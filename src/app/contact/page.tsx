import type { Metadata } from "next";
import { Instagram, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ContactRoutes } from "@/components/contact/ContactRoutes";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact RS Technology Group by WhatsApp, phone, email or our enquiry form. Serving homes and businesses across Trinidad and Tobago.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Four ways to reach us. Pick the easiest."
        lead="WhatsApp, a call, an email or the form below: every route reaches the same team."
        crumbs={[{ href: "/contact", label: "Contact" }]}
      />
      <section className="container-rs py-12 sm:py-16">
        <h2 className="sr-only">Ways to get in touch</h2>
        <ContactRoutes />
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
          <span className="flex items-center gap-2"><MapPin className="size-4 text-blue-500" aria-hidden /> Homes and businesses across {site.location}</span>
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600"><Instagram className="size-4 text-blue-500" aria-hidden /> @rstechgrouptt</a>
        </div>
      </section>
      <section id="enquiry" className="scroll-mt-24 bg-mist py-12 sm:py-16">
        <div className="container-rs max-w-3xl">
          <h2 className="display-2">Send a message</h2>
          <p className="lead mt-4">Say what you need help with and how you&apos;d like us to reply.</p>
          <div className="mt-8"><QuoteForm source="contact-form" submissionsEnabled={isFirebaseAdminConfigured} /></div>
        </div>
      </section>
    </>
  );
}
