"use client";

import { type CSSProperties, useId, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ImageLightbox } from "@/components/image-lightbox";
import { ProjectCard } from "@/components/project-card";
import { cn } from "@/lib/utils";

interface AnimatedFolderProps {
  project: Project;
  /** Lid tilted and images fanned out */
  open: boolean;
  /** Only the active folder renders its image cards */
  interactive?: boolean;
  /** Folder colour; defaults to the project's own colour */
  color?: string;
  className?: string;
}

const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/**
 * One project folder: back panel and tab, up to three image cards, and the
 * front panel. Opening it tilts the panels and fans the cards out; a card
 * opens the lightbox, which links through to the project page.
 */
export function AnimatedFolder({ project, open, interactive = false, color, className }: AnimatedFolderProps) {
  const uid = useId().replace(/:/g, "");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const images = project.images.slice(0, 3).map((image, index) => ({
    id: `${project.slug}-${index}`,
    image: image.src,
    // The cards say what the folder holds: one card per case-study step
    title: project.sections[index]?.heading ?? image.alt,
  }));

  const handleProjectClick = (id: string, index: number) => {
    const cardEl = cardRefs.current[index];
    if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
    setSelectedIndex(index);
    setHiddenCardId(id);
  };

  const transition = `transform 500ms ${spring}`;
  const lid = open ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)";

  return (
    <>
      <div
        className={cn("folder relative flex items-center justify-center", className)}
        style={{ width: 128, height: 112, perspective: "1000px", "--folder": color ?? project.color } as CSSProperties}
      >
        {/* Ground shadow */}
        <div
          aria-hidden="true"
          className="absolute left-2 right-2 h-3 rounded-[50%] bg-black/30 blur-[6px]"
          style={{ bottom: 2, zIndex: 0 }}
        />

        {/* Back panel with its tab, drawn as one shape like a real folder */}
        <svg
          aria-hidden="true"
          viewBox="0 0 128 110"
          className="absolute motion-reduce:!transition-none"
          style={{
            top: "calc(50% - 48px - 14px)",
            left: 0,
            width: 128,
            height: 110,
            overflow: "visible",
            transformOrigin: "bottom center",
            transform: open ? "rotateX(-15deg)" : "rotateX(0deg)",
            transition,
            zIndex: 10,
          }}
        >
          <defs>
            <linearGradient id={`${uid}-back`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--folder-tab)" }} />
              <stop offset="0.22" style={{ stopColor: "var(--folder-back)" }} />
              <stop offset="1" style={{ stopColor: "color-mix(in oklab, var(--folder-back) 80%, black)" }} />
            </linearGradient>
          </defs>
          <path
            d="M0 7Q0 0 7 0H43Q49 0 52 5L55 10Q58 14 64 14H121Q128 14 128 21V102Q128 110 120 110H8Q0 110 0 102Z"
            fill={`url(#${uid}-back)`}
            style={{ stroke: "color-mix(in oklab, var(--folder-back) 60%, black)" }}
            strokeWidth="1"
          />
          {/* Light catching the top edge of the tab */}
          <path d="M3 4Q4 1.5 8 1.5H43Q47.5 1.5 50 5.5" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
        </svg>

        {/* Paper sheets peeking out of the folder */}
        <div
          aria-hidden="true"
          className="paper-grain absolute rounded-[3px] bg-[#fffaf0] shadow-[0_1px_2px_rgba(0,0,0,0.25)] motion-reduce:!transition-none"
          style={{
            left: 9,
            right: 14,
            top: open ? 6 : 14,
            height: 74,
            transform: "rotate(-1.8deg)",
            transition: `top 500ms ${spring}`,
            zIndex: 12,
          }}
        />
        <div
          aria-hidden="true"
          className="paper-grain absolute rounded-[3px] bg-[#f4e8cc] shadow-[0_1px_2px_rgba(0,0,0,0.25)] motion-reduce:!transition-none"
          style={{
            left: 16,
            right: 8,
            top: open ? 10 : 17,
            height: 72,
            transform: "rotate(1.4deg)",
            transition: `top 500ms ${spring}`,
            zIndex: 13,
          }}
        />

        {/* Image cards, between back and front */}
        {interactive && (
          <div
            className="absolute"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}
          >
            {images.map((item, index) => (
              <ProjectCard
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                image={item.image}
                title={item.title}
                delay={index * 80}
                isVisible={open}
                index={index}
                onClick={() => handleProjectClick(item.id, index)}
                isSelected={hiddenCardId === item.id}
              />
            ))}
          </div>
        )}

        {/* Front panel: card stock with a crease, a slight sheen and grain */}
        <div
          aria-hidden="true"
          className="absolute w-32 overflow-hidden rounded-t-[6px] rounded-b-lg motion-reduce:!transition-none"
          style={{
            top: "calc(50% - 48px + 14px)",
            height: 82,
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--folder-front) 82%, white) 0%, var(--folder-front) 22%, color-mix(in oklab, var(--folder-front) 84%, black) 100%)",
            border: "1px solid color-mix(in oklab, var(--folder-front) 62%, black)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.18), 0 -2px 6px rgba(0,0,0,0.18), 0 8px 14px -6px rgba(0,0,0,0.45)",
            transformOrigin: "bottom center",
            transform: lid,
            transition,
            zIndex: 30,
          }}
        >
          {/* Fold crease near the top edge */}
          <span className="absolute inset-x-1.5 top-[7px] h-px bg-black/20" />
          <span className="absolute inset-x-1.5 top-[8px] h-px bg-white/25" />
          {/* Sheen and paper grain */}
          <span
            className="absolute inset-0"
            style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 38%, transparent 55%)" }}
          />
          <span className="paper-grain absolute inset-0 opacity-60 mix-blend-overlay" />
        </div>
      </div>

      {interactive && (
        <ImageLightbox
          projects={images}
          currentIndex={selectedIndex ?? 0}
          isOpen={selectedIndex !== null}
          onClose={() => {
            setSelectedIndex(null);
            setSourceRect(null);
          }}
          sourceRect={sourceRect}
          onCloseComplete={() => setHiddenCardId(null)}
          onNavigate={(newIndex) => {
            setSelectedIndex(newIndex);
            setHiddenCardId(images[newIndex]?.id ?? null);
          }}
          href={`/projects/${project.slug}`}
          label={`${project.title} images`}
        />
      )}
    </>
  );
}
