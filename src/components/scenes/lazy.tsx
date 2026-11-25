"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

/**
 * Scenes load after the page's text and CTAs, so headings and buttons are usable
 * immediately. The placeholder reserves space (no layout jump) and states what
 * the scene shows, which also serves as the no-JavaScript fallback.
 */
function Placeholder({ label, dark, h }: { label: string; dark?: boolean; h: string }) {
  return (
    <div className={cn("grid place-items-center rounded-[var(--radius-card)] p-6 text-center text-sm", h, dark ? "bg-navy-950 text-white/60 ring-1 ring-white/10" : "bg-mist text-ink-soft ring-1 ring-line")} role="status">
      {label}
    </div>
  );
}

export const TechnicianSceneLazy = dynamic(() => import("./TechnicianScene").then((m) => m.TechnicianScene), {
  ssr: false,
  loading: () => <Placeholder dark h="aspect-[960/560]" label="Loading the illustrated cable-repair scene…" />,
});
export const WifiCoverageLazy = dynamic(() => import("./WifiCoverage").then((m) => m.WifiCoverage), {
  ssr: false,
  loading: () => <Placeholder h="min-h-[360px]" label="Loading the Wi-Fi coverage comparison…" />,
});
export const WorkbenchLazy = dynamic(() => import("./Workbench").then((m) => m.Workbench), {
  ssr: false,
  loading: () => <Placeholder h="min-h-[520px]" label="Loading the troubleshooting workbench…" />,
});
export const WebStudioLazy = dynamic(() => import("./WebStudio").then((m) => m.WebStudio), {
  ssr: false,
  loading: () => <Placeholder dark h="min-h-[600px]" label="Loading the website studio demo…" />,
});
export const PackagePlannerLazy = dynamic(() => import("./PackagePlanner").then((m) => m.PackagePlanner), {
  ssr: false,
  loading: () => <Placeholder h="min-h-[640px]" label="Loading the project planner…" />,
});
export const SocialMakeoverLazy = dynamic(() => import("./SocialMakeover").then((m) => m.SocialMakeover), {
  ssr: false,
  loading: () => <Placeholder h="min-h-[620px]" label="Loading the profile makeover…" />,
});
export const ProfileDiscoveryLazy = dynamic(() => import("./ProfileDiscovery").then((m) => m.ProfileDiscovery), {
  ssr: false,
  loading: () => <Placeholder h="min-h-[560px]" label="Loading the business profile example…" />,
});
export const HealthWalkthroughLazy = dynamic(() => import("./HealthWalkthrough").then((m) => m.HealthWalkthrough), {
  ssr: false,
  loading: () => <Placeholder h="min-h-[480px]" label="Loading the health check walkthrough…" />,
});
