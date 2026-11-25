import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Home teasers for the three flagship experiences. Deliberately still frames
 * (with a small hover lift) so the full scenes stay a reason to visit each page.
 */

const items = [
  {
    href: "/services/networking",
    eyebrow: "Networking",
    title: "Watch a technician trace and fix a dropped connection.",
    art: <RackArt />,
  },
  {
    href: "/services/website-development",
    eyebrow: "Website studio",
    title: "See a brief become a working, responsive site.",
    art: <StudioArt />,
  },
  {
    href: "/packages",
    eyebrow: "Project planner",
    title: "Plan your website's pages and features in a minute.",
    art: <PlannerArt />,
  },
];

export function ExperiencePreviews() {
  return (
    <ul className="mt-12 grid gap-5 md:grid-cols-3">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} className="group block h-full overflow-hidden rounded-[var(--radius-card)] bg-navy-950 ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1">
            <div className="grid-pattern-dark relative aspect-[4/3] overflow-hidden" aria-hidden>
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">{it.art}</div>
            </div>
            <div className="p-6">
              <p className="eyebrow text-blue-300">{it.eyebrow}</p>
              <p className="mt-3 font-display text-lg font-bold leading-snug text-white">{it.title}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-blue-300">
                Open the experience <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function RackArt() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <rect x="170" y="20" width="110" height="200" rx="6" fill="#0b1a3e" stroke="#2c4f8a" strokeWidth="2" />
      <rect x="180" y="40" width="90" height="22" rx="3" fill="#132f63" />
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={188 + i * 11} cy="51" r="2.6" fill={i === 5 ? "#f5b544" : "#3ddc84"} />)}
      <rect x="180" y="72" width="90" height="20" rx="3" fill="#102552" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={184 + i * 11} y="78" width="7" height="7" rx="1" fill="#061231" stroke={i === 5 ? "#f5b544" : "#24406f"} />)}
      <path d="M243 86 C240 130, 150 150, 120 210" fill="none" stroke="#1671d9" strokeWidth="5" strokeLinecap="round" />
      <circle cx="243" cy="86" r="16" fill="none" stroke="#f5b544" strokeWidth="2" opacity="0.7" />
      <rect x="40" y="110" width="80" height="56" rx="6" fill="#0e2350" stroke="#2c4f8a" strokeWidth="2" />
      <circle cx="80" cy="136" r="10" fill="none" stroke="#f5b544" strokeWidth="2.5" />
      <path d="M80 131 v6 M80 140 v.5" stroke="#f5b544" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function StudioArt() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <rect x="26" y="40" width="120" height="150" rx="4" fill="#fffdf6" transform="rotate(-5 86 115)" />
      <g transform="rotate(-5 86 115)" stroke="#4a4f5a" strokeWidth="1.5" fill="none">
        <path d="M40 60 H130 M40 76 H110" />
        <rect x="40" y="92" width="90" height="34" />
        <rect x="40" y="134" width="26" height="22" /><rect x="72" y="134" width="26" height="22" /><rect x="104" y="134" width="26" height="22" />
      </g>
      <rect x="150" y="52" width="150" height="130" rx="8" fill="white" />
      <rect x="150" y="52" width="150" height="12" rx="4" fill="#f3f5f7" />
      <rect x="160" y="72" width="130" height="44" rx="5" fill="#c0743f" />
      <rect x="168" y="82" width="70" height="6" rx="3" fill="white" />
      <rect x="168" y="94" width="48" height="5" rx="2.5" fill="white" opacity="0.7" />
      {[0, 1, 2].map((i) => <rect key={i} x={160 + i * 44} y="124" width="38" height="44" rx="4" fill="#fff8ef" stroke="#f1dcc4" />)}
      <path d="M140 116 L156 116" stroke="#5d9bec" strokeWidth="2.5" strokeDasharray="3 4" />
    </svg>
  );
}

function PlannerArt() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <rect x="120" y="34" width="80" height="42" rx="8" fill="white" />
      <rect x="130" y="44" width="34" height="7" rx="3.5" fill="#021d52" />
      {[0, 1, 2].map((i) => <rect key={i} x={130 + i * 18} y="58" width="14" height="10" rx="3" fill="#1671d9" />)}
      <path d="M160 76 V96 M70 96 H250 M70 96 V112 M130 96 V112 M190 96 V112 M250 96 V112" stroke="white" strokeOpacity="0.35" strokeWidth="2" fill="none" />
      {[40, 100, 160, 220].map((x) => <rect key={x} x={x} y="112" width="60" height="26" rx="6" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" />)}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={40 + i * 62} y="170" width="54" height="40" rx="8" fill={i < 2 ? "#1671d9" : "white"} fillOpacity={i < 2 ? 0.35 : 0.08} stroke={i < 2 ? "#5d9bec" : "white"} strokeOpacity="0.4" />)}
    </svg>
  );
}
