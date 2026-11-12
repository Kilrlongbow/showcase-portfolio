"use client";

import Image from "next/image";
import { type PointerEvent, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlipPortraitProps {
  facts: string[];
  className?: string;
}

/**
 * Portrait card that tilts towards the cursor and flips over on click, tap
 * or Enter to show a few facts on the back. With reduced motion it does not
 * tilt and crossfades between the sides instead of rotating.
 */
export function FlipPortrait({ facts, className }: FlipPortraitProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLButtonElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType !== "mouse" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 10, y: x * 12 });
  };

  const rotation = reduceMotion ? 0 : flipped ? 180 : 0;

  return (
    <div className={cn("relative mx-auto aspect-[3/4] w-full max-w-sm [perspective:1200px]", className)}>
      <button
        ref={cardRef}
        type="button"
        aria-pressed={flipped}
        aria-label={flipped ? "Show my photo" : "Flip the photo to read a few facts about me"}
        onClick={() => setFlipped((f) => !f)}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        className="group relative block h-full w-full cursor-pointer rounded-3xl text-left [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${rotation + tilt.y}deg)`,
          transition: reduceMotion ? "none" : "transform 700ms cubic-bezier(0.34, 1.3, 0.64, 1)",
        }}
      >
        {/* Front: the photo on a coloured card */}
        <span
          className="absolute inset-0 overflow-hidden rounded-3xl bg-steel/25 ring-1 ring-border [backface-visibility:hidden]"
          style={{
            opacity: reduceMotion && flipped ? 0 : 1,
            transition: reduceMotion ? "opacity 200ms" : undefined,
          }}
          aria-hidden={flipped}
        >
          <Image
            src="/images/me-cutout.png"
            alt="Eugene Chivurayise"
            fill
            priority
            sizes="(min-width: 768px) 384px, 90vw"
            className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-space px-3 py-1.5 text-xs font-semibold text-papaya">
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            Flip me
          </span>
        </span>

        {/* Back: a few facts */}
        <span
          className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-space p-7 text-papaya [backface-visibility:hidden]"
          style={{
            transform: reduceMotion ? undefined : "rotateY(180deg)",
            opacity: reduceMotion && !flipped ? 0 : 1,
            transition: reduceMotion ? "opacity 200ms" : undefined,
          }}
          aria-hidden={!flipped}
        >
          <span className="font-heading block text-5xl">Hi, I&apos;m Eugene</span>
          <span className="mt-6 block space-y-3">
            {facts.map((fact) => (
              <span key={fact} className="block border-l-4 border-flag pl-3 text-lg leading-snug">
                {fact}
              </span>
            ))}
          </span>
          <span className="mt-6 inline-flex items-center gap-1.5 self-end rounded-full bg-papaya px-3 py-1.5 text-xs font-semibold text-space">
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            Flip back
          </span>
        </span>
      </button>
    </div>
  );
}
