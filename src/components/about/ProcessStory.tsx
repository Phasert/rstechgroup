"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * About page process: four stages told as a scroll story. On large screens the
 * illustration stays pinned and changes as each stage scrolls into focus; on
 * small screens each stage carries its own illustration. Stage dots are buttons
 * for keyboard and touch users.
 */

const stages = [
  { name: "Assess", title: "We listen, then we look.", body: "What's the problem, where does it happen, and what's already in place? We don't recommend anything until we understand your setup and how you use it." },
  { name: "Recommend", title: "Options in plain language.", body: "You get a clear explanation of what we'd do, why, and what it involves. Practical fixes come first, and we won't push upgrades you don't need." },
  { name: "Implement", title: "Careful, tidy work.", body: "Installations and configuration are done with attention to detail, so the result is reliable and easy to understand later." },
  { name: "Verify", title: "Tested with you.", body: "We check the result works the way you need, explain what changed, and only then call the job done." },
];

export function ProcessStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div className="aspect-[5/4] overflow-hidden rounded-[var(--radius-card)] bg-navy-950 ring-1 ring-white/10">
            <>
              <motion.div key={active} className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Art i={active} />
              </motion.div>
            </>
          </div>
          <ol className="mt-6 flex items-center" aria-label="Process stages">
            {stages.map((s, i) => (
              <li key={s.name} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  aria-current={active === i ? "step" : undefined}
                  className={cn("flex min-h-11 items-center gap-2 rounded-full px-3 font-display text-sm font-semibold transition-colors", active === i ? "bg-blue-500 text-white" : active > i ? "text-blue-600" : "text-ink-soft")}
                >
                  <span className={cn("grid size-7 place-items-center rounded-full text-xs", active === i ? "bg-white/20" : "bg-mist")}>{i + 1}</span>
                  {s.name}
                </button>
                {i < stages.length - 1 && <span className="mx-1 h-0.5 flex-1 rounded bg-line"><span className={cn("block h-full rounded bg-blue-500 transition-all duration-500", active > i ? "w-full" : "w-0")} /></span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="space-y-10 lg:space-y-0">
        {stages.map((s, i) => (
          <Stage key={s.name} i={i} s={s} onActive={setActive} refCb={(el) => { refs.current[i] = el; }} />
        ))}
      </div>
    </div>
  );
}

function Stage({ i, s, onActive, refCb }: { i: number; s: (typeof stages)[number]; onActive: (i: number) => void; refCb: (el: HTMLDivElement | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  useEffect(() => { if (inView) onActive(i); }, [inView, i, onActive]);
  return (
    <div ref={(el) => { ref.current = el; refCb(el); }} className="lg:flex lg:min-h-[70vh] lg:items-center">
      <div>
        <div className="mb-6 aspect-[5/4] overflow-hidden rounded-[var(--radius-card)] bg-navy-950 lg:hidden" aria-hidden><Art i={i} /></div>
        <p className="eyebrow">{String(i + 1).padStart(2, "0")} · {s.name}</p>
        <h3 className="display-2 mt-4">{s.title}</h3>
        <p className="lead mt-5 max-w-lg">{s.body}</p>
      </div>
    </div>
  );
}

function Art({ i }: { i: number }) {
  const reduce = useReducedMotion();
  const d = (x: number) => (reduce ? { duration: 0 } : { duration: 0.8, delay: x });
  return (
    <svg viewBox="0 0 400 320" className="h-full w-full" aria-hidden>
      <defs>
        <pattern id="aboutGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="white" strokeOpacity="0.05" /></pattern>
      </defs>
      <rect width="400" height="320" fill="url(#aboutGrid)" />
      {i === 0 && (
        <g>
          <path d="M90 230 V140 L170 90 L250 140 V230 Z" fill="none" stroke="#5d9bec" strokeWidth="3" />
          <rect x="120" y="170" width="40" height="60" fill="none" stroke="#5d9bec" strokeWidth="2" />
          <rect x="185" y="160" width="40" height="30" fill="none" stroke="#5d9bec" strokeWidth="2" />
          <motion.g initial={{ x: reduce ? 60 : -40 }} animate={{ x: reduce ? 60 : [-40, 90, 40] }} transition={reduce ? { duration: 0 } : { duration: 3, repeat: Infinity, repeatType: "mirror" }}>
            <circle cx="200" cy="170" r="34" fill="#1671d9" fillOpacity="0.15" stroke="white" strokeWidth="5" />
            <path d="M224 194 L252 222" stroke="white" strokeWidth="9" strokeLinecap="round" />
          </motion.g>
          <rect x="280" y="70" width="80" height="104" rx="8" fill="white" />
          {[0, 1, 2, 3].map((k) => <motion.rect key={k} x="292" y={92 + k * 18} height="6" rx="3" fill="#021d52" initial={{ width: 0 }} animate={{ width: 40 + (k % 2) * 14 }} transition={d(0.3 + k * 0.2)} />)}
        </g>
      )}
      {i === 1 && (
        <g>
          {[0, 1, 2].map((k) => (
            <motion.g key={k} initial={{ y: reduce ? 0 : 20, opacity: reduce ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} transition={d(k * 0.15)}>
              <rect x={50 + k * 105} y="80" width="90" height="140" rx="12" fill={k === 1 ? "#1671d9" : "white"} fillOpacity={k === 1 ? 1 : 0.1} stroke={k === 1 ? "#5d9bec" : "white"} strokeOpacity="0.4" />
              <rect x={64 + k * 105} y="100" width="50" height="7" rx="3.5" fill="white" opacity={k === 1 ? 1 : 0.5} />
              <rect x={64 + k * 105} y="116" width="62" height="5" rx="2.5" fill="white" opacity="0.35" />
              <rect x={64 + k * 105} y="128" width="40" height="5" rx="2.5" fill="white" opacity="0.35" />
            </motion.g>
          ))}
          <motion.g initial={{ scale: reduce ? 1 : 0 }} animate={{ scale: 1 }} transition={reduce ? { duration: 0 } : { type: "spring", delay: 0.7 }} style={{ transformOrigin: "200px 240px", transformBox: "view-box" }}>
            <circle cx="200" cy="240" r="24" fill="#1f9d6b" />
            <path d="M189 240 l8 8 l14 -16" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </g>
      )}
      {i === 2 && (
        <g>
          <rect x="80" y="140" width="110" height="60" rx="10" fill="#132f63" stroke="#5d9bec" strokeWidth="2" />
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={100 + k * 22} cy="185" r="4" fill="#3ddc84" />)}
          <rect x="250" y="90" width="80" height="60" rx="10" fill="#132f63" stroke="#5d9bec" strokeWidth="2" />
          <rect x="250" y="190" width="80" height="60" rx="10" fill="#132f63" stroke="#5d9bec" strokeWidth="2" />
          <motion.path d="M190 160 C220 160, 220 120, 250 120" fill="none" stroke="#5d9bec" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={d(0.2)} />
          <motion.path d="M190 180 C220 180, 220 220, 250 220" fill="none" stroke="#5d9bec" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={d(0.6)} />
          <motion.g initial={{ rotate: reduce ? 0 : -25 }} animate={{ rotate: reduce ? 0 : [-25, 15, -25] }} transition={reduce ? { duration: 0 } : { duration: 2, repeat: Infinity }} style={{ transformOrigin: "120px 100px", transformBox: "view-box" }}>
            <path d="M120 100 L160 60" stroke="white" strokeWidth="10" strokeLinecap="round" />
            <circle cx="166" cy="54" r="14" fill="none" stroke="white" strokeWidth="7" />
          </motion.g>
        </g>
      )}
      {i === 3 && (
        <g>
          <motion.path d="M200 60 L270 90 V160 C270 210, 235 240, 200 256 C165 240, 130 210, 130 160 V90 Z" fill="#1671d9" fillOpacity="0.2" stroke="#5d9bec" strokeWidth="4" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={d(0)} />
          <motion.path d="M172 158 l20 20 l38 -42" fill="none" stroke="#3ddc84" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={d(0.7)} />
          {[0, 1, 2, 3].map((k) => <motion.rect key={k} x={300 + k * 16} width="10" rx="2" fill="#3ddc84" initial={{ y: 250, height: 0 }} animate={{ y: 250 - (k + 1) * 18, height: (k + 1) * 18 }} transition={d(1 + k * 0.1)} />)}
        </g>
      )}
    </svg>
  );
}
