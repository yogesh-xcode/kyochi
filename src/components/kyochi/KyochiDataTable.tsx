"use client";
"use no memo";

import { isValidElement, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import {
  type ColumnDef,
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
};

type KyochiDataTableProps = {
  columns: string[];
  rows: KyochiTableRow[];
  minTableWidthClassName?: string;
  centeredBodyColumns?: number[];
  showSelection?: boolean;
  tone?: "default" | "soft";
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
}: KyochiDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const selectColumnWidth = showSelection ? 56 : 0;
  const actionsColumnWidth = 148;
  const dynamicColumnWidth = columns.length > 0 ? `calc((100% - ${selectColumnWidth + actionsColumnWidth}px) / ${columns.length})` : "auto";

  const columnDefs = useMemo<ColumnDef<KyochiTableRow>[]>(
    () => [
      ...(showSelection
        ? [{
            id: "select",
            enableSorting: false,
            header: () => (
              <div className="flex h-full w-full items-center justify-center px-4">
                <input type="checkbox" aria-label="Select all rows" />
              </div>
            ),
            cell: ({ row }: { row: { original: KyochiTableRow } }) => (
              <div className="h-full text-center px-4 overflow-hidden flex items-center justify-center">
                <input type="checkbox" aria-label={`Select ${row.original.id}`} />
              </div>
            ),
          } satisfies ColumnDef<KyochiTableRow>]
        : []),
      ...columns.map((column, index) => ({
        id: `column-${index}`,
        accessorFn: (row: KyochiTableRow) =>
          row.sortValues?.[index] ?? nodeToText(row.cells[index]),
        header: () => (
          <span className="inline-flex w-full justify-center text-center type-label uppercase tracking-wider k-text-subtle whitespace-normal break-words leading-tight">
            {column}
          </span>
        ),
        cell: ({ row }: { row: { original: KyochiTableRow } }) => (
          <div
            className={`flex h-full w-full items-center overflow-hidden px-4 ${
              centeredBodyColumns.includes(index) ? "justify-center text-center" : "justify-start text-left"
            }`}
          >
            <div className="w-full type-body k-text-strong whitespace-normal break-words leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:[-webkit-line-clamp:3] overflow-hidden">
              {row.original.cells[index]}
            </div>
          </div>
        ),
      })),
      {
        id: "actions",
        enableSorting: false,
        header: () => (
          <span className="inline-flex w-full justify-center text-center type-label uppercase tracking-wider k-text-subtle">
            Actions
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex h-full w-full items-center justify-center overflow-hidden px-4 text-center whitespace-normal break-words">
            {row.original.actions ?? (
              <div className="inline-flex items-center gap-1.5">
                <Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit ${row.original.id}`}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" aria-label={`Delete ${row.original.id}`}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        ),
      },
    ],
    [centeredBodyColumns, columns, showSelection],
  );

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 4,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();
  const totalRows = rows.length;
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="space-y-3">
      <div className={`overflow-hidden border k-border-soft ${tone === "soft" ? "rounded-2xl bg-white" : "rounded-xl k-surface"}`}>
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
                className={`${tone === "soft" ? "bg-[#f3f6fa] border-b border-[#e7edf5]" : "k-surface-muted"} hover:bg-transparent`}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="align-middle text-center h-12">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={`inline-flex w-full items-center justify-center gap-1 ${
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
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`group h-[42px] max-h-[42px] align-middle hover:h-[63px] hover:max-h-[63px] ${
                    tone === "soft" ? "border-b border-[#edf1f6] hover:bg-[#fbfcfe]" : "k-row-hover"
                  } transition-[height,background-color] duration-200`}
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
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 border-t k-border-soft pt-3 md:flex-row md:items-center md:justify-between">
        <p className="type-small k-text-body">
          Showing <span className="font-bold k-text-strong">{start} - {end}</span> of{" "}
          <span className="font-bold k-text-strong">{totalRows}</span> records
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border k-border-soft k-text-subtle disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: Math.min(table.getPageCount(), 3) }, (_, index) => {
            const active = index === pageIndex;
            return (
              <button
                key={`page-${index + 1}`}
                type="button"
                className={`inline-flex size-8 items-center justify-center rounded-lg type-small font-bold ${
                  active
                    ? "k-brand-bg k-primary-foreground"
                    : "border k-border-soft k-text-strong"
                }`}
                onClick={() => table.setPageIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border k-border-soft k-text-subtle disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
