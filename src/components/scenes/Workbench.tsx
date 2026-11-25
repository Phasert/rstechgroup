"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, FileText, Folder, Image as ImageIcon, Loader2, Mail, Printer, RotateCcw, Router, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepper } from "./useStepper";
import { DemoBadge } from "./SceneControls";

/**
 * Troubleshooting workbench: three everyday jobs. Each case moves from a
 * "before" state through four steps to an "after" state, and the bench
 * illustration changes with every step so the visitor sees what the work achieves.
 */

type CaseId = "slow" | "printer" | "setup";

const cases: Record<CaseId, { tab: string; before: string; after: string; steps: { title: string; body: string }[] }> = {
  slow: {
    tab: "Slow computer",
    before: "Takes ages to start, apps freeze, the disk is nearly full.",
    after: "Starts promptly, apps open smoothly, room to spare.",
    steps: [
      { title: "Check what runs at startup", body: "Programs that launch themselves every time are reviewed, and the unnecessary ones are switched off." },
      { title: "Check storage and disk health", body: "A nearly full or failing drive slows everything. Space is freed and the drive's health is checked." },
      { title: "Apply pending updates", body: "Operating system and driver updates are installed so the machine is stable and secure." },
      { title: "Re-test and explain", body: "The computer is restarted and tested, and you're told in plain language what was changed." },
    ],
  },
  printer: {
    tab: "Printer won't connect",
    before: "The printer shows offline and nobody can print.",
    after: "Every computer and phone that needs it can print.",
    steps: [
      { title: "Check the printer's connection", body: "Is it on the network at all? The printer's own network settings are the first stop." },
      { title: "Rejoin the right network", body: "Printers often drop off after a router change. It's reconnected to the correct Wi-Fi." },
      { title: "Install the correct driver", body: "Each computer gets the right driver so jobs go to the right printer." },
      { title: "Print a test page", body: "A test page from each device confirms everything works before we leave." },
    ],
  },
  setup: {
    tab: "New computer setup",
    before: "A new computer in the box and an old one full of everything you need.",
    after: "Ready to work: files, email, apps, printer and backups in place.",
    steps: [
      { title: "Unbox and update", body: "The new machine is set up, updated and secured before anything is moved across." },
      { title: "Move your files", body: "Documents, photos and folders are copied from the old computer." },
      { title: "Set up email and apps", body: "Your email accounts and the software you use are installed and signed in." },
      { title: "Printer and backups", body: "Printing and a backup routine are configured so it's ready for everyday use." },
    ],
  },
};

