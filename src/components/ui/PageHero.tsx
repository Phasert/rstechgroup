import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/** Navy page header shared by interior pages, echoing the homepage hero without the canvas scene. */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="grid-pattern-dark absolute inset-0 -z-10" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_20%,rgb(22_113_217/0.35),transparent_55%)]" aria-hidden />
      <div className="slash-accent absolute -right-24 -top-10 -z-10 hidden h-[140%] w-72 rotate-12 bg-white/[0.04] md:block" aria-hidden />
      <div className="container-rs py-14 sm:py-20">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  <ChevronRight className="size-3.5" aria-hidden />
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-white/90">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="hover:text-white">{c.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow text-blue-300">{eyebrow}</p>
        <h1 className="display-2 mt-4 max-w-3xl text-white">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">{lead}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
