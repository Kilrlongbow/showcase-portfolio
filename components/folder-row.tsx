"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";
import { AnimatedFolder } from "@/components/animated-folder";
import { wrapIndex } from "@/components/wheel-carousel";
import { cn } from "@/lib/utils";

interface FolderRowProps {
  projects: Project[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  /** Folders drawn on each side of the centre one */
  reach?: number;
  /** Distance between folder centres, in px */
  spacing?: number;
  /** Extra scale of the centre folder */
  grow?: number;
  /** Base size of every folder (1 = 128px wide) */
  folderScale?: number;
  className?: string;
}

/**
 * Endless horizontal row of project folders. The row is a continuous
 * `rotation` value: slot p sits at (p - rotation) * spacing and shows
 * projects[p mod n], so it never runs out of folders in either direction.
 */
export function FolderRow({
  projects,
  activeIndex,
  onActiveChange,
  reach = 3,
  spacing = 170,
  grow = 0.6,
  folderScale = 1,
  className,
}: FolderRowProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = projects.length;
  const [rotation, setRotation] = useState(activeIndex);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(activeIndex);
  const selectedRef = useRef(activeIndex);
  const targetRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef<{ x: number; rotation: number; last: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const commitRotation = useCallback(
    (next: number, silent = false) => {
      rotationRef.current = next;
      setRotation(next);
      const index = wrapIndex(Math.round(next), count);
      if (index !== selectedRef.current) {
        selectedRef.current = index;
        setIsOpen(false);
        if (!silent) onActiveChange(index);
      }
    },
    [count, onActiveChange],
  );

  const runAnimation = useCallback(() => {
    if (frameRef.current !== null) return;

    const tick = () => {
      let keepAnimating = false;

      if (dragRef.current?.moved) {
        frameRef.current = null;
        return;
      }

      if (targetRef.current !== null) {
        const delta = targetRef.current - rotationRef.current;
        if (Math.abs(delta) > 0.001 && !reduceMotion) {
          commitRotation(rotationRef.current + delta * 0.16, true);
          keepAnimating = true;
        } else {
          commitRotation(targetRef.current, true);
          targetRef.current = null;
        }
      } else if (Math.abs(velocityRef.current) > 0.001 && !reduceMotion) {
        commitRotation(rotationRef.current + velocityRef.current);
        velocityRef.current *= 0.9;
        keepAnimating = true;
      } else {
        velocityRef.current = 0;
        const snap = Math.round(rotationRef.current);
        const delta = snap - rotationRef.current;
        if (Math.abs(delta) > 0.001 && !reduceMotion) {
          commitRotation(rotationRef.current + delta * 0.22);
          keepAnimating = true;
        } else {
          commitRotation(snap);
        }
      }

      frameRef.current = keepAnimating ? requestAnimationFrame(tick) : null;
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [commitRotation, reduceMotion]);

  const runAnimationRef = useRef(runAnimation);
  useEffect(() => {
    runAnimationRef.current = runAnimation;
  }, [runAnimation]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  // Follow the parent (e.g. the project list) along the shortest way round
  useEffect(() => {
    const target = wrapIndex(activeIndex, count);
    if (target === selectedRef.current) return;
    let delta = target - wrapIndex(Math.round(rotationRef.current), count);
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    selectedRef.current = target;
    velocityRef.current = 0;
    targetRef.current = Math.round(rotationRef.current) + delta;
    runAnimationRef.current();
  }, [activeIndex, count]);

  const moveTo = (nextRotation: number) => {
    velocityRef.current = 0;
    targetRef.current = null;
    commitRotation(nextRotation);
    runAnimation();
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (event: globalThis.WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      targetRef.current = null;
      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const delta = raw * 0.006;
      commitRotation(rotationRef.current + delta);
      velocityRef.current = delta * 0.2;
      runAnimation();
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [commitRotation, runAnimation]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClickRef.current = false;
    dragRef.current = { x: event.clientX, rotation: rotationRef.current, last: rotationRef.current, moved: false };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(distance) < 6) return;
      drag.moved = true;
      targetRef.current = null;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const next = drag.rotation - distance / spacing;
    velocityRef.current = next - drag.last;
    drag.last = next;
    commitRotation(next);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    suppressClickRef.current = true;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    runAnimation();
  };

  const handleSlotClick = (slot: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (slot === Math.round(rotationRef.current)) {
      setIsOpen((open) => !open);
    } else {
      moveTo(slot);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(Math.round(rotationRef.current) + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(Math.round(rotationRef.current) - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((open) => !open);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const center = Math.round(rotation);
  const slots: number[] = [];
  for (let p = Math.floor(rotation) - reach; p <= Math.ceil(rotation) + reach; p++) slots.push(p);

  const activeProject = projects[wrapIndex(center, count)]!;
  const fanOpen = isOpen || isHovered;

  return (
    <div
      ref={stageRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Project folders. Use the arrow keys to browse and Enter to open a folder."
      tabIndex={0}
      className={cn(
        "pointer-events-none relative w-full touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-flag focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-xl",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {slots.map((slot) => {
        const offset = slot - rotation;
        const distance = Math.abs(offset);
        if (distance > reach + 0.5) return null;

        const closeness = Math.max(0, 1 - distance);
        const scale = (1 + grow * closeness) * folderScale;
        // Neighbours step aside so the growing centre folder never overlaps them
        const push = Math.sign(offset) * Math.min(distance, 1) * ((128 * grow * folderScale) / 2);
        const x = offset * spacing + push;
        const isCenter = slot === center;
        const project = projects[wrapIndex(slot, count)]!;

        return (
          <div
            key={slot}
            aria-hidden={!isCenter}
            className="pointer-events-auto absolute left-1/2 bottom-6"
            style={{
              transform: `translateX(calc(-50% + ${x}px)) scale(${scale})`,
              transformOrigin: "bottom center",
              zIndex: isCenter ? 20 : 10 - Math.round(distance),
            }}
            onPointerEnter={(e) => isCenter && e.pointerType === "mouse" && setIsHovered(true)}
            onPointerLeave={() => isCenter && setIsHovered(false)}
            onClick={() => handleSlotClick(slot)}
          >
            <AnimatedFolder
              project={project}
              open={isCenter && fanOpen}
              interactive={isCenter}
              color={isCenter ? "var(--flag-red)" : "var(--steel-blue)"}
            />
          </div>
        );
      })}

      <p className="sr-only" aria-live="polite">
        {activeProject.title}, folder {wrapIndex(center, count) + 1} of {count}
        {isOpen ? ", open" : ""}
      </p>
    </div>
  );
}
