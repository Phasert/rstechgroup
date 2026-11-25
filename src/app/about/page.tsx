import type { Metadata } from "next";
import { ArrowRight, Building2, Home, MapPin, MessageSquareText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ProcessStory } from "@/components/about/ProcessStory";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "RS Technology Group is a Trinidad and Tobago technology solutions company, established in 2026. Here's how we work: assess, recommend, implement, verify.",
  alternates: { canonical: "/about" },
};

// Only confirmed facts appear here. Mission, vision and values are marked "proposed"
// in the brief and stay off the site until the owner approves them.

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About RS Technology Group"
        title="A local technology team that explains as it works."
        lead={`Established in ${site.established}, based in ${site.location}, working with households and businesses.`}
        crumbs={[{ href: "/about", label: "About" }]}
      />

      {/* Who we are: editorial split, distinct from the homepage intro */}
      <section className="container-rs py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <p className="font-display text-3xl font-bold leading-snug text-navy-900 sm:text-4xl">
            Grounded in IT. Hands-on in support, networking, wireless and infrastructure.
          </p>
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              RS Technology Group helps people and businesses get more from the technology they depend on. The work
              ranges from a single slow laptop to an office network, and from a first website to getting found on
              Google.
            </p>
            <p>
              Whatever the job, the approach is the same: understand the setup, recommend what&apos;s practical, do the
              work carefully, and check it with you before calling it done.
            </p>
          </div>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-line sm:grid-cols-3">
          {[
            { icon: MapPin, label: "Based in", value: site.location },
            { icon: Home, label: "For", value: "Homes and families" },
            { icon: Building2, label: "And for", value: "Businesses" },
          ].map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-4 bg-white p-6">
              <Icon className="size-6 shrink-0 text-blue-500" aria-hidden />
              <span>
                <span className="block text-sm text-ink-soft">{label}</span>
                <span className="block font-display text-lg font-semibold text-navy-900">{value}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* How we work */}
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-rs">
          <p className="eyebrow">How we work</p>
          <h2 className="display-2 mt-4 max-w-2xl">Four steps on every job, big or small.</h2>
          <div className="mt-12"><ProcessStory /></div>
        </div>
      </section>

      {/* Closing: conversation, not a repeated CTA band */}
      <section className="container-rs py-16 sm:py-24">
        <div className="flex flex-col items-start gap-6 border-l-4 border-blue-500 pl-6 sm:pl-10">
          <MessageSquareText className="size-8 text-blue-500" aria-hidden />
          <p className="max-w-2xl font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            The first step is always a conversation. Tell us what&apos;s going on and we&apos;ll take it from there.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Get in touch <ArrowRight className="size-4" aria-hidden /></Button>
            <Button href="/services" variant="secondary">Browse services</Button>
          </div>
        </div>
      </section>
    </>
  );
}
