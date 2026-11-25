"use client";

import { useState, type FormEvent, type ReactNode, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock, Menu as MenuIcon, Monitor, Smartphone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepper } from "./useStepper";
import { DemoBadge, SceneControls } from "./SceneControls";

/**
 * Web studio: a fictional client's brief becomes a wireframe, then a visual
 * design, then a finished sample site the visitor can actually use
 * (working navigation, mobile menu and an enquiry form that is clearly a demo).
 */

const steps = [
  { title: "The brief", body: "It starts with a conversation: who your customers are, what they need to find, and how they should contact you." },
  { title: "Wireframe", body: "The structure comes first. Every section has a job before any colour or photography is added." },
  { title: "Visual design", body: "Brand colours, typography and imagery bring the structure to life." },
  { title: "Finished sample site", body: "A responsive site that works. Try the menu and the enquiry form, and switch between desktop and mobile." },
];

type View = "home" | "menu" | "order";

export function WebStudio() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const s = useStepper(sceneRef, steps.length, { interval: [3600, 3000, 3000, 3000], reducedStart: 3 });
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const stage = s.step;

  return (
    <div ref={sceneRef}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DemoBadge dark>Demo site for a fictional business</DemoBadge>
        <div className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15" role="group" aria-label="Preview device">
          {([["desktop", Monitor], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
            <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)} className={cn("inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold capitalize transition-colors", device === d ? "bg-white text-navy-900" : "text-white/75 hover:text-white")}>
              <Icon className="size-4" aria-hidden /> {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid min-h-[480px] place-items-center rounded-[var(--radius-card)] bg-[radial-gradient(circle_at_50%_0%,rgb(22_113_217/0.25),transparent_60%)] p-3 sm:p-8">
        <>
          {stage === 0 ? (
            <motion.div key="brief" initial={{ opacity: 0, rotate: -2, y: 20 }} animate={{ opacity: 1, rotate: -1.5, y: 0 }} exit={{ opacity: 0, scale: 0.92, rotate: 0 }} transition={{ duration: s.reduce ? 0 : 0.5 }}>
              <Brief />
            </motion.div>
          ) : (
            <motion.div
              key="frame"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: s.reduce ? 0 : 0.5 }}
              className={cn(
                "overflow-hidden bg-white shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]",
                device === "mobile" ? "w-[300px] max-w-full rounded-[2.2rem] border-[10px] border-navy-800" : "w-full max-w-[760px] rounded-2xl",
              )}
            >
              {device === "desktop" && (
                <div className="flex items-center gap-2 border-b border-line bg-mist px-4 py-2.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" /><span className="size-2.5 rounded-full bg-[#febc2e]" /><span className="size-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 h-6 flex-1 rounded-md bg-white px-3 text-[11px] leading-6 text-ink-soft">saltwaterbakery.example</span>
                </div>
              )}
              <SampleSite stage={stage} mobile={device === "mobile"} />
            </motion.div>
          )}
        </>
      </div>

      <SceneControls s={s} steps={steps} dark label="Website build" className="mt-6" />
    </div>
  );
}

function Brief() {
  const notes = ["Customers ask about cake orders", "Show opening hours clearly", "Easy WhatsApp contact", "Warm, friendly feel"];
  return (
    <div className="relative w-[min(560px,86vw)] rounded-lg bg-[#fffdf6] p-6 shadow-2xl sm:p-8">
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Client brief</p>
      <p className="mt-2 font-display text-2xl font-extrabold text-navy-900">Saltwater Bakery</p>
      <p className="text-sm text-ink-soft">Neighbourhood bakery · fictional example</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px]">
        <ul className="space-y-2">
          {notes.map((n, i) => (
            <motion.li key={n} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.25 }} className="flex gap-2 text-[15px] italic text-navy-800">
              <span className="text-blue-500">✓</span>{n}
            </motion.li>
          ))}
        </ul>
        <svg viewBox="0 0 180 140" className="h-auto w-full" aria-label="Rough page sketch">
          <motion.g fill="none" stroke="#4a4f5a" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }}>
            <motion.path d="M6 8 L174 10 L172 132 L8 130 Z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <motion.path d="M16 22 L60 22 M120 22 L160 23" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6 }} />
            <motion.path d="M16 38 L164 40 L162 78 L16 76 Z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.9 }} />
            <motion.path d="M16 90 L60 90 L60 120 L16 120 Z M70 90 L112 90 L112 120 L70 120 Z M122 90 L164 91 L164 120 L122 120 Z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.3 }} />
          </motion.g>
        </svg>
      </div>
      <span className="absolute -right-3 -top-4 rotate-6 rounded bg-[#ffe58f] px-3 py-2 text-xs font-semibold text-navy-900 shadow">&ldquo;Phone first!&rdquo;</span>
    </div>
  );
}

