"use client";

import type React from "react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxItem {
  id: string;
  image: string;
  title: string;
}

interface ImageLightboxProps {
  projects: LightboxItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
  /** Page the "View" button leads to */
  href?: string;
  label?: string;
}

export function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
  href,
  label = "Image viewer",
}: ImageLightboxProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isSliding, setIsSliding] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const duration = reduceMotion ? 0 : 400;

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;

  const currentProject = projects[internalIndex];

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- slide is driven by the parent index
      setIsSliding(true);
      setInternalIndex(currentIndex);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (!isSliding) return;
    const timer = setTimeout(() => setIsSliding(false), duration);
    return () => clearTimeout(timer);
  }, [isSliding, duration]);

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate]);

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, duration);
  }, [onClose, onCloseComplete, duration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "ArrowLeft") navigatePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      /* eslint-disable react-hooks/set-state-in-effect -- measured open animation */
      setShouldRender(true);
      setInternalIndex(currentIndex);
      setAnimationPhase(reduceMotion ? "complete" : "initial");
      setIsClosing(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      if (reduceMotion) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
      });
      const timer = setTimeout(() => {
        setAnimationPhase("complete");
      }, 500);
      return () => clearTimeout(timer);
    }
    // currentIndex is only read when opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sourceRect, reduceMotion]);

  useEffect(() => {
    if (animationPhase === "complete" && isOpen) closeButtonRef.current?.focus();
  }, [animationPhase, isOpen]);

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) return;
    onNavigate(idx);
  };

  if (!shouldRender || !currentProject) return null;

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {};

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetWidth = Math.min(768, viewportWidth - 64);
    const targetHeight = Math.min(viewportHeight * 0.85, 600);

    const targetX = (viewportWidth - targetWidth) / 2;
    const targetY = (viewportHeight - targetHeight) / 2;

    const scaleX = sourceRect.width / targetWidth;
    const scaleY = sourceRect.height / targetHeight;
    const scale = Math.max(scaleX, scaleY);

    const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2);
    const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2);

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 1,
    };
  };

  const getFinalStyles = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1)",
    opacity: 1,
  });

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();
  const controlsVisible = animationPhase === "complete" && !isClosing;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div
        className="absolute inset-0 bg-background"
        style={{
          opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
          transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      />

      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className={cn(
          "absolute top-5 right-5 z-50",
          "w-10 h-10 flex items-center justify-center",
          "rounded-full bg-muted ring-1 ring-border",
          "border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-all duration-300 ease-out hover:scale-105 active:scale-95",
        )}
        style={{
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
      >
        <X className="w-4 h-4" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          navigatePrev();
        }}
        disabled={!hasPrev || isSliding}
        className={cn(
          "absolute left-4 md:left-8 z-50",
          "w-12 h-12 flex items-center justify-center",
          "rounded-full bg-muted ring-1 ring-border",
          "border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
          "disabled:opacity-0 disabled:pointer-events-none",
        )}
        style={{
          opacity: controlsVisible && hasPrev ? 1 : 0,
          transform: controlsVisible ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          navigateNext();
        }}
        disabled={!hasNext || isSliding}
        className={cn(
          "absolute right-4 md:right-8 z-50",
          "w-12 h-12 flex items-center justify-center",
          "rounded-full bg-muted ring-1 ring-border",
          "border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
          "disabled:opacity-0 disabled:pointer-events-none",
        )}
        style={{
          opacity: controlsVisible && hasNext ? 1 : 0,
          transform: controlsVisible ? "translateX(0)" : "translateX(20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <div
        className="relative z-10 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transform: isClosing && !reduceMotion ? "translate(0, 0) scale(0.95)" : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms ease-out`,
          transformOrigin: "center center",
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl bg-card ring-1 ring-border shadow-2xl"
          style={{
            borderRadius: animationPhase === "initial" && !isClosing ? "8px" : "16px",
            transition: "border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
                transition: isSliding && !reduceMotion ? "transform 400ms cubic-bezier(0.32, 0.72, 0, 1)" : "none",
              }}
            >
              {projects.map((project, idx) => (
                // eslint-disable-next-line @next/next/no-img-element -- natural-size image inside a sliding strip
                <img
                  key={project.id}
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  aria-hidden={idx !== internalIndex}
                  className="w-full h-auto max-h-[70vh] object-contain bg-background flex-shrink-0"
                  style={{ minWidth: "100%" }}
                />
              ))}
            </div>

          </div>

          <div
            className="px-6 py-5 bg-card border-t border-border"
            style={{
              opacity: controlsVisible ? 1 : 0,
              transform: controlsVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-foreground tracking-tight truncate h-7">
                  {currentProject?.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="hidden sm:block text-sm text-muted-foreground">
                    <kbd className="px-1.5 py-0.5 mx-0.5 text-xs font-medium bg-muted text-muted-foreground rounded border border-border">
                      ←
                    </kbd>
                    <kbd className="px-1.5 py-0.5 mx-0.5 text-xs font-medium bg-muted text-muted-foreground rounded border border-border">
                      →
                    </kbd>{" "}
                    to navigate
                  </p>
                  <div className="flex items-center">
                    {projects.map((project, idx) => (
                      <button
                        key={project.id}
                        type="button"
                        aria-label={`Show image ${idx + 1} of ${totalProjects}`}
                        aria-current={idx === internalIndex}
                        onClick={() => handleDotClick(idx)}
                        className="grid h-6 w-6 place-items-center"
                      >
                        <span
                          className={cn(
                            "block w-2 h-2 rounded-full transition-all duration-300",
                            idx === internalIndex
                              ? "bg-foreground scale-110"
                              : "bg-muted-foreground/40 hover:bg-muted-foreground/60",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {href && (
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2",
                    "text-sm font-medium text-muted-foreground",
                    "bg-muted/50 hover:bg-muted",
                    "rounded-lg border border-border",
                    "transition-all duration-200 ease-out",
                    "hover:text-foreground",
                  )}
                >
                  <span>View project</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
