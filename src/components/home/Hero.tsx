"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ease } from "@/lib/motion";
import { site } from "@/lib/site";

// Canvas scene is client-only and loaded after the text so it never blocks first paint.
const HeroNetworkCanvas = dynamic(
  () => import("@/components/animations/HeroNetworkCanvas").then((m) => m.HeroNetworkCanvas),
  { ssr: false },
);

export function Hero() {
  const reduce = useReducedMotion();
  const words = ["Technology", "That", "Works."];
  const d = (s: number) => (reduce ? 0 : s);

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="grid-pattern-dark absolute inset-0 -z-20" aria-hidden />
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_45%,rgb(22_113_217/0.35),transparent_60%)]"
        aria-hidden
      />
      <HeroNetworkCanvas className="absolute inset-0 -z-10 h-full w-full" />
      {/* Keeps headline legible over the scene on small screens */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/70 lg:to-transparent" aria-hidden />

      {/* Desktop: shorter than the viewport so the next section starts to show on typical laptop screens. */}
      <div className="container-rs flex min-h-[calc(100svh-72px)] flex-col justify-end pb-16 pt-[46svh] sm:pb-20 lg:min-h-[min(calc(100svh-72px-7rem),720px)] lg:justify-center lg:py-16">
        <div className="max-w-2xl">
          <motion.p
            className="eyebrow text-blue-300"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(0.3), duration: 0.6, ease }}
          >
            {site.tagline}
          </motion.p>

          <h1 className="display-1 mt-5 text-white">
            <span className="block">
              {words.map((w, i) => (
                <motion.span
                  key={w}
                  className="mr-[0.25em] inline-block"
                  initial={{ opacity: 0, y: "0.6em", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: d(0.45 + i * 0.1), duration: 0.8, ease }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="block bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: "0.6em", filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: d(0.8), duration: 0.8, ease }}
            >
              Support You Can Trust.
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(1.0), duration: 0.7, ease }}
          >
            IT support, Wi-Fi and networking, and website development for homes and businesses across Trinidad and
            Tobago.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(1.15), duration: 0.7, ease }}
          >
            <Button href="/quote" magnetic>
              Request a Quote <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href="/services" variant="light" magnetic>
              Explore Our Services
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
