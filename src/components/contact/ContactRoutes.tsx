"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Small visual of the four ways to reach RS, each route lighting up on hover/focus. */

const routes = [
  { icon: MessageCircle, label: "WhatsApp", note: "Quick questions and photos of the problem", href: site.whatsappUrl, external: true },
  { icon: Phone, label: "Call", note: site.phoneDisplay, href: `tel:${site.phoneE164}` },
  { icon: Mail, label: "Email", note: site.email, href: `mailto:${site.email}` },
  { icon: FileText, label: "Enquiry form", note: "Send the details in one go", href: "#enquiry" },
];

export function ContactRoutes() {
  const [hot, setHot] = useState<number | null>(null);
  const reduce = useReducedMotion();
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_260px]">
      <ul className="grid gap-3 sm:grid-cols-2">
        {routes.map((r, i) => (
          <li key={r.label}>
            <a
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
              className={cn("flex min-h-20 items-center gap-4 rounded-2xl bg-white p-4 ring-1 transition-all", hot === i ? "ring-blue-500 shadow-[var(--shadow-lift)]" : "ring-line")}
            >
              <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl transition-colors", hot === i ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500")}>
                <r.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-display font-bold text-navy-900">{r.label}</span>
                <span className="block break-words text-sm text-ink-soft">{r.note}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <svg viewBox="0 0 260 220" className="mx-auto hidden h-auto w-full max-w-[260px] lg:block" aria-hidden>
        {[30, 85, 140, 195].map((y, i) => (
          <g key={y}>
            <path id={`route-${i}`} d={`M0 ${y} C110 ${y}, 120 110, 200 110`} fill="none" stroke={hot === i ? "#1671d9" : "#dceafb"} strokeWidth={hot === i ? 4 : 2.5} />
            {!reduce && (
              <circle r="4" fill="#1671d9" opacity={hot === null || hot === i ? 1 : 0.2}>
                <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite"><mpath href={`#route-${i}`} /></animateMotion>
              </circle>
            )}
          </g>
        ))}
        <motion.g initial={false} animate={{ scale: hot !== null ? 1.08 : 1 }} style={{ transformOrigin: "222px 110px", transformBox: "view-box" }}>
          <circle cx="222" cy="110" r="34" fill="#021d52" />
          <text x="222" y="117" textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily="var(--font-display)">RS</text>
        </motion.g>
      </svg>
    </div>
  );
}
