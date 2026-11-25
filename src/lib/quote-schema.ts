import { z } from "zod";
import { services } from "@/lib/services";

// Shared by the quote form (client-side hints) and /api/quote (the real check).
// The server always re-validates; never trust the client copy.

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug as string, label: s.title })),
  { value: "not-sure", label: "Not sure yet / something else" },
] as const;

const serviceValues = serviceOptions.map((o) => o.value) as [string, ...string[]];

export const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

/** Phone-based methods need a number we can actually reach. */
export const needsPhone = (method: string) => method === "phone" || method === "whatsapp";

// Loose international format: optional +, then 7–15 digits once spaces, dashes, dots and brackets are removed.
const phoneDigits = (v: string) => v.replace(/[\s\-().]/g, "");
const isPhone = (v: string) => /^\+?\d{7,15}$/.test(phoneDigits(v));

export const quoteSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(100, "Please keep your name under 100 characters."),
    email: z.string().trim().toLowerCase().max(200, "Email address is too long.").pipe(z.email("Please enter a valid email address.")),
    phone: z
      .string()
      .trim()
      .max(30, "Phone number is too long.")
      .refine((v) => v === "" || isPhone(v), "Please enter a valid phone number, e.g. 868 123 4567."),
    customerType: z.enum(["residential", "commercial"], { error: "Please choose residential or business." }),
    service: z.enum(serviceValues, { error: "Please choose a service." }),
    description: z
      .string()
      .trim()
      .min(20, "Please add a little more detail (at least 20 characters).")
      .max(3000, "Please keep project details under 3,000 characters."),
    preferredContact: z.enum(["email", "phone", "whatsapp"], { error: "Please choose how we should contact you." }),
    privacyAccepted: z.literal(true, { error: "Please confirm you have read how we use your details." }),
    source: z.enum(["quote-form", "contact-form"]).default("quote-form"),
    // Honeypot: real visitors never see or fill this field.
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (needsPhone(v.preferredContact) && v.phone === "") {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: `Please add a phone number so we can ${v.preferredContact === "whatsapp" ? "message you on WhatsApp" : "call you"}.`,
      });
    }
  });

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteData = z.output<typeof quoteSchema>;

/** Response body from POST /api/quote. */
export type QuoteResponse =
  | { ok: true; id: string }
  | { ok: false; code: "invalid"; fieldErrors: Partial<Record<keyof QuoteInput, string>> }
  | { ok: false; code: "unavailable" | "rate_limited" | "error"; message: string };

export const isServiceValue = (v: unknown): v is string => typeof v === "string" && serviceValues.includes(v);
