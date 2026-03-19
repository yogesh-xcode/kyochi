"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { InitialsAvatar, MSO } from "@/components/kyochi/primitives";
import type { NavSection } from "@/types";

type SidebarProps = {
  navSections: NavSection[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function Sidebar({ navSections, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname === href;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/30 z-30 lg:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside
        className={`w-72 bg-white border-r border-amber-500/10 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
      <div className="p-5 flex items-center gap-3 border-b border-slate-100">
        <div className="size-10 rounded-full bg-[#d4af35] flex items-center justify-center text-white shadow-sm">
          <MSO>spa</MSO>
        </div>
        <div className="min-w-0">
          <h1 className="type-h3 text-slate-900 leading-none">Kyochi</h1>
          <p className="display-heading text-[#d4af35] text-[11px] tracking-wide uppercase truncate">
            Wellness Intelligence
          </p>
        </div>
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden size-8 rounded-lg text-slate-500 hover:bg-[#f3f0e6] hover:text-[#d4af35] transition-colors inline-flex items-center justify-center"
          aria-label="Close sidebar"
        >
          <MSO className="text-[20px]">close</MSO>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-7 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                    isItemActive(item.href)
                      ? "bg-[#d4af35]/14 text-[#b8941f] border border-[#d4af35]/20"
                      : "text-slate-600 hover:bg-[#f3f0e6] border border-transparent"
                  }`}
                >
                  <MSO>{item.icon}</MSO>
                  <span>{item.label}</span>
                  {item.pulse && <span className="ml-auto size-2 rounded-full bg-[#d4af35] animate-pulse" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#f3f0e6]/90">
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
    </>
  );
}
