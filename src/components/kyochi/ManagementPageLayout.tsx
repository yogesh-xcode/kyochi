"use client";

import { Download, Plus, Printer, SlidersHorizontal, Upload } from "lucide-react";

import { KyochiDataTable, type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { KIcon } from "@/components/kyochi/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

      <Card className="k-surface rounded-2xl border k-border-soft shadow-sm py-0 ring-0 gap-0 overflow-hidden">
        <CardHeader className="p-5 border-b k-border-soft">
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <Input
              className="h-11 w-full sm:w-75 border k-border-soft bg-(--k-color-surface-muted) rounded-lg focus-visible:border-(--k-color-brand) focus-visible:ring-(--k-color-brand)/25"
              placeholder={searchPlaceholder}
            />
            <Button variant="outline" className="h-11 px-3 border k-border-soft bg-(--k-color-surface)">
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
            <Button variant="outline" className="h-11 px-3 border k-border-soft bg-(--k-color-surface)">
              <Upload className="size-4" />
              Upload
            </Button>
            <Button className="h-11 px-3 bg-[var(--kyochi-gold-400)] text-[var(--kyochi-gold-900)] hover:bg-[var(--kyochi-gold-500)]">
              <Download className="size-4" />
              Export
            </Button>
            <Button variant="outline" className="h-11 px-3 border k-border-soft bg-(--k-color-surface)">
              <Printer className="size-4" />
              Print
            </Button>
            <Button className="h-11 px-3 bg-[var(--kyochi-gold-400)] text-[var(--kyochi-gold-900)] hover:bg-[var(--kyochi-gold-500)]">
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <KyochiDataTable
            columns={columns}
            rows={rows}
            centeredBodyColumns={centeredBodyColumns}
            tone="soft"
          />
        </CardContent>
      </Card>
    </div>
  );
}
