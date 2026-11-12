"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Renders its children everywhere except the home page, which fits in one screen. */
export function HideOnHome({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : children;
}
