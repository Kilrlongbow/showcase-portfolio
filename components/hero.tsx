"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useCallback, useMemo, useState } from "react";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { disciplines, isPlaceholder, type Project } from "@/data/projects";
import { FolderRow } from "@/components/folder-row";
import { WheelCarousel, type WheelCarouselItem, wrapIndex } from "@/components/wheel-carousel";
import { useMediaQuery } from "@/lib/use-media-query";

/** The wheel looks empty with only a few names, so the list is repeated */
const MIN_WHEEL_ITEMS = 8;

export function Hero({ projects }: { projects: Project[] }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);
  const count = projects.length;
  const repeats = Math.max(1, Math.ceil(MIN_WHEEL_ITEMS / count));

  const wheelItems = useMemo<WheelCarouselItem[]>(
    () =>
      Array.from({ length: count * repeats }, (_, i) => {
        const project = projects[i % count]!;
        return { label: project.title, image: project.images[0]?.src ?? "", color: project.ink };
      }),
    [projects, count, repeats],
  );

  const [active, setActive] = useState(0);
  const [wheelIndex, setWheelIndex] = useState(0);

  const handleWheelChange = useCallback(
    (_item: WheelCarouselItem, index: number) => {
      setWheelIndex(index);
      setActive(index % count);
    },
    [count],
  );

  // Pick the copy of the project in the repeated wheel list that is closest
  // to where the wheel is now, so it turns the short way.
  const handleFolderChange = useCallback(
    (index: number) => {
      setActive(index);
      setWheelIndex((current) => {
        const total = count * repeats;
        let best = index;
        let bestDistance = Infinity;
        for (let r = 0; r < repeats; r++) {
          const candidate = index + r * count;
          const raw = Math.abs(candidate - current);
          const distance = Math.min(raw, total - raw);
          if (distance < bestDistance) {
            best = candidate;
            bestDistance = distance;
          }
        }
        return best;
      });
    },
    [count, repeats],
  );

  const activeProject = projects[wrapIndex(active, count)]!;
  const activeDiscipline = disciplines.find((d) => d.id === activeProject.discipline);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-y-10 overflow-x-clip px-4 pb-12 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1fr_minmax(320px,28%)] lg:gap-x-8 lg:pb-8"
      style={{ "--ink": activeProject.ink } as CSSProperties}
    >
      <div className="relative flex flex-col">
        {/* Intro */}
        <div className="relative z-30 max-w-md pt-6 lg:pt-10 lg:pb-10">
          <p className="text-sm font-semibold tracking-wide text-flag uppercase">Eugene Chivurayise</p>
          <h1 id="hero-title" className="font-heading mt-2 text-5xl sm:text-6xl">
            Frontend Developer
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I build expressive, accessible web experiences with React, TypeScript and thoughtful interaction design.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <li>
              <a href="#work" className="underline decoration-flag decoration-2 underline-offset-4 hover:text-flag">
                View work
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Kilrlongbow"
                className="underline decoration-flag decoration-2 underline-offset-4 hover:text-flag"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link href="/about" className="underline decoration-flag decoration-2 underline-offset-4 hover:text-flag">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="underline decoration-flag decoration-2 underline-offset-4 hover:text-flag">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Cut-out photo: sits beside the folders instead of behind them */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[94%] w-[36%] lg:block">
          <Image
            src="/images/me-cutout.png"
            alt="Eugene Chivurayise"
            fill
            priority
            sizes="30vw"
            className="object-contain object-bottom"
          />
        </div>

        {/* Folders */}
        <div id="work" className="relative isolate z-20 mt-10 scroll-mt-24 lg:mt-auto lg:w-[64%]">
          {/* Huge background word, in the open space above the folders */}
          <p
            aria-hidden="true"
            className="font-heading pointer-events-none absolute inset-x-0 top-4 -z-10 select-none text-center text-[24vw] text-steel/20 lg:top-2 lg:text-[10.5vw] min-[1440px]:text-[150px]"
          >
            Eugene
          </p>
          <FolderRow
            projects={projects}
            activeIndex={active}
            onActiveChange={handleFolderChange}
            spacing={isDesktop ? 165 : 104}
            grow={isDesktop ? 0.55 : 0.45}
            folderScale={isDesktop ? 1 : 0.72}
            reach={2}
            className={isDesktop ? "h-[340px]" : "h-[280px]"}
          />

          <p className="text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Swipe, drag or use ← → to browse · click a folder to peek inside
          </p>

          {/* What is in the active folder */}
          <div className="relative z-30 mx-auto mt-5 max-w-md text-center">
            <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--ink)" }}>
              {activeDiscipline?.label}
            </p>
            <h2 className="font-heading mt-1 text-3xl" style={{ color: "var(--ink)" }}>
              {activeProject.title}
            </h2>
            {!isPlaceholder(activeProject.summary) && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activeProject.summary}</p>
            )}
            <p className="mt-2 text-sm">
              <span className="font-semibold">Inside: </span>
              {activeProject.contents.join(" · ")}
            </p>
          </div>

          <div className="relative z-30 mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link
              href={`/projects/${activeProject.slug}`}
              className="font-heading inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2 text-lg text-papaya transition-colors"
              style={{ backgroundColor: "var(--ink)" }}
            >
              Open {activeProject.title}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-flag"
              style={{ textDecorationColor: "var(--ink)" }}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              See all projects as a list
            </Link>
          </div>
        </div>
      </div>

      {/* Project list */}
      <div className="relative z-10 h-[300px] lg:h-auto">
        <WheelCarousel
          items={wheelItems}
          activeIndex={wheelIndex}
          onActiveChange={handleWheelChange}
          ariaLabel="Projects"
          mode="custom"
          background="transparent"
          textColor="rgba(0, 48, 73, 0.38)"
          markerSize={12}
          markerGap={14}
          photoWidth={0}
          apexInset={isDesktop ? 14 : 22}
          radius={isDesktop ? 520 : 340}
          spacing={isDesktop ? 12 : 13}
          visibleItems={4}
          edgeFadeSize={18}
          scrollSpeed={0.005}
          capturePageScroll={isDesktop}
          className="min-h-0"
          itemClassName="font-heading text-[clamp(2.25rem,4vw,4rem)]"
        />
      </div>

      {/* Plain links for screen readers and when scripts fail */}
      <nav aria-label="All projects" className="sr-only">
        <ul>
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
