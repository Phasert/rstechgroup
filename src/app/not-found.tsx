import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-rs flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="display-2 mt-4">This page isn&apos;t connected.</h1>
      <p className="lead mt-4 max-w-xl">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/contact" variant="secondary">Contact us</Button>
      </div>
    </section>
  );
}
