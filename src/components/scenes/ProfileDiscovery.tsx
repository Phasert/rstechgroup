"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock, Image as ImageIcon, MapPin, Navigation, Phone, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepper } from "./useStepper";
import { DemoBadge, SceneControls } from "./SceneControls";

/**
 * Illustrative journey from a local search to a complete business profile.
 * Fictional business; makes no ranking, placement or verification claims.
 */

const steps = [
  { title: "A customer searches", body: "Someone nearby looks for the kind of business you run." },
  { title: "Your business on the map", body: "A set-up profile gives your business a pin with the right name and location." },
  { title: "The profile opens", body: "They see your hours, directions, photos and a way to contact you, without leaving the page." },
  { title: "Complete and accurate", body: "Every field filled in and kept current, so customers get the right answer first time." },
];

const QUERY = "hardware store open now";
const pins = [
  { x: 18, y: 30 }, { x: 70, y: 22 }, { x: 82, y: 64 }, { x: 30, y: 72 },
];

export function ProfileDiscovery() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const s = useStepper(sceneRef, steps.length, { interval: [3000, 2600, 3200, 3600], reducedStart: 3 });
  const st = s.step;
  const typed = useTyping(QUERY, st === 0 && !s.reduce, s.run);
  const query = st === 0 && !s.reduce ? typed : QUERY;

  return (
    <div ref={sceneRef} className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
      <div className="card relative overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <DemoBadge>Illustrative · fictional business</DemoBadge>
          <span className="hidden text-xs text-ink-soft sm:block">Not a real search result</span>
        </div>
        <div className="p-4 sm:p-6" aria-hidden>
          <div className="flex items-center gap-3 rounded-full bg-mist px-4 py-3 ring-1 ring-line">
            <Search className="size-4 text-ink-soft" />
            <span className="text-sm text-navy-900">{query}<span className={cn("ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-navy-900", st === 0 && !s.reduce ? "animate-pulse" : "opacity-0")} /></span>
          </div>
          <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-[#e8eef5]">
            {/* stylised streets */}
            <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 20 L100 26 M0 46 L100 40 M30 0 L36 62 M68 0 L62 62" stroke="white" strokeWidth="3" fill="none" />
              <path d="M0 8 L40 12 M50 55 L100 52 M85 0 L88 30" stroke="white" strokeWidth="1.5" fill="none" />
              <rect x="40" y="28" width="14" height="9" rx="1.5" fill="#cfe6d6" />
              <rect x="72" y="4" width="20" height="12" rx="1.5" fill="#cfe6d6" />
            </svg>
            {st >= 1 && pins.map((p, i) => (
              <motion.span key={`${i}-${s.run}`} className="absolute -translate-x-1/2 -translate-y-full text-ink-soft/60" style={{ left: `${p.x}%`, top: `${p.y}%` }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.reduce ? 0 : 0.1 * i }}>
                <MapPin className="size-5" />
              </motion.span>
            ))}
            {st >= 1 && (
              <motion.span key={`main-${s.run}`} className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-full" initial={{ y: s.reduce ? 0 : -60, opacity: s.reduce ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} transition={s.reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 14, delay: 0.5 }}>
                <span className="flex flex-col items-center">
                  <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-navy-900 shadow">Northgate Hardware</span>
                  <MapPin className="mt-0.5 size-9 fill-danger text-white drop-shadow" />
                </span>
              </motion.span>
            )}
            {st === 0 && <div className="absolute inset-0 grid place-items-center text-sm text-ink-soft">Searching nearby…</div>}
          </div>
          <AnimatePresence>
            {st >= 2 && (
              <motion.div key={`card-${s.run}`} initial={{ y: s.reduce ? 0 : 40, opacity: s.reduce ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: s.reduce ? 0 : 0.5 }} className="relative -mt-10 rounded-2xl bg-white p-5 shadow-[var(--shadow-lift)] ring-1 ring-line">
                <p className="font-display text-lg font-bold text-navy-900">Northgate Hardware</p>
                <p className="text-sm text-ink-soft">Hardware store</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm"><Clock className="size-4 text-success" /><span className="font-semibold text-success">Open</span><span className="text-ink-soft">· Closes 6 pm</span></p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[[Navigation, "Directions"], [Phone, "Call"], [Star, "Save"]].map(([I, l]) => {
                    const Icon = I as typeof Phone;
                    return <span key={l as string} className="flex flex-col items-center gap-1 rounded-xl bg-blue-50 py-2 text-[11px] font-semibold text-blue-600"><Icon className="size-4" />{l as string}</span>;
                  })}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {["#c9d8ea", "#e6d3bd", "#cfe6d6", "#dcd6ea"].map((c) => <span key={c} className="grid aspect-square place-items-center rounded-lg" style={{ background: c }}><ImageIcon className="size-4 text-white" /></span>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div>
        <SceneControls s={s} steps={steps} label="Business profile" />
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {["Correct name & category", "Accurate opening hours", "Location & directions", "Phone & website", "Photos you supply", "Clear description"].map((f, i) => {
            const done = st === 3 || (st === 2 && i < 5) || (st === 1 && i < 1 + 2);
            return (
              <li key={f} className={cn("flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ring-1 transition-colors duration-500", done ? "bg-success/10 text-navy-900 ring-success/30" : "text-ink-soft ring-line")}>
                <span className={cn("grid size-5 place-items-center rounded-full", done ? "bg-success text-white" : "bg-mist")}>{done && <Check className="size-3" aria-hidden />}</span>
                {f}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Illustration only. Google decides how and where profiles appear, and verification is completed through Google&apos;s own steps. We set up a complete, accurate profile; we don&apos;t promise rankings.
        </p>
      </div>
    </div>
  );
}

function useTyping(text: string, active: boolean, run: number) {
  const [n, setN] = useState(0);
  const [lastRun, setLastRun] = useState(run);
  if (run !== lastRun) { setLastRun(run); setN(0); }
  useEffect(() => {
    if (!active || n >= text.length) return;
    const id = setTimeout(() => setN((v) => v + 1), 70);
    return () => clearTimeout(id);
  }, [active, n, text.length]);
  return text.slice(0, n);
}
