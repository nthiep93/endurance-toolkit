export const SITE = {
  name: "Endurance Toolkit",
  shortName: "EnduranceKit",
  tagline: "Free, fast, no-login calculators for runners",
  description:
    "Free running calculators that work instantly in your browser: pace, race time prediction, VDOT training paces, heart rate zones, marathon splits and race fueling. No signup, no tracking of your inputs.",
  // TODO: replace with the production domain before launch
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://endurance-toolkit.vercel.app",
  locale: "en_US",
  /** bump when content changes; used by sitemap + footer (no Date() during prerender) */
  lastUpdated: "2026-11-25",
} as const;
