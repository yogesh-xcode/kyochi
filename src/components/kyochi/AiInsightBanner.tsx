import { MSO } from "@/components/kyochi/primitives";

export function AiInsightBanner() {
  return (
    <section className="bg-linear-to-r from-[#201d12] to-slate-800 rounded-xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <MSO className="text-[#d4af35]">auto_awesome</MSO>
          <span className="text-xs font-bold tracking-widest uppercase text-[#d4af35]/80">
            Kyochi AI Insight
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-3">Resource Allocation Optimization</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Based on last month&apos;s performance, Kyochi AI suggests increasing therapist
          availability on Thursday afternoons between 2 PM and 5 PM. This could reduce wait times
          by up to 22%.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 bg-[#d4af35] text-[#201d12] font-bold text-sm rounded-lg hover:brightness-110 transition-all">
            Apply Recommendation
          </button>
          <button className="px-6 py-2.5 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-all">
            View Full Analysis
          </button>
        </div>
      </div>
      <div className="absolute -right-20 -top-20 size-80 bg-[#d4af35]/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute right-20 bottom-10 size-40 bg-[#e5c366]/10 blur-[60px] rounded-full pointer-events-none" />
    </section>
  );
}
