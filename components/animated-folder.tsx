"use client";

import { type CSSProperties, useRef, useState } from "react";
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
  className?: string;
}

const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/**
 * One project folder: back panel and tab, up to three image cards, and the
 * front panel. Opening it tilts the panels and fans the cards out; a card
 * opens the lightbox, which links through to the project page.
 */
export function AnimatedFolder({ project, open, interactive = false, className }: AnimatedFolderProps) {
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
        style={{ width: 128, height: 112, perspective: "1000px", "--folder": project.color } as CSSProperties}
      >
        {/* Back panel */}
        <div
          className="absolute w-32 h-24 bg-folder-back motion-reduce:!transition-none rounded-lg shadow-md ring-1 ring-black/40"
          style={{
            transformOrigin: "bottom center",
            transform: open ? "rotateX(-15deg)" : "rotateX(0deg)",
            transition,
            zIndex: 10,
          }}
        />

        {/* Tab */}
        <div
          className="absolute w-14 h-5 motion-reduce:!transition-none rounded-t-md ring-1 ring-black/40"
          style={{
            top: "calc(50% - 48px - 14px)",
            left: 0,
            background: "linear-gradient(to bottom, var(--folder-tab), var(--folder-back))",
            transformOrigin: "bottom center",
            transform: open ? "rotateX(-25deg) translateY(-2px)" : "rotateX(0deg)",
            transition,
            zIndex: 10,
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

        {/* Front panel */}
        <div
          className="absolute w-32 bg-folder-front motion-reduce:!transition-none rounded-lg shadow-lg ring-1 ring-black/40"
          style={{
            top: "calc(50% - 48px + 14px)",
            height: 82,
            transformOrigin: "bottom center",
            transform: lid,
            transition,
            zIndex: 30,
          }}
        />

        {/* Shine */}
        <div
          className="absolute w-32 rounded-lg overflow-hidden pointer-events-none motion-reduce:!transition-none"
          style={{
            top: "calc(50% - 48px + 14px)",
            height: 82,
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
            transformOrigin: "bottom center",
            transform: lid,
            transition,
            zIndex: 31,
          }}
        />
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
