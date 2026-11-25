import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SimpleMarkdown } from "@/components/content/ContentCards";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { getArticleBySlug } from "@/lib/data/public";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = await getArticleBySlug((await params).slug);
  if (!a) return { title: "Article not found" };
  return {
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.excerpt,
    alternates: { canonical: `/resources/${a.slug}` },
  };
}

export default async function ArticlePage({ params }: Params) {
  const a = await getArticleBySlug((await params).slug);
  if (!a) notFound();
  const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-TT", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <>
      <ReadingProgress />
      <PageHero eyebrow={a.category} title={a.title} lead={a.excerpt} crumbs={[{ href: "/resources", label: "Resources" }, { href: `/resources/${a.slug}`, label: a.title }]}>
        <p className="text-sm text-white/60">
          {[a.authorName, date, `${a.readingMinutes} min read`].filter(Boolean).join(" · ")}
        </p>
      </PageHero>
      <article className="container-rs max-w-3xl py-16 sm:py-24">
        {a.coverImage && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-mist">
            <Image src={a.coverImage.url} alt={a.coverImage.alt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <SimpleMarkdown source={a.body} />
        <div className="card mt-16 flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display font-semibold text-navy-900">Would you rather we handled it?</p>
          <Button href="/quote">Request a Quote <ArrowRight className="size-4" aria-hidden /></Button>
        </div>
      </article>
    </>
  );
}
