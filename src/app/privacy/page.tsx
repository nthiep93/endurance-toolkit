import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `Privacy policy for ${SITE.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <StaticPage title="Privacy policy">
      <p>Last updated: 25 November 2026.</p>
      <h2>What you type stays in your browser</h2>
      <p>
        All calculations run locally in your browser. The times, distances, heart rates and other values you enter
        are not sent to or stored on our servers.
      </p>
      <h2>Analytics</h2>
      <p>
        We may use privacy-friendly, aggregate analytics (page views, country, device type) to understand which
        tools are useful. These do not identify you personally.
      </p>
      <h2>Advertising and affiliate links</h2>
      <p>
        To keep the tools free we may show advertising and include affiliate links to running products. Third-party
        ad vendors, including Google, may use cookies to serve ads based on your prior visits to this and other
        websites. You can opt out of personalized advertising in Google&apos;s Ads Settings. When ads are enabled in
        regions that require it, we will ask for your consent first.
      </p>
      <h2>Contact</h2>
      <p>Questions about this policy can be sent via the contact details on the About page.</p>
    </StaticPage>
  );
}
