"use client";

import { isValidElement, useEffect, useMemo, useState } from "react";
import { Download, Plus, Printer, Search, SlidersHorizontal, Upload } from "lucide-react";

import { KyochiDataTable, type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { KIcon } from "@/components/kyochi/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  formFieldConfigs?: Record<
    string,
    {
      type?: "text" | "select" | "date" | "time" | "typeahead";
      options?: string[];
      defaultValue?: string;
      placeholder?: string;
      debounceMs?: number;
    }
  >;
};

const isDateColumn = (column: string) => column.toLowerCase().includes("date");
const isTimeColumn = (column: string) => column.toLowerCase().includes("time");

const parseDateTextToTimestamp = (value: string): number | null => {
  const text = value.trim();
  if (!text) {
    return null;
  }
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00`).getTime();
  }
  const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmy) {
    return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}T00:00:00`).getTime();
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
};

const parseTimeTextToMinutes = (value: string): number | null => {
  const text = value.trim();
  if (!text) {
    return null;
  }
  const hm = text.match(/^(\d{1,2}):(\d{2})$/);
  if (hm) {
    return Number(hm[1]) * 60 + Number(hm[2]);
  }
  const ampm = text.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    const hour = Number(ampm[1]) % 12;
    const mins = Number(ampm[2]);
    const offset = ampm[3].toUpperCase() === "PM" ? 12 * 60 : 0;
    return hour * 60 + mins + offset;
  }
  return null;
};

const nodeToText = (node: React.ReactNode): string => {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(nodeToText).join(" ").trim();
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return nodeToText(props.children);
  }
  return "";
};

