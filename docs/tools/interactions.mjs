// Captures the interactive states for the process log (desktop only):
// folder fan-out, lightbox, flipped About portrait, and whether a vertical
// mouse-wheel over the folder row scrolls the page.
// Usage: node docs/tools/interactions.mjs <prefix>
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PORT = 9334;
const prefix = process.argv[2] ?? "after";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "shot-"))}`,
  "--hide-scrollbars",
  "about:blank",
]);
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  await sleep(200);
  try {
    wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page")
      ?.webSocketDebuggerUrl;
  } catch {}
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  pending.get(msg.id)?.(msg);
  pending.delete(msg.id);
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m.result)));
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
const shot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  const file = `docs/screenshots/${prefix}-${name}.png`;
  writeFileSync(file, Buffer.from(data, "base64"));
  console.log(file);
};
const open = async (path) => {
  await send("Page.navigate", { url: BASE + path });
  await sleep(2500);
  await evaluate("document.fonts.ready");
};
const centerOf = (selector) =>
  evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
const mouse = (type, { x, y }, extra = {}) =>
  send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1, ...extra });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

// 1. Folder fan-out on hover
await open("/");
const folder = await evaluate(`(() => { const el = [...document.querySelectorAll('#work [aria-hidden="false"]')][0];
  const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height * 0.7 }; })()`);
await mouse("mouseMoved", folder);
await sleep(900);
await shot("folder-open-desktop");

// 2. Lightbox from the first fanned card
const card = await centerOf('#work button[aria-label^="Enlarge"]');
await mouse("mousePressed", card);
await mouse("mouseReleased", card);
await sleep(1200);
await shot("lightbox-desktop");

// 3. Vertical wheel over the folders should scroll the page
await open("/");
await evaluate("window.scrollTo(0, 0)");
const row = await centerOf("#work");
await mouse("mouseWheel", row, { deltaX: 0, deltaY: 400 });
await sleep(800);
const scrolled = await evaluate("window.scrollY");
console.log(`vertical wheel over folders → page scrollY = ${scrolled} (${scrolled > 0 ? "page scrolls" : "trapped"})`);

// 4. About portrait flipped
await open("/about");
const portrait = await centerOf('button[aria-pressed]');
await mouse("mousePressed", portrait);
await mouse("mouseReleased", portrait);
await mouse("mouseMoved", { x: 5, y: 5 });
await sleep(1200);
await shot("about-flipped-desktop");

ws.close();
chrome.kill();
