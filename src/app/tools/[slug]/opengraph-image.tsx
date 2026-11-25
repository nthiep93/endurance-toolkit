import { ogCard, ogSize } from "@/components/og";
import { TOOLS, getTool } from "@/lib/registry";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Endurance Toolkit calculator";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  return ogCard(tool?.name ?? "Running calculator", tool?.summary ?? "Free · No login · Private");
}
