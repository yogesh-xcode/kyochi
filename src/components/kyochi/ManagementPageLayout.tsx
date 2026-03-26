"use client";

import { isValidElement, useEffect, useMemo, useState } from "react";
import {
  Download,
  Lock,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { KyochiDataTable, type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { KIcon } from "@/components/kyochi/icons";
import { ManagementPageSkeleton } from "@/components/kyochi/PageSkeletons";
import { StatusPill } from "@/components/kyochi/primitives";
import { Button } from "@/components/ui/button";
import FileUpload04 from "@/components/ui/file-upload";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { Input } from "@/components/ui/input";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

type FormFieldType = "text" | "select" | "date" | "time" | "typeahead";
type ExtraCreateField = NonNullable<ManagementPageLayoutProps["extraCreateFields"]>[number];

type ManagementPageLayoutProps = {
  title: string;
  subtitle?: string;
  searchPlaceholder: string;
  addActionLabel?: string;
  createSheetTitle?: string;
  createSheetDescription?: string;
  editSheetDescription?: string;
  kpis: KpiItem[];
  columns: string[];
  rows: KyochiTableRow[];
  centeredBodyColumns?: number[];
  openAddOnMount?: boolean;
  openEditRowId?: string | null;
  onOpenEditRowHandled?: () => void;
  onUpdateRow?: (input: { rowId: string; values: string[] }) => Promise<void>;
  onCreateRow?: (
    input: {
      values: string[];
      extraValues?: Record<string, string>;
      meta?: {
        typeaheadEntryModeByColumn?: Record<string, "typed" | "selected">;
      };
    },
  ) => Promise<{ id?: string; values?: string[] } | void>;
  onDeleteRows?: (rowIds: string[]) => Promise<void>;
  onRowClick?: (row: KyochiTableRow) => void;
  optimisticMutations?: boolean;
  showAddAction?: boolean;
  showUploadAction?: boolean;
  uploadActionLabel?: string;
  enableRowEdit?: boolean;
  enableRowDelete?: boolean;
  enableBulkDelete?: boolean;
  showSelection?: boolean;
  deleteDialogTitle?: string;
  deleteDialogDescription?: (input: {
    row: KyochiTableRow | null;
    count: number;
  }) => string;
  formFieldConfigs?: Record<
    string,
    {
      type?: FormFieldType;
      options?: string[];
      defaultValue?: string;
      placeholder?: string;
      min?: string;
      max?: string;
      debounceMs?: number;
      requiredInCreate?: boolean;
      hiddenInForm?: boolean;
      readOnlyInEdit?:
      | boolean
      | ((input: {
        isEditMode: boolean;
        formValues: string[];
        columns: string[];
        columnIndex: number;
      }) => boolean);
    }
  >;
  extraCreateFields?: Array<{
    key: string;
    label: string;
    type?: Exclude<FormFieldType, "typeahead">;
    options?: string[];
    defaultValue?: string;
    placeholder?: string;
    min?: string;
    max?: string;
    required?: boolean;
  }>;
  createSteps?: Array<{
    id: string;
    title?: string;
    description?: string;
    submitLabel?: string;
    columnNames?: string[];
    extraFieldKeys?: string[];
  }>;
  createStepResolver?: (input: {
    values: string[];
    extraValues: Record<string, string>;
    columns: string[];
    typeaheadEntryModeByColumn: Record<string, "typed" | "selected">;
  }) => string[];
  createSubmitLabel?: string;
  isLoading?: boolean;
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
  addActionLabel = "Add",
  createSheetTitle,
  createSheetDescription = "Enter details and save to create a new record.",
  editSheetDescription = "Update the selected record and save changes.",
  kpis,
  columns,
  rows,
  centeredBodyColumns = [],
  openAddOnMount = false,
  openEditRowId = null,
  onOpenEditRowHandled,
  onUpdateRow,
  onCreateRow,
  onDeleteRows,
  onRowClick,
  optimisticMutations = true,
  showAddAction = true,
  showUploadAction = true,
  uploadActionLabel = "Import",
  enableRowEdit = true,
  enableRowDelete = true,
  enableBulkDelete = true,
  showSelection = true,
  deleteDialogTitle = "Delete record?",
  deleteDialogDescription,
  formFieldConfigs = {},
  extraCreateFields = [],
  createSteps,
  createStepResolver,
  createSubmitLabel,
  isLoading = false,
}: ManagementPageLayoutProps) {
  const [tableRows, setTableRows] = useState<KyochiTableRow[]>(rows);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowPendingDelete, setRowPendingDelete] = useState<KyochiTableRow | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [updateErrorDialogOpen, setUpdateErrorDialogOpen] = useState(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<KyochiTableRow[]>([]);
  const [debouncedFormValues, setDebouncedFormValues] = useState<string[]>([]);
  const [activeTypeaheadIndex, setActiveTypeaheadIndex] = useState<number | null>(null);
  const [activeTypeaheadOptionIndex, setActiveTypeaheadOptionIndex] = useState<number>(-1);
  const [typeaheadEntryModeByIndex, setTypeaheadEntryModeByIndex] = useState<
    Record<number, "typed" | "selected">
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [extraCreateValues, setExtraCreateValues] = useState<Record<string, string>>({});
  const [activeCreateStep, setActiveCreateStep] = useState(0);
  const [isCreateStepVisible, setIsCreateStepVisible] = useState(true);
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
  const [hasOpenedAddFromMount, setHasOpenedAddFromMount] = useState(false);
  const [hasLocalMutations, setHasLocalMutations] = useState(false);
  const idColumnIndex = useMemo(
    () => columns.findIndex((column) => column.trim().toLowerCase() === "id"),
    [columns],
  );
  const hasIdColumn = idColumnIndex >= 0;

  useEffect(() => {
    if (!importStatus) {
      return;
    }
    const timer = window.setTimeout(() => setImportStatus(null), 2800);
    return () => window.clearTimeout(timer);
  }, [importStatus]);

  useEffect(() => {
    if (hasLocalMutations) {
      return;
    }
    const timer = window.setTimeout(() => {
      setTableRows(rows);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hasLocalMutations, rows]);

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
  const resolveFieldType = (index: number): FormFieldType => {
    return getFieldConfig(index).type ?? "text";
  };
  const resolveExtraFieldType = (field: ExtraCreateField) => {
    return field.type ?? "text";
  };
  const buildDefaultExtraCreateValues = () =>
    Object.fromEntries(
      extraCreateFields.map((field) => [
        field.key,
        field.defaultValue ??
        (resolveExtraFieldType(field) === "select" && field.options && field.options.length > 0
          ? field.options[0]
          : ""),
      ]),
    );
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
      if (hasIdColumn && index === idColumnIndex) {
        return "";
      }
      const fieldConfig = getFieldConfig(index);
      if (fieldConfig.defaultValue !== undefined) {
        return fieldConfig.defaultValue;
      }
      if (resolveFieldType(index) === "select" && fieldConfig.options && fieldConfig.options.length > 0) {
        return fieldConfig.options[0];
      }
      return "";
    });

  const normalizeValueForField = (index: number, value: string) => {
    const text = value.trim();
    if (!text) {
      return "";
    }
    if (resolveFieldType(index) === "date") {
      const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (dmy) {
        return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
      }
      return text;
    }
    if (resolveFieldType(index) === "time") {
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
    setExtraCreateValues(buildDefaultExtraCreateValues());
    setActiveCreateStep(0);
    setTypeaheadEntryModeByIndex({});
    setSheetOpen(true);
  };

  const shouldOpenAddOnMount = openAddOnMount;

  useEffect(() => {
    if (shouldOpenAddOnMount && !hasOpenedAddFromMount) {
      openAddSheet();
      setHasOpenedAddFromMount(true);
      return;
    }
    if (!shouldOpenAddOnMount && hasOpenedAddFromMount) {
      setHasOpenedAddFromMount(false);
    }
  }, [hasOpenedAddFromMount, shouldOpenAddOnMount]);

  const openEditSheet = (row: KyochiTableRow) => {
    const nextValues = columns.map((_, index) =>
      normalizeValueForField(index, getCellText(row, index)),
    );
    setIsEditMode(true);
    setEditingRowId(row.id);
    setFormValues(nextValues);
    setDebouncedFormValues(nextValues);
    setExtraCreateValues(buildDefaultExtraCreateValues());
    setActiveCreateStep(0);
    setTypeaheadEntryModeByIndex({});
    setSheetOpen(true);
  };

  useEffect(() => {
    if (!openEditRowId) {
      return;
    }
    const target = tableRows.find((row) => row.id === openEditRowId);
    if (!target) {
      onOpenEditRowHandled?.();
      return;
    }
    if (target.canEdit === false) {
      onOpenEditRowHandled?.();
      return;
    }
    openEditSheet(target);
    onOpenEditRowHandled?.();
  }, [onOpenEditRowHandled, openEditRowId, tableRows]);

  const typeaheadEntryModeByColumn = useMemo(() => {
    const output: Record<string, "typed" | "selected"> = {};
    Object.entries(typeaheadEntryModeByIndex).forEach(([rawIndex, mode]) => {
      const index = Number(rawIndex);
      const column = columns[index];
      if (Number.isInteger(index) && column) {
        output[column] = mode;
      }
    });
    return output;
  }, [columns, typeaheadEntryModeByIndex]);

  const allCreateSteps = useMemo(() => {
    if (!createSteps || createSteps.length === 0) {
      return [];
    }
    return createSteps;
  }, [createSteps]);

  const resolvedCreateStepIds = useMemo(() => {
    if (isEditMode || allCreateSteps.length === 0) {
      return [];
    }
    const configuredIds = allCreateSteps.map((step) => step.id);
    if (!createStepResolver) {
      return configuredIds;
    }
    const resolved = createStepResolver({
      values: formValues,
      extraValues: extraCreateValues,
      columns,
      typeaheadEntryModeByColumn,
    });
    const unique = Array.from(new Set(resolved));
    const sanitized = unique.filter((id) => configuredIds.includes(id));
    return sanitized.length > 0 ? sanitized : configuredIds;
  }, [
    allCreateSteps,
    columns,
    createStepResolver,
    extraCreateValues,
    formValues,
    isEditMode,
    typeaheadEntryModeByColumn,
  ]);

  useEffect(() => {
    if (isEditMode || resolvedCreateStepIds.length === 0) {
      return;
    }
    setActiveCreateStep((current) =>
      Math.min(current, resolvedCreateStepIds.length - 1),
    );
  }, [isEditMode, resolvedCreateStepIds]);

  useEffect(() => {
    if (!sheetOpen || isEditMode) {
      return;
    }
    setIsCreateStepVisible(false);
    const frame = window.requestAnimationFrame(() => {
      setIsCreateStepVisible(true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [activeCreateStep, isEditMode, sheetOpen]);

  const currentCreateStep = useMemo(() => {
    if (isEditMode || allCreateSteps.length === 0 || resolvedCreateStepIds.length === 0) {
      return null;
    }
    const currentId = resolvedCreateStepIds[Math.min(activeCreateStep, resolvedCreateStepIds.length - 1)];
    return allCreateSteps.find((step) => step.id === currentId) ?? null;
  }, [activeCreateStep, allCreateSteps, isEditMode, resolvedCreateStepIds]);

  const currentStepColumnIndexSet = useMemo(() => {
    if (!currentCreateStep?.columnNames || currentCreateStep.columnNames.length === 0) {
      return null;
    }
    return new Set(
      currentCreateStep.columnNames
        .map((name) => columns.findIndex((column) => column.toLowerCase() === name.toLowerCase()))
        .filter((index) => index >= 0),
    );
  }, [columns, currentCreateStep]);

  const currentStepExtraFieldKeySet = useMemo(() => {
    if (!currentCreateStep?.extraFieldKeys || currentCreateStep.extraFieldKeys.length === 0) {
      return null;
    }
    return new Set(currentCreateStep.extraFieldKeys);
  }, [currentCreateStep]);

  const askDeleteRow = (row: KyochiTableRow) => {
    setRowPendingDelete(row);
    setDeleteTargetIds([row.id]);
    setDeleteDialogOpen(true);
  };

  const askDeleteSelected = () => {
    const targetIds = selectedRows.map((row) => row.id);
    if (targetIds.length === 0) {
      return;
    }
    setRowPendingDelete(null);
    setDeleteTargetIds(targetIds);
    setDeleteDialogOpen(true);
  };

  const openUpdateError = (message: string) => {
    setUpdateErrorMessage(message);
    setUpdateErrorDialogOpen(true);
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return fallback;
  };

  const handleFormValueChange = (index: number, value: string) => {
    setFormValues((current) => current.map((entry, entryIndex) => (entryIndex === index ? value : entry)));
  };

  const handleExtraCreateValueChange = (key: string, value: string) => {
    setExtraCreateValues((current) => ({ ...current, [key]: value }));
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

  const parseCsv = (content: string) => {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let inQuotes = false;

    const flushCell = () => {
      row.push(cell);
      cell = "";
    };

    const flushRow = () => {
      flushCell();
      if (row.some((entry) => entry.trim().length > 0)) {
        rows.push(row);
      }
      row = [];
    };

    for (let i = 0; i < content.length; i += 1) {
      const char = content[i];
      const next = content[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === "," && !inQuotes) {
        flushCell();
        continue;
      }

      if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") {
          i += 1;
        }
        flushRow();
        continue;
      }

      cell += char;
    }

    if (cell.length > 0 || row.length > 0) {
      flushRow();
    }

    return rows;
  };

  const normalizeHeader = (value: string) =>
    value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  const runCsvImport = async (file: File) => {
    if (!onCreateRow) {
      setImportProgress(0);
      setImportStatus({
        tone: "error",
        message: "Import is not enabled on this page.",
      });
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setImportProgress(0);
      setImportStatus({
        tone: "error",
        message: "Please import a CSV file.",
      });
      return;
    }

    const csvText = await file.text();
    const parsedRows = parseCsv(csvText);
    if (parsedRows.length < 2) {
      setImportProgress(0);
      setImportStatus({
        tone: "error",
        message: "CSV must include a header row and at least one data row.",
      });
      return;
    }

    const headers = parsedRows[0].map(normalizeHeader);
    const columnIndexMap = columns.map((column) =>
      headers.findIndex((header) => header === normalizeHeader(column)),
    );

    const mappedColumns = columnIndexMap.filter((index) => index >= 0).length;
    if (mappedColumns === 0) {
      setImportProgress(0);
      setImportStatus({
        tone: "error",
        message: "CSV headers do not match this table.",
      });
      return;
    }

    const usedIds = new Set(tableRows.map((entry) => entry.id));
    const importedRows = parsedRows.slice(1);
    const totalRows = importedRows.length;
    let successCount = 0;
    let failedCount = 0;
    let firstError: string | null = null;

    setIsImporting(true);
    setImportProgress(0);

    for (const [index, rawRow] of importedRows.entries()) {
      const values = columns.map((_, columnIndex) => {
        const sourceIndex = columnIndexMap[columnIndex];
        if (sourceIndex < 0) {
          return "";
        }
        return (rawRow[sourceIndex] ?? "").trim();
      });

      if (hasIdColumn && !values[idColumnIndex]) {
        let generated = getNextGeneratedId();
        while (usedIds.has(generated)) {
          generated = `${generated}x`;
        }
        values[idColumnIndex] = generated;
      }

      try {
        await onCreateRow({ values });
        if (hasIdColumn) {
          usedIds.add(values[idColumnIndex]);
        }
        successCount += 1;
      } catch (error) {
        failedCount += 1;
        if (!firstError) {
          firstError =
            error instanceof Error && error.message.trim().length > 0
              ? error.message
              : "Row import failed.";
        }
      }
      setImportProgress(Math.max(1, Math.round(((index + 1) / totalRows) * 100)));
    }

    setIsImporting(false);
    setImportProgress(100);
    setImportFile(null);
    setImportModalOpen(false);

    if (failedCount === 0) {
      setImportStatus({
        tone: "success",
        message: `Imported ${successCount} row${successCount === 1 ? "" : "s"} successfully.`,
      });
      return;
    }

    setImportStatus({
      tone: "error",
      message: `Imported ${successCount}, failed ${failedCount}. ${firstError ?? ""}`.trim(),
    });
  };

  const renderCell = (column: string, value: string, rowId: string) => {
    const text = value || "-";
    if (column.toLowerCase().includes("status")) {
      return <StatusPill key={`${rowId}-${column}-status`} status={text} />;
    }
    return text;
  };

  const submitRow = async () => {
    if (!isEditMode) {
      const missingColumns = formFieldOrder
        .filter((index) => {
          if (hasIdColumn && index === idColumnIndex) {
            return false;
          }
          if (getFieldConfig(index).hiddenInForm) {
            return false;
          }
          if (currentStepColumnIndexSet !== null && !currentStepColumnIndexSet.has(index)) {
            return false;
          }
          return getFieldConfig(index).requiredInCreate === true;
        })
        .filter((index) => !(formValues[index] ?? "").trim())
        .map((index) => columns[index]);

      const missingExtra = extraCreateFields
        .filter((field) => {
          if (currentCreateStep) {
            if (currentStepExtraFieldKeySet === null) {
              return false;
            }
            if (!currentStepExtraFieldKeySet.has(field.key)) {
              return false;
            }
          }
          return field.required;
        })
        .filter((field) => !(extraCreateValues[field.key] ?? "").trim())
        .map((field) => field.label);

      const missing = [...missingColumns, ...missingExtra];
      if (missing.length > 0) {
        openUpdateError(`Please fill required fields: ${missing.join(", ")}.`);
        return;
      }
    }

    if (!isEditMode && currentCreateStep && resolvedCreateStepIds.length > 0) {
      const currentStepIndex = resolvedCreateStepIds.findIndex((id) => id === currentCreateStep.id);
      if (currentStepIndex >= 0 && currentStepIndex < resolvedCreateStepIds.length - 1) {
        setActiveCreateStep(currentStepIndex + 1);
        return;
      }
    }

    const normalized = formValues.map((value) => value.trim());
    const normalizedExtraValues = Object.fromEntries(
      Object.entries(extraCreateValues).map(([key, value]) => [key, value.trim()]),
    );
    const nextId = isEditMode
      ? (editingRowId ?? (hasIdColumn ? normalized[idColumnIndex] : getNextGeneratedId()))
      : getNextGeneratedId();
    if (hasIdColumn) {
      normalized[idColumnIndex] = nextId;
    }
    const nextRow: KyochiTableRow = {
      id: nextId,
      sortValues: normalized,
      cells: normalized.map((value, index) => renderCell(columns[index], value, nextId)),
    };

    if (isEditMode) {
      if (!editingRowId) {
        openUpdateError("Unable to update this record because no row is selected.");
        return;
      }
      const hasTargetRow = tableRows.some((row) => row.id === editingRowId);
      if (!hasTargetRow) {
        openUpdateError(`Unable to update ${editingRowId} because it is no longer available.`);
        return;
      }
      try {
        setIsSaving(true);
        if (onUpdateRow) {
          await onUpdateRow({ rowId: editingRowId, values: normalized });
        }
      } catch (error) {
        openUpdateError(getErrorMessage(error, "Unable to update this record."));
        return;
      } finally {
        setIsSaving(false);
      }
      if (optimisticMutations) {
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
        setHasLocalMutations(true);
      }
    } else {
      let createdValues = normalized;
      let createdId = nextId;
      try {
        setIsSaving(true);
        if (onCreateRow) {
          const created = await onCreateRow({
            values: normalized,
            extraValues: normalizedExtraValues,
            meta: {
              typeaheadEntryModeByColumn,
            },
          });
          if (created?.id) {
            createdId = created.id;
          }
          if (created?.values && created.values.length === normalized.length) {
            createdValues = created.values.map((value) => value.trim());
          } else {
            createdValues = normalized.map((value, index) =>
              hasIdColumn && index === idColumnIndex ? createdId : value,
            );
          }
        }
      } catch (error) {
        openUpdateError(getErrorMessage(error, "Unable to create this record."));
        return;
      } finally {
        setIsSaving(false);
      }
      const createdRow: KyochiTableRow = {
        id: createdId,
        sortValues: createdValues,
        cells: createdValues.map((value, index) =>
          renderCell(columns[index], value, createdId),
        ),
      };
      if (optimisticMutations) {
        setTableRows((current) => [createdRow, ...current]);
        setHasLocalMutations(true);
      }
    }

    setSheetOpen(false);
    setEditingRowId(null);
    setIsEditMode(false);
    setActiveCreateStep(0);
  };

  const confirmDelete = async () => {
    if (deleteTargetIds.length === 0) {
      return;
    }
    try {
      setIsDeleting(true);
      if (onDeleteRows) {
        await onDeleteRows(deleteTargetIds);
      }
    } catch (error) {
      openUpdateError(getErrorMessage(error, "Unable to delete selected records."));
      return;
    } finally {
      setIsDeleting(false);
    }
    if (optimisticMutations) {
      setTableRows((current) => current.filter((row) => !deleteTargetIds.includes(row.id)));
      setHasLocalMutations(true);
    }
    setSelectedRows([]);
    setDeleteTargetIds([]);
    setDeleteDialogOpen(false);
    setRowPendingDelete(null);
  };

  const masterOptionsByColumn = useMemo(() => {
    const options: Record<number, string[]> = {};
    columns.forEach((column, index) => {
      if ((hasIdColumn && index === idColumnIndex) || isDateColumn(column) || isTimeColumn(column)) {
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
        if (hasIdColumn && index === idColumnIndex) {
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

  const clearAppliedFilters = () => {
    setAppliedMasterFilters({});
    setAppliedDateRanges({});
    setAppliedTimeRanges({});
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
        font-family: "Manrope", sans-serif;
        font-weight: 800;
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
      return "k-delta-warning";
    }
    if (normalized.includes("live") || normalized.includes("verified") || normalized.includes("%") || normalized.includes("leader")) {
      return "k-delta-positive";
    }
    return "k-delta-neutral";
  };

  if (isLoading) {
    return (
      <ManagementPageSkeleton
        kpiCount={Math.max(1, kpis.length)}
        columnCount={Math.max(1, columns.length)}
        rowCount={8}
        showSelection={showSelection}
        showUploadAction={showUploadAction}
        showAddAction={showAddAction}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card
            key={kpi.label}
            className="k-surface rounded-xl shadow-sm border k-border-soft border-l-[3px] border-l-[var(--kyochi-gold-500)] py-0 ring-0"
          >
            <CardContent className="px-5 py-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="size-9 k-brand-soft-bg rounded-lg flex items-center justify-center k-brand">
                  <KIcon name={kpiIcons[index % kpiIcons.length]} className="size-4.5" />
                </div>
                <Badge
                  variant="outline"
                  className={`h-auto border-transparent px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-normal normal-case ${getDeltaBadgeTone(
                    kpi.delta,
                  )}`}
                >
                  {kpi.delta}
                </Badge>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.07em] k-text-subtle">
                {kpi.label}
              </p>
              <h3 className="text-[30px] leading-[1.1] font-semibold k-text-strong mt-1">
                {kpi.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {importStatus ? (
          <div
            className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${importStatus.tone === "success"
                ? "border-[#86efac] bg-[#f0fdf4] text-[#166534]"
                : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
              }`}
          >
            {importStatus.message}
          </div>
        ) : null}

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
                onClick={hasActiveFilters ? clearAppliedFilters : openFilterModal}
              >
                {hasActiveFilters ? (
                  <X className="size-4" />
                ) : (
                  <SlidersHorizontal className="size-4" />
                )}
                {hasActiveFilters ? "Clear Filters" : "Filters"}
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
              {enableBulkDelete && selectedRows.length > 0 ? (
                <Button
                  variant="destructive-outline"
                  className="h-9 px-3 text-[13px]"
                  onClick={askDeleteSelected}
                >
                  <Trash2 className="size-4" />
                  Delete Selected ({selectedRows.length})
                </Button>
              ) : null}
              {showUploadAction ? (
                <Button
                  variant="outline"
                  className="h-9 px-3 text-[13px]"
                  onClick={() => setImportModalOpen(true)}
                  disabled={isImporting || !onCreateRow}
                >
                  <Upload className="size-4" />
                  {isImporting ? "Importing..." : uploadActionLabel}
                </Button>
              ) : null}

              {showAddAction ? (
                <Button className="h-9 px-3.5 text-[13px] inline-flex items-center justify-center rounded-l-md" onClick={openAddSheet}>
                  <Plus className="size-4" />
                  {addActionLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="p-0">
          <KyochiDataTable
            columns={columns}
            rows={filteredRows}
            centeredBodyColumns={centeredBodyColumns}
            showSelection={showSelection}
            tone="soft"
            onEditRow={enableRowEdit ? openEditSheet : undefined}
            onDeleteRow={enableRowDelete ? askDeleteRow : undefined}
            onRowClick={onRowClick}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{isEditMode ? `Edit ${title}` : (createSheetTitle ?? `Create ${title}`)}</SheetTitle>
            <SheetDescription>
              {isEditMode ? editSheetDescription : createSheetDescription}
            </SheetDescription>
          </SheetHeader>

          {!isEditMode && currentCreateStep ? (
            <div className="mt-2 rounded-lg border border-[var(--k-color-border-soft)] bg-[#fbf8ef] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.11em] k-text-subtle">
                Step {Math.min(activeCreateStep + 1, resolvedCreateStepIds.length)} of {resolvedCreateStepIds.length}
              </p>
              <p className="mt-0.5 text-sm font-semibold k-text-strong">
                {currentCreateStep.title ?? "Complete this step"}
              </p>
              {currentCreateStep.description ? (
                <p className="mt-0.5 text-xs k-text-subtle">{currentCreateStep.description}</p>
              ) : null}
            </div>
          ) : null}

          <div
            key={currentCreateStep?.id ?? "default-create"}
            className={`mt-5 space-y-3 transition-all duration-300 ease-out ${isCreateStepVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
          >
            {formFieldOrder.map((index) => {
              const column = columns[index];
              const isIdField = hasIdColumn && index === idColumnIndex;
              const fieldConfig = getFieldConfig(index);
              const isHiddenInForm = fieldConfig.hiddenInForm === true;
              const isOutsideCurrentCreateStep =
                !isEditMode && currentStepColumnIndexSet !== null && !currentStepColumnIndexSet.has(index);
              const readOnlyInEditConfig = fieldConfig.readOnlyInEdit;
              const isConfiguredReadOnlyInEdit =
                typeof readOnlyInEditConfig === "function"
                  ? readOnlyInEditConfig({
                    isEditMode,
                    formValues,
                    columns,
                    columnIndex: index,
                  })
                  : readOnlyInEditConfig === true;
              const isLockedInEdit =
                isEditMode && (isIdField || isConfiguredReadOnlyInEdit);
              if (!isEditMode && isIdField) {
                return null;
              }
              if (isHiddenInForm) {
                return null;
              }
              if (isOutsideCurrentCreateStep) {
                return null;
              }

              const isTypeahead = fieldConfig.type === "typeahead";
              const resolvedFieldType = resolveFieldType(index);
              const typeaheadSource = fieldConfig.options ?? [];
              const currentRaw = formValues[index] ?? "";
              const currentDebounced = debouncedFormValues[index] ?? "";
              const inputId = `sheet-field-${isEditMode ? "edit" : "create"}-${index}`;
              const typeaheadMatches = isTypeahead
                ? typeaheadSource
                  .filter((option) =>
                    option.toLowerCase().includes(currentDebounced.toLowerCase()),
                  )
                  .slice(0, 8)
                : [];

              return (
                <Field key={`${column}-${index}`}>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor={inputId}>{column}</FieldLabel>
                    {isLockedInEdit ? (
                      <span className="inline-flex items-center justify-center rounded-full border border-[var(--k-color-border-soft)] bg-[#f7f4ea] p-1 text-[#8b7a55]">
                        <Lock className="size-3" />
                      </span>
                    ) : null}
                  </div>
                  {resolvedFieldType === "select" ? (
                    <select
                      id={inputId}
                      value={currentRaw}
                      onChange={(event) =>
                        handleFormValueChange(index, event.target.value)
                      }
                      className={`flex h-9 w-full rounded-md border px-3 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-color-brand)]/20 disabled:opacity-100 ${isLockedInEdit
                        ? "border-[#e4dcc7] bg-[#f7f4ea] text-[#8b7a55]"
                        : "border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)]"
                        }`}
                      disabled={isLockedInEdit}
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
                        id={inputId}
                        value={currentRaw}
                        onChange={(event) => {
                          handleFormValueChange(index, event.target.value);
                          setTypeaheadEntryModeByIndex((current) => ({
                            ...current,
                            [index]: "typed",
                          }));
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
                              setTypeaheadEntryModeByIndex((current) => ({
                                ...current,
                                [index]: "selected",
                              }));
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
                        disabled={isLockedInEdit}
                        readOnly={isLockedInEdit}
                        className={isLockedInEdit ? "border-[#e4dcc7] bg-[#f7f4ea] text-[#8b7a55] disabled:border-[#e4dcc7] disabled:bg-[#f7f4ea] disabled:text-[#8b7a55] disabled:opacity-100" : ""}
                      />
                      {!isLockedInEdit && activeTypeaheadIndex === index &&
                        typeaheadMatches.length > 0 ? (
                        <div className="absolute z-20 mt-1 max-h-44 w-full overflow-auto rounded-md border border-[var(--k-color-border-soft)] bg-white shadow-md">
                          {typeaheadMatches.map((option, optionIndex) => (
                            <button
                              key={`${column}-option-${option}-${optionIndex}`}
                              type="button"
                              className={`block w-full px-3 py-2 text-left text-[13px] ${activeTypeaheadOptionIndex === optionIndex
                                  ? "bg-[#f8f3e4]"
                                  : "hover:bg-[#f8f3e4]"
                                }`}
                              onMouseEnter={() =>
                                setActiveTypeaheadOptionIndex(optionIndex)
                              }
                              onMouseDown={() => {
                                handleFormValueChange(index, option);
                                setTypeaheadEntryModeByIndex((current) => ({
                                  ...current,
                                  [index]: "selected",
                                }));
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
                    resolvedFieldType === "date" ? (
                      <DatePickerInput
                        id={inputId}
                        value={currentRaw}
                        onChange={(nextValue) => handleFormValueChange(index, nextValue)}
                        placeholder={fieldConfig.placeholder ?? "dd-mm-yyyy"}
                        min={fieldConfig.min}
                        max={fieldConfig.max}
                        disabled={isLockedInEdit}
                        readOnly={isLockedInEdit}
                      />
                    ) : resolvedFieldType === "time" ? (
                      <TimePickerInput
                        id={inputId}
                        value={currentRaw}
                        onChange={(nextValue) => handleFormValueChange(index, nextValue)}
                        placeholder={
                          isIdField
                            ? "Auto-generated"
                            : fieldConfig.placeholder ?? "hh:mm"
                        }
                        min={fieldConfig.min}
                        max={fieldConfig.max}
                        disabled={isLockedInEdit}
                        readOnly={isLockedInEdit}
                        className={
                          isLockedInEdit
                            ? "border-[#e4dcc7] bg-[#f7f4ea] text-[#8b7a55] disabled:border-[#e4dcc7] disabled:bg-[#f7f4ea] disabled:text-[#8b7a55] disabled:opacity-100"
                            : ""
                        }
                      />
                    ) : (
                      <Input
                        id={inputId}
                        type="text"
                        value={currentRaw}
                        onChange={(event) => handleFormValueChange(index, event.target.value)}
                        placeholder={
                          isIdField
                            ? "Auto-generated"
                            : fieldConfig.placeholder ?? `Enter ${column.toLowerCase()}`
                        }
                        disabled={isLockedInEdit}
                        readOnly={isLockedInEdit}
                        className={isLockedInEdit ? "border-[#e4dcc7] bg-[#f7f4ea] text-[#8b7a55] disabled:border-[#e4dcc7] disabled:bg-[#f7f4ea] disabled:text-[#8b7a55] disabled:opacity-100" : ""}
                      />
                    )
                  )}
                  {isLockedInEdit ? (
                    <FieldDescription>Locked in edit mode.</FieldDescription>
                  ) : null}
                </Field>
              );
            })}

            {!isEditMode
              ? extraCreateFields.map((extraField) => {
                const shouldShowOnCurrentStep = currentCreateStep
                  ? currentStepExtraFieldKeySet?.has(extraField.key) ?? false
                  : true;
                if (!shouldShowOnCurrentStep) {
                  return null;
                }
                const resolvedExtraType = resolveExtraFieldType(extraField);
                const value = extraCreateValues[extraField.key] ?? "";
                const extraInputId = `sheet-extra-${extraField.key}`;
                return (
                  <Field key={extraField.key}>
                    <FieldLabel htmlFor={extraInputId}>{extraField.label}</FieldLabel>
                    {resolvedExtraType === "select" ? (
                      <select
                        id={extraInputId}
                        value={value}
                        onChange={(event) =>
                          handleExtraCreateValueChange(extraField.key, event.target.value)
                        }
                        className="flex h-9 w-full rounded-md border border-(--k-color-border-soft) bg-(--k-color-surface) px-3 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--k-color-brand)/20"
                      >
                        {(extraField.options ?? []).map((option, optionIndex) => (
                          <option key={`${extraField.key}-${option}-${optionIndex}`} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      resolvedExtraType === "date" ? (
                        <DatePickerInput
                          id={extraInputId}
                          value={value}
                          min={extraField.min}
                          max={extraField.max}
                          onChange={(nextValue) =>
                            handleExtraCreateValueChange(extraField.key, nextValue)
                          }
                          placeholder={extraField.placeholder ?? "dd-mm-yyyy"}
                        />
                      ) : resolvedExtraType === "time" ? (
                        <TimePickerInput
                          id={extraInputId}
                          value={value}
                          min={extraField.min}
                          max={extraField.max}
                          onChange={(nextValue) =>
                            handleExtraCreateValueChange(extraField.key, nextValue)
                          }
                          placeholder={extraField.placeholder ?? "hh:mm"}
                        />
                      ) : (
                        <Input
                          id={extraInputId}
                          type="text"
                          value={value}
                          onChange={(event) =>
                            handleExtraCreateValueChange(extraField.key, event.target.value)
                          }
                          placeholder={extraField.placeholder ?? `Enter ${extraField.label.toLowerCase()}`}
                        />
                      )
                    )}
                  </Field>
                );
              })
              : null}
          </div>

          <SheetFooter className="items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!isEditMode && currentCreateStep && activeCreateStep > 0) {
                  setActiveCreateStep((current) => Math.max(0, current - 1));
                  return;
                }
                setSheetOpen(false);
              }}
              className="h-9 min-w-[92px] leading-none inline-flex items-center justify-center !rounded-l-md !rounded-r-none"
              style={{
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
                borderTopRightRadius: "0",
                borderBottomRightRadius: "0",
              }}
            >
              {!isEditMode && currentCreateStep && activeCreateStep > 0 ? "Back" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={submitRow}
              disabled={isSaving}
              className="h-9 min-w-[80px] leading-none inline-flex items-center justify-center !rounded-l-md !rounded-r-none"
              style={{
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
                borderTopRightRadius: "0",
                borderBottomRightRadius: "0",
              }}
            >
              {isSaving
                ? "Saving..."
                : isEditMode
                  ? "Update"
                  : currentCreateStep?.submitLabel ?? createSubmitLabel ?? "Save"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={importModalOpen}
        onOpenChange={(open) => {
          setImportModalOpen(open);
          if (!open) {
            setImportFile(null);
            setImportProgress(0);
          }
        }}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader className="sr-only">
            <AlertDialogTitle>{uploadActionLabel}</AlertDialogTitle>
            <AlertDialogDescription>
              Select a CSV file and confirm import.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FileUpload04
            mode="import"
            title="File Upload"
            helperText="CSV only. Header names should match table columns."
            acceptMimeTypes={["text/csv", "application/vnd.ms-excel"]}
            maxSizeMb={5}
            selectionOnly
            selectedFile={importFile}
            externalUploading={isImporting}
            externalProgress={isImporting ? importProgress : 0}
            primaryActionLabel={uploadActionLabel}
            cancelActionLabel="Cancel"
            onFileSelected={setImportFile}
            onPrimaryAction={() => {
              if (!importFile) {
                setImportStatus({
                  tone: "error",
                  message: "Please choose a CSV file before importing.",
                });
                return;
              }
              void runCsvImport(importFile);
            }}
            onCancelAction={() => {
              setImportModalOpen(false);
              setImportFile(null);
            }}
            onError={(message) =>
              setImportStatus({
                tone: "error",
                message,
              })
            }
            onSuccess={() => undefined}
          />
        </AlertDialogContent>
      </AlertDialog>

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
              if (hasIdColumn && index === idColumnIndex) {
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

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteTargetIds([]);
            setRowPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogDescription ? (
                deleteDialogDescription({
                  row: rowPendingDelete,
                  count: deleteTargetIds.length,
                })
              ) : deleteTargetIds.length > 1 ? (
                <>This action will remove <span className="font-semibold k-text-strong">{deleteTargetIds.length} selected rows</span> from the table.</>
              ) : (
                <>This action will remove <span className="font-semibold k-text-strong">{rowPendingDelete?.id ?? deleteTargetIds[0] ?? "this row"}</span> from the table.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={updateErrorDialogOpen}
        onOpenChange={(open) => {
          setUpdateErrorDialogOpen(open);
          if (!open) {
            setUpdateErrorMessage("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update failed</AlertDialogTitle>
            <AlertDialogDescription>
              {updateErrorMessage || "We could not update the selected record. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button type="button" variant="destructive">
                OK
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
