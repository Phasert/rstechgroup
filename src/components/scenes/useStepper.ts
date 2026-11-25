"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Shared playback for step-based scenes: autoplays only while the scene is on
 * screen, pauses offscreen, never autoplays under reduced motion, and exposes
 * manual controls (go to step, next, previous, replay, play/pause).
 */
export function useStepper(ref: RefObject<HTMLElement | null>, count: number, { interval = 3800, loop = false, reducedStart }: { interval?: number | number[]; loop?: boolean; reducedStart?: number } = {}) {
  const reduce = !!useReducedMotion();
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(0);
  // Bumped on every replay/jump so keyframed layers can remount and play again.
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedApplied, setReducedApplied] = useState(false);

  // Under reduced motion, start on a meaningful frame (usually the result) and do not autoplay.
  if (reduce && !reducedApplied) {
    setReducedApplied(true);
    setPlaying(false);
    if (reducedStart !== undefined) setStep(reducedStart);
  }

  const active = playing && inView && !reduce;
  const delay = Array.isArray(interval) ? interval[step] ?? interval[interval.length - 1] : interval;

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => {
      setStep((s) => {
        if (s < count - 1) return s + 1;
        if (loop) return 0;
        setPlaying(false);
        return s;
      });
    }, delay);
    return () => clearTimeout(id);
  }, [active, step, count, loop, delay]);

  return {
    step,
    run,
    reduce,
    inView,
    playing: active,
    finished: step === count - 1 && !playing,
    go: (i: number) => { setStep(Math.max(0, Math.min(count - 1, i))); setRun((r) => r + 1); setPlaying(false); },
    next: () => { setStep((s) => Math.min(count - 1, s + 1)); setRun((r) => r + 1); setPlaying(false); },
    prev: () => { setStep((s) => Math.max(0, s - 1)); setRun((r) => r + 1); setPlaying(false); },
    replay: () => { setStep(0); setRun((r) => r + 1); setPlaying(true); },
    toggle: () => {
      if (step === count - 1 && !playing) { setStep(0); setRun((r) => r + 1); setPlaying(true); return; }
      setPlaying((p) => !p);
    },
  };
}

export type Stepper = ReturnType<typeof useStepper>;
