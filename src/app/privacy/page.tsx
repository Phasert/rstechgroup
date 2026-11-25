import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { site } from "@/lib/site";

// OWNER REVIEW: the full privacy policy has not been approved. Only a factual summary of how the
// enquiry form handles data is published, and the page is kept out of search results until approved.
export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How RS Technology Group handles the details you send through our enquiry forms.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy notice" crumbs={[{ href: "/privacy", label: "Privacy" }]} />
      <section className="container-rs max-w-3xl py-14 sm:py-20">
        <DraftNotice>
          Our full privacy policy is being finalised. This page summarises how we currently handle the details you
          send us. If you have any questions, email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-blue-600 underline underline-offset-2">{site.email}</a>.
        </DraftNotice>
        <div className="mt-10 space-y-8 text-lg leading-relaxed text-ink-soft">
          <div>
            <h2 className="text-2xl font-bold">What we collect</h2>
            <p className="mt-3">
              When you send an enquiry, we collect the details you enter: your name, email address, phone number (if
              given), whether the enquiry is for a home or business, the service you&apos;re interested in, your project
              details and how you&apos;d like us to contact you.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">How we use it</h2>
            <p className="mt-3">
              We use these details to respond to your enquiry and discuss the work you&apos;ve asked about.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">How it&apos;s stored</h2>
            <p className="mt-3">
              Enquiries are stored in a private database that only authorised RS Technology Group staff can access. To
              protect the form from abuse, we keep a short-lived, anonymised record of how often a connection has sent
              enquiries; we don&apos;t store your IP address itself.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Questions</h2>
            <p className="mt-3">
              For any question about your details, contact us at {site.email} or {site.phoneDisplay}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
