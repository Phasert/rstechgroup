// Website project planner: option definitions shared by the /packages planner (client)
// and /quote (server), which turns a plan in the URL into a readable summary.
// No prices, package names or inclusions here: those are not yet approved. Hosting, domain,
// email and ongoing care are described as things to discuss, matching the brief ("subject to scope").

export const sizeOptions = [
  { value: "one", label: "One page", detail: "Everything on a single, focused page", pages: 1 },
  { value: "few", label: "A few pages", detail: "Around 3 to 5 pages", pages: 4 },
  { value: "multi", label: "Multi-page site", detail: "Around 6 to 10 pages", pages: 8 },
  { value: "large", label: "Larger site", detail: "More than 10 pages", pages: 12 },
] as const;

export const featureOptions = [
  { value: "enquiry", label: "Enquiry form" },
  { value: "whatsapp", label: "WhatsApp & click-to-call" },
  { value: "gallery", label: "Photo gallery" },
  { value: "listings", label: "Service or product listings" },
  { value: "location", label: "Location map & opening hours" },
] as const;

export const contentOptions = [
  { value: "ready", label: "My text and photos are ready" },
  { value: "help", label: "I'd like help shaping the content" },
] as const;

export const hostingOptions = [
  { value: "have", label: "I already have a domain and hosting" },
  { value: "need", label: "I need a domain and hosting set up" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export type Plan = {
  size: (typeof sizeOptions)[number]["value"];
  features: (typeof featureOptions)[number]["value"][];
  content: (typeof contentOptions)[number]["value"];
  hosting: (typeof hostingOptions)[number]["value"];
  email: boolean;
  care: boolean;
};

export const defaultPlan: Plan = { size: "few", features: ["enquiry", "whatsapp"], content: "ready", hosting: "unsure", email: false, care: false };

const pick = <T extends { value: string }>(opts: readonly T[], v: unknown) => opts.find((o) => o.value === v);

export function planToParams(p: Plan) {
  const q = new URLSearchParams({ service: "website-development", pages: p.size, content: p.content, hosting: p.hosting });
  if (p.features.length) q.set("features", p.features.join(","));
  if (p.email) q.set("email", "1");
  if (p.care) q.set("care", "1");
  return q.toString();
}

/** Parses untrusted search params, keeping only known values. Returns null when there is no plan. */
export function paramsToPlan(sp: Record<string, string | string[] | undefined>): Plan | null {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const size = pick(sizeOptions, one("pages"));
  if (!size) return null;
  const features = (one("features") ?? "")
    .split(",")
    .map((f) => pick(featureOptions, f)?.value)
    .filter((f): f is Plan["features"][number] => Boolean(f));
  return {
    size: size.value,
    features: [...new Set(features)],
    content: pick(contentOptions, one("content"))?.value ?? "ready",
    hosting: pick(hostingOptions, one("hosting"))?.value ?? "unsure",
    email: one("email") === "1",
    care: one("care") === "1",
  };
}

export function planSummary(p: Plan): string[] {
  const size = pick(sizeOptions, p.size)!;
  const lines = [`Size: ${size.label} (${size.detail.toLowerCase()})`];
  lines.push(`Features: ${p.features.length ? p.features.map((f) => pick(featureOptions, f)!.label).join(", ") : "none chosen yet"}`);
  lines.push(`Content: ${pick(contentOptions, p.content)!.label}`);
  lines.push(`Domain & hosting: ${pick(hostingOptions, p.hosting)!.label}`);
  if (p.email) lines.push("Would like to discuss a business email address");
  if (p.care) lines.push("Would like to discuss ongoing updates and maintenance");
  return lines;
}

/** Qualitative scope only. Never a price. */
export function planScope(p: Plan): { label: string; level: 1 | 2 | 3 } {
  const score = sizeOptions.findIndex((s) => s.value === p.size) * 2 + p.features.length + (p.content === "help" ? 2 : 0) + (p.care ? 1 : 0);
  if (score <= 3) return { label: "Focused", level: 1 };
  if (score <= 7) return { label: "Moderate", level: 2 };
  return { label: "Extensive", level: 3 };
}

export function planDescription(p: Plan) {
  return `Website plan from the project planner:\n${planSummary(p).map((l) => `- ${l}`).join("\n")}\n\nAbout my business: `;
}
