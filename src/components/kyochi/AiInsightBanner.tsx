import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <Button variant="secondary" className="h-10 px-6">
            {primaryAction}
          </Button>
          <Button variant="outline" className="h-10 px-6">
            {secondaryAction}
          </Button>
        </div>
      </div>
      <div className="absolute -right-20 -top-20 size-80 k-ai-banner-orb-1 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute right-20 bottom-10 size-40 k-ai-banner-orb-2 blur-[60px] rounded-full pointer-events-none" />
    </section>
  );
}
