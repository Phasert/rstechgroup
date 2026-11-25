"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { nav, site } from "@/lib/site";
import { services } from "@/lib/services";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/75">
      <div className="grid-pattern-dark absolute inset-0 opacity-60" aria-hidden />
      <div className="container-rs relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/brand/rs-logo-on-dark.png" alt={site.name} width={1140} height={730} className="h-16 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Reliable technology solutions for homes and businesses across {site.location}.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Services</h2>
          <ul className="mt-3 space-y-0 text-sm lg:mt-5 lg:space-y-3">
            {services.map((s) => (
              <li key={s.slug}><Link className="inline-flex min-h-11 items-center hover:text-white lg:min-h-0" href={`/services/${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Company</h2>
          <ul className="mt-3 space-y-0 text-sm lg:mt-5 lg:space-y-3">
            {nav.filter((n) => n.href !== "/services").map((n) => (
              <li key={n.href}><Link className="inline-flex min-h-11 items-center hover:text-white lg:min-h-0" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="inline-flex min-h-11 items-center hover:text-white lg:min-h-0" href="/quote">Request a Quote</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Contact</h2>
          <ul className="mt-3 space-y-0 text-sm lg:mt-5 lg:space-y-4">
            <li><a className="flex min-h-11 items-center gap-3 hover:text-white lg:min-h-0" href={`tel:${site.phoneE164}`}><Phone className="size-4 text-blue-300" aria-hidden />{site.phoneDisplay}</a></li>
            <li><a className="flex min-h-11 items-center gap-3 hover:text-white lg:min-h-0" href={site.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle className="size-4 text-blue-300" aria-hidden />WhatsApp</a></li>
            <li><a className="flex min-h-11 items-center gap-3 break-all hover:text-white lg:min-h-0" href={`mailto:${site.email}`}><Mail className="size-4 shrink-0 text-blue-300" aria-hidden />{site.email}</a></li>
            <li className="flex min-h-11 items-center gap-3 lg:min-h-0"><MapPin className="size-4 text-blue-300" aria-hidden />{site.location}</li>
            <li><a className="flex min-h-11 items-center gap-3 hover:text-white lg:min-h-0" href={site.social.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="size-4 text-blue-300" aria-hidden />@rstechgrouptt</a></li>
          </ul>
        </div>
      </div>
      <div className="container-rs relative flex flex-col gap-3 border-t border-white/10 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. {site.tagline}</p>
        <div className="flex gap-5">
          <Link className="inline-flex min-h-11 items-center hover:text-white" href="/privacy">Privacy Policy</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-white" href="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
