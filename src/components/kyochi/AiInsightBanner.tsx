import { Sparkles } from "lucide-react";

type AiInsightBannerProps = {
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
};

export function AiInsightBanner({ title, body, primaryAction, secondaryAction }: AiInsightBannerProps) {
  return (
    <section className="k-ai-banner-bg rounded-xl p-8 k-ai-banner-text relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-4 k-brand" />
          <span className="type-label k-ai-banner-chip text-[11px]">
            Kyochi AI Insight
          </span>
        </div>
        <h3 className="type-h2 k-ai-banner-text mb-3">{title}</h3>
        <p className="type-body text-[15px] leading-relaxed k-ai-banner-muted mb-6">{body}</p>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-lg k-brand-bg k-primary-foreground type-small font-bold k-brand-bg-hover transition-colors">
            {primaryAction}
          </button>
          <button className="px-6 py-2.5 rounded-lg k-ai-banner-secondary type-small font-bold transition-colors">
            {secondaryAction}
          </button>
        </div>
      </div>
      <div className="absolute -right-20 -top-20 size-80 k-ai-banner-orb-1 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute right-20 bottom-10 size-40 k-ai-banner-orb-2 blur-[60px] rounded-full pointer-events-none" />
    </section>
  );
}
