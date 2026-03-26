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
        <Badge
          variant="outline"
          className="mb-3 inline-flex h-auto w-fit items-center gap-1 rounded-full border-transparent px-2 py-1 type-label text-[9px] k-brand-soft-bg k-brand-strong"
        >
          <Sparkles className="size-3.5" />
          Clinical Insight
        </Badge>
        <h4 className="type-h3 text-[18px] leading-tight k-text-strong mb-2">{title}</h4>
        <p className="type-body text-[14px] leading-relaxed k-text-body mb-4 line-clamp-5">{body}</p>
        <div className="mt-auto flex flex-col gap-2">
          <Button className="w-full">{primaryAction}</Button>
          <Button variant="outline" className="w-full">
            {secondaryAction}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
