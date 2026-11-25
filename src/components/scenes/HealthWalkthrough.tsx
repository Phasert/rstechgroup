"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ClipboardCheck, HardDrive, Laptop, Monitor, Printer, Router, Settings2, ShieldAlert, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepper } from "./useStepper";
import { DemoBadge, SceneControls } from "./SceneControls";

/** Inspection walkthrough of an example small-office health check, ending in a prioritised report. */

type Priority = "High" | "Medium" | "Low";

const checkpoints = [
  {
    title: "Devices",
    body: "Each computer and shared device is checked for storage, updates and general condition.",
    items: [Monitor, Laptop, Laptop, Printer],
    finding: "Front-desk computer: storage 92% full and updates paused for months.",
    action: "Free up space, resume updates and set them to install automatically.",
    priority: "Medium" as Priority,
  },
  {
    title: "Connectivity",
    body: "Internet, router and Wi-Fi are tested where people actually work.",
    items: [Router, Wifi, Wifi],
    finding: "Router still uses its default admin password.",
    action: "Set a strong admin password and record it somewhere safe.",
    priority: "High" as Priority,
  },
  {
    title: "Setup",
    body: "How things are configured: backups, accounts and shared files.",
    items: [HardDrive, Settings2, ShieldAlert],
    finding: "Shared files aren't backed up anywhere.",
    action: "Set up an automatic backup and test a restore.",
    priority: "High" as Priority,
  },
];

const extra = { finding: "Weak Wi-Fi in the back office.", action: "Reposition or add an access point after a coverage check.", priority: "Low" as Priority };

const steps = [
  ...checkpoints.map((c) => ({ title: `Check ${c.title.toLowerCase()}`, body: c.body })),
  { title: "Prioritised report", body: "Findings are ranked so you know what to do first, in plain language you can act on." },
];

const tone: Record<Priority, string> = {
  High: "bg-danger/10 text-danger ring-danger/30",
  Medium: "bg-warning/10 text-[#8a4b0f] ring-warning/30",
  Low: "bg-blue-50 text-blue-600 ring-blue-100",
};

export function HealthWalkthrough() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const s = useStepper(sceneRef, steps.length, { interval: [3600, 3600, 3600, 5000], reducedStart: 3 });
  const st = s.step;
  const cp = checkpoints[st];
  const report = [...checkpoints, extra].sort((a, b) => ["High", "Medium", "Low"].indexOf(a.priority) - ["High", "Medium", "Low"].indexOf(b.priority));

  return (
    <div ref={sceneRef}>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Checklist rail */}
        <ol className="flex gap-2 overflow-x-auto lg:flex-col" aria-hidden>
          {[...checkpoints.map((c) => c.title), "Report"].map((t, i) => (
            <li key={t} className={cn("flex min-w-36 items-center gap-3 rounded-2xl p-4 ring-1 transition-colors", i === st ? "bg-navy-900 text-white ring-navy-900" : i < st ? "bg-success/10 text-navy-900 ring-success/30" : "bg-white text-ink-soft ring-line")}>
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold", i === st ? "bg-blue-500" : i < st ? "bg-success text-white" : "bg-mist")}>{i < st ? "✓" : i + 1}</span>
              <span className="font-display font-semibold">{t}</span>
            </li>
          ))}
        </ol>

        <div className="card relative min-h-[380px] overflow-hidden p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <DemoBadge>Example findings</DemoBadge>
            <span className="flex items-center gap-2 text-xs font-semibold text-ink-soft"><ClipboardCheck className="size-4 text-blue-500" aria-hidden /> Small office assessment</span>
          </div>
          <>
            {cp ? (
              <motion.div key={`cp-${st}-${s.run}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: s.reduce ? 0 : 0.4 }} className="mt-6">
                <div className="relative flex flex-wrap justify-center gap-4 overflow-hidden rounded-2xl bg-mist p-6" aria-hidden>
                  {cp.items.map((I, i) => (
                    <motion.span key={i} className="grid size-16 place-items-center rounded-2xl bg-white text-navy-700 shadow-sm ring-1 ring-line" initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: s.reduce ? 0 : 0.3 + i * 0.25 }}>
                      <I className="size-7" />
                    </motion.span>
                  ))}
                  {!s.reduce && <span className="pointer-events-none absolute inset-0 animate-[scan_1.6s_ease-in-out_2] bg-gradient-to-b from-transparent via-blue-300/35 to-transparent" />}
                </div>
                <motion.div initial={{ opacity: s.reduce ? 1 : 0, y: s.reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.reduce ? 0 : 1.6 }} className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl p-4 ring-1 ring-line">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">Finding</p>
                    <p className="mt-1 text-navy-900">{cp.finding}</p>
                  </div>
                  <div className="rounded-2xl p-4 ring-1 ring-line">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">Recommendation</p>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold ring-1", tone[cp.priority])}>{cp.priority}</span>
                    </div>
                    <p className="mt-1 text-navy-900">{cp.action}</p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key={`report-${s.run}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: s.reduce ? 0 : 0.4 }} className="mt-6">
                <p className="font-display text-xl font-bold text-navy-900">What to do first</p>
                <ol className="mt-4 space-y-2">
                  {report.map((r, i) => (
                    <motion.li key={r.finding} initial={{ opacity: s.reduce ? 1 : 0, x: s.reduce ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: s.reduce ? 0 : 0.2 + i * 0.25 }} className="flex flex-col gap-2 rounded-2xl p-4 ring-1 ring-line sm:flex-row sm:items-center">
                      <span className="font-display text-sm font-bold text-ink-soft">{i + 1}</span>
                      <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ring-1", tone[r.priority])}>{r.priority}</span>
                      <span className="flex-1 text-sm text-navy-900"><strong>{r.action}</strong> <span className="text-ink-soft">({r.finding.replace(/\.$/, "").toLowerCase()})</span></span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            )}
          </>
        </div>
      </div>
      <SceneControls s={s} steps={steps} label="Health check walkthrough" className="mt-6" />
    </div>
  );
}
