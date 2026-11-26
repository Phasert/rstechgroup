import "server-only";

import type { Timestamp } from "firebase-admin/firestore";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { PortfolioProject } from "@/lib/types";

// Read-only public queries. Return [] (never fake content) when Firebase is
// not configured yet, so pages render their empty states.

const iso = (v: unknown) => (v && typeof (v as Timestamp).toDate === "function" ? (v as Timestamp).toDate().toISOString() : (v as string | undefined));

function normalise<T>(id: string, data: FirebaseFirestore.DocumentData): T {
  const out: Record<string, unknown> = { id, ...data };
  for (const k of ["createdAt", "updatedAt", "publishedAt"]) if (k in out) out[k] = iso(out[k]);
  return out as T;
}

export async function getFeaturedProjects(limit = 3): Promise<PortfolioProject[]> {
  if (!isFirebaseAdminConfigured) return [];
  try {
    const snap = await adminDb()
      .collection("portfolioProjects")
      .where("status", "==", "published")
      .orderBy("featured", "desc")
      .orderBy("order", "asc")
      .limit(limit)
      .get();
    return snap.docs.map((d) => normalise<PortfolioProject>(d.id, d.data()));
  } catch (err) {
    console.error("getFeaturedProjects failed", err);
    return [];
  }
}

export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  if (!isFirebaseAdminConfigured) return [];
  try {
    const snap = await adminDb()
      .collection("portfolioProjects")
      .where("status", "==", "published")
      .orderBy("order", "asc")
      .limit(60)
      .get();
    return snap.docs.map((d) => normalise<PortfolioProject>(d.id, d.data()));
  } catch (err) {
    console.error("getPublishedProjects failed", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  if (!isFirebaseAdminConfigured) return null;
  try {
    const snap = await adminDb()
      .collection("portfolioProjects")
      .where("status", "==", "published")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    const doc = snap.docs[0];
    return doc ? normalise<PortfolioProject>(doc.id, doc.data()) : null;
  } catch (err) {
    console.error("getProjectBySlug failed", err);
    return null;
  }
}

