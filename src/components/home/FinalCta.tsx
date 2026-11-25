import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="container-rs py-20 sm:py-28">
      <Reveal className="relative overflow-hidden rounded-[var(--radius-section)] bg-gradient-to-br from-navy-700 via-navy-800 to-blue-600 px-6 py-16 text-center sm:px-16 sm:py-20">
        <div className="grid-pattern-dark absolute inset-0" aria-hidden />
        <div className="slash-accent absolute -right-20 -top-10 h-[140%] w-64 rotate-12 bg-white/5" aria-hidden />
        <div className="relative">
          <RevealItem><h2 className="display-2 text-white">Let&apos;s find the right solution for you.</h2></RevealItem>
          <RevealItem>
            <p className="lead mx-auto mt-5 max-w-2xl text-white/75">
              Tell us what you need — a slow computer, weak Wi-Fi, a new website — and we&apos;ll come back with practical next steps.
            </p>
          </RevealItem>
          <RevealItem className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" variant="secondary" magnetic>Get in Touch <ArrowRight className="size-4" aria-hidden /></Button>
            <Button href={site.whatsappUrl} variant="light" external magnetic><MessageCircle className="size-4" aria-hidden /> WhatsApp us</Button>
          </RevealItem>
        </div>
      </Reveal>
    </section>
  );
}
