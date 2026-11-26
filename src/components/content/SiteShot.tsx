import Image from "next/image";
import { hostOf, shotsFor } from "@/lib/showcase";
import { cn } from "@/lib/utils";

/**
 * Browser-window mockup holding a full-page screenshot captured from the live site
 * (public/portfolio/<slug>/). When the parent `.group` is hovered, the screenshot slowly
 * scrolls through the page. `phone` adds a small phone mockup with the mobile capture,
 * overlapping the bottom-right corner (used on the featured preview).
 */
export function SiteShot({
  slug,
  url,
  title,
  alt,
  className = "aspect-[16/10]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  dark,
  phone,
  priority,
}: {
  slug: string;
  url: string;
  title: string;
  alt?: string;
  className?: string;
  sizes?: string;
  dark?: boolean;
  phone?: boolean;
  priority?: boolean;
}) {
  const shots = shotsFor(slug);
  return (
    <div className={cn("relative min-w-0", phone && "sm:mb-8 sm:mr-6")}>
      <div className={cn("overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(4,16,48,0.55)] ring-1 transition-transform duration-500 group-hover:-translate-y-1", dark ? "bg-navy-900 ring-white/15" : "bg-white ring-line")}>
        <div className={cn("flex items-center gap-2 px-4 py-2.5", dark ? "bg-white/10" : "bg-mist")} aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" /><span className="size-2.5 rounded-full bg-[#febc2e]" /><span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className={cn("ml-3 min-w-0 truncate rounded-md px-3 py-0.5 text-xs", dark ? "bg-white/10 text-white/70" : "bg-white text-ink-soft")}>{hostOf(url)}</span>
        </div>
        <div className={cn("relative overflow-hidden bg-navy-900", className)}>
          <Image
            src={shots.full}
            alt={alt ?? `Screenshot of the ${title} website`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top transition-[object-position] duration-[7000ms] ease-in-out group-hover:object-bottom motion-reduce:transition-none"
          />
        </div>
      </div>

      {phone && (
        <div
          className="absolute -bottom-8 -right-6 hidden w-[22%] min-w-28 max-w-40 rounded-[1.4rem] bg-navy-950 p-1.5 shadow-[0_24px_48px_-12px_rgba(4,16,48,0.7)] ring-1 ring-white/20 transition-transform duration-500 group-hover:-translate-y-2 sm:block"
          aria-hidden
        >
          <div className="relative aspect-[9/19] overflow-hidden rounded-[1.05rem] bg-navy-900">
            <Image
              src={shots.mobile}
              alt=""
              fill
              sizes="160px"
              className="object-cover object-top transition-[object-position] duration-[9000ms] ease-in-out group-hover:object-bottom motion-reduce:transition-none"
            />
            <span className="absolute left-1/2 top-1.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-navy-950" />
          </div>
        </div>
      )}
    </div>
  );
}
