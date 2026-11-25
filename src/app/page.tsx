import Link from "next/link";
import { ArrowRight, BookOpen, FolderKanban } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ServiceCards } from "@/components/home/ServiceCards";
import { WhyChoose } from "@/components/home/WhyChoose";
import { FinalCta } from "@/components/home/FinalCta";
import { ExperiencePreviews } from "@/components/home/ExperiencePreviews";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getFeaturedProjects, getLatestArticles } from "@/lib/data/public";
import { ArticleCard, ProjectCard } from "@/components/content/ContentCards";

export const revalidate = 300;

export default async function HomePage() {
  const [projects, articles] = await Promise.all([getFeaturedProjects(3), getLatestArticles(3)]);

  return (
    <>
      <Hero />

      {/* Introduction */}
      <section className="container-rs grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <SectionHeading
          eyebrow="About RS Technology Group"
          title="Technology should work for you, not complicate your life."
        />
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <RevealItem>
            <p>
              Established in 2026, RS Technology Group is a Trinidad and Tobago-based technology solutions company
              helping individuals and businesses navigate an increasingly connected world.
            </p>
          </RevealItem>
          <RevealItem>
            <p>
              With a foundation in Information Technology and hands-on experience in technical support, networking,
              wireless connectivity and infrastructure, we deliver practical solutions centred on reliability, quality
              workmanship and clear communication.
            </p>
          </RevealItem>
          <RevealItem>
            <Link href="/about" className="inline-flex items-center gap-2 font-display font-semibold text-blue-600 hover:gap-3 transition-all">
              More about us <ArrowRight className="size-4" aria-hidden />
            </Link>
          </RevealItem>
        </Reveal>
      </section>

      {/* Services */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-rs">
          <SectionHeading
            eyebrow="Our solutions"
            title="Six ways we help homes and businesses."
            lead="From everyday IT support to network infrastructure and digital business development."
          />
          <ServiceCards />
        </div>
      </section>

      {/* Previews of the flagship experiences */}
      <section className="container-rs py-20 sm:py-28">
        <SectionHeading
          eyebrow="See the work up close"
          title="Don't just read about it. Watch it happen."
          lead="Each service page has a hands-on example. Here are three to start with."
        />
        <ExperiencePreviews />
      </section>


      {/* Why choose */}
      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-28">
        <div className="grid-pattern-dark absolute inset-0" aria-hidden />
        <div className="container-rs relative">
          <SectionHeading dark eyebrow="Why RS Technology Group" title="Practical solutions. Dependable support. Quality service." />
          <WhyChoose />
        </div>
      </section>


      {/* Featured projects */}
      <section className="container-rs py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Our work" title="Featured projects" />
          {projects.length > 0 && <Button href="/work" variant="secondary">All projects</Button>}
        </div>
        <div className="mt-12">
          {projects.length === 0 ? (
            <EmptyState
              icon={<FolderKanban className="size-6" />}
              title="Our portfolio is on its way"
              body="We're documenting our completed work. In the meantime, we're happy to talk through what we can do for you."
              action={<Button href="/contact" variant="secondary">Talk to us</Button>}
            />
          ) : (
            <Reveal className="grid gap-6 md:grid-cols-3">
              {projects.map((p) => (
                <RevealItem key={p.id}><ProjectCard p={p} /></RevealItem>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* Resources preview */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-rs">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Resources" title="Technology tips and guides" />
            {articles.length > 0 && <Button href="/resources" variant="secondary">All resources</Button>}
          </div>
          <div className="mt-12">
            {articles.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="size-6" />}
                title="Guides coming soon"
                body="We'll be publishing practical advice on IT support, Wi-Fi, networking and getting your business online."
              />
            ) : (
              <Reveal className="grid gap-6 md:grid-cols-3">
                {articles.map((a) => (
                  <RevealItem key={a.id}><ArticleCard a={a} /></RevealItem>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
