import type { PortfolioProject } from "@/lib/types";

// Live websites built by RS Technology Group, shown on the portfolio ahead of
// any Firestore projects. The first entry is the main highlight.
type Showcase = Pick<PortfolioProject, "id" | "slug" | "title" | "category" | "summary" | "link" | "featured">;

const sites: Showcase[] = [
  {
    id: "stonebridge-construction",
    slug: "stonebridge-construction",
    title: "Stonebridge Construction",
    category: "Website development",
    summary: "A website for Stonebridge Construction, designed and built by RS Technology Group.",
    link: "https://stonebridge-construction-blue.vercel.app/",
    featured: true,
  },
  {
    id: "fiber-electric-solutions",
    slug: "fiber-electric-solutions",
    title: "Fiber Electric Solutions",
    category: "Website development",
    summary: "A website for Fiber Electric Solutions, designed and built by RS Technology Group.",
    link: "https://www.fiberelectricsolutions.com/",
    featured: true,
  },
  {
    id: "azure-estates",
    slug: "azure-estates",
    title: "Azure Estates",
    category: "Website development",
    summary: "A website for Azure Estates, designed and built by RS Technology Group.",
    link: "https://azure-estates-eight.vercel.app/",
    featured: true,
  },
];

export const showcase: PortfolioProject[] = sites.map((s, i) => ({
  ...s,
  description: "",
  technologies: [],
  images: [],
  order: i,
  status: "published",
  createdAt: "",
  updatedAt: "",
}));

/** Showcase sites open the live site; Firestore projects open their case study. */
export const isExternal = (p: PortfolioProject) => showcase.some((s) => s.id === p.id);
export const projectHref = (p: PortfolioProject) => (isExternal(p) ? p.link! : `/portfolio/${p.slug}`);
export const hostOf = (url?: string) => (url ? new URL(url).hostname.replace(/^www\./, "") : "");
