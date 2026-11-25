"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle2, Loader2, Mail, MessageCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { getService } from "@/lib/services";
import {
  contactMethods,
  needsPhone,
  quoteSchema,
  serviceOptions,
  type QuoteData,
  type QuoteInput,
  type QuoteResponse,
} from "@/lib/quote-schema";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string; unavailable?: boolean };

interface Props {
  defaultService?: string;
  source?: "quote-form" | "contact-form";
  /** False when the server has no Firestore connection; the form then points to WhatsApp/email instead. */
  submissionsEnabled: boolean;
  /** Pre-filled project details, e.g. a plan carried over from the package planner. */
  defaultDescription?: string;
  /** Show the live progress / selected-service strip at the top of the form. */
  showProgress?: boolean;
}

const inputCls =
  "block w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-ink shadow-[inset_0_1px_2px_rgb(2_29_82/0.04)] transition-colors placeholder:text-ink-soft/60 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15";

export function QuoteForm({ defaultService = "", source = "quote-form", submissionsEnabled, defaultDescription = "", showProgress = false }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const successRef = useRef<HTMLHeadingElement>(null);
  const formId = useId();
  const focusFirstError = () =>
    requestAnimationFrame(() =>
      document
        .getElementById(formId)
        ?.querySelector<HTMLElement>('[aria-invalid="true"], fieldset[data-invalid] input')
        ?.focus(),
    );
  const alertRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<QuoteInput, unknown, QuoteData>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    // Focus is moved manually so it always lands on the first invalid field in page order.
    shouldFocusError: false,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      customerType: undefined,
      service: defaultService,
      description: defaultDescription,
      preferredContact: "email",
      privacyAccepted: undefined,
      source,
      website: "",
    },
  });

  const method = useWatch({ control, name: "preferredContact" });
  const description = useWatch({ control, name: "description" }) ?? "";
  const phoneRequired = needsPhone(method);
  const [wName, wEmail, wPhone, wType, wService, wPrivacy] = useWatch({
    control,
    name: ["name", "email", "phone", "customerType", "service", "privacyAccepted"],
  });
  const checks = [
    (wName ?? "").trim().length >= 2,
    /\S+@\S+\.\S+/.test(wEmail ?? ""),
    !phoneRequired || (wPhone ?? "").trim().length >= 7,
    Boolean(wType),
    Boolean(wService),
    description.trim().length >= 20,
    wPrivacy === true,
  ];
  const done = checks.filter(Boolean).length;
  const chosen = getService(wService ?? "");

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
    if (status.kind === "error") alertRef.current?.focus();
  }, [status]);

  const onSubmit = async (data: QuoteData) => {
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => null)) as QuoteResponse | null;

      if (res.ok && body?.ok) {
        setStatus({ kind: "success" });
        reset();
        return;
      }
      if (body && !body.ok && body.code === "invalid") {
        for (const [field, message] of Object.entries(body.fieldErrors)) {
          setError(field as keyof QuoteInput, { type: "server", message });
        }
        setStatus({ kind: "error", message: "Please check the highlighted fields and try again." });
        focusFirstError();
        return;
      }
      setStatus({
        kind: "error",
        unavailable: body?.ok === false && body.code === "unavailable",
        message: body && !body.ok && "message" in body ? body.message : "We couldn't send your enquiry just now. Please try again or contact us directly.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "We couldn't reach our server. Check your connection and try again, or contact us directly.",
      });
    }
  };

  if (status.kind === "success") {
    return (
      <div className="card p-8 sm:p-10" role="status">
        <span className="grid size-14 place-items-center rounded-2xl bg-success/10 text-success">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="mt-6 text-2xl font-bold focus:outline-none sm:text-3xl">
          Thank you, your enquiry has been received.
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink-soft">
          We&apos;ve saved your details and will be in touch using your preferred contact method. If it&apos;s urgent,
          you can also reach us on WhatsApp.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-display font-semibold text-white hover:bg-blue-600">
            <MessageCircle className="size-4" aria-hidden /> WhatsApp us
          </a>
          <button
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
            className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-display font-semibold text-navy-900 ring-1 ring-line hover:text-blue-600 hover:ring-blue-300"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit, () => focusFirstError())} noValidate className="card relative p-6 sm:p-10" aria-busy={submitting}>
      {!submissionsEnabled && (
        <FallbackNotice className="mb-8" title="Online enquiries aren't switched on yet">
          This form isn&apos;t connected to our system yet, so it can&apos;t send. Please contact us directly. We&apos;ll
          reply as soon as we can.
        </FallbackNotice>
      )}

      {showProgress && (
        <div className="mb-8 rounded-2xl bg-mist p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.span
                key={wService || "none"}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn("grid size-11 place-items-center rounded-xl", chosen ? "bg-blue-500 text-white" : "bg-white text-ink-soft ring-1 ring-line")}
              >
                {chosen ? <ServiceIcon name={chosen.icon} className="size-5" /> : <Send className="size-5" aria-hidden />}
              </motion.span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Your request</p>
                <p className="font-display font-bold text-navy-900">
                  {chosen ? chosen.title : wService === "not-sure" ? "Not sure yet: we'll help you choose" : "Choose a service below"}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-navy-900" aria-live="polite">
              {done === checks.length ? "Ready to send" : `${done} of ${checks.length} details`}
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white" aria-hidden>
            <motion.div className={cn("h-full rounded-full", done === checks.length ? "bg-success" : "bg-blue-500")} animate={{ width: `${(done / checks.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" error={errors.name} required>
          {(p) => <input {...p} {...register("name")} type="text" autoComplete="name" className={inputCls} />}
        </Field>
        <Field label="Email address" error={errors.email} required>
          {(p) => <input {...p} {...register("email")} type="email" autoComplete="email" inputMode="email" className={inputCls} />}
        </Field>
      </div>

      <fieldset className="mt-8" data-invalid={errors.preferredContact ? "" : undefined}>
        <legend className="font-display text-sm font-semibold text-navy-900">
          How should we contact you? <span className="text-danger" aria-hidden>*</span>
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {contactMethods.map((m) => (
            <label key={m.value} className="relative">
              <input {...register("preferredContact")} type="radio" value={m.value} className="peer sr-only" />
              <span className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-line px-3 text-center text-sm font-semibold text-ink-soft transition-colors hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100">
                {m.label}
              </span>
            </label>
          ))}
        </div>
        <FieldErrorText error={errors.preferredContact} id="preferredContact-error" />
      </fieldset>

      <div className="mt-6">
        <Field
          label="Phone number"
          error={errors.phone}
          required={phoneRequired}
          hint={phoneRequired ? `Required so we can ${method === "whatsapp" ? "message you on WhatsApp" : "call you"}.` : "Optional."}
        >
          {(p) => <input {...p} {...register("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="e.g. 868 123 4567" className={inputCls} />}
        </Field>
      </div>

      <fieldset className="mt-8" data-invalid={errors.customerType ? "" : undefined}>
        <legend className="font-display text-sm font-semibold text-navy-900">
          Is this for your home or a business? <span className="text-danger" aria-hidden>*</span>
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { value: "residential", label: "Home / residential" },
            { value: "commercial", label: "Business" },
          ].map((o) => (
            <label key={o.value}>
              <input
                {...register("customerType")}
                type="radio"
                value={o.value}
                className="peer sr-only"
                aria-describedby={errors.customerType ? "customerType-error" : undefined}
              />
              <span className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-line px-3 text-center text-sm font-semibold text-ink-soft transition-colors hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100">
                {o.label}
              </span>
            </label>
          ))}
        </div>
        <FieldErrorText error={errors.customerType} id="customerType-error" />
      </fieldset>

      <div className="mt-8">
        <Field label="Which service do you need?" error={errors.service} required>
          {(p) => (
            <select {...p} {...register("service")} className={cn(inputCls, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%234a4f5a%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12")}>
              <option value="" disabled>Choose a service…</option>
              {serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
        </Field>
      </div>

      <div className="mt-6">
        <Field
          label="Project details"
          error={errors.description}
          required
          hint={`Tell us what's happening, where, and anything you've already tried. ${description.length}/3000`}
        >
          {(p) => <textarea {...p} {...register("description")} rows={6} className={cn(inputCls, "resize-y")} />}
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden>
        <label>
          Website
          <input {...register("website")} type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-8">
        <label className="flex items-start gap-3">
          <input
            {...register("privacyAccepted")}
            type="checkbox"
            aria-invalid={errors.privacyAccepted ? true : undefined}
            aria-describedby={errors.privacyAccepted ? "privacyAccepted-error" : undefined}
            className="mt-0.5 size-5 shrink-0 rounded border-line accent-blue-500"
          />
          <span className="text-sm leading-relaxed text-ink-soft">
            I understand RS Technology Group will use these details only to respond to my enquiry, as described in the{" "}
            <Link href="/privacy" target="_blank" className="font-semibold text-blue-600 underline underline-offset-2">
              privacy notice
            </Link>
            . <span className="text-danger" aria-hidden>*</span>
          </span>
        </label>
        <FieldErrorText error={errors.privacyAccepted} id="privacyAccepted-error" />
      </div>

      {status.kind === "error" && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="mt-8 focus:outline-none">
          <FallbackNotice title={status.unavailable ? "Online enquiries aren't available right now" : "Your enquiry wasn't sent"}>
            {status.message} Your details are still in the form.
          </FallbackNotice>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft"><span className="text-danger" aria-hidden>*</span> Required</p>
        <button
          type="submit"
          disabled={submitting || !submissionsEnabled}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-500 px-7 font-display font-semibold text-white shadow-[0_10px_30px_-10px_rgb(22_113_217/0.7)] transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-ink-soft/40 disabled:shadow-none"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{submitting ? "Sending your enquiry" : ""}</p>
    </form>
  );
}

interface FieldRenderProps {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: FieldError;
  required?: boolean;
  hint?: string;
  children: (p: FieldRenderProps) => ReactNode;
}) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="font-display text-sm font-semibold text-navy-900">
        {label} {required && <span className="text-danger" aria-hidden>*</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">{hint}</p>}
      <div className="mt-2">
        {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": required || undefined })}
      </div>
      <FieldErrorText error={error} id={`${id}-error`} />
    </div>
  );
}

function FieldErrorText({ error, id }: { error?: FieldError; id: string }) {
  if (!error?.message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {error.message}
    </p>
  );
}

function FallbackNotice({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-warning/40 bg-warning/10 p-5", className)}>
      <p className="flex items-center gap-2 font-display font-semibold text-navy-900">
        <AlertTriangle className="size-5 text-warning" aria-hidden /> {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{children}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-700">
          <MessageCircle className="size-4" aria-hidden /> WhatsApp {site.phoneDisplay}
        </a>
        <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-navy-900 ring-1 ring-line hover:text-blue-600">
          <Mail className="size-4" aria-hidden /> Email us
        </a>
      </div>
    </div>
  );
}
