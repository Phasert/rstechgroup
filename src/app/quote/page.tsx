import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { isServiceValue } from "@/lib/quote-schema";
import { getService } from "@/lib/services";
import { paramsToPlan, planDescription, planSummary } from "@/lib/planner";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Tell RS Technology Group about your IT support, networking or website project and we'll get back to you with practical next steps.",
  alternates: { canonical: "/quote" },
};

const steps = ["We read your request", "We may ask a few questions", "We reply your preferred way"];

export default async function QuotePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const requested = Array.isArray(sp.service) ? sp.service[0] : sp.service;
  const plan = paramsToPlan(sp);
  const defaultService = plan ? "website-development" : isServiceValue(requested) ? requested : "";
  const selected = getService(defaultService);

  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title={plan ? "Your website plan is ready to send." : selected ? `Request a quote: ${selected.title}` : "Tell us about your project."}
        lead={plan ? "We've added your planner choices to the form. Add a few words about your business and send it over." : "A few details is all it takes. We'll come back with practical next steps. No obligation."}
        crumbs={[{ href: "/quote", label: "Request a Quote" }]}
      />
      <section className="bg-mist py-12 sm:py-16">
        <div className="container-rs grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          <QuoteForm
            defaultService={defaultService}
            defaultDescription={plan ? planDescription(plan) : ""}
            submissionsEnabled={isFirebaseAdminConfigured}
            showProgress
          />
          <aside className="space-y-5 lg:sticky lg:top-24">
            {plan && (
              <div className="rounded-[var(--radius-card)] bg-navy-950 p-6 text-white">
                <p className="flex items-center gap-2 font-display font-bold"><ClipboardList className="size-5 text-blue-300" aria-hidden /> From the planner</p>
                <ul className="mt-3 space-y-1.5 text-sm text-white/80">{planSummary(plan).map((l) => <li key={l}>{l}</li>)}</ul>
                <Link href="/packages" className="mt-4 inline-block text-sm font-semibold text-blue-300 underline underline-offset-4">Change the plan</Link>
              </div>
            )}
            <div className="card p-6">
              <p className="font-display font-bold text-navy-900">After you send it</p>
              <ol className="mt-4 space-y-3">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-ink-soft">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-50 font-display text-xs font-bold text-blue-600">{i + 1}</span>{s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-6">
              <p className="font-display font-bold text-navy-900">Rather talk now?</p>
              <div className="mt-4 grid gap-2">
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold text-navy-900 ring-1 ring-line hover:text-blue-600"><MessageCircle className="size-4 text-blue-500" aria-hidden /> WhatsApp</a>
                <a href={`tel:${site.phoneE164}`} className="flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold text-navy-900 ring-1 ring-line hover:text-blue-600"><Phone className="size-4 text-blue-500" aria-hidden /> {site.phoneDisplay}</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
