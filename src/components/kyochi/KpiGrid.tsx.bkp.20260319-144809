import type { KpiCard } from "@/types";
import { KIcon } from "@/components/kyochi/icons";

type KpiGridProps = {
  cards: KpiCard[];
};

export function KpiGrid({ cards }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-4 k-surface rounded-xl shadow-sm border-b-4 k-brand-border-soft"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 k-brand-soft-bg rounded-lg k-brand">
              <KIcon name={card.icon} className="size-4" />
            </div>
            <span className={`type-label normal-case tracking-normal px-2 py-0.5 rounded-full ${card.deltaColor}`}>
              {card.delta}
            </span>
          </div>
          <p className="type-small k-text-body">{card.label}</p>
          <h3 className="type-h3 k-text-strong mt-1">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}
