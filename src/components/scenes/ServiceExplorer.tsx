"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Flower2, Laptop, MapPin, Search, Wifi } from "lucide-react";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { getService, type ServiceSlug } from "@/lib/services";

/** Need-led explorer: visitors pick the problem they have and see the matching service. */

const needs: { need: string; slug: ServiceSlug; why: string }[] = [
  { need: "My Wi-Fi doesn't reach every room", slug: "networking", why: "Coverage problems are usually about placement and layout, not just internet speed." },
  { need: "My computer is slow or acting up", slug: "it-support", why: "Most slowdowns have a cause that can be found and fixed, from startup clutter to a full drive." },
  { need: "Our printer won't connect", slug: "it-support", why: "Printers often drop off the network after a router change and need reconnecting properly." },
  { need: "We need a website", slug: "website-development", why: "A clear, responsive site that makes it easy for customers to understand you and get in touch." },
  { need: "Customers can't find us on Google", slug: "google-business-profile", why: "A complete, accurate Business Profile puts your hours, location and contact details in front of searchers." },
  { need: "Our social profiles look inconsistent", slug: "social-media-setup", why: "Matching names, logos and details make your business recognisable wherever customers look." },
  { need: "We need to link a second building", slug: "networking", why: "A wireless bridge can connect two locations without running cable between them." },
  { need: "I'm not sure how healthy our setup is", slug: "technology-health-checks", why: "An assessment tells you what's fine, what isn't, and what to fix first." },
];

export function ServiceExplorer() {
  const [i, setI] = useState(0);
  const n = needs[i];
  const s = getService(n.slug)!;
  const reduce = useReducedMotion();
  const resultRef = useRef<HTMLDivElement>(null);
  // Below lg the result sits under the list of needs, so bring it into view after a choice.
  const choose = (idx: number) => {
    setI(idx);
    if (window.innerWidth < 1024) requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <fieldset>
        <legend className="font-display text-lg font-bold text-navy-900">What&apos;s going on?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {needs.map((x, idx) => (
            <label key={x.need}>
              <input type="radio" name="need" className="peer sr-only" checked={i === idx} onChange={() => choose(idx)} />
              <span className="inline-flex min-h-12 cursor-pointer items-center rounded-full bg-white px-5 text-left text-[15px] font-semibold text-navy-900 ring-1 ring-line transition-colors hover:ring-blue-300 peer-checked:bg-navy-900 peer-checked:text-white peer-checked:ring-navy-900 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-300">
                {x.need}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div ref={resultRef} className="scroll-mb-4 overflow-hidden rounded-[var(--radius-card)] bg-navy-950 text-white ring-1 ring-white/10" aria-live="polite">
        <div className="grid-pattern-dark relative grid h-48 place-items-center overflow-hidden" aria-hidden>
          <>
            <motion.div key={n.slug} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: reduce ? 0 : 0.35 }}>
              <MiniPreview slug={n.slug} reduce={!!reduce} />
            </motion.div>
          </>
        </div>
        <>
          <motion.div key={n.need} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3 }} className="p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-semibold text-blue-300"><ServiceIcon name={s.icon} className="size-4" /> Recommended: {s.title}</p>
            <p className="mt-3 text-lg leading-relaxed text-white/85">{n.why}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/services/${s.slug}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-display font-semibold text-white hover:bg-blue-600">
                See how it works <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={`/quote?service=${s.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-display font-semibold text-white ring-1 ring-white/30 hover:bg-white/10">
                Request a quote
              </Link>
            </div>
          </motion.div>
        </>
      </div>
    </div>
  );
}

/** Tiny looping vignette per service. Static under reduced motion. */
function MiniPreview({ slug, reduce }: { slug: ServiceSlug; reduce: boolean }) {
  const loop = (d = 0) => (reduce ? { duration: 0 } : { duration: 1.6, repeat: Infinity, repeatDelay: 1, delay: d });
  switch (slug) {
    case "networking":
      return (
        <div className="flex items-center gap-6">
          {[0, 1, 2].map((k) => (
            <div key={k} className="relative grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Wifi className="size-6 text-blue-300" />
              {!reduce && <motion.span className="absolute inset-0 rounded-2xl ring-2 ring-blue-300" initial={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 0, scale: 1.7 }} transition={loop(k * 0.4)} />}
            </div>
          ))}
        </div>
      );
    case "it-support":
      return (
        <div className="w-48 rounded-xl bg-white p-3 text-navy-900">
          <div className="flex items-center gap-2 text-xs font-semibold"><Laptop className="size-4 text-blue-500" /> Running checks</div>
          <div className="mt-3 h-2 rounded-full bg-mist"><motion.div className="h-full rounded-full bg-success" initial={{ width: reduce ? "100%" : "10%" }} animate={{ width: "100%" }} transition={loop()} /></div>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-success"><Check className="size-3" /> Back to normal</p>
        </div>
      );
    case "website-development":
      return (
        <div className="w-56 overflow-hidden rounded-lg bg-white">
          <div className="h-3 bg-mist" />
          <div className="space-y-1.5 p-2">
            <motion.div className="h-10 rounded" initial={{ backgroundColor: reduce ? "#1671d9" : "#e3e7ed" }} animate={{ backgroundColor: "#1671d9" }} transition={loop()} />
            <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((k) => <motion.div key={k} className="h-6 rounded" initial={{ backgroundColor: reduce ? "#dceafb" : "#f3f5f7" }} animate={{ backgroundColor: "#dceafb" }} transition={loop(0.2 + k * 0.15)} />)}</div>
          </div>
        </div>
      );
    case "social-media-setup":
      return (
        <div className="flex items-center gap-3">
          <motion.span className="grid size-16 place-items-center rounded-full" initial={{ backgroundColor: reduce ? "#e0665a" : "#4a4f5a" }} animate={{ backgroundColor: "#e0665a" }} transition={loop()}><Flower2 className="size-8 text-white" /></motion.span>
          <div className="grid grid-cols-3 gap-1">{Array.from({ length: 6 }, (_, k) => <motion.span key={k} className="size-7 rounded-sm" initial={{ backgroundColor: reduce ? (k % 2 ? "#fbf1e6" : "#e0665a") : "#4a4f5a" }} animate={{ backgroundColor: k % 2 ? "#fbf1e6" : "#e0665a" }} transition={loop(k * 0.08)} />)}</div>
        </div>
      );
    case "google-business-profile":
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-navy-900"><Search className="size-3.5" /> shop near me</div>
          <motion.span initial={{ y: reduce ? 0 : -24, opacity: reduce ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 12, repeat: Infinity, repeatDelay: 1.5 }}>
            <MapPin className="size-10 fill-danger text-white" />
          </motion.span>
        </div>
      );
    case "technology-health-checks":
      return (
        <ul className="w-52 space-y-1.5 rounded-xl bg-white p-3 text-xs text-navy-900">
          {["Devices", "Connectivity", "Setup"].map((l, k) => (
            <li key={l} className="flex items-center gap-2">
              <motion.span className="grid size-4 place-items-center rounded-full text-white" initial={{ backgroundColor: reduce ? "#1f9d6b" : "#e3e7ed" }} animate={{ backgroundColor: "#1f9d6b" }} transition={loop(k * 0.4)}><Check className="size-2.5" /></motion.span>
              {l}
            </li>
          ))}
        </ul>
      );
  }
}
