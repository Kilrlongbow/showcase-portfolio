import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import {
  Big_Shoulders,
  Caveat_Brush,
  Fraunces,
  Instrument_Serif,
  Permanent_Marker,
  Unbounded,
} from "next/font/google";

/*
 * TEMPORARY comparison page for choosing a more creative display font.
 * Development only. Delete this file once a direction is chosen.
 */

export const metadata: Metadata = { title: "Font directions", robots: { index: false } };

const fraunces = Fraunces({ subsets: ["latin"], weight: ["900"], style: ["italic"] });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic"] });
const caveat = Caveat_Brush({ subsets: ["latin"], weight: "400" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400" });
const unbounded = Unbounded({ subsets: ["latin"], weight: ["800"] });
const shoulders = Big_Shoulders({ subsets: ["latin"], weight: ["900"] });

const directions = [
  {
    name: "Bold editorial",
    note: "A characterful serif for headings. Feels like a magazine or a printed case study; pairs well with Inter body text.",
    fonts: [
      { name: "Fraunces Black Italic", className: fraunces.className, style: {} },
      { name: "Instrument Serif Italic", className: instrument.className, style: {} },
    ],
  },
  {
    name: "Playful / handmade",
    note: "Hand-lettered labels, like writing on a real folder with a marker. Best as an accent next to Barlow, not for every heading.",
    fonts: [
      { name: "Caveat Brush", className: caveat.className, style: {} },
      { name: "Permanent Marker", className: marker.className, style: {} },
    ],
  },
  {
    name: "Sporty / racing",
    note: "Wide or tall, fast display type in the spirit of motorsport sites. Could replace Barlow Condensed as the main voice.",
    fonts: [
      { name: "Unbounded ExtraBold", className: unbounded.className, style: { textTransform: "uppercase" } },
      { name: "Big Shoulders Black", className: shoulders.className, style: { textTransform: "uppercase" } },
    ],
  },
] satisfies { name: string; note: string; fonts: { name: string; className: string; style: CSSProperties }[] }[];

export default function FontsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8">
      <header className="py-12">
        <p className="text-sm font-semibold tracking-wide text-flag uppercase">Temporary · development only</p>
        <h1 className="font-heading mt-2 text-6xl">Font directions</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Each sample shows the hero title, a folder label and a case-study heading. The current font, Barlow
          Condensed, is at the top for comparison. Body text stays Inter.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Current · Barlow Condensed</h2>
        <Sample className="font-heading" style={{}} />
      </section>

      {directions.map((direction, i) => (
        <section key={direction.name} className="mt-12">
          <h2 className="font-heading text-4xl">
            {String.fromCharCode(65 + i)}. {direction.name}
          </h2>
          <p className="mt-1 max-w-2xl text-muted-foreground">{direction.note}</p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {direction.fonts.map((font) => (
              <div key={font.name} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{font.name}</h3>
                <Sample className={font.className} style={font.style} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Sample({ className, style }: { className: string; style: CSSProperties }) {
  return (
    <div className="mt-4 space-y-5">
      <p className={`${className} text-5xl leading-none text-space`} style={style}>
        Frontend Developer
      </p>
      <div className="flex items-end gap-4">
        <span
          className="inline-flex h-20 w-36 items-end rounded-lg bg-flag px-2 pb-1.5 text-papaya shadow-md"
          aria-hidden="true"
        >
          <span className={`${className} text-xl leading-none`} style={style}>
            HiccupViews
          </span>
        </span>
        <span className={`${className} text-3xl leading-none text-[#2F6585]`} style={style}>
          SmartHome
        </span>
      </div>
      <p className={`${className} text-3xl leading-tight text-flag`} style={style}>
        Research &amp; early concepts
      </p>
      <p className="text-base leading-relaxed">
        Body text stays in Inter so the case studies remain easy to read at length.
      </p>
    </div>
  );
}
