"use client";
"use no memo";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type KyochiTableRow = {
  id: string;
  cells: React.ReactNode[];
  actions?: React.ReactNode;
};

type KyochiDataTableProps = {
  columns: string[];
  rows: KyochiTableRow[];
  minTableWidthClassName?: string;
};

export function KyochiDataTable({
  columns,
  rows,
  minTableWidthClassName = "min-w-[920px]",
}: KyochiDataTableProps) {
  const columnDefs = useMemo<ColumnDef<KyochiTableRow>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <div className="w-12 text-center px-4 py-3">
            <input type="checkbox" aria-label="Select all rows" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center px-4 py-4">
            <input type="checkbox" aria-label={`Select ${row.original.id}`} />
          </div>
        ),
      },
      ...columns.map((column, index) => ({
        id: `column-${index}`,
        header: () => <span className="type-label uppercase tracking-wider k-text-subtle">{column}</span>,
        cell: ({ row }: { row: { original: KyochiTableRow } }) => (
          <div className="type-body k-text-strong px-4 py-4 align-middle">{row.original.cells[index]}</div>
        ),
      })),
      {
        id: "actions",
        header: () => <span className="type-label uppercase tracking-wider k-text-subtle">Actions</span>,
        cell: ({ row }) => (
          <div className="px-4 py-4 text-right">
            {row.original.actions ?? (
              <div className="inline-flex items-center gap-3">
                <button type="button" className="k-brand hover:underline">
                  Edit
                </button>
                <button type="button" className="k-text-body hover:underline">
                  Delete
                </button>
              </div>
            )}
          </div>
        ),
      },
    ],
    [columns],
  );

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 4,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();
  const totalRows = rows.length;
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border k-border-soft k-surface">
        <Table className={minTableWidthClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="k-surface-muted hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="align-middle">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="k-row-hover transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="h-24 text-center type-small k-text-body">
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
