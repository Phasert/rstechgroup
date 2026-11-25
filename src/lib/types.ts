// Firestore document shapes. Timestamps are stored as Firestore Timestamps
// and converted to ISO strings when passed to client components.

export type QuoteStatus = "new" | "pending" | "in_progress" | "completed" | "archived";
export type PublishStatus = "draft" | "published";
export type CustomerType = "residential" | "commercial";
export type ContactMethod = "phone" | "whatsapp" | "email";

export interface QuoteAttachment {
  path: string; // quote-attachments/{requestId}/{file}
  name: string;
  contentType: string;
  size: number;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  service: string; // ServiceSlug or "not-sure"
  description: string;
  budget?: string;
  preferredContact: ContactMethod;
  attachments: QuoteAttachment[];
  privacyAccepted: true;
  status: QuoteStatus;
  source: "quote-form" | "contact-form" | "package-quiz";
  createdAt: string;
  updatedAt: string;
}

export interface QuoteNote {
  id: string;
  body: string;
  authorUid: string;
  authorEmail: string;
  createdAt: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  challenge?: string;
  solution?: string;
  /** Case study extras (optional, entered by an admin for real, verified projects only). */
  result?: string;
  location?: string;
  serviceSlugs?: string[];
  completedOn?: string; // e.g. "March 2027"
  technologies: string[];
  images: { url: string; path: string; alt: string }[];
  coverImage?: { url: string; alt: string };
  link?: string;
  featured: boolean;
  order: number;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // Markdown
  category: string;
  coverImage?: { url: string; alt: string };
  authorName?: string; // only if a real author is set by an admin
  readingMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  status: PublishStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUid: string;
  action: string;
  target: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}
