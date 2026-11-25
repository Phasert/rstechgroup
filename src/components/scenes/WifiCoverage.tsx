"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Laptop, Router, Smartphone, Tv, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "./SceneControls";

/** Before/after Wi-Fi coverage on an illustrative home floor plan. */

const rooms = [
  { x: 0, y: 0, w: 300, h: 220, label: "Living room" },
  { x: 300, y: 0, w: 300, h: 180, label: "Kitchen" },
  { x: 0, y: 220, w: 220, h: 160, label: "Bedroom" },
  { x: 220, y: 220, w: 220, h: 160, label: "Home office" },
  { x: 440, y: 180, w: 160, h: 200, label: "Back room" },
];

const devices = [
  { x: 150, y: 120, icon: Tv, before: 3, label: "TV" },
  { x: 470, y: 90, icon: Smartphone, before: 2, label: "Phone in kitchen" },
  { x: 100, y: 310, icon: Smartphone, before: 1, label: "Phone in bedroom" },
  { x: 330, y: 300, icon: Laptop, before: 1, label: "Laptop in office" },
  { x: 510, y: 300, icon: Laptop, before: 0, label: "Laptop in back room" },
];

const sources = {
  before: [{ x: 40, y: 40, r: 300, kind: "router" as const }],
  after: [
    { x: 40, y: 40, r: 210, kind: "router" as const },
    { x: 420, y: 245, r: 200, kind: "ap" as const },
    { x: 380, y: 60, r: 190, kind: "ap" as const },
  ],
};

/** True on phone-width screens, where the 600-unit plan renders at about half size. */
function useSmallScreen() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia("(max-width: 639px)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false,
  );
}

export function WifiCoverage() {
  const small = useSmallScreen();
  // Phones: enlarge labels and device chips so they stay legible when the plan is scaled down.
  const k = small ? 1.55 : 1;
  const [mode, setMode] = useState<"before" | "after">("before");
  const reduce = useReducedMotion();
  const t = { duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] as const };
  const all = [...sources.after];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div className="card relative overflow-hidden p-3 sm:p-5">
        <div className="mb-3"><DemoBadge>Illustrative floor plan</DemoBadge></div>
        <svg viewBox="0 0 600 380" className="block h-auto w-full" role="img" aria-label={mode === "before" ? "Before: one router in the corner, weak signal in the bedroom and office and none in the back room." : "After: two access points added, strong signal in every room."}>
          <defs>
            <radialGradient id="wifiHeat">
              <stop offset="0" stopColor="#1671d9" stopOpacity="0.55" />
              <stop offset="0.55" stopColor="#5d9bec" stopOpacity="0.28" />
              <stop offset="1" stopColor="#5d9bec" stopOpacity="0" />
            </radialGradient>
            <pattern id="dead" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="10" height="10" fill="#fdf1e4" />
              <line x1="0" y1="0" x2="0" y2="10" stroke="#f0c48f" strokeWidth="4" />
            </pattern>
          </defs>
          <rect width="600" height="380" fill="#f8fafc" />
          {all.map((src, i) => {
            const on = mode === "after" || i === 0;
            const r = mode === "before" ? sources.before[0].r : src.r;
            return (
              <motion.circle key={i} cx={src.x} cy={src.y} fill="url(#wifiHeat)" initial={false} animate={{ r: on ? r : 0, opacity: on ? 1 : 0 }} transition={t} />
            );
          })}
          <motion.rect x="440" y="180" width="160" height="200" fill="url(#dead)" initial={false} animate={{ opacity: mode === "before" ? 0.85 : 0 }} transition={t} />
          {rooms.map((r) => (
            <g key={r.label}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="#021d52" strokeWidth="4" />
              <text x={r.x + 10} y={r.y + r.h - 10} fontSize={small ? 22 : 13} fontWeight={small ? 600 : 400} fill="#4a4f5a" fontFamily="var(--font-sans)">{small ? ({ "Living room": "Living", "Home office": "Office", "Back room": "Back" } as Record<string, string>)[r.label] ?? r.label : r.label}</text>
            </g>
          ))}
          {/* doorways */}
          {[[260, 220, 30, 4], [300, 120, 4, 40], [440, 260, 4, 40], [180, 220, 30, 4]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y - 1} width={w} height={h + 2} fill="#f8fafc" />)}
          {all.map((src, i) => {
            const on = mode === "after" || i === 0;
            return (
              <g key={`src-${i}`} transform={`translate(${src.x} ${src.y}) scale(${k}) translate(${-src.x} ${-src.y})`}>
              <motion.g initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.4 }} transition={t} style={{ transformOrigin: `${src.x}px ${src.y}px`, transformBox: "view-box" }}>
                <circle cx={src.x} cy={src.y} r="18" fill="#021d52" />
                <foreignObject x={src.x - 10} y={src.y - 10} width="20" height="20">
                  {src.kind === "router" ? <Router className="size-5 text-white" /> : <Wifi className="size-5 text-white" />}
                </foreignObject>
              </motion.g>
              </g>
            );
          })}
          {devices.map((d) => {
            const bars = mode === "after" ? 4 : d.before;
            const Icon = d.icon;
            return (
              <g key={d.label} transform={`translate(${d.x} ${d.y}) scale(${k}) translate(${-d.x} ${-d.y})`}>
                <rect x={d.x - 22} y={d.y - 18} width="70" height="36" rx="10" fill="white" stroke={bars === 0 ? "#d9822b" : "#e3e7ed"} />
                <foreignObject x={d.x - 15} y={d.y - 11} width="22" height="22"><Icon className="size-5 text-navy-700" /></foreignObject>
                {[0, 1, 2, 3].map((b) => (
                  <motion.rect key={b} x={d.x + 14 + b * 7} width="5" rx="1" initial={false} animate={{ y: d.y + 8 - (b + 1) * 5, height: (b + 1) * 5, fill: b < bars ? (bars <= 1 ? "#d9822b" : "#1f9d6b") : "#e3e7ed" }} transition={{ ...t, delay: reduce ? 0 : b * 0.06 }} />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <div>
        <div className="inline-flex rounded-full bg-mist p-1 ring-1 ring-line" role="group" aria-label="Coverage view">
          {(["before", "after"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cn("min-h-11 rounded-full px-6 font-display text-sm font-semibold capitalize transition-colors", mode === m ? "bg-navy-900 text-white" : "text-ink-soft hover:text-navy-900")}>
              {m}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="mt-6">
          {mode === "before" ? (
            <>
              <h3 className="text-2xl font-bold">One router, doing too much.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">A single router in the corner covers the nearest rooms well, but walls and distance weaken the signal. The office struggles and the back room drops out entirely.</p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold">Coverage planned around the space.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">Access points placed where people actually work and relax spread the signal evenly. Devices connect to the strongest point as you move through the home.</p>
            </>
          )}
        </div>
        <p className="mt-4 text-sm text-ink-soft">The right fix depends on your layout and equipment, so we assess the space before recommending anything.</p>
      </div>
    </div>
  );
}
