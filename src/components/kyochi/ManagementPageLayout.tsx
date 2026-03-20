"use client";

import { Download, Plus, Printer, Search, SlidersHorizontal, Upload } from "lucide-react";

import { KyochiDataTable, type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { KIcon } from "@/components/kyochi/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IconKey } from "@/types";

type KpiItem = {
  label: string;
  value: string;
  helper: string;
  delta: string;
};

type ManagementPageLayoutProps = {
  title: string;
  subtitle?: string;
  searchPlaceholder: string;
  kpis: KpiItem[];
  columns: string[];
  rows: KyochiTableRow[];
  centeredBodyColumns?: number[];
};

export function ManagementPageLayout({
  searchPlaceholder,
  kpis,
  columns,
  rows,
  centeredBodyColumns = [],
}: ManagementPageLayoutProps) {
  const kpiIcons: IconKey[] = ["group", "monitoring", "verified", "pending_actions"];
  const getDeltaBadgeTone = (delta: string) => {
    const normalized = delta.toLowerCase();
    if (normalized.includes("review") || normalized.includes("risk") || normalized.includes("queue") || normalized.includes("needs")) {
      return "delta-neg";
    }
    if (normalized.includes("live") || normalized.includes("verified") || normalized.includes("%") || normalized.includes("leader")) {
      return "delta-pos";
    }
    return "k-text-subtle";
  };
  const getDeltaTextTone = (delta: string) => {
    const normalized = delta.toLowerCase();
    if (normalized.includes("review") || normalized.includes("risk") || normalized.includes("queue") || normalized.includes("needs")) {
      return "text-[#c44c1a]";
    }
    if (normalized.includes("live") || normalized.includes("verified") || normalized.includes("%") || normalized.includes("leader")) {
      return "text-[#3b6d11]";
    }
    return "k-text-subtle";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={kpi.label} className="k-card border k-border-soft border-l-[3px] border-l-[var(--kyochi-gold-500)] px-5 py-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="size-9 rounded-lg k-brand-soft-bg k-brand flex items-center justify-center">
                <KIcon name={kpiIcons[index % kpiIcons.length]} className="size-4" />
              </div>
              <span className={`inline-flex rounded-full border border-transparent px-2 py-0.5 text-[10px] font-semibold ${getDeltaBadgeTone(kpi.delta)}`}>
                {kpi.delta}
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.07em] k-text-subtle mb-0.5">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-[30px] leading-[1.1] font-semibold k-text-strong">{kpi.value}</p>
              <span className={`text-[12px] font-semibold ${getDeltaTextTone(kpi.delta)}`}>{kpi.delta}</span>
            </div>
            <p className="text-[12px] mt-1.5 k-text-body">{kpi.helper}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[280px]">
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 k-brand" />
                <Input
                  className="h-9 w-full pl-8 pr-3 border k-border-soft bg-(--k-color-surface) rounded-md text-[13px] focus-visible:border-(--k-color-brand) focus-visible:ring-(--k-color-brand)/20"
                  placeholder={searchPlaceholder}
                />
              </div>

              <Button variant="outline" className="h-9 px-3 rounded-md text-[13px]">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>

              <Button variant="outline" className="h-9 px-3 rounded-md text-[13px]">
                <Download className="size-4" />
                Export
              </Button>
              <Button variant="outline" className="h-9 px-3 rounded-md text-[13px]">
                <Printer className="size-4" />
                Print
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9 px-3 rounded-md text-[13px]">
                <Upload className="size-4" />
                Upload
              </Button>

              <Button className="h-9 px-3.5 rounded-md text-[13px]">
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="p-0">
          <KyochiDataTable
            columns={columns}
            rows={rows}
            centeredBodyColumns={centeredBodyColumns}
            tone="soft"
          />
        </div>
      </div>
    </div>
  );
}
