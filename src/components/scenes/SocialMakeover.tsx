"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { Flower2, Globe, MessageCircle, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepper } from "./useStepper";
import { DemoBadge, SceneControls } from "./SceneControls";

/** Phone-based profile makeover for a fictional florist, inspected stage by stage. */

const steps = [
  { title: "Before", body: "An old personal-style handle, a default picture, no description and no way to get in touch." },
  { title: "Profile image & name", body: "A clear logo that reads at small sizes, and the real business name customers search for." },
  { title: "Bio & contact", body: "A one-line description of what you offer, plus message, call and website buttons." },
  { title: "Visual identity", body: "Consistent colours and highlight covers make the profile instantly recognisable." },
];

const brand = { coral: "#e0665a", leaf: "#3f8f6b", cream: "#fbf1e6" };
const beforeTiles = ["#c9ced6", "#a7b0bd", "#e3e7ed", "#d7c9b8", "#b8c2ce", "#cfd5dd", "#9aa7bd", "#e8e2d8", "#c0c7d1"];
const afterTiles = [brand.coral, brand.cream, brand.leaf, brand.cream, brand.coral, brand.cream, brand.leaf, brand.cream, brand.coral];

export function SocialMakeover() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const s = useStepper(sceneRef, steps.length, { interval: 2800, reducedStart: 3 });
  const st = s.step;
  const t = { duration: s.reduce ? 0 : 0.5 };

  return (
    <div ref={sceneRef} className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
      <div className="mx-auto">
        <div className="mb-3 text-center"><DemoBadge>Fictional sample business</DemoBadge></div>
        <div className="relative w-[272px] rounded-[2.6rem] bg-navy-900 p-3 sm:w-[290px] shadow-[0_40px_80px_-30px_rgb(2_29_82/0.6)]" aria-hidden>
          <div className="absolute left-1/2 top-4 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-navy-900" />
          <div className="h-[440px] overflow-hidden rounded-[2rem] bg-white px-4 pb-4 pt-10 sm:h-[560px]">
            <div className="flex items-center gap-4">
              <motion.div className="grid size-16 shrink-0 place-items-center rounded-full" initial={false} animate={{ backgroundColor: st >= 1 ? brand.coral : "#e3e7ed" }} transition={t}>
                {st >= 1 ? (
                  <motion.span key={`logo-${s.run}`} initial={{ scale: s.reduce ? 1 : 0, rotate: s.reduce ? 0 : -40 }} animate={{ scale: 1, rotate: 0 }} transition={t}><Flower2 className="size-9 text-white" /></motion.span>
                ) : (
                  <User className="size-9 text-ink-soft/50" />
                )}
              </motion.div>
              <div className="min-w-0">
                <motion.p key={`n-${st >= 1}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={t} className={cn("font-display font-bold leading-tight", st >= 1 ? "text-navy-900" : "text-ink-soft")}>
                  {st >= 1 ? "Island Bloom Florist" : "kim_flowers_2019"}
                </motion.p>
                <p className="text-xs text-ink-soft">{st >= 1 ? "Florist" : "Personal account"}</p>
              </div>
            </div>
            <div className="mt-4 min-h-[72px] text-sm">
              {st >= 2 ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={t}>
                  <p className="text-navy-900">Fresh arrangements for birthdays, weddings and every day.</p>
                  <p className="mt-1 font-semibold" style={{ color: brand.leaf }}>islandbloom.example</p>
                </motion.div>
              ) : (
                <p className="text-ink-soft/60">…</p>
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[MessageCircle, Phone, Globe].map((I, i) => (
                <motion.span key={i} initial={false} animate={{ opacity: st >= 2 ? 1 : 0.25, backgroundColor: st >= 3 ? brand.coral : st >= 2 ? "#021d52" : "#e3e7ed" }} transition={{ ...t, delay: s.reduce ? 0 : i * 0.08 }} className="flex h-9 items-center justify-center rounded-lg text-white">
                  <I className="size-4" />
                </motion.span>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              {["Bouquets", "Weddings", "Orders"].map((h, i) => (
                <div key={h} className="text-center">
                  <motion.div initial={false} animate={{ borderColor: st >= 3 ? brand.coral : "#e3e7ed", backgroundColor: st >= 3 ? brand.cream : "#f3f5f7" }} transition={{ ...t, delay: s.reduce ? 0 : i * 0.1 }} className="grid size-14 place-items-center rounded-full border-2">
                    {st >= 3 && <Flower2 className="size-5" style={{ color: i === 1 ? brand.leaf : brand.coral }} />}
                  </motion.div>
                  <p className="mt-1 text-[10px] text-ink-soft">{st >= 3 ? h : "—"}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1">
              {beforeTiles.map((c, i) => (
                <motion.div key={i} className="grid aspect-square place-items-center rounded-sm" initial={false} animate={{ backgroundColor: st >= 3 ? afterTiles[i] : c }} transition={{ ...t, delay: s.reduce ? 0 : i * 0.05 }}>
                  {st >= 3 && i % 2 === 0 && <Flower2 className="size-6 text-white/90" />}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <SceneControls s={s} steps={steps} label="Profile makeover" />
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-warning/10 p-4 ring-1 ring-warning/30"><p className="font-bold text-[#8a4b0f]">Before</p><p className="mt-1 text-ink-soft">Hard to find, hard to trust, no way to order.</p></div>
          <div className="rounded-2xl bg-success/10 p-4 ring-1 ring-success/30"><p className="font-bold text-success">After</p><p className="mt-1 text-ink-soft">Recognisable, clear about what it offers, one tap to get in touch.</p></div>
        </div>
      </div>
    </div>
  );
}
