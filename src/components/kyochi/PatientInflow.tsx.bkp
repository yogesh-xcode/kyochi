type PatientInflowProps = {
  labels: string[];
  points: number[];
  todayCount: number;
};

export function PatientInflow({ labels, points, todayCount }: PatientInflowProps) {
  const safePoints = points.length > 0 ? points : [10, 10, 10, 10];
  const maxValue = Math.max(...safePoints, 1);
  const stepX = safePoints.length > 1 ? 100 / (safePoints.length - 1) : 100;

  const linePoints = safePoints
    .map((point, index) => {
      const x = Math.round(index * stepX);
      const y = Math.round(45 - (point / maxValue) * 35);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${linePoints} 100,50 0,50`;

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-900">Patient Inflow</h4>
        <span className="text-xs text-[#d4af35] font-bold">Today: +{todayCount}</span>
      </div>
      <div className="relative h-48 w-full">
        <svg
          className="w-full h-full text-[#d4af35]"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points={areaPoints} fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>
      <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}
