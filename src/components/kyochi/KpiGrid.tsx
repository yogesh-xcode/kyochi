import type { KpiCard } from "@/types";
import { MSO } from "@/components/kyochi/primitives";

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
              <MSO>{card.icon}</MSO>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.deltaColor}`}>
              {card.delta}
            </span>
          </div>
          <p className="k-text-body text-[12px] font-medium">{card.label}</p>
          <h3 className="text-[20px] font-bold k-text-strong mt-1">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}
