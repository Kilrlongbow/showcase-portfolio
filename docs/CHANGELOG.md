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

## 1.1 · Folder colours carried into the titles
- **Area:** Home page
- **Feedback:** Improve colour coordination between folder titles and folder variants. Match or complement the text colours with the corresponding folder colours instead of keeping all titles red.
- **Change:** Every project now has an `ink` colour: its folder colour, darkened where needed so text stays readable (4.5:1 or better on the papaya background). The wheel shows each project name in its own colour (faded when not selected), and the marker dot, the caption under the folders and the "Open …" button all switch to the active project's colour. SmartHome uses `#2F6585` (folder `#669BBC` was only 2.67:1) and the gold slot uses `#8A5A00` (folder `#D9A441` was only 1.99:1).
- **Why:** The red titles made every project look the same and didn't match the blue and gold folders. Linking text to folder colour shows which name belongs to which folder, and the contrast check keeps it WCAG AA compliant.
- **Files:** `data/projects.ts`, `components/wheel-carousel.tsx`, `components/hero.tsx`
- **Before:** docs/screenshots/before-home-desktop.png
- **After:** docs/screenshots/after-home-desktop.png
- **Status:** Done

## 1.2 · No more overlap, more breathing room
- **Area:** Home page
- **Feedback:** Fix overlapping text, folders and other visual elements. Improve spacing so every element has enough room to breathe.
- **Change:** The folder row is no longer absolutely positioned across the photo. It now sits in the normal flow under the intro, in the left 64% of the column, with the photo in its own space on the right. The row shows two folders on each side instead of three. A spacing band separates the intro, the folders, the hint, the caption and the buttons. On mobile the photo is hidden in the hero (it is still on the About page) because it always overlapped the folders on narrow screens.
- **Why:** In V1 the folders, the photo, the background word and the wheel all overlapped, which made the page feel cluttered and hid the folders.
- **Files:** `components/hero.tsx`
- **Before:** docs/screenshots/before-home-desktop.png, docs/screenshots/before-home-mobile.png
- **After:** docs/screenshots/after-home-desktop.png, docs/screenshots/after-home-mobile.png
- **Status:** Done

## 1.3 · Opaque folder pop-ups
- **Area:** Home page
- **Feedback:** Make folder pop-ups fully opaque instead of transparent.
- **Change:** The lightbox backdrop changed from 80% see-through with a blur to solid page colour. Its round controls are now solid with a thin border, and the see-through gradient over the image was removed. The cards that fan out of a folder have a solid caption bar instead of a fading gradient.
- **Why:** With the page showing through, the pop-ups were hard to read and felt unfinished.
- **Files:** `components/image-lightbox.tsx`, `components/project-card.tsx`
- **Before:** –
- **After:** docs/screenshots/after-folder-open-desktop.png, docs/screenshots/after-lightbox-desktop.png
- **Status:** Done

## 1.4 · Folder contents explained
- **Area:** Home page
- **Feedback:** Include clear descriptions of the contents of each folder or pocket.
- **Change:** A caption under the active folder shows the project's discipline, its title, a one-sentence summary and an "Inside:" line listing what the folder contains (Problem · Research · Frontend build · Result). The lightbox still links through to the full case study.
- **Why:** Visitors could not tell what a folder held without opening it.
- **Files:** `components/hero.tsx`, `data/projects.ts`
- **Before:** docs/screenshots/before-home-desktop.png
- **After:** docs/screenshots/after-home-desktop.png
- **Status:** Done (the summaries are waiting on content; see 5.3)

## 1.5 · "WORK" becomes "EUGENE"
- **Area:** Home page
- **Feedback:** Replace the background word "WORK" with "EUGENE" to make the portfolio more personal.
- **Change:** The background word now reads "Eugene". It also moved from behind the photo and folders into the open space above the folders, so the whole name stays readable.
- **Why:** It makes the portfolio more personal, and in the new position the photo no longer hides half the word.
- **Files:** `components/hero.tsx`
- **Before:** docs/screenshots/before-home-desktop.png
- **After:** docs/screenshots/after-home-desktop.png
- **Status:** Done

## 2.1 · New "All Projects" page
- **Area:** Navigation & accessibility
- **Feedback:** Create a separate page that clearly lists and explains every project in the portfolio. Provide an alternative way to explore projects for users who find the homepage animations difficult to navigate.
- **Change:** New page at `/projects`. It lists every project as a plain card grid, grouped by discipline, and has jump links to each group. Each card shows the cover image, title in the project colour, summary, role, stack, what is inside, and a link to the case study (the whole card is clickable and has a visible keyboard focus ring). No animation is needed to use it.
- **Why:** The folders are the creative concept, but they should not be the only way in. This page also suits keyboard, screen-reader and reduced-motion users, and visitors who just want an overview.
- **Files:** `app/projects/page.tsx`, `data/projects.ts`
- **Before:** –
- **After:** docs/screenshots/after-projects-desktop.png, docs/screenshots/after-projects-mobile.png
- **Status:** Done

