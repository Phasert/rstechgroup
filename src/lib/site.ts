// Single source of truth for business details from the Website Master Brief (Nov 2026).
// Items flagged `needsConfirmation` must be verified by the owner before public launch.

export const site = {
  name: "RS Technology Group",
  tagline: "Technology. Infrastructure. Support.",
  established: 2026,
  location: "Trinidad and Tobago",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "RS Technology Group | IT Support, Networking & Web Design Trinidad",
  description:
    "RS Technology Group provides reliable IT support, networking, website development and digital business solutions for homes and businesses across Trinidad and Tobago.",
  phoneDisplay: "+1 (868) 708-1349",
  phoneE164: "+18687081349",
  whatsappUrl: "https://wa.me/18687081349",
  email: "rstechgroup25@gmail.com",
  availability: "24/7", // needsConfirmation: scope of 24/7 availability
  social: {
    instagram: "https://www.instagram.com/rstechgrouptt/",
    // Facebook and TikTok exist per the brief but URLs are unconfirmed. Do not invent them.
    facebook: undefined as string | undefined,
    tiktok: undefined as string | undefined,
  },
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

export const values = [
  { name: "Integrity", meaning: "Honest advice and transparent communication." },
  { name: "Reliability", meaning: "Dependable solutions and consistent service." },
  { name: "Quality", meaning: "Attention to detail in everything we deliver." },
  { name: "Innovation", meaning: "Practical use of modern technology." },
  { name: "Customer focus", meaning: "Solutions built around individual customer needs." },
  { name: "Continuous improvement", meaning: "Constantly developing our knowledge and capabilities." },
] as const;

export const mission =
  "To make technology more accessible, reliable and effective for homes and businesses through practical solutions, dependable support and quality service.";

export const vision =
  "To become a trusted technology solutions provider in Trinidad and Tobago, recognised for reliability, innovation, professionalism and customer satisfaction.";
