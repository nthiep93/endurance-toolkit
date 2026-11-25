export const SITE = {
  name: "Endurance Toolkit",
  shortName: "EnduranceKit",
  tagline: "Free, fast, no-login calculators for runners",
  description:
    "Free running calculators: pace, race time predictor, VDOT training paces, heart rate zones, marathon splits and fueling. Instant, private, no signup.",
  // TODO: replace with the production domain before launch
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://endurance-toolkit.vercel.app",
  locale: "en_US",
  /** bump when content changes; used by sitemap + footer (no Date() during prerender) */
  lastUpdated: "2026-11-25",
} as const;