## 2.2 · Clearer navigation
- **Area:** Navigation & accessibility
- **Feedback:** Make the overall navigation more intuitive and understandable.
- **Change:** The main menu is now Home · Projects · About Me · Contact, and Projects stays highlighted on the case-study pages. The homepage has a visible "See all projects as a list" link next to the Open button. A short hint under the folders ("Swipe, drag or use ← → to browse · click a folder to peek inside") makes visible the instructions that were previously only in the screen-reader label.
- **Why:** Visitors did not know how to work the folders, and the only way to reach the projects was through the animation.
- **Files:** `components/nav.tsx`, `components/hero.tsx`, `components/folder-row.tsx`
- **Before:** docs/screenshots/before-home-desktop.png
- **After:** docs/screenshots/after-home-desktop.png
- **Status:** Done

## 3.1 · Research: Lando Norris website
- **Area:** About page
- **Feedback:** Research the Lando Norris website for animation and interaction inspiration.
- **Change:** I studied landonorris.com and took four takeaways from it. (1) Every helmet card has a base image and a hover image, so hovering reveals a second side of the same object. (2) It uses one strong accent colour (lime) against calm neutrals. (3) A big signature-style name acts as a personal brand mark. (4) Small playful prompts invite interaction ("tap to lock", "Back to scroll"). Applied here: the About photo became a card with two sides (see 3.2), the name is used as a brand mark (1.5), and each project has its own accent colour (1.1).
- **Why:** Feedback asked for a more engaging, personal About page. The Lando Norris site does that with a few strong, repeated interactions rather than lots of movement.
- **Files:** –
- **Before:** –
- **After:** –
- **Status:** Done

## 3.2 · Flip-card portrait
- **Area:** About page
- **Feedback:** Explore animating the personal image to make the page more engaging. Consider a flip animation that reveals the front of the image.
- **Change:** The photo is now a card. It tilts slightly towards the mouse, and a click, tap or Enter flips it to a dark back side with "Hi, I'm Eugene" and three short facts. A "Flip me" / "Flip back" label shows that it is interactive. It is a real `<button>` with `aria-pressed` and a clear label. With reduced motion it does not tilt and fades between the sides instead of rotating. On desktop the card stays in view while the text scrolls.
- **Why:** It makes the page more engaging without a lot of movement, and the back side is a place for personality.
- **Files:** `components/flip-portrait.tsx`, `app/about/page.tsx`
- **Before:** docs/screenshots/before-about-desktop.png
- **After:** docs/screenshots/after-about-desktop.png, docs/screenshots/after-about-flipped-desktop.png
- **Status:** Done (the facts on the back are placeholders for Eugene to confirm)

## 4.1 · Scrolling no longer hijacked
- **Area:** Portfolio page & scrolling
- **Feedback:** Reduce excessive movement during scrolling. Ensure scrolling effects work correctly without distracting users.
- **Change:** Vertical mouse-wheel scrolling over the folder row used to spin the folders and block the page. Now the row only reacts to sideways scrolling (trackpad swipe or Shift + wheel), the arrow keys, dragging and clicks, and normal scrolling moves the page. Tested: a vertical wheel over the folders scrolls the page about 250–290 px. Speed and momentum are lower: the folder step went from 0.006 to 0.004 per pixel, glide decay from 0.9 to 0.85, and the wheel speed from 0.008 to 0.005. On mobile the project wheel no longer catches vertical swipes, so the page scrolls normally.
- **Why:** Spinning the carousel when you meant to scroll the page was the main source of the "too much movement" feedback.
- **Files:** `components/folder-row.tsx`, `components/wheel-carousel.tsx`, `components/hero.tsx`
- **Before:** –
- **After:** –
- **Status:** Done

