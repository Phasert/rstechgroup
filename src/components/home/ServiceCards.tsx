"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services, type Service } from "@/lib/services";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

function Card({ s, i }: { s: Service; i: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(-200), my = useMotionValue(-200);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, rgb(22 113 217 / 0.12), transparent 70%)`;

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left); my.set(e.clientY - r.top);
    if (reduce) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  };
  const reset = () => { rx.set(0); ry.set(0); mx.set(-200); my.set(-200); };

  return (
    <RevealItem className="[perspective:1000px]">
      <motion.div style={{ rotateX: rx, rotateY: ry }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
        <Link
          ref={ref}
          href={`/services/${s.slug}`}
          onMouseMove={onMove}
          onMouseLeave={reset}
          className="card group relative flex h-full flex-col overflow-hidden p-7 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
        >
          <motion.span className="pointer-events-none absolute inset-0" style={{ background: glow }} aria-hidden />
          <div className="flex items-start justify-between">
            <span className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-500 transition-colors duration-300 group-hover:bg-blue-500 group-hover:text-white">
              <ServiceIcon name={s.icon} className="size-6" />
            </span>
            <span className="font-display text-sm font-semibold text-line">0{i + 1}</span>
          </div>
          <h3 className="mt-8 text-xl font-bold">{s.title}</h3>
          <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{s.summary}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-blue-600">
            Learn more
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      </motion.div>
    </RevealItem>
  );
}

export function ServiceCards() {
  return (
    <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => <Card key={s.slug} s={s} i={i} />)}
    </Reveal>
  );
}
