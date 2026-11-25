import { ogCard, ogSize } from "@/components/og";
import { SITE } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = SITE.name;

export default function Image() {
  return ogCard("Running calculators that just work.", "Pace · Race predictor · VDOT · HR zones · Splits · Fueling");
}
