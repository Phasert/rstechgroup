import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ServiceExplorer } from "@/components/scenes/ServiceExplorer";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "IT support, networking and Wi-Fi, website design, social media setup, Google Business Profile setup and technology health checks for homes and businesses in Trinidad and Tobago.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Start with the problem. We'll point you to the fix."
        lead="Choose what's going on and see which service fits, or jump straight to the full list below."
        crumbs={[{ href: "/services", label: "Services" }]}
      />

      <section className="bg-mist py-14 sm:py-20">
        <div className="container-rs">
          <h2 className="sr-only">Find a service by problem</h2>
          <ServiceExplorer />
        </div>
      </section>

      <section className="container-rs py-16 sm:py-24" aria-labelledby="all-services">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 id="all-services" className="display-2">All six services</h2>
          <p className="max-w-sm text-ink-soft">Each page includes a hands-on example of the work.</p>
        </div>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group grid items-center gap-4 py-6 sm:grid-cols-[3rem_3.5rem_1fr_1.4fr_auto] sm:gap-6">
                <span className="hidden font-display text-sm font-bold text-ink-soft sm:block">0{i + 1}</span>
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <ServiceIcon name={s.icon} className="size-5" />
                </span>
                <span className="font-display text-xl font-bold text-navy-900 group-hover:text-blue-600">{s.title}</span>
                <span className="text-ink-soft">{s.summary}</span>
                <ArrowUpRight className="hidden size-5 text-blue-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
