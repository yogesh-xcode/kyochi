import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="k-surface rounded-xl border k-border-soft shadow-sm h-full py-0 ring-0">
      <CardContent className="p-4 h-full flex flex-col">
      <Badge variant="outline" className="inline-flex h-auto w-fit items-center gap-1 border-transparent px-2 py-1 rounded-full k-brand-soft-bg k-brand-strong type-label text-[9px] mb-3">
        <Sparkles className="size-3.5" />
        Clinical Insight
      </Badge>
      <h4 className="type-h3 text-[18px] k-text-strong mb-2">{title}</h4>
      <p className="type-body text-[14px] leading-relaxed k-text-body mb-3.5">{body}</p>
      <div className="flex flex-col sm:flex-row xl:flex-col gap-1.5 mt-auto">
        <Button className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl bg-[var(--kyochi-gold-500)] text-[var(--kyochi-cream-100)] type-small font-bold hover:bg-[var(--kyochi-gold-600)] transition-colors h-auto">
          {primaryAction}
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl k-surface-muted k-text-body type-small font-bold k-brand-soft-bg-hover transition-colors h-auto border border-transparent">
          {secondaryAction}
        </Button>
      </div>
      </CardContent>
    </Card>
  );
}
