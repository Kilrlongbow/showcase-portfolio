import type { Metadata } from "next";
import { FlipPortrait } from "@/components/flip-portrait";

export const metadata: Metadata = {
  title: "About Me",
};

const skills = [
  "HTML & semantic structure",
  "CSS: grid, animation, custom properties",
  "JavaScript & TypeScript",
  "React & Next.js",
  "Accessibility (WCAG 2.2)",
  "Interaction design & prototyping",
];

// Shown on the back of the portrait. TODO(Eugene): swap in your own facts.
const facts = [
  "Studying ICT at Fontys, specialising in frontend",
  "Building with React, TypeScript and Next.js",
  "Every project on this site is a folder you can open",
];

export default function AboutPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 px-4 py-12 sm:px-8 md:grid-cols-[2fr_3fr] md:py-16">
      <FlipPortrait facts={facts} className="md:sticky md:top-8" />
      <div>
        <h1 className="font-heading text-6xl sm:text-7xl">About Me</h1>
        <p className="mt-6 text-lg leading-relaxed">
          I&apos;m Eugene, a frontend developer studying at Fontys ICT. I like turning ambitious visual ideas into
          interfaces that are fast, accessible and well engineered. This portfolio is built around that idea:
          every project is a folder you can open.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Replace this text with your own story: what got you into frontend, how you work, and what you are
          looking for next.
        </p>

        <h2 className="font-heading mt-12 text-3xl">What I work with</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {skills.map((skill) => (
            <li key={skill} className="border-l-4 border-flag bg-card px-4 py-3 font-medium">
              {skill}
            </li>
          ))}
        </ul>

        <h2 className="font-heading mt-12 text-3xl">How I work</h2>
        <ol className="mt-4 space-y-3 text-lg">
          <li><strong>Research.</strong> Understand who it is for and what is not working.</li>
          <li><strong>Sketch & prototype.</strong> Try ideas early and throw the weak ones away.</li>
          <li><strong>Build.</strong> Reusable components, real routes, tested on keyboard and mobile.</li>
          <li><strong>Feedback.</strong> Show it every sprint and fix the top points first.</li>
        </ol>
      </div>
    </div>
  );
}
