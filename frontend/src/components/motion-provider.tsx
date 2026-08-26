"use client";

import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * MotionProvider: Wraps the app with LazyMotion for optimal bundle splitting.
 * Also respects the user's prefers-reduced-motion OS setting via useReducedMotion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict={false}>
      <div data-reduced-motion={shouldReduceMotion ? "true" : "false"}>
        {children}
      </div>
    </LazyMotion>
  );
}
