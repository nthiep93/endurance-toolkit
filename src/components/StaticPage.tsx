import type { ReactNode } from "react";

export function StaticPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="prose-guide mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">{title}</h1>
      {children}
    </article>
  );
}
