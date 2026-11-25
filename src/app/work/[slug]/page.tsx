import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SimpleMarkdown } from "@/components/content/ContentCards";
import { getProjectBySlug } from "@/lib/data/public";
import { getService } from "@/lib/services";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProjectBySlug((await params).slug);
  if (!p) return { title: "Project not found" };
  return { title: p.title, description: p.summary, alternates: { canonical: `/work/${p.slug}` } };
}

export default async function CaseStudyPage({ params }: Params) {
  const p = await getProjectBySlug((await params).slug);
  if (!p) notFound();
  const linked = (p.serviceSlugs ?? []).map(getService).filter((s) => s !== undefined);
  const meta = [
    ["Category", p.category],
    ["Location", p.location],
    ["Completed", p.completedOn],
  ].filter(([, v]) => Boolean(v)) as [string, string][];
  const chapters = [
    ["The challenge", p.challenge],
    ["Our approach", p.solution],
    ["The result", p.result],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-navy-950 text-white">
        {p.coverImage && <Image src={p.coverImage.url} alt={p.coverImage.alt} fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent" aria-hidden />
        <div className="container-rs pb-14 pt-24 sm:pt-36">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60"><Link href="/work" className="hover:text-white">Our Work</Link> / Case study</nav>
          <h1 className="display-1 mt-6 max-w-4xl text-white">{p.title}</h1>
          <p className="mt-5 max-w-2xl text-xl text-white/80">{p.summary}</p>
          {meta.length > 0 && (
            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/15 pt-6">
              {meta.map(([k, v]) => (<div key={k}><dt className="text-xs uppercase tracking-[0.18em] text-white/50">{k}</dt><dd className="mt-1 font-display font-semibold">{v}</dd></div>))}
            </dl>
          )}
        </div>
      </header>

      <div className="container-rs grid gap-14 py-16 sm:py-24 lg:grid-cols-[1fr_300px]">
        <div className="space-y-14">
          <SimpleMarkdown source={p.description} />
          {chapters.map(([title, body], i) => (
            <section key={title} className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <p className="font-display text-5xl font-extrabold text-blue-100">0{i + 1}</p>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <div className="mt-4"><SimpleMarkdown source={body} /></div>
              </div>
            </section>
          ))}
          {p.images.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">On the job</h2>
              <div className="mt-6 columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
                {p.images.map((img) => (
                  <figure key={img.path} className="break-inside-avoid overflow-hidden rounded-2xl bg-mist">
                    <Image src={img.url} alt={img.alt} width={800} height={600} sizes="(min-width: 640px) 40vw, 100vw" className="h-auto w-full" />
                    {img.alt && <figcaption className="p-3 text-sm text-ink-soft">{img.alt}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {linked.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">Services</p>
              <ul className="mt-3 space-y-2">{linked.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="font-semibold text-blue-600 hover:underline">{s.title}</Link></li>)}</ul>
            </div>
          )}
          {p.technologies.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">Technologies</p>
              <ul className="mt-3 flex flex-wrap gap-2">{p.technologies.map((t) => <li key={t} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">{t}</li>)}</ul>
            </div>
          )}
          {p.link && <Button href={p.link} external variant="secondary">Visit the site <ExternalLink className="size-4" aria-hidden /></Button>}
          <div className="rounded-[var(--radius-card)] bg-navy-950 p-6 text-white">
            <p className="font-display font-bold">Need something similar?</p>
            <p className="mt-2 text-sm text-white/70">Tell us about your project.</p>
            <div className="mt-4"><Button href={`/quote${linked[0] ? `?service=${linked[0].slug}` : ""}`}>Request a quote <ArrowRight className="size-4" aria-hidden /></Button></div>
          </div>
        </aside>
      </div>
    </article>
  );
}
