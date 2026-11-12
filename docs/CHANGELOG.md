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

## 1.1 · Only the active project is highlighted
- **Area:** Home page
- **Feedback:** Improve colour coordination between folder titles and folder variants. Match or complement the text colours with the corresponding folder colours instead of keeping all titles red. *Review round 2:* only the active folder's name should be highlighted in a different colour; all other texts and folders keep their colours.
- **Change:** The selected name in the project wheel and its marker dot now take the active folder's colour. They used to be always red. All other names keep the V1 grey, the folders keep their own colours, and the Open button keeps its V1 style. Each project has an `ink` colour: its folder colour, darkened only where needed for 4.5:1 contrast on the papaya background. SmartHome uses `#2F6585` (folder `#669BBC` was 2.67:1) and the gold slot uses `#8A5A00` (folder `#D9A441` was 1.99:1). Round 1 also coloured every name and the button; that was reverted after review.
- **Why:** The highlighted name now visibly belongs to the highlighted folder, without making the rest of the page busier.
- **Files:** `data/projects.ts`, `components/wheel-carousel.tsx`, `components/hero.tsx`
- **Before:** docs/screenshots/before-home-desktop.png
- **After:** docs/screenshots/after-home-desktop.png
- **Status:** Done

## 1.2 · Home page fits one screen
- **Area:** Home page
- **Feedback:** Fix overlapping text, folders and other visual elements. Improve spacing so every element has enough room to breathe. *Review round 2:* keep the layout, the picture and the other elements as they were; remove the footer so the home page needs no further scrolling.
- **Change:** Round 1 rearranged the hero (folders moved off the photo, extra caption and hint). After review that was reverted, and the V1 layout and photo are back unchanged. Instead, the footer is hidden on the home page only (`HideOnHome`), so the page fits the screen. Measured with no scrolling at 1440×900, 1280×720 and 1024×700. On short laptop screens the folder block moves up only as far as needed to keep the Open button on screen (`top: min(30%, 100% − 468px)`); at normal heights it sits exactly where it did in V1. On phones the V1 stacked layout is still taller than the screen, so it scrolls (237 px at 390×844).
- **Why:** The layout and photo are part of the portfolio's identity. The scrolling on the home page came from the footer, not from the hero.
- **Files:** `components/hide-on-home.tsx`, `app/layout.tsx`, `components/hero.tsx`
- **Before:** docs/screenshots/before-home-desktop.png
- **After:** docs/screenshots/after-home-desktop.png
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
- **Change:** The cards that fan out of a folder are now labelled with what the folder contains: one card per case-study step ("The problem", "Research & early concepts", "Frontend build"). They used to say "HiccupViews screen 1". The same labels appear in the lightbox, and the full descriptions are on the new projects page (2.1). The caption under the folders from round 1 was removed after review to keep the V1 layout.
- **Why:** Visitors can see what is inside a folder by peeking into it, without any extra elements on the home page.
- **Files:** `components/animated-folder.tsx`, `data/projects.ts`
- **Before:** –
- **After:** docs/screenshots/after-folder-open-desktop.png
- **Status:** Done

## 1.5 · "WORK" becomes "EUGENE"
- **Area:** Home page
- **Feedback:** Replace the background word "WORK" with "EUGENE" to make the portfolio more personal.
- **Change:** The large background word now reads "Eugene", in the same place, size and colour as "Work" was.
- **Why:** It makes the portfolio more personal.
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
- **Change:** The main menu is now Home · Projects · About Me · Contact, and Projects stays highlighted on the case-study pages. The extra hint and "See all projects as a list" link added under the folders in round 1 were removed after review to keep the V1 home layout. The menu link is now the way to the list view.
- **Why:** The projects can be reached without the animation, from every page, without changing the home page.
- **Files:** `components/nav.tsx`
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

## 4.1 · Home page scroll behaviour kept as in V1
- **Area:** Portfolio page & scrolling
- **Feedback:** Reduce excessive movement during scrolling. Ensure scrolling effects work correctly without distracting users. *Review round 2:* keep the other scroll functions as they were.
- **Change:** Round 1 made the folder row react only to sideways scrolling and stopped the wheel taking over scrolling on mobile. After review those changes were reverted, and the folders and project wheel scroll exactly as in V1. Now that the home page fits one screen (1.2), the mouse wheel is only used to browse the folders, so it no longer competes with scrolling the page.
- **Why:** Scrolling through the folders is a core part of the home page. The conflict came from the page itself scrolling, and removing the footer fixed that.
- **Files:** `components/folder-row.tsx`, `components/wheel-carousel.tsx`
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
- **Change:** Round 1 built a temporary page comparing three directions: editorial (Fraunces, Instrument Serif), handmade (Caveat Brush, Permanent Marker) and racing (Unbounded, Big Shoulders). After review, font changes are on hold, so the comparison page was removed and the site keeps Barlow Condensed and Inter. It is still in the git history (commit `6758dd5`) if needed.
- **Why:** This round focused on layout and usability.
- **Files:** `app/fonts/page.tsx` (removed)
- **Before:** –
- **After:** –
- **Status:** Skipped for now

## R.1 · Review of round 1
- **Area:** Review
- **Feedback:** The layout had to stay the same without changing the picture or other elements. Remove the footer so that no further page scrolling is needed on the home page, but keep the other scroll functions as they were. Only the active folder's name should be highlighted in a different colour; the rest of the texts and folders stay the same. Skip the font changes for now.
- **Change:** The home hero, folder row and project wheel were restored to V1. On top of that, only the requested changes were applied again: the "Eugene" background word, the colour on the active name only, folder contents on the fan-out cards, and the footer hidden on the home page. The font comparison page was removed. The projects page, the About flip card, opaque pop-ups and case-study changes stay. Entries 1.1, 1.2, 1.4, 1.5, 2.2, 4.1 and 6.1 were updated to match.
- **Why:** The folder layout is the creative concept and should be refined, not redesigned.
- **Files:** `components/hero.tsx`, `components/folder-row.tsx`, `components/wheel-carousel.tsx`, `components/animated-folder.tsx`, `components/hide-on-home.tsx`, `app/layout.tsx`
- **Before:** –
- **After:** docs/screenshots/after-home-desktop.png
- **Status:** Done
