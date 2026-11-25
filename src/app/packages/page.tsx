import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { PackagePlannerLazy } from "@/components/scenes/lazy";

export const metadata: Metadata = {
  title: "Website Packages",
  description:
    "Plan your website's size, features, hosting and care with the RS Technology Group project planner, then take the summary straight into a quote request.",
  alternates: { canonical: "/packages" },
};

// Package names, inclusions, prices, hosting and maintenance fees are not yet confirmed by the owner.
// The planner describes scope only; the confirmed baseline below comes from the brief.
const baseline = ["Responsive on phones, tablets and desktops", "Structured around how customers contact you", "Hosting, domain and email set up, subject to scope"];

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Website packages"
        title="Plan your website in a minute."
        lead="Choose the size, features and support you need. Watch your site map take shape, then take the plan straight into a quote."
        crumbs={[{ href: "/packages", label: "Packages" }]}
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          {baseline.map((b) => <li key={b} className="flex items-center gap-2"><Check className="size-4 text-blue-300" aria-hidden />{b}</li>)}
        </ul>
      </PageHero>

      <section className="bg-mist py-14 sm:py-20">
        <div className="container-rs">
          <h2 className="sr-only">Project planner</h2>
          <PackagePlannerLazy />
        </div>
      </section>

      <section className="container-rs py-14 sm:py-20">
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-line md:grid-cols-3">
          {[
            ["Plan", "Use the planner to sketch the scope. It's a starting point, not a commitment."],
            ["Talk it through", "We confirm the right package and what's included for your business."],
            ["Clear quote", "You know what's included and what it costs before you decide."],
          ].map(([t, b], i) => (
            <li key={t} className="bg-white p-7">
              <p className="font-display text-sm font-bold text-blue-500">0{i + 1}</p>
              <p className="mt-2 font-display text-lg font-bold text-navy-900">{t}</p>
              <p className="mt-1 text-ink-soft">{b}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
