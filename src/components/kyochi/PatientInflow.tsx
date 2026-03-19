import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PatientInflowProps = {
  labels: string[];
  points: number[];
  todayCount: number;
};

export function PatientInflow({ labels, points, todayCount }: PatientInflowProps) {
  const safePoints = points.length > 0 ? points : [10, 10, 10, 10];
  const maxValue = Math.max(...safePoints, 1);
  const stepX = safePoints.length > 1 ? 96 / (safePoints.length - 1) : 96;
  const isTrendingDown = safePoints[safePoints.length - 1] < safePoints[0];
  const trendLineColor = isTrendingDown ? "#ef4444" : "#22c55e";
  const trendFillColor = isTrendingDown ? "#fee2e2" : "#dcfce7";

  const linePoints = safePoints
    .map((point, index) => {
      const x = Math.round(2 + index * stepX);
      const y = Math.round(45 - (point / maxValue) * 35);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${linePoints} 98,50 2,50`;

  return (
    <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0">
      <CardHeader className="px-4 py-4 border-b-0 flex flex-row items-center justify-between">
        <CardTitle className="type-h3 text-[18px] k-text-strong">Patient Inflow</CardTitle>
        <span className="type-small k-brand font-bold">Today: +{todayCount}</span>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
      <div className="relative h-40 w-full">
        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          <polyline points={linePoints} fill="none" stroke={trendLineColor} strokeWidth="2" />
          <polygon points={areaPoints} fill={trendFillColor} fillOpacity="0.6" />
        </svg>
      </div>
      <div
        className="mt-3 type-label text-[8px] tracking-wide k-text-subtle grid gap-1 px-1"
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label) => (
          <span key={label} className="text-center">
            {label}
          </span>
        ))}
      </div>
      </CardContent>
    </Card>
  );
}
