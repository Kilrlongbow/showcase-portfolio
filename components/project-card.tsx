"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  image: string;
  title: string;
  delay: number;
  isVisible: boolean;
  index: number;
  onClick: () => void;
  isSelected: boolean;
}

const rotations = [-12, 0, 12];
const translations = [-55, 0, 55];

export const ProjectCard = forwardRef<HTMLButtonElement, ProjectCardProps>(
  ({ image, title, delay, isVisible, index, onClick, isSelected }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={`Enlarge image: ${title}`}
        tabIndex={isVisible ? 0 : -1}
        aria-hidden={!isVisible}
        className={cn(
          "absolute w-20 h-28 rounded-lg overflow-hidden shadow-xl",
          "bg-card border border-border",
          "cursor-pointer hover:ring-2 hover:ring-accent/50 motion-reduce:!transition-none",
          !isVisible && "pointer-events-none",
          isSelected && "opacity-0",
        )}
        style={{
          transform: isVisible
            ? `translateY(-90px) translateX(${translations[index]}px) rotate(${rotations[index]}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.5)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
          zIndex: 10 - index,
          left: "-40px",
          top: "-56px",
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Image
          src={image || "/placeholder.svg"}
          alt=""
          fill
          sizes="80px"
          unoptimized={image.endsWith(".svg")}
          className="object-cover"
          draggable={false}
        />
        <span className="absolute inset-x-0 bottom-0 h-8 bg-space" />
        <span className="absolute bottom-1.5 left-1.5 right-1.5 text-left text-[10px] font-medium text-primary-foreground truncate">
          {title}
        </span>
      </button>
    );
  },
);

ProjectCard.displayName = "ProjectCard";
