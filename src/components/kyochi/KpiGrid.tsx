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
          className="k-surface rounded-xl shadow-sm border k-border-soft border-l-[3px] border-l-[var(--kyochi-gold-500)] py-0 ring-0"
        >
          <CardContent className="px-5 py-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="size-8 k-brand-soft-bg rounded-lg flex items-center justify-center k-brand">
              <KIcon name={card.icon} className="size-4.5" />
            </div>
            <Badge variant="outline" className={`h-auto border-transparent px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-normal normal-case ${card.deltaColor}`}>
              {card.delta}
            </Badge>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.07em] k-text-subtle">{card.label}</p>
          <h3 className="text-[26px] leading-[1.15] font-semibold k-text-strong mt-1">{card.value}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
