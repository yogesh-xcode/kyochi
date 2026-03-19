import type { RevenueBar, RevenueRange } from "@/types";

type RevenueSnapshotProps = {
  revenueBars: RevenueBar[];
  revenueRange: RevenueRange;
  onRevenueRangeChange: (range: RevenueRange) => void;
};

export function RevenueSnapshot({
  revenueBars,
  revenueRange,
  onRevenueRangeChange,
}: RevenueSnapshotProps) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-900">Revenue Snapshot</h4>
        <select
          value={revenueRange}
          onChange={(e) => onRevenueRangeChange(e.target.value as RevenueRange)}
          className="text-xs border-none bg-[#f3f0e6] rounded-lg py-1 px-2 focus:ring-[#d4af35] outline-none cursor-pointer"
        >
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      <div className="h-48 w-full flex items-end gap-2 px-2">
        {revenueBars.map((bar, i) => (
          <div
            key={bar.day}
            className="flex-1 rounded-t-lg bg-[#d4af35] transition-all duration-500 cursor-pointer hover:brightness-110"
            style={{
              height: `${bar.pct}%`,
              opacity: 0.3 + (i / revenueBars.length) * 0.7,
            }}
            title={bar.label}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase">
        {revenueBars.map((bar) => (
          <span key={bar.day}>{bar.day}</span>
        ))}
      </div>
    </section>
  );
}
