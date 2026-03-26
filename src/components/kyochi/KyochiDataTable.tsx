"use client";
"use no memo";

import { isValidElement, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import {
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type KyochiTableRow = {
  id: string;
  cells: React.ReactNode[];
  sortValues?: Array<string | number>;
  actions?: React.ReactNode;
  canEdit?: boolean;
  canDelete?: boolean;
};

type KyochiDataTableProps = {
  columns: string[];
  rows: KyochiTableRow[];
  minTableWidthClassName?: string;
  centeredBodyColumns?: number[];
  showSelection?: boolean;
  tone?: "default" | "soft";
  onEditRow?: (row: KyochiTableRow) => void;
  onDeleteRow?: (row: KyochiTableRow) => void;
  onRowClick?: (row: KyochiTableRow) => void;
  onSelectionChange?: (rows: KyochiTableRow[]) => void;
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

export function KyochiDataTable({
  columns,
  rows,
  minTableWidthClassName = "min-w-[920px]",
  centeredBodyColumns = [],
  showSelection = true,
  tone = "default",
  onEditRow,
  onDeleteRow,
  onRowClick,
  onSelectionChange,
}: KyochiDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const allRowsCheckboxRef = useRef<HTMLInputElement>(null);
  const selectColumnWidth = showSelection ? 56 : 0;
  const actionsColumnWidth = 148;
  const dynamicColumnWidth = columns.length > 0 ? `calc((100% - ${selectColumnWidth + actionsColumnWidth}px) / ${columns.length})` : "auto";

  const columnDefs = useMemo<ColumnDef<KyochiTableRow>[]>(
    () => [
      ...(showSelection
        ? [{
          id: "select",
          enableSorting: false,
          header: ({ table }) => (
            <div className="flex h-full w-full items-center justify-center px-4">
              <input
                ref={allRowsCheckboxRef}
                type="checkbox"
                aria-label="Select all rows"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            </div>
          ),
          cell: ({ row }) => (
            <div className="h-full text-center px-4 overflow-hidden flex items-center justify-center">
              <input
                type="checkbox"
                aria-label={`Select ${row.original.id}`}
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                disabled={!row.getCanSelect()}
              />
            </div>
          ),
        } satisfies ColumnDef<KyochiTableRow>]
        : []),
      ...columns.map((column, index) => ({
        id: `column-${index}`,
        accessorFn: (row: KyochiTableRow) =>
          row.sortValues?.[index] ?? nodeToText(row.cells[index]),
        header: () => (
          <span
            className={`inline-flex w-full items-center type-label uppercase tracking-wider k-text-subtle whitespace-normal break-words leading-tight ${
              centeredBodyColumns.includes(index)
                ? "justify-center text-center"
                : "justify-start text-left"
            }`}
          >
            {column}
          </span>
        ),
        cell: ({ row }: { row: { original: KyochiTableRow } }) => (
          <div
            className={`flex h-full w-full items-center overflow-hidden px-4 ${centeredBodyColumns.includes(index) ? "justify-center text-center" : "justify-start text-left"
              }`}
          >
            <div className="w-full text-[12px] leading-[1.35] k-text-strong whitespace-normal break-words [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:[-webkit-line-clamp:3] overflow-hidden">
              {row.original.cells[index]}
            </div>
          </div>
        ),
      })),
      {
        id: "actions",
        enableSorting: false,
        header: () => (
          <span className="inline-flex items-center justify-center text-center type-label uppercase tracking-wider k-text-subtle">
            Actions
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex h-full w-full items-center justify-center overflow-hidden px-4 text-center whitespace-normal break-words">
            <div className="inline-flex items-center gap-1">
              {row.original.actions}
              {(onEditRow || onDeleteRow) && (
                <>
                  <div className="inline-flex items-center gap-1">
                    {onEditRow && row.original.canEdit !== false ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        className="inline-flex items-center justify-center rounded-l-md"
                        aria-label={`Edit ${row.original.id}`}
                        title={`Edit ${row.original.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onEditRow(row.original);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    ) : null}
                    {onDeleteRow && row.original.canDelete !== false ? (
                      <Button
                        type="button"
                        variant="destructive-outline"
                        size="icon-xs"
                        aria-label={`Delete ${row.original.id}`}
                        title={`Delete ${row.original.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onDeleteRow(row.original);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        ),
      },
    ],
    [centeredBodyColumns, columns, onDeleteRow, onEditRow, showSelection],
  );

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getRowId: (row) => row.id,
    enableRowSelection: showSelection,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (!allRowsCheckboxRef.current) {
      return;
    }
    allRowsCheckboxRef.current.indeterminate =
      table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
  }, [rowSelection, table]);

  useEffect(() => {
    onSelectionChange?.(table.getSelectedRowModel().rows.map((row) => row.original));
  }, [onSelectionChange, rowSelection, table]);

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();
  const visibleRows = table.getRowModel().rows;
  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1;
  const placeholderRowCount = Math.max(0, pageSize - visibleRows.length);

  const getPageItems = (pages: number, current: number): Array<number | "..."> => {
    if (pages <= 6) {
      return Array.from({ length: pages }, (_, index) => index + 1);
    }

    const tailStart = pages - 2;
    const windowStart = Math.min(Math.max(current - 1, 1), pages - 5);
    const window = [windowStart, windowStart + 1, windowStart + 2];
    const tail = [tailStart, tailStart + 1, tailStart + 2];

    if (window[2] < tailStart - 1) {
      return [...window, "...", ...tail];
    }

    return Array.from(new Set([...window, ...tail])).sort((a, b) => a - b);
  };

  const pageItems = getPageItems(totalPages, currentPage);
  const pagerBaseClass =
    "border-[var(--kyochi-gold-500)] text-[var(--kyochi-gold-600)] focus-visible:ring-[var(--kyochi-gold-500)] focus-visible:border-[var(--kyochi-gold-500)]";
  const pagerActiveClass =
    "bg-[var(--kyochi-gold-500)] border-[var(--kyochi-gold-500)] text-white hover:bg-[var(--kyochi-gold-600)]";
  const getSoftRowClass = (visualIndex: number, interactive: boolean) => {
    const base = visualIndex % 2 === 0 ? "bg-white" : "bg-[#fbf8ef]";
    const hover = interactive ? "hover:bg-[#f7f2df]" : "";
    return `${base} border-b border-[var(--k-color-border-soft)] ${hover}`.trim();
  };

  return (
    <div className="space-y-2">
      <div className={`overflow-hidden rounded-2xl ${tone === "soft" ? "bg-transparent" : "k-surface"}`}>
        <Table className={`${minTableWidthClassName} table-fixed`}>
          <colgroup>
            {showSelection && <col style={{ width: `${selectColumnWidth}px` }} />}
            {columns.map((column, index) => (
              <col key={`col-${column}-${index}`} style={{ width: dynamicColumnWidth }} />
            ))}
            <col style={{ width: `${actionsColumnWidth}px` }} />
          </colgroup>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={`${tone === "soft" ? "bg-[#f5f2e8] border-b border-[var(--k-color-border-soft)]" : "k-surface-muted"} hover:bg-transparent`}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="align-middle h-12">
                    {header.isPlaceholder ? null : (
                      (() => {
                        const columnMatch = header.column.id.match(/^column-(\d+)$/);
                        const columnIndex = columnMatch ? Number(columnMatch[1]) : -1;
                        const isDataColumn = columnIndex >= 0;
                        const isCenteredColumn =
                          columnIndex >= 0 && centeredBodyColumns.includes(columnIndex);
                        const alignmentClass = isDataColumn
                          ? isCenteredColumn
                            ? "justify-center px-0"
                            : "justify-start px-4"
                          : "justify-center px-0";

                        return (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={`inline-flex h-auto w-full items-center gap-0.5 border-0 bg-transparent py-0 hover:bg-transparent ${alignmentClass} ${
                          header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && header.column.getIsSorted() === "asc" && (
                          <ArrowUp className="size-3.5 k-text-subtle" />
                        )}
                        {header.column.getCanSort() && header.column.getIsSorted() === "desc" && (
                          <ArrowDown className="size-3.5 k-text-subtle" />
                        )}
                        {header.column.getCanSort() && !header.column.getIsSorted() && (
                          <ArrowUpDown className="size-3.5 k-text-subtle" />
                        )}
                      </Button>
                        );
                      })()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={
                    onRowClick
                      ? (event) => {
                          event.preventDefault();
                          onRowClick(row.original);
                        }
                      : undefined
                  }
                  className={`group h-[42px] max-h-[42px] align-middle hover:h-[63px] hover:max-h-[63px] ${tone === "soft"
                    ? getSoftRowClass(row.index, true)
                    : "k-row-hover"
                    } transition-[height,background-color] duration-200 ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-0 align-middle h-[42px] max-h-[42px] overflow-hidden group-hover:h-[63px] group-hover:max-h-[63px] transition-[height] duration-200"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (showSelection ? 2 : 1)} className="h-24 text-center type-small k-text-body">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {placeholderRowCount > 0 &&
              Array.from({ length: placeholderRowCount }).map((_, index) => {
                const visualIndex = visibleRows.length + index;
                const placeholderTone = tone === "soft" ? getSoftRowClass(visualIndex, false) : "";
                return (
                  <TableRow
                    key={`placeholder-row-${index}`}
                    aria-hidden="true"
                    className={`h-[42px] max-h-[42px] align-middle pointer-events-none ${placeholderTone}`}
                  >
                    {Array.from({ length: columns.length + (showSelection ? 2 : 1) }).map((__, cellIndex) => (
                      <TableCell
                        key={`placeholder-cell-${index}-${cellIndex}`}
                        className="p-0 align-middle h-[42px] max-h-[42px] overflow-hidden"
                      >
                        <div className="h-full w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center border-t k-border-soft pt-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            className={`disabled:opacity-40 ${pagerBaseClass}`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {pageItems.map((item, index) => {
            if (item === "...") {
              const prevNumber = [...pageItems.slice(0, index)].reverse().find((value): value is number => typeof value === "number");
              const nextNumber = pageItems.slice(index + 1).find((value): value is number => typeof value === "number");
              const currentIndex = pageItems.findIndex((value) => value === currentPage);
              const isLeftEllipsis = currentIndex !== -1 && index < currentIndex;
              const fallbackTarget = currentPage;
              const targetPage =
                prevNumber !== undefined && nextNumber !== undefined
                  ? isLeftEllipsis
                    ? Math.max(1, nextNumber - 1)
                    : Math.min(totalPages, prevNumber + 1)
                  : fallbackTarget;

              return (
                <Button
                  key={`ellipsis-${index}`}
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  className={`type-small font-bold k-text-subtle ${pagerBaseClass}`}
                  onClick={() => table.setPageIndex(targetPage - 1)}
                  aria-label={`Jump to page ${targetPage}`}
                  title={`Jump to page ${targetPage}`}
                >
                  ...
                </Button>
              );
            }

            return (
              <Button
                key={`page-${item}`}
                type="button"
                variant={item === currentPage ? "default" : "outline"}
                size="icon-xs"
                className={`type-small font-bold ${
                  item === currentPage ? pagerActiveClass : `${pagerBaseClass} k-text-strong`
                }`}
                onClick={() => table.setPageIndex(item - 1)}
              >
                {item}
              </Button>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            className={`disabled:opacity-40 ${pagerBaseClass}`}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
