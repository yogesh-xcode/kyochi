import { MSO } from "@/components/kyochi/primitives";

type InsightRecommendationCardProps = {
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
};

export function InsightRecommendationCard({
  title,
  body,
  primaryAction,
  secondaryAction,
}: InsightRecommendationCardProps) {
  return (
    <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#d4af35]/10 text-[#b8941f] text-[9px] font-bold uppercase tracking-wide mb-3">
        <MSO className="text-[13px]">auto_awesome</MSO>
        Clinical Insight
      </div>
      <h4 className="text-[16px] font-bold leading-tight text-slate-900 mb-2">{title}</h4>
      <p className="text-[13px] leading-relaxed text-slate-500 mb-3.5">{body}</p>
      <div className="flex flex-col sm:flex-row xl:flex-col gap-1.5">
        <button className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl bg-[#d4af35] text-[#3d2d04] text-[12px] font-bold hover:bg-[#e2be52] transition-colors">
          {primaryAction}
        </button>
        <button className="w-full sm:w-auto xl:w-full px-3 py-1.5 rounded-xl bg-[#f3f0e6] text-slate-700 text-[12px] font-bold hover:bg-[#e9e2d1] transition-colors">
          {secondaryAction}
        </button>
      </div>
    </section>
  );
}