export function Workbench() {
  const [active, setActive] = useState<CaseId>("slow");
  return (
    <div>
      <div role="tablist" aria-label="Troubleshooting examples" className="flex flex-wrap gap-2">
        {(Object.keys(cases) as CaseId[]).map((id) => (
          <button
            key={id}
            role="tab"
            type="button"
            id={`tab-${id}`}
            aria-selected={active === id}
            aria-controls={`panel-${id}`}
            onClick={() => setActive(id)}
            onKeyDown={(e) => {
              const ids = Object.keys(cases) as CaseId[];
              const i = ids.indexOf(id);
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const n = ids[(i + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length];
                setActive(n);
                document.getElementById(`tab-${n}`)?.focus();
              }
            }}
            tabIndex={active === id ? 0 : -1}
            className={cn("min-h-12 rounded-2xl px-5 font-display font-semibold transition-colors", active === id ? "bg-navy-900 text-white" : "bg-white text-ink-soft ring-1 ring-line hover:text-navy-900")}
          >
            {cases[id].tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} className="mt-6">
        <Case key={active} id={active} />
      </div>
    </div>
  );
}

function Case({ id }: { id: CaseId }) {
  const c = cases[id];
  // progress 0 = before, 4 = after
  const sceneRef = useRef<HTMLDivElement>(null);
  const s = useStepper(sceneRef, 5, { interval: 2300, reducedStart: 4 });
  const p = s.step;
  return (
    <div ref={sceneRef} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="card relative overflow-hidden bg-gradient-to-b from-mist to-white p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <DemoBadge>Example job</DemoBadge>
          <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-line" role="group" aria-label="Compare">
            <button type="button" aria-pressed={p === 0} onClick={() => s.go(0)} className={cn("min-h-10 rounded-full px-4 text-sm font-semibold", p === 0 ? "bg-warning/15 text-[#8a4b0f]" : "text-ink-soft")}>Before</button>
            <button type="button" aria-pressed={p === 4} onClick={() => s.go(4)} className={cn("min-h-10 rounded-full px-4 text-sm font-semibold", p === 4 ? "bg-success/15 text-success" : "text-ink-soft")}>After</button>
          </div>
        </div>
        <div className="mt-6 grid min-h-[260px] place-items-center" aria-hidden>
          {id === "slow" && <SlowBench p={p} />}
          {id === "printer" && <PrinterBench p={p} />}
          {id === "setup" && <SetupBench p={p} />}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite">
          <Outcome label="Before" text={c.before} on={p === 0} tone="warn" />
          <Outcome label="After" text={c.after} on={p === 4} tone="ok" />
        </div>
      </div>
      <div>
        <ol className="space-y-2">
          {c.steps.map((st, i) => {
            const done = p > i;
            const current = p === i + 1;
            return (
              <li key={st.title}>
                <button
                  type="button"
                  onClick={() => s.go(i + 1)}
                  aria-current={current ? "step" : undefined}
                  className={cn("flex w-full gap-4 rounded-2xl p-4 text-left transition-colors", current ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-mist")}
                >
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold transition-colors", done ? "bg-success text-white" : current ? "bg-blue-500 text-white" : "bg-mist text-ink-soft")}>
                    {done && !current ? <Check className="size-4" aria-hidden /> : i + 1}
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-navy-900">{st.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{st.body}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={s.replay} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-navy-900 ring-1 ring-line hover:text-blue-600">
          <RotateCcw className="size-4" aria-hidden /> Run the fix again
        </button>
      </div>
    </div>
  );
}

function Outcome({ label, text, on, tone }: { label: string; text: string; on: boolean; tone: "warn" | "ok" }) {
  return (
    <div className={cn("rounded-2xl p-4 ring-1 transition-all duration-500", on ? (tone === "ok" ? "bg-success/10 ring-success/30" : "bg-warning/10 ring-warning/30") : "bg-white ring-line opacity-60")}>
      <p className={cn("text-xs font-bold uppercase tracking-[0.18em]", tone === "ok" ? "text-success" : "text-[#8a4b0f]")}>{label}</p>
      <p className="mt-1 text-sm text-navy-900">{text}</p>
    </div>
  );
}

function LaptopFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-[260px] max-w-full", className)}>
      <div className="aspect-[16/10] overflow-hidden rounded-t-xl border-[6px] border-b-0 border-navy-800 bg-white">{children}</div>
      <div className="mx-auto h-3 w-[112%] -translate-x-[5.3%] rounded-b-xl bg-navy-700" />
    </div>
  );
}

function SlowBench({ p }: { p: number }) {
  const apps = 6 - Math.min(p, 1) * 4;
  const disk = p >= 2 ? 58 : 96;
  return (
    <LaptopFrame>
      <div className="flex h-full flex-col gap-2 p-3 text-[10px]">
        <div className="flex items-center justify-between font-semibold text-navy-900">
          <span>{p === 4 ? "Ready" : "Starting up…"}</span>
          {p < 4 ? <Loader2 className="size-3.5 animate-spin text-ink-soft" /> : <Check className="size-3.5 text-success" />}
        </div>
        <div className="flex gap-1">
          <AnimatePresence>
            {Array.from({ length: apps }, (_, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} className="size-4 rounded bg-blue-100 ring-1 ring-blue-300" />
            ))}
          </AnimatePresence>
          <span className="ml-auto text-ink-soft">{apps} startup apps</span>
        </div>
        <div>
          <div className="flex justify-between text-ink-soft"><span>Storage</span><span>{disk}% used</span></div>
          <div className="mt-1 h-2 rounded-full bg-mist"><motion.div className={cn("h-full rounded-full", disk > 90 ? "bg-danger" : "bg-success")} animate={{ width: `${disk}%` }} transition={{ duration: 0.8 }} /></div>
        </div>
        <div className="flex items-center gap-1.5 text-ink-soft">
          {p >= 3 ? <Check className="size-3 text-success" /> : <span className="size-3 rounded-full bg-warning" />}
          {p >= 3 ? "Up to date" : "Updates pending"}
        </div>
        <div className="mt-auto h-1.5 rounded-full bg-mist"><motion.div className="h-full rounded-full bg-blue-500" animate={{ width: p === 4 ? "100%" : "28%" }} transition={{ duration: 1 }} /></div>
      </div>
    </LaptopFrame>
  );
}

function PrinterBench({ p }: { p: number }) {
  const onNet = p >= 2;
  const ready = p >= 3;
  return (
    <div className="flex w-full max-w-md items-end justify-between gap-2">
      <div className="text-center">
        <Router className="mx-auto size-10 text-navy-700" />
        <p className="mt-1 text-xs text-ink-soft">Router</p>
      </div>
      <div className="relative mb-8 h-1 flex-1">
        <div className={cn("absolute inset-0 rounded-full transition-all duration-700", onNet ? "bg-blue-500" : "border-t-2 border-dashed border-danger/60 bg-transparent")} />
        <span className="absolute -top-7 left-1/2 -translate-x-1/2">{onNet ? <Wifi className="size-5 text-blue-500" /> : <WifiOff className="size-5 text-danger" />}</span>
      </div>
      <div className="relative">
        <div className="relative z-10 w-32 rounded-2xl bg-navy-800 p-3 shadow-lg">
          <div className="h-2 rounded-full bg-navy-950" />
          <div className="mt-3 flex items-center justify-between">
            <span className={cn("size-2.5 rounded-full transition-colors", ready ? "bg-success" : p >= 1 ? "bg-warning" : "bg-danger")} />
            <span className="text-[10px] font-semibold text-white/80">{ready ? "Ready" : onNet ? "Connected" : "Offline"}</span>
          </div>
          <Printer className="mx-auto mt-2 size-8 text-white/80" />
        </div>
        <AnimatePresence>
          {p === 4 && (
            <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className="absolute -bottom-14 left-1/2 w-20 -translate-x-1/2 rounded-sm bg-white p-2 shadow ring-1 ring-line">
              <p className="text-[9px] font-bold text-navy-900">Test page</p>
              <div className="mt-1 h-1 rounded bg-mist" /><div className="mt-1 h-1 w-2/3 rounded bg-mist" />
              <Check className="ml-auto mt-1 size-3 text-success" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SetupBench({ p }: { p: number }) {
  const items = [
    { icon: Check, label: "Updated & secured", at: 1 },
    { icon: Folder, label: "Files moved", at: 2 },
    { icon: Mail, label: "Email & apps", at: 3 },
    { icon: Printer, label: "Printer & backups", at: 4 },
  ];
  const files = [FileText, ImageIcon, Folder];
  return (
    <div className="flex w-full max-w-lg items-center justify-between gap-3">
      <div className="w-24 shrink-0 text-center">
        <div className="aspect-[16/10] rounded-md border-4 border-ink-soft/40 bg-mist" />
        <p className="mt-1 text-xs text-ink-soft">Old computer</p>
      </div>
      <div className="relative h-10 flex-1">
        {p === 2 && files.map((F, i) => (
          <motion.span key={i} className="absolute top-2 text-blue-500" initial={{ left: "0%", opacity: 0 }} animate={{ left: ["0%", "85%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.4 }}>
            <F className="size-5" />
          </motion.span>
        ))}
      </div>
      <LaptopFrame className="w-[190px]">
        {p === 0 ? (
          <div className="grid h-full place-items-center bg-[repeating-linear-gradient(45deg,#f3f5f7,#f3f5f7_8px,#e3e7ed_8px,#e3e7ed_16px)] text-[10px] font-semibold text-ink-soft">In the box</div>
        ) : (
          <ul className="space-y-1 p-2 text-[10px]">
            {items.map(({ icon: I, label, at }) => (
              <motion.li key={label} initial={false} animate={{ opacity: p >= at ? 1 : 0.35 }} className="flex items-center gap-1.5 text-navy-900">
                <span className={cn("grid size-4 place-items-center rounded-full", p >= at ? "bg-success text-white" : "bg-mist")}>{p >= at && <I className="size-2.5" />}</span>
                {label}
              </motion.li>
            ))}
          </ul>
        )}
      </LaptopFrame>
    </div>
  );
}
