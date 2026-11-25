import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { quoteSchema, type QuoteResponse } from "@/lib/quote-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = 5; // enquiries
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour, per client
const MAX_BODY_BYTES = 16 * 1024;

const json = (body: QuoteResponse, status: number) => NextResponse.json(body, { status });

function clientKey(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  // Only a salted hash is stored, never the raw IP.
  const salt = process.env.RATE_LIMIT_SALT ?? "rs-technology-group";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40);
}

/** Returns false when this client has used up its allowance for the current window. */
async function withinRateLimit(key: string) {
  const db = adminDb();
  const ref = db.collection("rateLimits").doc(`quote_${key}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();
    const data = snap.data() as { count: number; windowStart: number } | undefined;
    if (!data || now - data.windowStart > RATE_WINDOW_MS) {
      tx.set(ref, { count: 1, windowStart: now });
      return true;
    }
    if (data.count >= RATE_LIMIT) return false;
    tx.update(ref, { count: data.count + 1 });
    return true;
  });
}

export async function POST(req: NextRequest) {
  if (!isFirebaseAdminConfigured) {
    return json(
      { ok: false, code: "unavailable", message: "Online enquiries aren't switched on yet. Please contact us by WhatsApp or email." },
      503,
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, code: "error", message: "That request was too large. Please shorten your details." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, code: "error", message: "We couldn't read that request. Please try again." }, 400);
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    // A filled honeypot is a bot: pretend success so it learns nothing, but store nothing.
    if (fieldErrors.website) return json({ ok: true, id: "received" }, 201);
    return json({ ok: false, code: "invalid", fieldErrors }, 400);
  }

  const d = parsed.data;
  try {
    if (!(await withinRateLimit(clientKey(req)))) {
      return json(
        { ok: false, code: "rate_limited", message: "We've received several enquiries from you recently. Please wait a while or contact us directly." },
        429,
      );
    }

    const ref = adminDb().collection("quoteRequests").doc();
    await ref.set({
      name: d.name,
      email: d.email,
      phone: d.phone,
      customerType: d.customerType,
      service: d.service,
      description: d.description,
      preferredContact: d.preferredContact,
      attachments: [],
      privacyAccepted: true,
      status: "new",
      source: d.source,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Success is only reported after the write above has been acknowledged.
    return json({ ok: true, id: ref.id }, 201);
  } catch (err) {
    console.error("quote submission failed", err);
    return json(
      { ok: false, code: "error", message: "We couldn't save your enquiry just now. Please try again, or contact us by WhatsApp or email." },
      500,
    );
  }
}
