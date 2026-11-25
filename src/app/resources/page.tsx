import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { getLatestArticles } from "@/lib/data/public";
import { getService } from "@/lib/services";
import type { ResourceArticle } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resources",
  description: "The RS Guide: plain-language advice on IT support, Wi-Fi, networking and getting your business online.",
  alternates: { canonical: "/resources" },
};

// Topic shelves for the library. Article titles are never invented: shelves stay empty until real guides are published.
const shelves = [
  { topic: "Everyday IT", service: "it-support" },
  { topic: "Wi-Fi & networking", service: "networking" },
  { topic: "Websites", service: "website-development" },
  { topic: "Getting found online", service: "google-business-profile" },
] as const;

export default async function ResourcesPage() {
  const articles = await getLatestArticles(48);
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="The RS Guide"
        lead="Plain-language advice on keeping your technology working, from Wi-Fi dead zones to getting your business online."
        crumbs={[{ href: "/resources", label: "Resources" }]}
      />
      {lead ? <Library lead={lead} rest={rest} /> : <EmptyLibrary />}
    </>
  );
}

function Library({ lead, rest }: { lead: ResourceArticle; rest: ResourceArticle[] }) {
  const categories = [...new Set([lead, ...rest].map((a) => a.category))];
  return (
    <section className="container-rs py-16 sm:py-24">
      <ul className="mb-10 flex flex-wrap gap-2" aria-label="Topics">
        {categories.map((c) => <li key={c} className="rounded-full bg-mist px-4 py-2 text-sm font-semibold text-navy-900">{c}</li>)}
      </ul>
      <Link href={`/resources/${lead.slug}`} className="group grid gap-8 border-b border-line pb-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="eyebrow">Latest guide · {lead.category}</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy-900 group-hover:text-blue-600 sm:text-5xl">{lead.title}</h2>
        </div>
        <div className="self-end">
          <p className="text-lg leading-relaxed text-ink-soft">{lead.excerpt}</p>
          <p className="mt-4 text-sm font-semibold text-blue-600">{lead.readingMinutes} min read →</p>
        </div>
      </Link>
      <ol className="mt-4 grid md:grid-cols-2 md:gap-x-12">
        {rest.map((a, i) => (
          <li key={a.id} className="border-b border-line">
            <Link href={`/resources/${a.slug}`} className="group flex gap-6 py-7">
              <span className="font-display text-3xl font-extrabold text-blue-100">{String(i + 2).padStart(2, "0")}</span>
              <span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">{a.category}</span>
                <span className="mt-1 block font-display text-xl font-bold text-navy-900 group-hover:text-blue-600">{a.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">{a.readingMinutes} min read</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function EmptyLibrary() {
  return (
    <section className="container-rs py-16 sm:py-24">
      <div className="flex flex-col gap-4 border-b-2 border-navy-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-3xl font-extrabold text-navy-900">The shelves</h2>
        <p className="flex items-center gap-2 text-sm text-ink-soft"><BookOpen className="size-4 text-blue-500" aria-hidden /> First guides in preparation</p>
      </div>
      <ul className="grid sm:grid-cols-2">
        {shelves.map((sh, i) => {
          const s = getService(sh.service)!;
          return (
            <li key={sh.topic} className="border-b border-line sm:odd:border-r sm:odd:pr-10 sm:even:pl-10">
              <div className="py-8">
                <p className="font-display text-sm font-bold text-ink-soft">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-navy-900">{sh.topic}</h3>
                <div className="mt-4 space-y-2" aria-hidden>
                  <div className="h-2 w-4/5 rounded bg-mist" /><div className="h-2 w-3/5 rounded bg-mist" />
                </div>
                <p className="mt-4 text-sm text-ink-soft">No guides on this shelf yet. Meanwhile:</p>
                <Link href={`/services/${s.slug}`} className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-blue-600 hover:underline">
                  <ServiceIcon name={s.icon} className="size-4" /> {s.title} explained <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-10 max-w-xl text-ink-soft">
        Got a question you&apos;d like answered? <Link href="/contact" className="font-semibold text-blue-600 underline underline-offset-4">Ask us</Link> and it may become one of the first guides.
      </p>
    </section>
  );
}
