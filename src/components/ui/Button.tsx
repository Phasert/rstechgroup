"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-[0_10px_30px_-10px_rgb(22_113_217/0.7)]",
  secondary: "bg-white text-navy-900 ring-1 ring-line hover:ring-blue-300 hover:text-blue-600",
  ghost: "text-navy-900 hover:text-blue-600",
  light: "bg-white/[0.12] text-white ring-1 ring-white/45 hover:bg-white/20 hover:ring-white/70 backdrop-blur",
};

interface Props {
  href: string;
  children: ReactNode;
  variant?: Variant;
  magnetic?: boolean;
  className?: string;
  external?: boolean;
}

/** Link-styled button with an optional subtle magnetic pull on pointer devices. */
export function Button({ href, children, variant = "primary", magnetic = false, className, external }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (!magnetic || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const reset = () => { x.set(0); y.set(0); };

  const cls = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-[15px] font-semibold transition-colors duration-200",
    styles[variant],
    className,
  );

  return (
    <motion.span ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset} className="inline-flex">
      {external ? (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>
      ) : (
        <Link href={href} className={cls}>{children}</Link>
      )}
    </motion.span>
  );
}
