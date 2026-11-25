import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, Flag, Lightbulb, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { getPublishedProjects } from "@/lib/data/public";
import type { PortfolioProject } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Work",
  description: "Case studies of networking, IT support and website projects completed by RS Technology Group in Trinidad and Tobago.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  const [lead, ...rest] = projects;

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Case studies: the problem, the fix, the result."
        lead="Real projects, documented with photos and plain-language detail."
        crumbs={[{ href: "/work", label: "Our Work" }]}
      />
      {lead ? (
        <section className="container-rs py-16 sm:py-24">
          <FeaturedCase p={lead} />
          {rest.length > 0 && (
            <ul className="mt-12 grid gap-6 md:grid-cols-2">
              {rest.map((p) => (
                <li key={p.id}>
                  <Link href={`/work/${p.slug}`} className="group grid h-full grid-cols-[120px_1fr] overflow-hidden rounded-[var(--radius-card)] ring-1 ring-line sm:grid-cols-[180px_1fr]">
                    <div className="relative bg-mist">{p.coverImage && <Image src={p.coverImage.url} alt={p.coverImage.alt} fill sizes="180px" className="object-cover" />}</div>
                    <div className="p-5">
                      <p className="eyebrow">{p.category}</p>
                      <p className="mt-2 font-display text-lg font-bold text-navy-900 group-hover:text-blue-600">{p.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <CaseStudyPreview />
      )}
    </>
  );
}

function FeaturedCase({ p }: { p: PortfolioProject }) {
  return (
    <Link href={`/work/${p.slug}`} className="group grid overflow-hidden rounded-[var(--radius-section)] bg-navy-950 text-white lg:grid-cols-[1.3fr_1fr]">
      <div className="relative aspect-[16/10] bg-navy-900 lg:aspect-auto">
        {p.coverImage && <Image src={p.coverImage.url} alt={p.coverImage.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
      </div>
      <div className="p-8 sm:p-12">
        <p className="eyebrow text-blue-300">Featured case study · {p.category}</p>
        <h2 className="mt-4 text-3xl font-bold text-white">{p.title}</h2>
        <p className="mt-4 text-white/75">{p.summary}</p>
        {p.result && <p className="mt-6 border-l-2 border-blue-300 pl-4 text-white/90">{p.result}</p>}
        <span className="mt-8 inline-flex items-center gap-2 font-display font-semibold text-blue-300">Read the case study <ArrowUpRight className="size-4" aria-hidden /></span>
      </div>
    </Link>
  );
}

/** Shown until real projects are published: what each case study will contain. Clearly not a project. */
function CaseStudyPreview() {
  const parts = [
    { icon: Flag, title: "The challenge", body: "What wasn't working, and why it mattered to the customer." },
    { icon: Lightbulb, title: "The approach", body: "What we recommended, and the options we considered." },
    { icon: Camera, title: "The work", body: "Photos and details from the job itself, never stock imagery." },
    { icon: Target, title: "The result", body: "What changed for the customer, in their terms." },
  ];
  return (
    <section className="container-rs py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div>
          <p className="eyebrow">Coming soon</p>
          <h2 className="display-2 mt-4">Our first case studies are being written up.</h2>
          <p className="lead mt-5">Only real projects with real photos will appear here. This is what each one will cover.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/services">See the services in action</Button>
            <Button href="/contact" variant="secondary">Talk to us</Button>
          </div>
        </div>
        <div className="relative rounded-[var(--radius-card)] border-2 border-dashed border-line p-6 sm:p-8" aria-label="Layout preview of a case study">
          <span className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">Layout preview, not a project</span>
          <div className="aspect-[16/7] rounded-2xl bg-[repeating-linear-gradient(45deg,#f3f5f7,#f3f5f7_10px,#eef1f5_10px,#eef1f5_20px)]" aria-hidden />
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {parts.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-500"><Icon className="size-5" aria-hidden /></span>
                <span>
                  <span className="block font-display font-bold text-navy-900">{i + 1}. {title}</span>
                  <span className="block text-sm text-ink-soft">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
