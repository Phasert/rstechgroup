import { FileClock } from "lucide-react";

/** Shown on legal pages whose final wording is still with the owner for review. */
export function DraftNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-warning/40 bg-warning/10 p-5">
      <FileClock className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
      <p className="text-sm leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}
