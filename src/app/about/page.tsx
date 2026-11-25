import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${SITE.name} exists and how the calculators work.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <StaticPage title={`About ${SITE.name}`}>
      <p>
        {SITE.name} is a small, independent set of running calculators built by a software developer who is
        training for a marathon. Most pace tools online are slow, covered in pop-ups or ask you to sign up. These
        don&apos;t: every calculator loads fast, works on a phone at the start line, and runs entirely in your
        browser.
      </p>
      <h2>How the numbers are calculated</h2>
      <p>
        We use well-documented, published methods: the Riegel endurance formula for race predictions, the
        Daniels–Gilbert oxygen-cost equations behind VDOT, the Karvonen heart-rate-reserve method for training
        zones, and common sports-nutrition ranges for fueling. Each tool page explains its method, its limits and
        how to use the result in training.
      </p>
      <h2>Not medical advice</h2>
      <p>
        The calculators give estimates for healthy recreational and competitive runners. They are not a substitute
        for advice from a doctor, a sports dietitian or a qualified coach.
      </p>
    </StaticPage>
  );
}
