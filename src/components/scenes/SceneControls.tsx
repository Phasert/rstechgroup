"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Stepper } from "./useStepper";

/** Accessible step controls shared by the scenes: numbered steps, prev/next, play/pause, replay, live caption. */
export function SceneControls({
  s,
  steps,
  dark = false,
  label,
  className,
}: {
  s: Stepper;
  steps: { title: string; body: string }[];
  dark?: boolean;
  label: string;
  className?: string;
}) {
  const current = steps[s.step];
  const btn = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
    dark ? "text-white ring-1 ring-white/25 hover:bg-white/10" : "text-navy-900 ring-1 ring-line hover:text-blue-600 hover:ring-blue-300",
  );
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`${label} controls`}>
        <ol className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-1" aria-label={`${label} steps`}>
          {steps.map((st, i) => (
            <li key={st.title}>
              <button
                type="button"
                onClick={() => s.go(i)}
                aria-current={s.step === i ? "step" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-full pl-1.5 pr-4 text-sm font-semibold transition-colors",
                  s.step === i
                    ? "bg-blue-500 text-white"
                    : dark ? "text-white/70 ring-1 ring-white/15 hover:text-white" : "text-ink-soft ring-1 ring-line hover:text-navy-900",
                )}
              >
                <span className={cn("grid size-8 place-items-center rounded-full font-display text-xs", s.step === i ? "bg-white/20" : dark ? "bg-white/10" : "bg-mist")}>{i + 1}</span>
                <span className="hidden sm:inline">{st.title}</span>
                <span className="sr-only sm:hidden">{st.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <button type="button" onClick={s.prev} disabled={s.step === 0} className={cn(btn, "w-11 px-0 disabled:opacity-40")} aria-label="Previous step">
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={s.next} disabled={s.step === steps.length - 1} className={cn(btn, "w-11 px-0 disabled:opacity-40")} aria-label="Next step">
            <ChevronRight className="size-4" aria-hidden />
          </button>
          {!s.reduce && (
            <button type="button" onClick={s.toggle} className={cn(btn, "w-11 px-0")} aria-label={s.playing ? "Pause" : "Play"}>
              {s.playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
          )}
          <button type="button" onClick={s.replay} className={btn}>
            <RotateCcw className="size-4" aria-hidden /> Replay
          </button>
        </div>
      </div>
      <div className={cn("mt-5 min-h-24", dark ? "text-white" : "text-navy-900")} aria-live="polite">
        <p className={cn("font-display text-xs font-semibold uppercase tracking-[0.2em]", dark ? "text-blue-300" : "text-blue-500")}>
          Step {s.step + 1} of {steps.length}
        </p>
        <p className="mt-2 font-display text-xl font-bold">{current.title}</p>
        <p className={cn("mt-1 max-w-2xl leading-relaxed", dark ? "text-white/70" : "text-ink-soft")}>{current.body}</p>
      </div>
    </div>
  );
}

/** Small "illustrative / demo" badge so sample scenes are never mistaken for real work. */
export function DemoBadge({ children = "Illustrative example", dark = false }: { children?: React.ReactNode; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", dark ? "bg-white/10 text-white/80 ring-1 ring-white/15" : "bg-warning/10 text-[#8a4b0f] ring-1 ring-warning/30")}>
      <span className={cn("size-1.5 rounded-full", dark ? "bg-blue-300" : "bg-warning")} aria-hidden />
      {children}
    </span>
  );
}
