import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { services, type Service } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Building blocks for service pages. Each page composes a different selection and order. */

export function FaqList({ faqs, dark = false }: { faqs: Service["faqs"]; dark?: boolean }) {
  return (
    <div className={cn("divide-y border-y", dark ? "divide-white/10 border-white/10" : "divide-line border-line")}>
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className={cn("flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden", dark ? "text-white" : "text-navy-900")}>
            {f.q}
            <Plus className={cn("size-5 shrink-0 transition-transform group-open:rotate-45", dark ? "text-blue-300" : "text-blue-500")} aria-hidden />
          </summary>
          <p className={cn("mt-3 max-w-2xl leading-relaxed", dark ? "text-white/70" : "text-ink-soft")}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Problem → what we do, paired row by row. */
export function ProblemFixRows({ s }: { s: Service }) {
  const n = Math.max(s.problems.length, s.solutions.length);
  return (
    <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white ring-1 ring-line">
      {Array.from({ length: n }, (_, i) => (
        <li key={i} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">
          <span className="text-ink-soft">{s.problems[i] ?? ""}</span>
          <ArrowRight className="hidden size-4 text-blue-500 sm:block" aria-hidden />
          <span className="flex gap-2 font-semibold text-navy-900">{s.solutions[i] && <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden />}{s.solutions[i] ?? ""}</span>
        </li>
      ))}
    </ul>
  );
}

export function Checklist({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 | 3 }) {
  return (
    <ul className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-3")}>
      {items.map((i) => (
        <li key={i} className="flex gap-3 rounded-2xl bg-white p-4 text-navy-900 ring-1 ring-line">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success/10 text-success"><Check className="size-3.5" aria-hidden /></span>
          {i}
        </li>
      ))}
    </ul>
  );
}

export function ExamplesTimeline({ s }: { s: Service }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-blue-100 pl-8">
      {s.examples.map((e, i) => (
        <li key={e.title} className="relative">
          <span className="absolute -left-[45px] grid size-8 place-items-center rounded-full bg-blue-500 font-display text-sm font-bold text-white ring-4 ring-white">{i + 1}</span>
          <h3 className="text-lg font-bold">{e.title}</h3>
          <p className="mt-1 max-w-xl leading-relaxed text-ink-soft">{e.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function ExamplesRows({ s, dark = false }: { s: Service; dark?: boolean }) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-[var(--radius-card)] md:grid-cols-2", dark ? "bg-white/10" : "bg-line")}>
      {s.examples.map((e) => (
        <div key={e.title} className={cn("p-7", dark ? "bg-navy-900" : "bg-white")}>
          <h3 className={cn("text-lg font-bold", dark && "text-white")}>{e.title}</h3>
          <p className={cn("mt-2 leading-relaxed", dark ? "text-white/70" : "text-ink-soft")}>{e.body}</p>
        </div>
      ))}
    </div>
  );
}

export function CtaBand({ s, title, body, variant }: { s: Service; title: string; body: string; variant: "dark" | "split" | "light" }) {
  const quote = `/quote?service=${s.slug}`;
  if (variant === "split") {
    return (
      <div className="grid overflow-hidden rounded-[var(--radius-section)] ring-1 ring-line md:grid-cols-[1.4fr_1fr]">
        <div className="bg-white p-8 sm:p-12">
          <h2 className="display-2">{title}</h2>
          <p className="lead mt-4">{body}</p>
        </div>
        <div className="flex flex-col justify-center gap-3 bg-blue-500 p-8 sm:p-12">
          <Button href={quote} variant="secondary">Request a quote <ArrowRight className="size-4" aria-hidden /></Button>
          <Button href={site.whatsappUrl} external variant="light">WhatsApp us</Button>
        </div>
      </div>
    );
  }
  if (variant === "light") {
    return (
      <div className="flex flex-col gap-6 rounded-[var(--radius-section)] bg-blue-50 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">{body}</p>
        </div>
        <Button href={quote} magnetic>Request a quote <ArrowRight className="size-4" aria-hidden /></Button>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-section)] bg-gradient-to-br from-navy-700 via-navy-800 to-blue-600 px-6 py-14 sm:px-14">
      <div className="grid-pattern-dark absolute inset-0" aria-hidden />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="display-2 text-white">{title}</h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">{body}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href={quote} variant="secondary" magnetic>Request a quote <ArrowRight className="size-4" aria-hidden /></Button>
          <Button href="/contact" variant="light">Other ways to reach us</Button>
        </div>
      </div>
    </div>
  );
}

export function OtherServices({ current }: { current: Service["slug"] }) {
  return (
    <nav aria-label="Other services" className="border-t border-line bg-white">
      <div className="container-rs flex flex-wrap items-center gap-x-6 gap-y-3 py-8 text-sm">
        <span className="font-display font-semibold text-ink-soft">Other services</span>
        {services.filter((o) => o.slug !== current).map((o) => (
          <Link key={o.slug} href={`/services/${o.slug}`} className="group inline-flex min-h-11 items-center gap-2 font-semibold text-navy-900 hover:text-blue-600">
            <ServiceIcon name={o.icon} className="size-4 text-blue-500" />{o.short}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ))}
      </div>
    </nav>
  );
}