/** Text that is a grey bar in the wireframe and design stages and real copy in the finished site. */
function T({ stage, w, children, className }: { stage: number; w: string; children: ReactNode; className?: string }) {
  if (stage >= 3) return <span className={className}>{children}</span>;
  return <span className={cn("inline-block h-[0.7em] rounded align-middle", stage === 1 ? "bg-ink-soft/20" : "bg-current opacity-30")} style={{ width: w }} aria-hidden />;
}

function SampleSite({ stage, mobile }: { stage: number; mobile: boolean }) {
  const [view, setView] = useState<View>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const live = stage >= 3;
  const wire = stage === 1;
  const box = (designed: string) => (wire ? "border-2 border-dashed border-ink-soft/30 bg-transparent" : designed);
  const go = (v: View) => { setView(v); setMenuOpen(false); };
  const links: [View, string][] = [["home", "Home"], ["menu", "Our bakes"], ["order", "Order"]];

  return (
    <div className={cn("relative overflow-y-auto text-left", mobile ? "h-[520px]" : "h-[420px]", !wire && "font-sans")} inert={!live ? true : undefined}>
      {/* Nav */}
      <div className={cn("sticky top-0 z-10 flex items-center justify-between px-4 py-3", wire ? "border-b-2 border-dashed border-ink-soft/30 bg-white" : "bg-[#fff8ef]")}>
        <span className={cn("font-display text-sm font-extrabold", wire ? "text-ink-soft/40" : "text-[#7a3e1d]")}>
          <T stage={stage} w="90px">Saltwater Bakery</T>
        </span>
        {mobile ? (
          <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close demo menu" : "Open demo menu"} className={cn("grid size-9 place-items-center rounded-full", wire ? "border-2 border-dashed border-ink-soft/30" : "bg-[#7a3e1d] text-white")}>
            {menuOpen ? <X className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        ) : (
          <nav aria-label="Demo site" className="flex items-center gap-4 text-xs font-semibold">
            {links.map(([v, l]) => (
              <button key={v} type="button" onClick={() => go(v)} aria-current={view === v ? "page" : undefined} className={cn(wire ? "text-ink-soft/40" : view === v ? "text-[#7a3e1d] underline underline-offset-4" : "text-[#5b4636] hover:text-[#7a3e1d]")}>
                <T stage={stage} w="40px">{l}</T>
              </button>
            ))}
          </nav>
        )}
      </div>
      <AnimatePresence>
        {mobile && menuOpen && (
          <motion.nav aria-label="Demo site" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute inset-x-0 top-[60px] z-20 space-y-1 bg-[#fff8ef] p-4 shadow-lg">
            {links.map(([v, l]) => (
              <button key={v} type="button" onClick={() => go(v)} className="block w-full rounded-xl px-3 py-3 text-left font-display text-lg font-bold text-[#5b4636] hover:bg-[#f6e6d2]">{l}</button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {view === "home" && (
        <>
          <motion.div layout className={cn("m-3 grid gap-3 rounded-xl p-5", mobile ? "grid-cols-1" : "grid-cols-[1.2fr_1fr]", box("bg-gradient-to-br from-[#7a3e1d] to-[#c0743f] text-white"))}>
            <div className="space-y-3">
              <p className={cn("font-display font-extrabold leading-tight", mobile ? "text-xl" : "text-2xl")}><T stage={stage} w="80%">Fresh bread, baked before sunrise.</T></p>
              <p className="text-sm opacity-90"><T stage={stage} w="60%">Loaves, cakes and pastries made in small batches every morning.</T></p>
              <button type="button" onClick={() => go("order")} className={cn("rounded-full px-4 py-2 text-xs font-bold", wire ? "border-2 border-dashed border-ink-soft/30 text-transparent" : "bg-white text-[#7a3e1d]")}>
                <T stage={stage} w="60px">Ask about an order</T>
              </button>
            </div>
            {!mobile && (
              <div className={cn("min-h-28 rounded-lg", wire ? "border-2 border-dashed border-ink-soft/30" : "bg-[radial-gradient(circle_at_30%_70%,#f4c38a,transparent_55%),radial-gradient(circle_at_75%_25%,#fff1dc,transparent_50%),#e19b5f]")} />
            )}
          </motion.div>
          <div className={cn("mx-3 grid gap-3", mobile ? "grid-cols-1" : "grid-cols-3")}>
            {["Breads", "Celebration cakes", "Pastries"].map((c, i) => (
              <motion.div layout key={c} className={cn("rounded-xl p-3", box("bg-[#fff8ef] ring-1 ring-[#f1dcc4]"))} initial={false} animate={{ y: live ? 0 : 0 }} transition={{ delay: i * 0.05 }}>
                <div className={cn("mb-2 h-14 rounded-lg", wire ? "border-2 border-dashed border-ink-soft/30" : i === 1 ? "bg-[#f6d1c1]" : "bg-[#f1dcc4]")} />
                <p className="text-sm font-bold text-[#5b4636]"><T stage={stage} w="70%">{c}</T></p>
              </motion.div>
            ))}
          </div>
          <div className={cn("m-3 flex items-center gap-2 rounded-xl p-3 text-xs", box("bg-[#5b4636] text-white"))}>
            <Clock className={cn("size-4", wire && "opacity-30")} aria-hidden /> <T stage={stage} w="50%">Open Tue–Sun · 6am–2pm</T>
          </div>
        </>
      )}
      {view === "menu" && live && (
        <div className="space-y-2 p-4">
          <p className="font-display text-xl font-extrabold text-[#7a3e1d]">Our bakes</p>
          {["Sourdough loaf", "Coconut bake", "Sponge celebration cake", "Cinnamon rolls", "Currant rolls"].map((m) => (
            <div key={m} className="flex items-center justify-between rounded-xl bg-[#fff8ef] px-4 py-3 text-sm text-[#5b4636] ring-1 ring-[#f1dcc4]">{m}<span className="text-xs font-semibold text-[#c0743f]">Daily</span></div>
          ))}
        </div>
      )}
      {view === "order" && live && <OrderForm />}
    </div>
  );
}

function OrderForm() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!String(f.get("n") ?? "").trim() || !String(f.get("m") ?? "").trim()) { setErr("Please add your name and what you'd like."); return; }
    setErr("");
    setSent(true);
  };
  if (sent) {
    return (
      <div className="m-4 rounded-xl bg-[#eaf7ef] p-5 text-sm text-navy-900" role="status">
        <Check className="size-6 text-success" aria-hidden />
        <p className="mt-2 font-bold">Demo: enquiry form works.</p>
        <p className="mt-1 text-ink-soft">This is a sample site, so nothing was sent. On a real site, the business would receive your message.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-3 text-xs font-semibold text-blue-600 underline">Try again</button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-3 p-4" noValidate>
      <p className="font-display text-xl font-extrabold text-[#7a3e1d]">Ask about an order</p>
      <label className="block text-xs font-semibold text-[#5b4636]">Name<input name="n" className="mt-1 block w-full rounded-lg border border-[#f1dcc4] px-3 py-2 text-sm" /></label>
      <label className="block text-xs font-semibold text-[#5b4636]">What would you like?<textarea name="m" rows={3} className="mt-1 block w-full rounded-lg border border-[#f1dcc4] px-3 py-2 text-sm" /></label>
      {err && <p className="text-xs font-semibold text-danger" role="alert">{err}</p>}
      <button type="submit" className="w-full rounded-full bg-[#7a3e1d] py-2.5 text-sm font-bold text-white">Send enquiry (demo)</button>
    </form>
  );
}
