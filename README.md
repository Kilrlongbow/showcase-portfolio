# Showcase Portfolio

Personal portfolio of Eugene Chivurayise, frontend developer.

Every project is a folder. A row of coloured folders scrolls sideways without end; the folder in the centre grows and its name lights up in the curved project list beside it. Opening a folder fans out the project's images, and from there you go to the full project page.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- framer-motion, lucide-react

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Structure

| Path | What it is |
| --- | --- |
| `data/projects.ts` | All project content (single source of truth). Add a project here. |
| `components/hero.tsx` | Homepage: intro, photo, folder row and project list, kept in sync |
| `components/folder-row.tsx` | Endless horizontal folder carousel (wheel, drag, arrow keys, click) |
| `components/wheel-carousel.tsx` | Curved project-name list |
| `components/animated-folder.tsx` | Folder graphic with image fan-out and lightbox |
| `app/projects/[slug]/page.tsx` | Project case-study template |
| `app/globals.css` | Palette and design tokens |

## Adding a project

1. Put images in `public/images/projects/`.
2. Add an entry to `data/projects.ts` (or fill one of the `draft` slots and remove `draft: true`).

Drafts are visible in development only.

## Palette

Molten Lava `#780000` · Flag Red `#C1121F` · Papaya Whip `#FDF0D5` · Deep Space Blue `#003049` · Steel Blue `#669BBC`
