import Image from "next/image";
import Link from "next/link";
import { FolderKanban } from "lucide-react";
import type { PortfolioProject } from "@/lib/types";
import { isExternal, projectHref } from "@/lib/showcase";

export function ProjectCard({ p }: { p: PortfolioProject }) {
  return (
    <Link href={projectHref(p)} {...(isExternal(p) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="card group block h-full overflow-hidden">
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-mist text-blue-300">
        {p.coverImage ? (
          <Image src={p.coverImage.url} alt={p.coverImage.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <FolderKanban className="size-10" aria-hidden />
        )}
      </div>
      <div className="p-6">
        <p className="eyebrow">{p.category}</p>
        <h3 className="mt-3 text-xl font-bold group-hover:text-blue-600">{p.title}</h3>
        <p className="mt-2 line-clamp-2 text-ink-soft">{p.summary}</p>
      </div>
    </Link>
  );
}

/**
 * Minimal, safe Markdown-ish renderer for admin-authored article bodies:
 * blank-line separated blocks, `## `/`### ` headings and `- ` lists. Text is
 * rendered through React (escaped), never as raw HTML.
 */
export function SimpleMarkdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
      {blocks.map((b, i) => {
        if (b.startsWith("### ")) return <h3 key={i} className="pt-4 text-xl font-bold">{b.slice(4)}</h3>;
        if (b.startsWith("## ")) return <h2 key={i} className="pt-6 text-2xl font-bold">{b.slice(3)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-blue-500">
              {lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}
            </ul>
          );
        }
        return <p key={i} className="whitespace-pre-line">{b}</p>;
      })}
    </div>
  );
}
