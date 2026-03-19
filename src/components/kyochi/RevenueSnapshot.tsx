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
    <section className="k-surface p-4 rounded-xl shadow-sm border k-border-soft">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold k-text-strong">Revenue Snapshot</h4>
        <select
          value={revenueRange}
          onChange={(e) => onRevenueRangeChange(e.target.value as RevenueRange)}
          className="text-[10px] border-none k-surface-muted rounded-lg py-1 px-1.5 focus:ring-[var(--k-color-brand)] outline-none cursor-pointer"
        >
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      <div className="h-40 w-full flex items-end gap-1 px-1">
        {revenueBars.map((bar, i) => (
          <div
            key={bar.day}
            className="flex-1 rounded-t-lg k-brand-bg transition-all duration-500 cursor-pointer hover:brightness-110"
            style={{
              height: `${bar.pct}%`,
              opacity: 0.3 + (i / revenueBars.length) * 0.7,
            }}
            title={bar.label}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 px-1 text-[8px] k-text-subtle font-bold uppercase">
        {revenueBars.map((bar) => (
          <span key={bar.day} className="text-center">
            {bar.day}
          </span>
        ))}
      </div>
    </section>
  );
}
