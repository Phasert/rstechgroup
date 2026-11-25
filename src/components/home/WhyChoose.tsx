import { HeartHandshake, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

// Drawn from the brief's stated approach: reliability, quality workmanship,
// clear communication and long-term value. No claims beyond that.
const points = [
  { icon: ShieldCheck, title: "Reliable support", body: "Dependable solutions and consistent service, whether it's one laptop or a whole office network." },
  { icon: Sparkles, title: "Quality workmanship", body: "Attention to detail in every installation, configuration and website we deliver." },
  { icon: MessagesSquare, title: "Clear communication", body: "Honest advice in plain language — you'll know what was done and why." },
  { icon: HeartHandshake, title: "Long-term value", body: "Practical solutions built around your needs, not unnecessary upgrades." },
];

export function WhyChoose() {
  return (
    <Reveal className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 sm:grid-cols-2">
      {points.map(({ icon: Icon, title, body }) => (
        <RevealItem key={title} className="bg-navy-900 p-8 sm:p-10">
          <Icon className="size-7 text-blue-300" aria-hidden />
          <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
          <p className="mt-3 leading-relaxed text-white/70">{body}</p>
        </RevealItem>
      ))}
    </Reveal>
  );
}
