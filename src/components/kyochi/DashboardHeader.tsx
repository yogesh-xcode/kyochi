import { MSO } from "@/components/kyochi/primitives";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Intelligence Dashboard</h2>
        <p className="text-slate-500 mt-1">Daily system health and operational summary.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <MSO className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</MSO>
          <input
            className="pl-10 pr-4 py-2.5 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#d4af35] w-64 text-sm outline-none"
            placeholder="Search data points..."
            type="text"
          />
        </div>
        <button className="relative p-2.5 rounded-xl bg-white shadow-sm text-slate-600 hover:text-[#d4af35] transition-colors">
          <MSO>notifications</MSO>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
