export function PatientInflow() {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-900">Patient Inflow</h4>
        <span className="text-xs text-[#d4af35] font-bold">Today: +12</span>
      </div>
      <div className="relative h-48 w-full">
        <svg
          className="w-full h-full text-[#d4af35]"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 45 Q 10 35, 20 40 T 40 20 T 60 30 T 80 10 T 100 25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M0 45 Q 10 35, 20 40 T 40 20 T 60 30 T 80 10 T 100 25 V 50 H 0 Z"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </svg>
      </div>
      <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase">
        <span>08:00</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>20:00</span>
      </div>
    </section>
  );
}
