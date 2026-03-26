import type { RevenueBar, RevenueRange } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0 h-full">
      <CardHeader className="px-4 py-3.5 border-b-0 flex min-h-[56px] flex-row items-center justify-between">
        <CardTitle className="type-h3 text-[18px] k-text-strong">Revenue Snapshot</CardTitle>
        <select
          value={revenueRange}
          onChange={(e) => onRevenueRangeChange(e.target.value as RevenueRange)}
          className="type-small border-none k-surface-muted rounded-lg py-1 px-1.5 focus:ring-[var(--k-color-brand)] outline-none cursor-pointer"
        >
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </CardHeader>
      <CardContent className="flex h-full flex-col px-4 pb-4 pt-0">
      <div className="mb-2 flex items-center gap-3 type-label text-[8px] tracking-wide">
        <span className="inline-flex items-center gap-1 k-text-body"><span className="size-1.5 rounded-full bg-[var(--kyochi-gold-400)]" />Revenue</span>
        <span className="inline-flex items-center gap-1 k-text-subtle"><span className="size-1.5 rounded-full bg-[var(--kyochi-gold-200)]" />Forecast</span>
      </div>
      <div className="h-36 w-full flex items-end gap-1 px-1">
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
      <div className="mt-2.5 grid grid-cols-7 gap-1 px-1 type-label text-[8px] tracking-wide k-text-subtle">
        {revenueBars.map((bar) => (
          <span key={bar.day} className="text-center">
            {bar.day}
          </span>
        ))}
      </div>
      </CardContent>
    </Card>
  );
}
