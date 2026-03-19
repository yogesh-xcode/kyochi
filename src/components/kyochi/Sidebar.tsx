import { InitialsAvatar, MSO } from "@/components/kyochi/primitives";
import type { NavSection } from "@/components/kyochi/types";

type SidebarProps = {
  navSections: NavSection[];
};

export function Sidebar({ navSections }: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-amber-500/10 flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#d4af35] flex items-center justify-center text-white">
          <MSO>spa</MSO>
        </div>
        <div>
          <h1 className="type-h3 text-slate-900 leading-none">Kyochi</h1>
          <p className="display-heading text-[#d4af35] text-xs tracking-wider uppercase">
            Wellness Intelligence
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                    item.active ? "bg-[#d4af35]/10 text-[#d4af35]" : "text-slate-600 hover:bg-[#f3f0e6]"
                  }`}
                >
                  <MSO>{item.icon}</MSO>
                  <span>{item.label}</span>
                  {item.pulse && <span className="ml-auto size-2 rounded-full bg-[#d4af35] animate-pulse" />}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#f3f0e6]">
          <InitialsAvatar initials="AK" className="size-10 text-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Alex Kyochi</p>
            <p className="text-xs text-slate-500 truncate">System Admin</p>
          </div>
          <button className="text-slate-400 hover:text-[#d4af35] transition-colors">
            <MSO>settings</MSO>
          </button>
        </div>
      </div>
    </aside>
  );
}
