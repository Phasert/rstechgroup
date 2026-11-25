"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

export function Header() {
  const pathname = usePathname();
  // The menu is open only for the route it was opened on, so navigating closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-white",
      )}
    >
      <div className="container-rs flex h-18 items-center justify-between gap-6 py-3">
        {/* The stacked logo's small wordmark is unreadable at header height, so the RS mark is paired
            with a live-text wordmark in the logo's spaced style. */}
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${site.name} home`}>
          <Image src="/brand/rs-mark.png" alt="" width={905} height={410} priority className="h-8 w-auto sm:h-9" />
          <span className="flex flex-col border-l border-line pl-3 leading-none" aria-hidden>
            <span className="font-display text-[13px] font-extrabold tracking-[0.22em] text-navy-700 sm:text-[15px]">TECHNOLOGY</span>
            <span className="mt-1 font-display text-[10px] font-bold tracking-[0.5em] text-ink-soft sm:text-[11px]">GROUP</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={close}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-[15px] font-medium transition-colors",
                    isActive(item.href) ? "text-navy-900" : "text-ink-soft hover:text-navy-900",
                  )}
                >
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-blue-50"
                      transition={{ duration: 0.4, ease }}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phoneE164}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-navy-900 hover:text-blue-600 xl:inline-flex"
          >
            <Phone className="size-4" aria-hidden /> {site.phoneDisplay}
          </a>
          <Link
            href="/quote"
            className="hidden min-h-11 items-center rounded-full bg-blue-500 px-5 font-display text-sm font-semibold text-white transition-colors hover:bg-blue-600 sm:inline-flex"
          >
            Request a Quote
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-navy-900 ring-1 ring-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenPath((p) => (p === pathname ? null : pathname))}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-white lg:hidden"
          >
            <nav aria-label="Mobile" className="container-rs flex flex-col gap-1 py-6">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.35, ease }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={close}
                    className={cn(
                      "flex min-h-14 items-center rounded-2xl px-4 font-display text-2xl font-semibold",
                      isActive(item.href) ? "bg-blue-50 text-blue-600" : "text-navy-900",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 grid gap-3">
                <Link href="/quote" onClick={close} className="flex min-h-14 items-center justify-center rounded-full bg-blue-500 font-display font-semibold text-white">
                  Request a Quote
                </Link>
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-full font-display font-semibold text-navy-900 ring-1 ring-line">
                  WhatsApp {site.phoneDisplay}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
