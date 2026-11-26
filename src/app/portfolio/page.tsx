import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, Flag, Lightbulb, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { getPublishedProjects } from "@/lib/data/public";
import type { PortfolioProject } from "@/lib/types";
import { isExternal, projectHref, showcase } from "@/lib/showcase";
import { SiteShot } from "@/components/content/SiteShot";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Websites and case studies of networking, IT support and website projects completed by RS Technology Group in Trinidad and Tobago.",
  alternates: { canonical: "/portfolio" },
};

export default async function WorkPage() {
  const projects = [...showcase, ...(await getPublishedProjects())];
  const [lead, ...rest] = projects;

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work we're proud of."
        lead="Websites we've designed and built, from client work to concept sites, plus case studies from the field."
        crumbs={[{ href: "/portfolio", label: "Portfolio" }]}
      />
      {lead ? (
        <section className="container-rs py-16 sm:py-24">
          <Reveal><RevealItem><FeaturedCase p={lead} /></RevealItem></Reveal>
          {rest.length > 0 && (
            <>
              <div className="mt-20 flex items-end justify-between gap-6 border-b border-line pb-6">
                <h2 className="font-display text-3xl font-extrabold text-navy-900">More of our work</h2>
                <p className="hidden text-sm text-ink-soft sm:block">Hover a preview to scroll the page</p>
              </div>
              <Reveal className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
                {rest.map((p) => (
                  <RevealItem key={p.id}><ProjectTile p={p} /></RevealItem>
                ))}
              </Reveal>
            </>
          )}
        </section>
      ) : (
        <CaseStudyPreview />
      )}
    </>
  );
}

function FeaturedCase({ p }: { p: PortfolioProject }) {
  const external = isExternal(p);
  return (
    <Link href={projectHref(p)} {...ext(p)} className="group relative isolate grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[var(--radius-section)] bg-navy-950 p-6 text-white sm:p-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:p-14">
      <div className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-blue-600/30 blur-3xl transition-opacity duration-700 group-hover:opacity-80" aria-hidden />
      <div className="absolute -bottom-32 left-10 -z-10 size-80 rounded-full bg-blue-400/20 blur-3xl" aria-hidden />
      {external && p.link ? (
        <SiteShot slug={p.slug} url={p.link} title={p.title} alt={p.coverImage?.alt} sizes="(min-width: 1024px) 55vw, 100vw" dark phone priority />
      ) : (
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-900">
          {p.coverImage && <Image src={p.coverImage.url} alt={p.coverImage.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
        </div>
      )}
      <div>
        <p className="eyebrow text-blue-300">{external ? "Featured website" : "Featured case study"}</p>
        <h2 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">{p.title}</h2>
        <p className="mt-5 text-lg text-white/75">{p.summary}</p>
        {p.result && <p className="mt-6 border-l-2 border-blue-300 pl-4 text-white/90">{p.result}</p>}
        <span className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-500 px-6 font-display font-semibold text-white transition-colors group-hover:bg-blue-400">
          {external ? "Visit the live site" : "Read the case study"} <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function ProjectTile({ p }: { p: PortfolioProject }) {
  const external = isExternal(p);
  return (
    <Link href={projectHref(p)} {...ext(p)} className="group block">
      {external && p.link ? (
        <SiteShot slug={p.slug} url={p.link} title={p.title} alt={p.coverImage?.alt} sizes="(min-width: 768px) 45vw, 100vw" />
      ) : (
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-mist">
          {p.coverImage && <Image src={p.coverImage.url} alt={p.coverImage.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
        </div>
      )}
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{p.category}</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-navy-900 group-hover:text-blue-600">{p.title}</h3>
          <p className="mt-2 text-ink-soft">{p.summary}</p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-line transition-colors group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600" aria-hidden><ArrowUpRight className="size-5" /></span>
      </div>
    </Link>
  );
}

const ext = (p: PortfolioProject) => (isExternal(p) ? { target: "_blank", rel: "noopener noreferrer" } : {});

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
