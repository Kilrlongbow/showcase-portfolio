// Takes accurate desktop and mobile screenshots for the process log.
// Usage: node docs/tools/screenshot.mjs <prefix> <path> [<path> ...]
//   e.g. node docs/tools/screenshot.mjs after / /about /projects
// Writes docs/screenshots/<prefix>-<name>-<desktop|mobile>.png
// Needs the dev server on http://localhost:3000 and Google Chrome installed.
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PORT = 9333;
const [prefix, ...paths] = process.argv.slice(2);
if (!prefix || paths.length === 0) {
  console.error("Usage: node docs/tools/screenshot.mjs <prefix> <path> [...]");
  process.exit(1);
}

const devices = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const nameFor = (path) => (path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-"));

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
    const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    wsUrl = targets.find((t) => t.type === "page")?.webSocketDebuggerUrl;
  } catch {}
}
if (!wsUrl) throw new Error("Chrome did not start");

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method) listeners.forEach((l) => l(msg));
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, (msg) => (msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
const loaded = () =>
  new Promise((r) => {
    const l = (msg) => {
      if (msg.method === "Page.loadEventFired") {
        listeners.splice(listeners.indexOf(l), 1);
        r();
      }
    };
    listeners.push(l);
  });

await send("Page.enable");
for (const path of paths) {
  for (const [device, metrics] of Object.entries(devices)) {
    await send("Emulation.setDeviceMetricsOverride", metrics);
    await send("Emulation.setTouchEmulationEnabled", { enabled: metrics.mobile });
    const done = loaded();
    await send("Page.navigate", { url: BASE + path });
    await done;
    await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
    await sleep(1500); // let entrance animations settle
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    const file = `docs/screenshots/${prefix}-${nameFor(path)}-${device}.png`;
    writeFileSync(file, Buffer.from(data, "base64"));
    console.log(file);
  }
}
ws.close();
chrome.kill();
