"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Site-wide motion settings.
 *
 * `reducedMotion="user"` makes every framer-motion animation honour the OS
 * "reduce motion" setting (WCAG 2.3.3) — including the looping badge pulse,
 * the scroll cue and the hero parallax, none of which the CSS
 * `prefers-reduced-motion` block can reach, because framer-motion drives them
 * from JS rather than through CSS animations or transitions.
 *
 * A thin client wrapper because framer-motion ships no `"use client"`
 * directive of its own, so it cannot be imported straight into the server
 * root layout.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
