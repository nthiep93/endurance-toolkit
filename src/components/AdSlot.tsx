/**
 * Placeholder for monetization slots. Renders nothing until NEXT_PUBLIC_ADS_ENABLED=1,
 * so the site launches clean (better UX + AdSense approval needs real content first).
 * - variant "sponsor": a single fixed sponsor card (sold directly, see /sponsor)
 * - variant "display": reserved space for a display ad unit (prevents layout shift)
 */
export function AdSlot({ variant = "display", id }: { variant?: "display" | "sponsor"; id: string }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "1") return null;
  if (variant === "sponsor") {
    return (
      <aside
        aria-label="Sponsor"
        data-slot={id}
        className="no-print rounded-xl border border-dashed border-line bg-surface-2 p-4 text-sm text-muted"
      >
        <span className="font-semibold text-fg">Your brand here.</span> Reach runners while they plan races.{" "}
        <a className="text-brand underline" href="/sponsor">
          Sponsor this tool
        </a>
      </aside>
    );
  }
  return <div data-slot={id} className="no-print min-h-[100px] rounded-xl bg-surface-2" aria-hidden />;
}
