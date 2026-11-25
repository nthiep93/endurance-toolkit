import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";
import { CATEGORIES, TOOLS } from "@/lib/registry";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

function Header() {
  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-brand text-brand-fg text-sm">
            ET
          </span>
          <span>{SITE.name}</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm text-muted">
          <Link href="/#tools" className="hover:text-fg">
            Tools
          </Link>
          <Link href="/about" className="hover:text-fg">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="font-semibold">{SITE.name}</p>
          <p className="mt-2 text-sm text-muted">
            {SITE.tagline}. Calculations run in your browser — nothing you type is sent to a server.
          </p>
        </div>
        {(Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).map((c) => (
          <div key={c}>
            <p className="text-sm font-semibold">{CATEGORIES[c].label}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {TOOLS.filter((t) => t.category === c).map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="hover:text-fg">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 pb-8 text-xs text-muted">
        <span>© {SITE.lastUpdated.slice(0, 4)} {SITE.name}</span>
        <Link href="/about" className="hover:text-fg">About</Link>
        <Link href="/privacy" className="hover:text-fg">Privacy</Link>
        <Link href="/sponsor" className="hover:text-fg">Sponsor</Link>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
