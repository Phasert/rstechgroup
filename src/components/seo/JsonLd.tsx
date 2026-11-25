import { site } from "@/lib/site";
import { services } from "@/lib/services";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/rs-logo.png`,
    image: `${site.url}/brand/rs-logo.png`,
    telephone: site.phoneE164,
    email: site.email,
    foundingDate: String(site.established),
    areaServed: { "@type": "Country", name: "Trinidad and Tobago" },
    address: { "@type": "PostalAddress", addressCountry: "TT" },
    sameAs: [site.social.instagram, site.social.facebook, site.social.tiktok].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Technology services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.summary },
      })),
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