## 4.2 · Fixed background on the case-study pages
- **Area:** Portfolio page & scrolling
- **Feedback:** Consider keeping the background stationary while the content scrolls. Improve scroll animation performance and smoothness.
- **Change:** Each case-study page now has a fixed background: a soft glow in the project colour and the project title very large and faint. The content scrolls over it on solid panels. Sections fade in and rise 24 px as they enter the screen, using CSS scroll-driven animations (`animation-timeline: view()`). These run in the browser's compositor with no JavaScript scroll listeners and are skipped when reduced motion is on or the browser has no support. The body text is no longer bold italic.
- **Why:** A still background gives a calm sense of place, and the CSS-only reveal stays smooth because it does not run JavaScript on every scroll event.
- **Files:** `app/projects/[slug]/page.tsx`, `app/globals.css`
- **Before:** docs/screenshots/before-projects-hiccupviews-desktop.png
- **After:** docs/screenshots/after-projects-hiccupviews-desktop.png
- **Status:** Done

## 5.1 · Projects grouped by discipline
- **Area:** Portfolio structure & content
- **Feedback:** Organise the portfolio into clear, relevant topics or categories. Make sure projects are grouped logically under the appropriate topics.
- **Change:** There are four disciplines, each with a one-line explanation: UX research, UI & visual design, Frontend development, and Interaction & motion. Every project has a `discipline`, and the projects page and homepage caption use it.
- **Why:** Grouping by kind of work shows the range of skills and helps visitors find relevant work quickly.
- **Files:** `data/projects.ts`, `app/projects/page.tsx`
- **Before:** –
- **After:** docs/screenshots/after-projects-desktop.png
- **Status:** Waiting on content. The current assignments are first guesses (HiccupViews: Frontend, JoinUs: UI & visual design, SmartHome: Interaction & motion), and Eugene needs to confirm them.

## 5.2 · Case-study structure and prompts
- **Area:** Portfolio structure & content
- **Feedback:** Improve the quality, relevance and completeness of project content. Make project descriptions clear enough for visitors to understand the work.
- **Change:** Every case study follows the same four steps: The problem → Research & early concepts → Frontend build → Result & reflection. The placeholder text is now a set of specific writing prompts that ask for the audience, the brief, research findings, an idea that was rejected, key technical decisions, accessibility and performance, feedback, and lessons learned. If a summary has not been written yet, it is hidden on the site (`isPlaceholder`), so "TODO" text never goes live.
- **Why:** The same structure on every page makes the case studies easy to scan and compare, and the prompts make writing the real content quicker.
- **Files:** `data/projects.ts`, `app/projects/[slug]/page.tsx`
- **Before:** docs/screenshots/before-projects-hiccupviews-desktop.png
- **After:** docs/screenshots/after-projects-hiccupviews-desktop.png
- **Status:** Done (structure)

## 5.3 · Real project content
- **Area:** Portfolio structure & content
- **Feedback:** Improve the quality, relevance and completeness of project content.
- **Change:** Still to do. Eugene will supply the real summaries, case-study texts, screenshots and confirmed disciplines for HiccupViews, JoinUs and SmartHome. All placeholders are marked `TODO(Eugene)` in `data/projects.ts` and `app/about/page.tsx`.
- **Why:** Only the project owner can write accurate project content.
- **Files:** `data/projects.ts`, `public/images/projects/`
- **Before:** –
- **After:** –
- **Status:** Waiting on content

## 5.4 · Creative concept kept
- **Area:** Portfolio structure & content
- **Feedback:** Maintain the existing creative concept while refining its basic usability and presentation.
- **Change:** The folders, the curved wheel, the fan-out cards, the lightbox and the colour palette are all unchanged in concept. Every change above refines layout, colour, readability or control, and the projects list was added next to the folders, not instead of them.
- **Why:** The folder concept is what makes the portfolio memorable. The feedback was about usability, not the idea.
- **Files:** –
- **Before:** docs/screenshots/before-home-desktop.png
- **After:** docs/screenshots/after-home-desktop.png
- **Status:** Done

## 6.1 · Exploring more creative fonts
- **Area:** Typography
- **Feedback:** Explore more creative fonts within the portfolio.
- **Change:** A temporary comparison page at `/fonts` (development only, never in production) compares three directions against the current Barlow Condensed. A, bold editorial: Fraunces and Instrument Serif. B, playful/handmade: Caveat Brush and Permanent Marker. C, sporty/racing: Unbounded and Big Shoulders. Each sample shows the hero title, a folder label and a case-study heading. All fonts load through `next/font/google`, which hosts them on the site itself with no layout shift.
- **Why:** Seeing the fonts in context makes the choice easier than comparing names. Body text stays Inter so long texts stay readable.
- **Files:** `app/fonts/page.tsx`
- **Before:** –
- **After:** docs/screenshots/after-fonts-desktop.png
- **Status:** In progress: waiting for Eugene to choose a direction, then it gets applied site-wide and the page is removed
