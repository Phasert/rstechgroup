"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Clipboard, Globe, Image as ImageIcon, LayoutList, Mail, MapPin, MessageCircle, Send, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  contentOptions,
  defaultPlan,
  featureOptions,
  hostingOptions,
  planScope,
  planSummary,
  planToParams,
  sizeOptions,
  type Plan,
} from "@/lib/planner";

/**
 * Interactive project planner: visitors define the scope and a live site map
 * redraws as they choose. The plan travels to /quote in the URL and pre-fills
 * the enquiry. Scope is qualitative; no prices are shown.
 */

const featureIcon = { enquiry: Send, whatsapp: MessageCircle, gallery: ImageIcon, listings: LayoutList, location: MapPin } as const;
const pageNames = ["About", "Services", "Contact", "Gallery", "FAQ", "Team", "Projects", "Reviews", "Blog", "Locations", "Careers", "Events"];

export function PackagePlanner() {
  const [plan, setPlan] = useState<Plan>(defaultPlan);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const set = <K extends keyof Plan>(k: K, v: Plan[K]) => { setPlan((p) => ({ ...p, [k]: v })); setCopied(false); };
  const toggleFeature = (f: Plan["features"][number]) =>
    set("features", plan.features.includes(f) ? plan.features.filter((x) => x !== f) : [...plan.features, f]);

  const size = sizeOptions.find((s) => s.value === plan.size)!;
  const childPages = size.pages - 1;
  const scope = planScope(plan);
  const summary = planSummary(plan);
  const t = { duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] as const };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`RS Technology Group website plan\n${summary.map((l) => `- ${l}`).join("\n")}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      {/* Choices */}
      <div className="space-y-8">
        <Group legend="1. How big is the site?">
          <div className="grid grid-cols-2 gap-2">
            {sizeOptions.map((o) => (
              <Choice key={o.value} type="radio" name="size" checked={plan.size === o.value} onChange={() => set("size", o.value)} label={o.label} detail={o.detail} />
            ))}
          </div>
        </Group>
        <Group legend="2. What should visitors be able to do?">
          <div className="grid gap-2 sm:grid-cols-2">
            {featureOptions.map((o) => (
              <Choice key={o.value} type="checkbox" checked={plan.features.includes(o.value)} onChange={() => toggleFeature(o.value)} label={o.label} />
            ))}
          </div>
        </Group>
        <Group legend="3. Your content">
          <div className="grid gap-2 sm:grid-cols-2">
            {contentOptions.map((o) => <Choice key={o.value} type="radio" name="content" checked={plan.content === o.value} onChange={() => set("content", o.value)} label={o.label} />)}
          </div>
        </Group>
        <Group legend="4. Domain, hosting and care">
          <div className="grid gap-2">
            {hostingOptions.map((o) => <Choice key={o.value} type="radio" name="hosting" checked={plan.hosting === o.value} onChange={() => set("hosting", o.value)} label={o.label} />)}
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Choice type="checkbox" checked={plan.email} onChange={() => set("email", !plan.email)} label="Business email address" />
            <Choice type="checkbox" checked={plan.care} onChange={() => set("care", !plan.care)} label="Ongoing updates & care" />
          </div>
        </Group>
        {/* Phones: the preview sits below the choices, so keep a compact live summary in view. */}
        <a href="#plan-preview" className="sticky bottom-3 z-20 flex min-h-14 items-center justify-between gap-3 rounded-full bg-navy-900 px-5 text-sm font-semibold text-white shadow-[var(--shadow-lift)] lg:hidden">
          <span aria-live="polite">{size.label} · {plan.features.length} features · {scope.label}</span>
          <span className="text-blue-300">View plan ↓</span>
        </a>
      </div>

      {/* Live preview */}
      <div id="plan-preview" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-navy-950 text-white ring-1 ring-white/10">
          <div className="grid-pattern-dark relative p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-blue-300">Live scope preview</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold" aria-live="polite">
                Scope: {scope.label}
                <span className="flex gap-0.5" aria-hidden>{[1, 2, 3].map((l) => <span key={l} className={cn("h-2.5 w-1.5 rounded-sm", l <= scope.level ? "bg-blue-300" : "bg-white/20")} />)}</span>
              </span>
            </div>

            {/* Site map */}
            <LayoutGroup>
              <div className="mt-6 flex flex-col items-center" aria-hidden>
                <motion.div layout transition={t} className="relative w-44 rounded-xl bg-white p-3 text-navy-900 shadow-lg">
                  <p className="font-display text-sm font-bold">Home</p>
                  <div className="mt-2 h-1.5 w-3/4 rounded bg-mist" />
                  <div className="mt-1 h-1.5 w-1/2 rounded bg-mist" />
                  <div className="mt-2 flex flex-wrap gap-1">
                    <AnimatePresence>
                      {plan.features.map((f) => {
                        const I = featureIcon[f];
                        return (
                          <motion.span key={f} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={t} className="grid size-6 place-items-center rounded-md bg-blue-500 text-white">
                            <I className="size-3.5" />
                          </motion.span>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
                {childPages > 0 && <motion.div layout className="h-5 w-px bg-white/30" />}
                <motion.div layout transition={t} className="flex max-w-full flex-wrap justify-center gap-2">
                  <AnimatePresence>
                    {pageNames.slice(0, Math.min(childPages, 11)).map((n, i) => (
                      <motion.span key={n} layout initial={{ opacity: 0, y: -10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ ...t, delay: reduce ? 0 : i * 0.03 }} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/85 ring-1 ring-white/15">
                        {n}
                      </motion.span>
                    ))}
                    {childPages > 11 && <motion.span layout key="more" className="rounded-lg px-2 py-1.5 text-xs text-white/60">+ more</motion.span>}
                  </AnimatePresence>
                </motion.div>
                {childPages === 0 && <p className="mt-3 text-xs text-white/60">Single page with sections</p>}
              </div>
            </LayoutGroup>

            {/* Services around the site */}
            <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden>
              {[
                { on: plan.content === "help", icon: LayoutList, label: "Content help" },
                { on: plan.hosting !== "have", icon: Globe, label: plan.hosting === "unsure" ? "Hosting: TBC" : "Domain & hosting" },
                { on: plan.email, icon: Mail, label: "Business email" },
                { on: plan.care, icon: Wrench, label: "Ongoing care" },
              ].map(({ on, icon: I, label }) => (
                <motion.div key={label} initial={false} animate={{ opacity: on ? 1 : 0.35 }} transition={t} className={cn("rounded-xl p-3 text-xs ring-1", on ? "bg-blue-500/20 ring-blue-300/50" : "ring-white/10")}>
                  <I className="size-4 text-blue-300" />
                  <p className="mt-2 font-semibold">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-white/10 bg-navy-900 p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold text-white">Your plan</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-white/80">
              {summary.map((l) => <li key={l} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-blue-300" aria-hidden />{l}</li>)}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              This is a starting point, not a quote. We&apos;ll confirm the right package, what&apos;s included and the price after a short conversation.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href={`/quote?${planToParams(plan)}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-display font-semibold text-white hover:bg-blue-600">
                Take this plan to a quote <ArrowRight className="size-4" aria-hidden />
              </Link>
              <button type="button" onClick={copy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/10">
                {copied ? <Check className="size-4" aria-hidden /> : <Clipboard className="size-4" aria-hidden />}
                {copied ? "Copied" : "Copy summary"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-display text-lg font-bold text-navy-900">{legend}</legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

function Choice({ type, name, checked, onChange, label, detail }: { type: "radio" | "checkbox"; name?: string; checked: boolean; onChange: () => void; label: string; detail?: string }) {
  return (
    <label className="block h-full">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex h-full min-h-14 cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100">
        <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center border-2 transition-colors", type === "radio" ? "rounded-full" : "rounded-md", checked ? "border-blue-500 bg-blue-500 text-white" : "border-line")}>
          {checked && <Check className="size-3" aria-hidden />}
        </span>
        <span>
          <span className="block font-semibold text-navy-900">{label}</span>
          {detail && <span className="mt-0.5 block text-sm text-ink-soft">{detail}</span>}
        </span>
      </span>
    </label>
  );
}
