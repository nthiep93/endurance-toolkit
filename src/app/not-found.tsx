import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">Wrong turn on the course</h1>
      <p className="mt-3 text-muted">That page doesn&apos;t exist. The finish line is this way:</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-brand-fg">
        All calculators
      </Link>
    </div>
  );
}
