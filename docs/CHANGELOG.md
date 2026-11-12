# Portfolio V2 – Change Log

Working log of every change made after the V1 feedback round. Each entry follows the same template so it can be exported to the Word process log (`docs/build_docx.py` → `docs/Portfolio-V2-Process-Log.docx`).

Baseline: V1, commit `64acd8f`. Before screenshots: `docs/screenshots/before-*.png`.

<!-- Entry template
## ID · Title
- **Area:**
- **Feedback:**
- **Change:**
- **Why:**
- **Files:**
- **Before:** screenshot path
- **After:** screenshot path
- **Status:** Done | In progress | Waiting on content
-->

## 0.1 · Security upgrade of Next.js
- **Area:** Maintenance
- **Feedback:** Not from the feedback round. `npm audit` reported a critical advisory for Next.js 16.0.0–16.4.0 (remote code execution in the image optimisation API with SVG files, remote code execution in `use cache`, and a Server Actions denial of service).
- **Change:** Upgraded `next` and `eslint-config-next` from 16.4.0 to 16.4.6. After the upgrade `npm audit` reports 0 vulnerabilities and the production build passes.
- **Why:** The portfolio serves SVG project images, so the image-optimisation advisory applied to this site directly. Fixing it first means every later change is built and tested on a safe version.
- **Files:** `package.json`, `package-lock.json`
- **Before:** –
- **After:** –
- **Status:** Done
