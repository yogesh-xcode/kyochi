import type { KpiCard } from "@/components/kyochi/types/index";
import { MSO } from "@/components/kyochi/primitives";

type KpiGridProps = {
  cards: KpiCard[];
};

export function KpiGrid({ cards }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-6 bg-white rounded-xl shadow-sm border-b-4 border-[#d4af35]/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#d4af35]/10 rounded-lg text-[#d4af35]">
              <MSO>{card.icon}</MSO>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.deltaColor}`}>
              {card.delta}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">{card.label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}
