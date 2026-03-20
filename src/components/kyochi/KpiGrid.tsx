import type { KpiCard } from "@/types";
import { KIcon } from "@/components/kyochi/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type KpiGridProps = {
  cards: KpiCard[];
};

export function KpiGrid({ cards }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0"
        >
          <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 k-brand-soft-bg rounded-md k-brand">
              <KIcon name={card.icon} className="size-4" />
            </div>
            <Badge variant="outline" className={`h-auto border-transparent type-label normal-case tracking-normal px-2 py-0.5 rounded-full ${card.deltaColor}`}>
              {card.delta}
            </Badge>
          </div>
          <p className="type-small k-text-body">{card.label}</p>
          <h3 className="type-h3 k-text-strong mt-1">{card.value}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
