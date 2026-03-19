import { Sparkles } from "lucide-react";

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
    <section className="k-surface rounded-xl border k-border-soft shadow-sm p-4 h-full flex flex-col">
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full k-brand-soft-bg k-brand-strong type-label text-[9px] mb-3">
        <Sparkles className="size-3.5" />
        Clinical Insight
      </div>
      <h4 className="type-h3 text-[18px] k-text-strong mb-2">{title}</h4>
      <p className="type-body text-[14px] leading-relaxed k-text-body mb-3.5">{body}</p>
      <div className="flex flex-col sm:flex-row xl:flex-col gap-1.5 mt-auto">
        <button className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl k-brand-bg k-primary-foreground type-small font-bold k-brand-bg-hover transition-colors">
          {primaryAction}
        </button>
        <button className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl k-surface-muted k-text-body type-small font-bold k-brand-soft-bg-hover transition-colors">
          {secondaryAction}
        </button>
      </div>
    </section>
  );
}