const getCellText = (row: KyochiTableRow, index: number): string => {
  const renderedText = nodeToText(row.cells[index]).trim();
  if (renderedText) {
    return renderedText;
  }
  const rawSortValue = row.sortValues?.[index];
  if (rawSortValue === null || rawSortValue === undefined) {
    return "";
  }
  return String(rawSortValue).trim();
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function ManagementPageLayout({
  title,
  searchPlaceholder,
  kpis,
  columns,
  rows,
  centeredBodyColumns = [],
  formFieldConfigs = {},
}: ManagementPageLayoutProps) {
  const [tableRows, setTableRows] = useState<KyochiTableRow[]>(rows);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowPendingDelete, setRowPendingDelete] = useState<KyochiTableRow | null>(null);
  const [debouncedFormValues, setDebouncedFormValues] = useState<string[]>([]);
  const [activeTypeaheadIndex, setActiveTypeaheadIndex] = useState<number | null>(null);
  const [activeTypeaheadOptionIndex, setActiveTypeaheadOptionIndex] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedMasterFilters, setAppliedMasterFilters] = useState<
    Record<number, string>
  >({});
  const [draftMasterFilters, setDraftMasterFilters] = useState<
    Record<number, string>
  >({});
  const [appliedDateRanges, setAppliedDateRanges] = useState<
    Record<number, { from: string; to: string }>
  >({});
  const [draftDateRanges, setDraftDateRanges] = useState<
    Record<number, { from: string; to: string }>
  >({});
  const [appliedTimeRanges, setAppliedTimeRanges] = useState<
    Record<number, { from: string; to: string }>
  >({});
  const [draftTimeRanges, setDraftTimeRanges] = useState<
    Record<number, { from: string; to: string }>
  >({});
  const idColumnIndex = 0;

  useEffect(() => {
    setTableRows(rows);
  }, [rows]);

  useEffect(() => {
    const debounceMs =
      Math.max(
        120,
        ...columns.map((column) => formFieldConfigs[column]?.debounceMs ?? 250),
      ) || 250;
    const timer = window.setTimeout(() => {
      setDebouncedFormValues(formValues);
    }, debounceMs);
    return () => window.clearTimeout(timer);
  }, [columns, formFieldConfigs, formValues]);

  const getFieldConfig = (index: number) => formFieldConfigs[columns[index]] ?? {};
  const formFieldOrder = useMemo(() => {
    const indices = columns.map((_, index) => index);
    const findIndexByKeyword = (keyword: "therapy" | "therapist") =>
      columns.findIndex((column) => column.toLowerCase().includes(keyword));

    const therapyIndex = findIndexByKeyword("therapy");
    const therapistIndex = findIndexByKeyword("therapist");

    if (therapyIndex === -1 || therapistIndex === -1 || therapistIndex > therapyIndex) {
      return indices;
    }

    return indices.sort((a, b) => {
      if (a === therapistIndex && b === therapyIndex) {
        return 1;
      }
      if (a === therapyIndex && b === therapistIndex) {
        return -1;
      }
      return a - b;
    });
  }, [columns]);
  const buildDefaultFormValues = () =>
    columns.map((_, index) => {
      if (index === idColumnIndex) {
        return "";
      }
      const fieldConfig = getFieldConfig(index);
      if (fieldConfig.defaultValue !== undefined) {
        return fieldConfig.defaultValue;
      }
      if (fieldConfig.type === "select" && fieldConfig.options && fieldConfig.options.length > 0) {
        return fieldConfig.options[0];
      }
      return "";
    });

  const normalizeValueForField = (index: number, value: string) => {
    const fieldConfig = getFieldConfig(index);
    const text = value.trim();
    if (!text) {
      return "";
    }
    if (fieldConfig.type === "date") {
      const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (dmy) {
        return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
      }
      return text;
    }
    if (fieldConfig.type === "time") {
      const ampm = text.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (ampm) {
        const rawHour = Number(ampm[1]);
        const mins = ampm[2];
        const meridiem = ampm[3].toUpperCase();
        const hour24 = (rawHour % 12) + (meridiem === "PM" ? 12 : 0);
        return `${String(hour24).padStart(2, "0")}:${mins}`;
      }
      return text;
    }
    return text;
  };

  const openAddSheet = () => {
    setIsEditMode(false);
    setEditingRowId(null);
    setFormValues(buildDefaultFormValues());
    setDebouncedFormValues(buildDefaultFormValues());
    setSheetOpen(true);
  };

  const openEditSheet = (row: KyochiTableRow) => {
    const nextValues = columns.map((_, index) =>
      normalizeValueForField(index, getCellText(row, index)),
    );
    setIsEditMode(true);
    setEditingRowId(row.id);
    setFormValues(nextValues);
    setDebouncedFormValues(nextValues);
    setSheetOpen(true);
  };

  const askDeleteRow = (row: KyochiTableRow) => {
    setRowPendingDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleFormValueChange = (index: number, value: string) => {
    setFormValues((current) => current.map((entry, entryIndex) => (entryIndex === index ? value : entry)));
  };

  const getNextGeneratedId = () => {
    const idSources = tableRows
      .map((row) => row.id?.trim())
      .filter(Boolean);

    const parsed = idSources
      .map((id) => {
        const match = id.match(/^([A-Za-z]+)(\d+)$/);
        if (!match) {
          return null;
        }
        return {
          prefix: match[1],
          numeric: Number(match[2]),
          width: match[2].length,
        };
      })
      .filter((entry): entry is { prefix: string; numeric: number; width: number } => entry !== null);

    if (parsed.length === 0) {
      return `ROW${Date.now()}`;
    }

    const reference = parsed[0];
    const samePrefix = parsed.filter((entry) => entry.prefix === reference.prefix);
    const maxNumeric = samePrefix.reduce((max, entry) => Math.max(max, entry.numeric), 0);
    const width = samePrefix.reduce((max, entry) => Math.max(max, entry.width), reference.width);

    return `${reference.prefix}${String(maxNumeric + 1).padStart(width, "0")}`;
  };

  const submitRow = () => {
    const normalized = formValues.map((value) => value.trim());
    const nextId = isEditMode ? (editingRowId ?? normalized[idColumnIndex]) : getNextGeneratedId();
    normalized[idColumnIndex] = nextId;
    const nextRow: KyochiTableRow = {
      id: nextId,
      sortValues: normalized,
      cells: normalized.map((value) => value || "-"),
    };

    if (isEditMode && editingRowId) {
      setTableRows((current) =>
        current.map((row) =>
          row.id === editingRowId
            ? {
              ...row,
              id: nextId,
              sortValues: nextRow.sortValues,
              cells: nextRow.cells,
            }
            : row,
        ),
      );
    } else {
      setTableRows((current) => [nextRow, ...current]);
    }

    setSheetOpen(false);
    setEditingRowId(null);
    setIsEditMode(false);
  };

  const confirmDelete = () => {
    if (!rowPendingDelete) {
      return;
    }
    setTableRows((current) => current.filter((row) => row.id !== rowPendingDelete.id));
    setDeleteDialogOpen(false);
    setRowPendingDelete(null);
  };

  const masterOptionsByColumn = useMemo(() => {
    const options: Record<number, string[]> = {};
    columns.forEach((column, index) => {
      if (index === idColumnIndex || isDateColumn(column) || isTimeColumn(column)) {
        return;
      }
      options[index] = Array.from(
        new Set(
          tableRows
            .map((row) => getCellText(row, index))
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b));
    });
    return options;
  }, [columns, tableRows]);

  const filteredRows = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tableRows.filter((row) => {
      const rowText = columns
        .map((_, index) => getCellText(row, index))
        .join(" ")
        .toLowerCase();
      const searchMatch = !search || rowText.includes(search);

      if (!searchMatch) {
        return false;
      }

      for (let index = 0; index < columns.length; index += 1) {
        const column = columns[index];
        if (index === idColumnIndex) {
          continue;
        }

        if (isDateColumn(column)) {
          const range = appliedDateRanges[index];
          if (range?.from || range?.to) {
            const cellTs = parseDateTextToTimestamp(getCellText(row, index));
            if (cellTs === null) {
              return false;
            }
            if (range.from) {
              const fromTs = parseDateTextToTimestamp(range.from);
              if (fromTs !== null && cellTs < fromTs) {
                return false;
              }
            }
            if (range.to) {
              const toTs = parseDateTextToTimestamp(range.to);
              if (toTs !== null && cellTs > toTs) {
                return false;
              }
            }
          }
          continue;
        }

        if (isTimeColumn(column)) {
          const range = appliedTimeRanges[index];
          if (range?.from || range?.to) {
            const cellMin = parseTimeTextToMinutes(getCellText(row, index));
            if (cellMin === null) {
              return false;
            }
            if (range.from) {
              const fromMin = parseTimeTextToMinutes(range.from);
              if (fromMin !== null && cellMin < fromMin) {
                return false;
              }
            }
            if (range.to) {
              const toMin = parseTimeTextToMinutes(range.to);
              if (toMin !== null && cellMin > toMin) {
                return false;
              }
            }
          }
          continue;
        }

        const selected = appliedMasterFilters[index];
        if (selected) {
          const cellText = getCellText(row, index).toLowerCase();
          if (cellText !== selected.toLowerCase()) {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    appliedDateRanges,
    appliedMasterFilters,
    appliedTimeRanges,
    columns,
    searchTerm,
    tableRows,
  ]);

  const hasActiveFilters =
    Object.values(appliedMasterFilters).some(Boolean) ||
    Object.values(appliedDateRanges).some((range) => range.from || range.to) ||
    Object.values(appliedTimeRanges).some((range) => range.from || range.to);

  const openFilterModal = () => {
    setDraftMasterFilters(appliedMasterFilters);
    setDraftDateRanges(appliedDateRanges);
    setDraftTimeRanges(appliedTimeRanges);
    setFilterModalOpen(true);
  };

  const applyFilters = () => {
    setAppliedMasterFilters(draftMasterFilters);
    setAppliedDateRanges(draftDateRanges);
    setAppliedTimeRanges(draftTimeRanges);
    setFilterModalOpen(false);
  };

  const clearDraftFilters = () => {
    setDraftMasterFilters({});
    setDraftDateRanges({});
    setDraftTimeRanges({});
  };

  const exportFilteredRows = () => {
    const headers = columns.map((column) => `"${column.replace(/"/g, '""')}"`).join(",");
    const csvRows = filteredRows.map((row) =>
      columns
        .map((_, index) => `"${getCellText(row, index).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const printableRows = filteredRows.map((row) =>
      columns.map((_, index) => getCellText(row, index) || "-"),
    );
    const generatedAt = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const columnHeaders = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
    const bodyRows = printableRows
      .map(
        (rowValues) =>
          `<tr>${rowValues.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | Kyochi Print</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: "Manrope", "Segoe UI", sans-serif;
        background: #f8f7f4;
        color: #2c2519;
        padding: 30px 20px;
      }
      .page {
        max-width: 980px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #e9e3d5;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 12px 36px rgba(107, 81, 42, 0.14);
      }
      .header {
        background: linear-gradient(120deg, #2c2519 0%, #3d2d04 100%);
        color: #fff;
      }
      .header-inner {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        padding: 22px 24px 18px;
      }
      .brand-title {
        font-family: "DM Serif Display", Georgia, serif;
        font-size: 24px;
        line-height: 1;
      }
      .brand-sub {
        margin-top: 6px;
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #f3dc8a;
      }
      .doc-title {
        font-size: 16px;
        font-weight: 700;
        text-align: right;
      }
      .doc-meta {
        margin-top: 5px;
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.72);
        text-align: right;
      }
      .strip { height: 4px; background: #d4af35; }
      .table-wrap { padding: 18px 22px 16px; }
      table { width: 100%; border-collapse: collapse; }
      thead th {
        background: #f5f2ea;
        color: #6b5e4c;
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        text-align: left;
        padding: 10px 9px;
        border-bottom: 1px solid #e9e3d5;
      }
      tbody td {
        font-size: 12px;
        color: #2c2519;
        padding: 9px;
        border-bottom: 1px solid #eee7da;
      }
      tbody tr:nth-child(even) td { background: #fcfbf8; }
      .footer {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #e9e3d5;
        background: #f8f5ee;
        padding: 12px 22px;
      }
      .footer-label {
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #8a7a64;
      }
      .footer-value { color: #b8941f; font-weight: 700; }
      @media print {
        body { background: #fff; padding: 0; }
        .page {
          box-shadow: none;
          border: none;
          border-radius: 0;
          max-width: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="header-inner">
          <div>
            <div class="brand-title">Kyochi</div>
            <div class="brand-sub">Wellness Intelligence Platform</div>
          </div>
          <div>
            <div class="doc-title">${escapeHtml(title)}</div>
            <div class="doc-meta">Generated · ${escapeHtml(generatedAt)}</div>
            <div class="doc-meta">Total Records · ${printableRows.length}</div>
          </div>
        </div>
        <div class="strip"></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${columnHeaders}</tr></thead>
          <tbody>
            ${bodyRows || `<tr><td colspan="${columns.length}">No records available.</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="footer">
        <div class="footer-label">Kyochi Clinical Operations</div>
        <div class="footer-label">Total ${title} · <span class="footer-value">${printableRows.length}</span></div>
      </div>
    </div>
  </body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, "_blank");
    if (!printWindow) {
      URL.revokeObjectURL(blobUrl);
      return;
    }

    const revoke = () => {
      URL.revokeObjectURL(blobUrl);
    };

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      window.setTimeout(revoke, 60_000);
    };
  };

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
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <Button
                variant="outline"
                className="h-9 px-3 text-[13px]"
                onClick={openFilterModal}
              >
                <SlidersHorizontal className="size-4" />
                {hasActiveFilters ? "Filters On" : "Filters"}
              </Button>

              <Button
                variant="outline"
                className="h-9 px-3 text-[13px]"
                onClick={exportFilteredRows}
              >
                <Download className="size-4" />
                Export
              </Button>
              <Button
                variant="outline"
                className="h-9 px-3 text-[13px]"
                onClick={printTable}
              >
                <Printer className="size-4" />
                Print
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9 px-3 text-[13px]">
                <Upload className="size-4" />
                Upload
              </Button>

              <Button className="h-9 px-3.5 text-[13px] inline-flex items-center justify-center rounded-l-md" onClick={openAddSheet}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="p-0">
          <KyochiDataTable
            columns={columns}
            rows={filteredRows}
            centeredBodyColumns={centeredBodyColumns}
            tone="soft"
            onEditRow={openEditSheet}
            onDeleteRow={askDeleteRow}
          />
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{isEditMode ? `Edit ${title}` : `Add ${title}`}</SheetTitle>
            <SheetDescription>
              {isEditMode ? "Update the selected record and save changes." : "Enter details and save to add a new record."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 space-y-3">
            {formFieldOrder.map((index) => {
              const column = columns[index];
              const isIdField = index === idColumnIndex;
              const fieldConfig = getFieldConfig(index);
              if (!isEditMode && isIdField) {
                return null;
              }

              const isTypeahead = fieldConfig.type === "typeahead";
              const typeaheadSource = fieldConfig.options ?? [];
              const currentRaw = formValues[index] ?? "";
              const currentDebounced = debouncedFormValues[index] ?? "";
              const typeaheadMatches = isTypeahead
                ? typeaheadSource
                  .filter((option) =>
                    option.toLowerCase().includes(currentDebounced.toLowerCase()),
                  )
                  .slice(0, 8)
                : [];

              return (
                <div key={`${column}-${index}`} className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide k-text-subtle">{column}</label>
                  {fieldConfig.type === "select" ? (
                    <select
                      value={currentRaw}
                      onChange={(event) =>
                        handleFormValueChange(index, event.target.value)
                      }
                      className="flex h-9 w-full rounded-md border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)] px-3 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-color-brand)]/20"
                      disabled={isEditMode && isIdField}
                    >
                      {(fieldConfig.options ?? []).map((option, optionIndex) => (
                        <option
                          key={`${column}-${option}-${optionIndex}`}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : isTypeahead ? (
                    <div className="relative">
                      <Input
                        value={currentRaw}
                        onChange={(event) => {
                          handleFormValueChange(index, event.target.value);
                          if (activeTypeaheadIndex === index) {
                            setActiveTypeaheadOptionIndex(-1);
                          }
                        }}
                        onClick={() => {
                          setActiveTypeaheadIndex(index);
                          setActiveTypeaheadOptionIndex(-1);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            if (activeTypeaheadIndex !== index) {
                              setActiveTypeaheadIndex(index);
                              setActiveTypeaheadOptionIndex(
                                typeaheadMatches.length > 0 ? 0 : -1,
                              );
                              return;
                            }
                            if (typeaheadMatches.length === 0) {
                              return;
                            }
                            setActiveTypeaheadOptionIndex((current) =>
                              Math.min(
                                current + 1,
                                typeaheadMatches.length - 1,
                              ),
                            );
                            return;
                          }

                          if (event.key === "ArrowUp") {
                            event.preventDefault();
                            if (activeTypeaheadIndex !== index) {
                              setActiveTypeaheadIndex(index);
                              setActiveTypeaheadOptionIndex(
                                typeaheadMatches.length > 0
                                  ? typeaheadMatches.length - 1
                                  : -1,
                              );
                              return;
                            }
                            if (typeaheadMatches.length === 0) {
                              return;
                            }
                            setActiveTypeaheadOptionIndex((current) =>
                              Math.max(current - 1, 0),
                            );
                            return;
                          }

                          if (event.key === "Enter" && activeTypeaheadIndex === index) {
                            const pickIndex =
                              activeTypeaheadOptionIndex >= 0
                                ? activeTypeaheadOptionIndex
                                : 0;
                            const selected = typeaheadMatches[pickIndex];
                            if (selected) {
                              event.preventDefault();
                              handleFormValueChange(index, selected);
                              setActiveTypeaheadIndex(null);
                              setActiveTypeaheadOptionIndex(-1);
                            }
                          }

                          if (event.key === "Escape") {
                            setActiveTypeaheadIndex(null);
                            setActiveTypeaheadOptionIndex(-1);
                          }
                        }}
                        onBlur={() =>
                          window.setTimeout(() => {
                            setActiveTypeaheadIndex((current) => {
                              if (current === index) {
                                setActiveTypeaheadOptionIndex(-1);
                                return null;
                              }
                              return current;
                            });
                          }, 120)
                        }
                        placeholder={
                          fieldConfig.placeholder ??
                          `Type to search ${column.toLowerCase()}`
                        }
                        disabled={isEditMode && isIdField}
                        readOnly={isEditMode && isIdField}
                      />
                      {activeTypeaheadIndex === index &&
                        typeaheadMatches.length > 0 ? (
                        <div className="absolute z-20 mt-1 max-h-44 w-full overflow-auto rounded-md border border-[var(--k-color-border-soft)] bg-white shadow-md">
                          {typeaheadMatches.map((option, optionIndex) => (
                            <button
                              key={`${column}-option-${option}-${optionIndex}`}
                              type="button"
                              className={`block w-full px-3 py-2 text-left text-[13px] ${
                                activeTypeaheadOptionIndex === optionIndex
                                  ? "bg-[#f8f3e4]"
                                  : "hover:bg-[#f8f3e4]"
                              }`}
                              onMouseEnter={() =>
                                setActiveTypeaheadOptionIndex(optionIndex)
                              }
                              onMouseDown={() => {
                                handleFormValueChange(index, option);
                                setActiveTypeaheadIndex(null);
                                setActiveTypeaheadOptionIndex(-1);
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Input
                      type={fieldConfig.type === "date" || fieldConfig.type === "time" ? fieldConfig.type : "text"}
                      value={currentRaw}
                      onChange={(event) => handleFormValueChange(index, event.target.value)}
                      placeholder={
                        isIdField
                          ? "Auto-generated"
                          : fieldConfig.placeholder ?? `Enter ${column.toLowerCase()}`
                      }
                      disabled={isEditMode && isIdField}
                      readOnly={isEditMode && isIdField}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <SheetFooter className="items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSheetOpen(false)}
              className="h-9 min-w-[92px] leading-none inline-flex items-center justify-center !rounded-l-md !rounded-r-none"
              style={{
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
                borderTopRightRadius: "0",
                borderBottomRightRadius: "0",
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitRow}
              className="h-9 min-w-[80px] leading-none inline-flex items-center justify-center !rounded-l-md !rounded-r-none"
              style={{
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
                borderTopRightRadius: "0",
                borderBottomRightRadius: "0",
              }}
            >
              {isEditMode ? "Update" : "Save"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filter Records</AlertDialogTitle>
            <AlertDialogDescription>
              Use range filters for date/time and master selections for other fields.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="max-h-[55vh] space-y-3 overflow-auto pr-1">
            {columns.map((column, index) => {
              if (index === idColumnIndex) {
                return null;
              }

              if (isDateColumn(column)) {
                const range = draftDateRanges[index] ?? { from: "", to: "" };
                return (
                  <div key={`filter-${column}-${index}`} className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide k-text-subtle">
                      {column} Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={range.from}
                        onChange={(event) =>
                          setDraftDateRanges((current) => ({
                            ...current,
                            [index]: { ...range, from: event.target.value },
                          }))
                        }
                      />
                      <Input
                        type="date"
                        value={range.to}
                        onChange={(event) =>
                          setDraftDateRanges((current) => ({
                            ...current,
                            [index]: { ...range, to: event.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              }

              if (isTimeColumn(column)) {
                const range = draftTimeRanges[index] ?? { from: "", to: "" };
                return (
                  <div key={`filter-${column}-${index}`} className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide k-text-subtle">
                      {column} Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="time"
                        value={range.from}
                        onChange={(event) =>
                          setDraftTimeRanges((current) => ({
                            ...current,
                            [index]: { ...range, from: event.target.value },
                          }))
                        }
                      />
                      <Input
                        type="time"
                        value={range.to}
                        onChange={(event) =>
                          setDraftTimeRanges((current) => ({
                            ...current,
                            [index]: { ...range, to: event.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              }

              const options = masterOptionsByColumn[index] ?? [];
              return (
                <div key={`filter-${column}-${index}`} className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide k-text-subtle">
                    {column}
                  </label>
                  <select
                    value={draftMasterFilters[index] ?? ""}
                    onChange={(event) =>
                      setDraftMasterFilters((current) => ({
                        ...current,
                        [index]: event.target.value,
                      }))
                    }
                    className="flex h-9 w-full rounded-md border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)] px-3 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-color-brand)]/20"
                  >
                    <option value="">All</option>
                    {options.map((option, optionIndex) => (
                      <option key={`filter-${column}-${option}-${optionIndex}`} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" onClick={() => setFilterModalOpen(false)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="button" variant="outline" onClick={clearDraftFilters}>
              Clear
            </Button>
            <AlertDialogAction asChild>
              <Button type="button" onClick={applyFilters}>
                Apply
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove <span className="font-semibold k-text-strong">{rowPendingDelete?.id ?? "this row"}</span> from the table.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="button" variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
