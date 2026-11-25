import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";
import { TOOLS } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Sponsor a calculator",
  description: `Reach runners while they plan training and races. Sponsor a tool on ${SITE.name}.`,
  alternates: { canonical: "/sponsor" },
};

export default function Sponsor() {
  return (
    <StaticPage title="Sponsor a calculator">
      <p>
        Runners open these tools at high-intent moments: setting a goal time, planning race-day pacing and
        fueling, choosing training zones. A sponsorship gives your brand one clean, non-intrusive card directly
        below a calculator — no pop-ups, no tracking pixels.
      </p>
      <h2>Good fit for</h2>
      <ul>
        <li>Race organizers and running events</li>
        <li>Running shoes, GPS watches, heart rate straps</li>
        <li>Sports nutrition (gels, drink mixes, electrolytes)</li>
        <li>Coaching services and training apps</li>
      </ul>
      <h2>Available placements</h2>
      <ul>
        {TOOLS.map((t) => (
          <li key={t.slug}>{t.name}</li>
        ))}
      </ul>
      <p>Monthly, per tool or site-wide. Get in touch to receive current traffic numbers and pricing.</p>
    </StaticPage>
  );
}
