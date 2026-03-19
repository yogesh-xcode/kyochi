import { MSO } from "@/components/kyochi/primitives";

type InsightRecommendationCardProps = {
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
};

export function InsightRecommendationCard({
  title,
  body,
  primaryAction,
  secondaryAction,
}: InsightRecommendationCardProps) {
  return (
    <section className="k-surface rounded-xl border k-border-soft shadow-sm p-4">
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--k-brand-soft))] k-brand-strong text-[9px] font-bold uppercase tracking-wide mb-3">
        <MSO className="text-[13px]">auto_awesome</MSO>
        Clinical Insight
      </div>
      <h4 className="text-[16px] font-bold leading-tight k-text-strong mb-2">{title}</h4>
      <p className="text-[13px] leading-relaxed k-text-body mb-3.5">{body}</p>
      <div className="flex flex-col sm:flex-row xl:flex-col gap-1.5">
        <button className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl bg-[hsl(var(--k-brand))] text-[hsl(var(--primary-foreground))] text-[12px] font-bold hover:bg-[hsl(var(--k-brand)/0.88)] transition-colors">
          {primaryAction}
        </button>
        <button className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl k-surface-muted k-text-body text-[12px] font-bold hover:bg-[hsl(var(--k-brand-soft))] transition-colors">
          {secondaryAction}
        </button>
      </div>
    </section>
  );
}
