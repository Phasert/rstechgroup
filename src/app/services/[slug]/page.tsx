import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Checklist, CtaBand, ExamplesRows, ExamplesTimeline, FaqList, OtherServices, ProblemFixRows } from "@/components/services/Blocks";
import {
  HealthWalkthroughLazy,
  ProfileDiscoveryLazy,
  SocialMakeoverLazy,
  TechnicianSceneLazy,
  WebStudioLazy,
  WifiCoverageLazy,
  WorkbenchLazy,
} from "@/components/scenes/lazy";
import { getService, services, type Service, type ServiceSlug } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return {
    title: s.title,
    description: `${s.summary} RS Technology Group, serving homes and businesses across Trinidad and Tobago.`,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

/** Each service has its own story, so each page composes its own sections in its own order. */
const pages: Record<ServiceSlug, (s: Service) => ReactNode> = {
  networking: (s) => (
    <>
      <section className="bg-navy-950 py-16 sm:py-24">
        <div className="container-rs">
          <SectionHeading dark eyebrow="On site with RS" title="Watch a dropped connection get fixed." lead="One faulty patch cable can take a desk offline. Follow the repair from fault to fix, step by step." />
          <div className="mt-10"><TechnicianSceneLazy /></div>
        </div>
      </section>
      <section className="container-rs py-16 sm:py-24">
        <SectionHeading eyebrow="A separate problem" title="When the Wi-Fi just doesn't reach." lead="Compare a single-router home with one where coverage was planned for the space." />
        <div className="mt-10"><WifiCoverageLazy /></div>
      </section>
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-rs grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Typical jobs</p>
            <h2 className="display-2 mt-4">From one dead zone to a whole building.</h2>
            <p className="lead mt-5">{s.description}</p>
          </div>
          <ExamplesTimeline s={s} />
        </div>
      </section>
      <section className="container-rs grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="display-2">Networking questions</h2>
        <FaqList faqs={s.faqs} />
      </section>
      <section className="container-rs pb-16 sm:pb-24">
        <CtaBand s={s} variant="dark" title="Tell us where the signal drops." body="Describe the space and the problem. Your request arrives with Networking & Infrastructure already selected." />
      </section>
    </>
  ),

  "it-support": (s) => (
    <>
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-rs">
          <SectionHeading eyebrow="The workbench" title="Pick a problem. See it fixed." lead="Three everyday jobs, from the first check to the finished result." />
          <div className="mt-10"><WorkbenchLazy /></div>
        </div>
      </section>
      <section className="container-rs py-16 sm:py-24">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:px-5">
          <p className="eyebrow">What you&apos;re dealing with</p><span /><p className="eyebrow">What we do about it</p>
        </div>
        <div className="mt-4"><ProblemFixRows s={s} /></div>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{s.description}</p>
      </section>
      <section className="bg-navy-950 py-16 sm:py-24">
        <div className="container-rs grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading dark eyebrow="Before you call" title="Common questions." />
          <FaqList faqs={s.faqs} dark />
        </div>
      </section>
      <section className="container-rs py-16 sm:py-24">
        <CtaBand s={s} variant="split" title="Something not working?" body="Tell us what it's doing (or not doing). A short description is enough to get started." />
      </section>
    </>
  ),

  "website-development": (s) => (
    <>
      <section className="relative overflow-hidden bg-navy-900 py-16 sm:py-24">
        <div className="container-rs">
          <SectionHeading dark eyebrow="The studio" title="From a rough brief to a working site." lead="Follow a sample project through each stage, then use the finished demo yourself." />
          <div className="mt-10"><WebStudioLazy /></div>
        </div>
      </section>
      <section className="container-rs grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">Every site we build</p>
          <h2 className="display-2 mt-4">Built around how your customers get in touch.</h2>
          <p className="lead mt-5">{s.description}</p>
          <div className="mt-8"><Checklist items={s.solutions} /></div>
        </div>
        <Link href="/packages" className="card group block bg-gradient-to-br from-blue-50 to-white p-8 transition-shadow hover:shadow-[var(--shadow-lift)]">
          <p className="eyebrow">Planning a site?</p>
          <p className="mt-4 font-display text-2xl font-bold text-navy-900 group-hover:text-blue-600">Map out your pages and features with the project planner.</p>
          <p className="mt-3 text-ink-soft">Choose what you need and take the summary straight into a quote request.</p>
          <span className="mt-6 inline-flex items-center gap-2 font-display font-semibold text-blue-600">Open the planner <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
        </Link>
      </section>
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-rs">
          <SectionHeading eyebrow="Where we help" title="Typical website projects." />
          <div className="mt-10"><ExamplesRows s={s} /></div>
        </div>
      </section>
      <section className="container-rs grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="display-2">Website questions</h2>
        <FaqList faqs={s.faqs} />
      </section>
      <section className="container-rs pb-16 sm:pb-24">
        <CtaBand s={s} variant="light" title="Let's plan your website." body="Tell us about your business and what the site needs to do." />
      </section>
    </>
  ),

  "social-media-setup": (s) => (
    <>
      <section className="container-rs py-16 sm:py-24">
        <SectionHeading eyebrow="Profile makeover" title="Same business. A profile customers trust." lead="Step through a sample profile as it comes together, piece by piece." />
        <div className="mt-12"><SocialMakeoverLazy /></div>
      </section>
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-rs grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">What gets set up</p>
            <h2 className="display-2 mt-4">A clean, consistent starting point.</h2>
            <p className="lead mt-5">{s.description}</p>
          </div>
          <div className="space-y-6">
            <Checklist items={s.solutions} />
            <ExamplesTimeline s={s} />
          </div>
        </div>
      </section>
      <section className="container-rs grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="display-2">Good to know</h2>
        <FaqList faqs={s.faqs} />
      </section>
      <section className="container-rs pb-16 sm:pb-24">
        <CtaBand s={s} variant="split" title="Ready for a profile that matches your business?" body="Tell us which platforms you use, or want to start on." />
      </section>
    </>
  ),

  "google-business-profile": (s) => (
    <>
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-rs">
          <SectionHeading eyebrow="From search to visit" title="Make it easy to find you, and easy to choose you." lead="An illustrated journey from a nearby search to a complete profile." />
          <div className="mt-10"><ProfileDiscoveryLazy /></div>
        </div>
      </section>
      <section className="container-rs grid gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="eyebrow">What we do</p>
          <h2 className="display-2 mt-4">Accurate details, everywhere they show.</h2>
          <p className="lead mt-5">{s.description}</p>
          <div className="mt-8"><Checklist items={s.solutions} /></div>
        </div>
        <div className="self-start rounded-[var(--radius-card)] bg-navy-950 p-8 text-white">
          <ShieldCheck className="size-8 text-blue-300" aria-hidden />
          <h3 className="mt-5 text-2xl font-bold text-white">An honest note on rankings</h3>
          <p className="mt-3 leading-relaxed text-white/75">Google decides where profiles appear, and nobody can honestly guarantee a position. What we can do is make sure your profile is complete and correct, which gives customers what they need when they do find you.</p>
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-sm font-semibold text-blue-300">Typical jobs</p>
            <ul className="mt-3 space-y-2 text-white/80">{s.examples.map((e) => <li key={e.title}>{e.title}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="container-rs grid gap-10 pb-16 sm:pb-24 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="display-2">Questions</h2>
        <FaqList faqs={s.faqs} />
      </section>
      <section className="container-rs pb-16 sm:pb-24">
        <CtaBand s={s} variant="light" title="Get your business on the map." body="Tell us your business name and area, and whether a profile already exists." />
      </section>
    </>
  ),

  "technology-health-checks": (s) => (
    <>
      <section className="container-rs py-16 sm:py-24">
        <SectionHeading eyebrow="Inside an assessment" title="What a health check looks at, and what you get." lead="Walk through an example small-office check, from the first device to the prioritised report." />
        <div className="mt-10"><HealthWalkthroughLazy /></div>
      </section>
      <section className="bg-navy-950 py-16 sm:py-24">
        <div className="container-rs grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading dark eyebrow="Good times to book one" title="When a health check makes sense." />
            <p className="mt-5 text-lg leading-relaxed text-white/70">{s.description}</p>
          </div>
          <ExamplesRows s={s} dark />
        </div>
      </section>
      <section className="container-rs grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="display-2">What you receive</h2>
          <div className="mt-8"><Checklist items={s.benefits} /></div>
        </div>
        <FaqList faqs={s.faqs} />
      </section>
      <section className="container-rs pb-16 sm:pb-24">
        <CtaBand s={s} variant="dark" title="Get a clear picture of your setup." body="Tell us roughly what you have and what's worrying you." />
      </section>
    </>
  ),
};

const heroLeads: Record<ServiceSlug, string> = {
  networking: "Wi-Fi that reaches, cabling that's traceable, and equipment that's configured properly, for homes, offices and multi-building sites.",
  "it-support": "Help with the computers, printers and devices you rely on every day, explained in plain language.",
  "website-development": "Modern, responsive websites that help your business look credible and make it easy for customers to reach you.",
  "social-media-setup": "Business profiles that look consistent, say what you do, and make it easy to get in touch.",
  "google-business-profile": "A complete, accurate presence on Google Search and Maps, so customers get the right details first time.",
  "technology-health-checks": "A structured look at your devices, connectivity and setup, with clear priorities on what to fix first.",
};

export default async function ServiceDetailPage({ params }: Params) {
  const s = getService((await params).slug);
  if (!s) notFound();

  return (
    <>
      <PageHero
        eyebrow={s.short}
        title={s.title}
        lead={heroLeads[s.slug]}
        crumbs={[{ href: "/services", label: "Services" }, { href: `/services/${s.slug}`, label: s.title }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`/quote?service=${s.slug}`} magnetic>Request a quote <ArrowRight className="size-4" aria-hidden /></Button>
          <Button href={site.whatsappUrl} variant="light" external><MessageCircle className="size-4" aria-hidden /> WhatsApp us</Button>
        </div>
      </PageHero>
      {pages[s.slug](s)}
      <OtherServices current={s.slug} />
    </>
  );
}
