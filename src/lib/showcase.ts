import type { PortfolioProject } from "@/lib/types";

// Websites designed and built by RS Technology Group, shown on the portfolio ahead of
// any Firestore projects. The first entry is the main highlight.
// Summaries describe only what each live site shows. Stonebridge and Azure Estates are
// concept sites for fictional businesses (each says so on the site), so they are labelled as concepts.
// Screenshots in public/portfolio/<slug>/ were captured from the live sites with Playwright.
type Showcase = Pick<PortfolioProject, "id" | "slug" | "title" | "category" | "summary" | "link" | "featured" | "technologies" | "coverImage">;

const sites: Showcase[] = [
  {
    id: "stonebridge-construction",
    slug: "stonebridge-construction",
    title: "Stonebridge Construction",
    category: "Concept website · Construction",
    summary:
      "A concept site for a fictional builder and developer. An illustrated crane-and-worker hero opens onto a scroll sequence where a building rises from first line to completion, with animated service demonstrations, a six-stage process timeline and a before-and-after comparison.",
    link: "https://stonebridge-construction-blue.vercel.app/",
    featured: true,
    technologies: ["Next.js", "Vercel"],
    coverImage: {
      url: "/portfolio/stonebridge-construction/desktop.webp",
      alt: "Stonebridge Construction homepage: an illustrated night-time building site with a tower crane, a half-built frame and a bricklayer beside the headline 'Built With Purpose. Designed To Last.'",
    },
  },
  {
    id: "fiber-electric-solutions",
    slug: "fiber-electric-solutions",
    title: "Fiber & Electric Solutions",
    category: "Client website · Electrical & fibre optic",
    summary:
      "The website for Fiber & Electric Solutions Ltd., an electrical and fibre-optic contractor in Trinidad and Tobago. It sets out both service areas, from installation and maintenance to fibre design and termination, alongside practical do's-and-don'ts guidance, a resources library and quote requests.",
    link: "https://www.fiberelectricsolutions.com/",
    featured: true,
    technologies: ["Next.js", "Vercel"],
    coverImage: {
      url: "/portfolio/fiber-electric-solutions/desktop.webp",
      alt: "Fiber & Electric Solutions homepage: a dark electrical switch room behind the headline 'Electrical solutions built for reliability.' with buttons to explore services and view work",
    },
  },
  {
    id: "azure-estates",
    slug: "azure-estates",
    title: "Azure Estates",
    category: "Concept website · Real estate",
    summary:
      "A concept site for a fictional Caribbean luxury real-estate agency, with property search, illustrative listings, a room-by-room home tour, an interactive floor plan, a daylight-to-night view and an enquiry form. All listings are clearly marked as illustrative.",
    link: "https://azure-estates-eight.vercel.app/",
    featured: true,
    technologies: ["Next.js", "Vercel"],
    coverImage: {
      url: "/portfolio/azure-estates/desktop.webp",
      alt: "Azure Estates homepage: a modern white villa with a pool behind the headline 'Exceptional Properties. Extraordinary Living.' and a property search bar",
    },
  },
];

export const showcase: PortfolioProject[] = sites.map((s, i) => ({
  ...s,
  description: "",
  images: [],
  order: i,
  status: "published",
  createdAt: "",
  updatedAt: "",
}));

/** Local screenshots captured from each showcase site (see public/portfolio/<slug>/). */
export const shotsFor = (slug: string) => ({
  full: `/portfolio/${slug}/desktop-full.webp`,
  fold: `/portfolio/${slug}/desktop.webp`,
  mobile: `/portfolio/${slug}/mobile-full.webp`,
});

/** Showcase sites open the live site; Firestore projects open their case study. */
export const isExternal = (p: PortfolioProject) => showcase.some((s) => s.id === p.id);
export const projectHref = (p: PortfolioProject) => (isExternal(p) ? p.link! : `/portfolio/${p.slug}`);
export const hostOf = (url?: string) => (url ? new URL(url).hostname.replace(/^www\./, "") : "");
