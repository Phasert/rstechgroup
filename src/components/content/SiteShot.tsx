"use client";

import { useState } from "react";
import { hostOf } from "@/lib/showcase";

/** Live screenshot of a site, rendered by WordPress mShots in the visitor's browser. */
export const shotUrl = (url: string, w = 1280, h = 2400) => `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${h}`;

/**
 * Browser-window mockup holding a tall screenshot. When the parent `.group` is
 * hovered, the screenshot slowly scrolls through the page.
 */
export function SiteShot({ url, title, className = "aspect-[16/10]", dark }: { url: string; title: string; className?: string; dark?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(4,16,48,0.55)] ring-1 ${dark ? "bg-navy-900 ring-white/15" : "bg-white ring-line"} transition-transform duration-500 group-hover:-translate-y-1`}>
      <div className={`flex items-center gap-2 px-4 py-2.5 ${dark ? "bg-white/10" : "bg-mist"}`}>
        <span className="size-2.5 rounded-full bg-[#ff5f57]" /><span className="size-2.5 rounded-full bg-[#febc2e]" /><span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className={`ml-3 truncate rounded-md px-3 py-0.5 text-xs ${dark ? "bg-white/10 text-white/70" : "bg-white text-ink-soft"}`}>{hostOf(url)}</span>
      </div>
      <div className={`relative ${className} overflow-hidden bg-gradient-to-br from-navy-900 to-blue-600`}>
        {failed ? (
          <p className="absolute inset-0 grid place-items-center p-4 text-center font-display text-xl font-extrabold text-white">{title}</p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- external screenshot service, not optimisable
          <img
            src={shotUrl(url)}
            alt={`Screenshot of the ${title} website`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover object-top text-transparent transition-[object-position] duration-[6000ms] ease-in-out group-hover:object-bottom"
          />
        )}
      </div>
    </div>
  );
}
