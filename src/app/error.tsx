"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-rs flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow text-danger">Something went wrong</p>
      <h1 className="display-2 mt-4">We hit an unexpected problem.</h1>
      <p className="lead mt-4 max-w-xl">Please try again. If it keeps happening, contact us directly.</p>
      <button onClick={reset} className="mt-8 min-h-12 rounded-full bg-blue-500 px-6 font-display font-semibold text-white hover:bg-blue-600">
        Try again
      </button>
    </section>
  );
}
