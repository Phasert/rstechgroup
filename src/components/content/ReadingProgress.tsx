"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar under the header for long articles. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-[72px] z-40 h-1 origin-left bg-blue-500" style={{ scaleX }} />;
}
