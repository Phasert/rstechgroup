import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { Button } from "@/components/ui/Button";

// OWNER REVIEW: terms and conditions have not been written or approved yet. No terms are published
// until the owner supplies and approves them; the page stays out of search results meanwhile.
export const metadata: Metadata = {
  title: "Terms & Conditions",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Terms" title="Terms & conditions" crumbs={[{ href: "/terms", label: "Terms & Conditions" }]} />
      <section className="container-rs max-w-3xl py-14 sm:py-20">
        <DraftNotice>
          Our terms and conditions are being finalised and will be published here. In the meantime, please contact
          us with any questions.
        </DraftNotice>
        <div className="mt-8"><Button href="/contact" variant="secondary">Questions? Contact us</Button></div>
      </section>
    </>
  );
}
