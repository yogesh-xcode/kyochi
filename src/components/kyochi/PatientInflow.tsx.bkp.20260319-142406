type PatientInflowProps = {
  labels: string[];
  points: number[];
  todayCount: number;
};

export function PatientInflow({ labels, points, todayCount }: PatientInflowProps) {
  const safePoints = points.length > 0 ? points : [10, 10, 10, 10];
  const maxValue = Math.max(...safePoints, 1);
  const stepX = safePoints.length > 1 ? 96 / (safePoints.length - 1) : 96;

  const linePoints = safePoints
    .map((point, index) => {
      const x = Math.round(2 + index * stepX);
      const y = Math.round(45 - (point / maxValue) * 35);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${linePoints} 98,50 2,50`;

  return (
    <section className="k-surface p-4 rounded-xl shadow-sm border k-border-soft">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold k-text-strong">Patient Inflow</h4>
        <span className="text-[10px] k-brand font-bold">Today: +{todayCount}</span>
      </div>
      <div className="relative h-40 w-full">
        <svg
          className="w-full h-full k-brand"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points={areaPoints} fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>
      <div
        className="mt-3 text-[8px] k-text-subtle font-bold uppercase grid gap-1 px-1"
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label) => (
          <span key={label} className="text-center">
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
