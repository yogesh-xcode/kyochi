import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PatientInflowProps = {
  labels: string[];
  points: number[];
  todayCount: number;
};

export function PatientInflow({ labels, points, todayCount }: PatientInflowProps) {
  const safePoints = points.length > 0 ? points : [10, 10, 10, 10];
  const safeLabels = labels.length > 0 ? labels : ["08:00", "12:00", "16:00", "20:00"];
  const maxValue = Math.max(...safePoints, 1);

  const chartWidth = 300;
  const topY = 20;
  const bottomY = 110;
  const graphHeight = bottomY - topY;
  const stepX = safePoints.length > 1 ? chartWidth / (safePoints.length - 1) : chartWidth;

  const coords = safePoints.map((point, index) => {
    const x = Math.round(index * stepX);
    const y = Math.round(bottomY - (point / maxValue) * graphHeight);
    return { x, y };
  });

  const linePath = coords.reduce((path, point, index) => {
    if (index === 0) {
      return `M${point.x},${point.y}`;
    }
    const prev = coords[index - 1];
    const midX = Math.round((prev.x + point.x) / 2);
    return `${path} C${midX},${prev.y} ${midX},${point.y} ${point.x},${point.y}`;
  }, "");

  const areaPath = `${linePath} L${chartWidth},${bottomY} L0,${bottomY} Z`;

  return (
    <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0 h-full">
      <CardHeader className="px-4 py-3.5 border-b k-border-soft flex min-h-[56px] flex-row items-center justify-between">
        <CardTitle className="type-h3 text-[18px] k-text-strong">Patient Inflow</CardTitle>
        <span className="type-small k-brand font-bold">Today: +{todayCount}</span>
      </CardHeader>
      <CardContent className="flex h-full flex-col px-4 pb-3 pt-2">
        <div className="relative h-38 w-full">
          <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} 130`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="patient-inflow-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8993a" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#c8993a" stopOpacity="0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#ede8dc" strokeWidth="0.5" />
            <line x1="0" y1="55" x2={chartWidth} y2="55" stroke="#ede8dc" strokeWidth="0.5" />
            <line x1="0" y1="90" x2={chartWidth} y2="90" stroke="#ede8dc" strokeWidth="0.5" />

            <path d={areaPath} fill="url(#patient-inflow-fill)" />
            <path d={linePath} fill="none" stroke="#c8993a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {coords.map((coord, index) => (
              <circle key={`${coord.x}-${coord.y}-${index}`} cx={coord.x} cy={coord.y} r="2.8" fill="#c8993a" />
            ))}

            {safeLabels.map((label, index) => (
              <text
                key={label}
                x={Math.round(index * stepX)}
                y="125"
                fontSize="9"
                fill="#a09080"
                textAnchor={index === 0 ? "start" : index === safeLabels.length - 1 ? "end" : "middle"}
              >
                {label}
              </text>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
