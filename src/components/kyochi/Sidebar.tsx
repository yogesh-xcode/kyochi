"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Settings, X } from "lucide-react";

import { KIcon } from "@/components/kyochi/icons";
import { InitialsAvatar } from "@/components/kyochi/primitives";
import { Button } from "@/components/ui/button";
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
        className={`fixed inset-0 k-overlay z-30 lg:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside
        className={`w-60 k-surface border-r k-border-soft flex flex-col fixed h-full z-40 transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
      <div className="h-[62px] px-3.5 shrink-0 flex items-center gap-2 border-b k-border-soft">
        <div className="size-8 rounded-full k-brand-bg flex items-center justify-center text-white shadow-sm">
          <Leaf className="size-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[1rem] font-bold k-text-strong leading-none">Kyochi</h1>
          <p className="display-heading k-brand text-[9px] tracking-wide uppercase truncate">
            Wellness Intelligence
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onMobileClose}
          className="ml-auto lg:hidden rounded-lg k-text-body hover:bg-[var(--k-color-surface-muted)] hover:text-[var(--k-color-brand)] transition-colors"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </Button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2.5 text-[8px] font-bold k-text-subtle uppercase tracking-widest mb-2">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-[12px] font-semibold ${
                    isItemActive(item.href)
                      ? "k-brand-soft-bg k-brand-strong border k-brand-border-soft"
                      : "k-text-body hover:bg-[var(--k-color-surface-muted)] border border-transparent"
                  }`}
                >
                  <KIcon name={item.icon} className="size-4" />
                  <span>{item.label}</span>
                  {item.pulse && <span className="ml-auto size-2 rounded-full k-brand-bg animate-pulse" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t k-border-soft">
        <div className="flex items-center gap-2 p-1.5 rounded-xl k-surface-muted">
          <InitialsAvatar initials="AK" className="size-8 text-[12px]" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold k-text-strong truncate">Alex Kyochi</p>
            <p className="text-[10px] k-text-body truncate">System Admin</p>
          </div>
          <Button variant="ghost" size="icon-sm" className="k-text-subtle hover:text-[var(--k-color-brand)] transition-colors">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
      </aside>
    </>
  );
}
