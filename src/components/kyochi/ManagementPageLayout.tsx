"use client";

import { ArrowUpDown, Download, Plus, Printer, SlidersHorizontal, Upload } from "lucide-react";

import { KyochiDataTable, type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { KIcon } from "@/components/kyochi/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  title,
  searchPlaceholder,
  kpis,
  columns,
  rows,
  centeredBodyColumns = [],
}: ManagementPageLayoutProps) {
  const kpiIcons: IconKey[] = ["group", "monitoring", "verified", "pending_actions"];
  const getDeltaTone = (delta: string) => {
    const normalized = delta.toLowerCase();
    if (normalized.includes("review") || normalized.includes("risk") || normalized.includes("queue") || normalized.includes("needs")) {
      return "delta-neg";
    }
    if (normalized.includes("live") || normalized.includes("verified") || normalized.includes("%") || normalized.includes("leader")) {
      return "delta-pos";
    }
    return "k-text-subtle";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={kpi.label} className="k-card k-metric border-b-4 k-brand-border-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="p-1.5 rounded-lg k-brand-soft-bg k-brand">
                <KIcon name={kpiIcons[index % kpiIcons.length]} className="size-4" />
              </div>
              <span className={`inline-flex rounded-full border border-transparent px-2 py-0.5 type-small ${getDeltaTone(kpi.delta)}`}>
                {kpi.delta}
              </span>
            </div>
            <p className="k-metric-label">{kpi.label}</p>
            <p className="k-metric-value">{kpi.value}</p>
            <p className="k-metric-delta k-text-body">{kpi.helper}</p>
          </div>
        ))}
      </div>

      <Card className="k-surface rounded-2xl border k-border-soft shadow-sm py-0 ring-0 gap-0 overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b k-border-soft">
          <CardTitle className="type-h3 k-text-strong">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Input
              className="h-11 max-w-md border k-border-soft bg-[var(--k-color-surface-muted)] rounded-lg focus-visible:border-[var(--k-color-brand)] focus-visible:ring-[var(--k-color-brand)]/25"
              placeholder={searchPlaceholder}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="h-11 px-3 border k-border-soft bg-[var(--k-color-surface)]">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
              <Button variant="outline" className="h-11 px-3 border k-border-soft bg-[var(--k-color-surface)]">
                <ArrowUpDown className="size-4" />
                Sort
              </Button>
              <Button className="h-11 px-3 k-brand-bg k-primary-foreground hover:opacity-95">
                <Plus className="size-4" />
                Add
              </Button>
              <Button variant="outline" className="h-11 px-3 border k-border-soft bg-[var(--k-color-surface)]">
                <Upload className="size-4" />
                Upload
              </Button>
              <Button className="h-11 px-3 k-brand-bg k-primary-foreground hover:opacity-95">
                <Download className="size-4" />
                Export
              </Button>
              <Button variant="outline" className="h-11 px-3 border k-border-soft bg-[var(--k-color-surface)]">
                <Printer className="size-4" />
                Print
              </Button>
            </div>
          </div>

          <KyochiDataTable columns={columns} rows={rows} centeredBodyColumns={centeredBodyColumns} />
        </CardContent>
      </Card>
    </div>
  );
}
