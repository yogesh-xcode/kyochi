"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DatePickerInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
};

const toIso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromIso = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

const formatDisplay = (value: string) => {
  const parsed = fromIso(value);
  if (!parsed) {
    return "";
  }
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}-${month}-${year}`;
};

const shortWeekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pickerRowHeight = 32;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isBefore = (left: string, right: string) => left < right;
const isAfter = (left: string, right: string) => left > right;

export function DatePickerInput({
  id,
  value,
  onChange,
  min,
  max,
  disabled,
  readOnly,
  placeholder = "dd-mm-yyyy",
  className,
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const monthMenuRef = useRef<HTMLDivElement | null>(null);
  const yearMenuRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => fromIso(value), [value]);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date(),
  );

  useEffect(() => {
    if (!selectedDate) {
      return;
    }
    setVisibleMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  useEffect(() => {
    if (open) {
      return;
    }
    setMonthMenuOpen(false);
    setYearMenuOpen(false);
  }, [open]);

  useEffect(() => {
    if (!monthMenuOpen || !monthMenuRef.current) {
      return;
    }
    monthMenuRef.current.scrollTop = Math.max(
      0,
      visibleMonth.getMonth() * pickerRowHeight,
    );
  }, [monthMenuOpen, visibleMonth]);

  const minIso = min && fromIso(min) ? min : undefined;
  const maxIso = max && fromIso(max) ? max : undefined;
  const minDate = minIso ? fromIso(minIso) : null;
  const maxDate = maxIso ? fromIso(maxIso) : null;
  const todayIso = toIso(new Date());
  const yearOptions = useMemo(() => {
    const currentYear = visibleMonth.getFullYear();
    const startYear = minDate ? minDate.getFullYear() : currentYear - 80;
    const endYear = maxDate ? maxDate.getFullYear() : currentYear + 30;
    const years: number[] = [];
    for (let year = startYear; year <= endYear; year += 1) {
      years.push(year);
    }
    return years;
  }, [maxDate, minDate, visibleMonth]);

  useEffect(() => {
    if (!yearMenuOpen || !yearMenuRef.current) {
      return;
    }
    const selectedYearIndex = yearOptions.findIndex(
      (year) => year === visibleMonth.getFullYear(),
    );
    if (selectedYearIndex < 0) {
      return;
    }
    yearMenuRef.current.scrollTop = Math.max(0, selectedYearIndex * pickerRowHeight);
  }, [yearMenuOpen, yearOptions, visibleMonth]);

  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const lastDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
  const leading = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const dayCells: Array<{ iso: string; day: number; inMonth: boolean; disabled: boolean }> = [];

  for (let i = 0; i < leading; i += 1) {
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), i - leading + 1);
    const iso = toIso(date);
    dayCells.push({
      iso,
      day: date.getDate(),
      inMonth: false,
      disabled: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
    const iso = toIso(date);
    const outOfMin = minIso ? isBefore(iso, minIso) : false;
    const outOfMax = maxIso ? isAfter(iso, maxIso) : false;
    dayCells.push({
      iso,
      day,
      inMonth: true,
      disabled: outOfMin || outOfMax,
    });
  }

  while (dayCells.length % 7 !== 0) {
    const offset = dayCells.length - (leading + daysInMonth);
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, offset + 1);
    const iso = toIso(date);
    dayCells.push({
      iso,
      day: date.getDate(),
      inMonth: false,
      disabled: true,
    });
  }

  const pickDate = (iso: string) => {
    onChange(iso);
    setOpen(false);
  };

  const setToday = () => {
    const outOfMin = minIso ? isBefore(todayIso, minIso) : false;
    const outOfMax = maxIso ? isAfter(todayIso, maxIso) : false;
    if (outOfMin || outOfMax) {
      return;
    }
    onChange(todayIso);
    setVisibleMonth(new Date());
    setOpen(false);
  };

  const canInteract = !disabled && !readOnly;

  const selectMonth = (monthIndex: number) => {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), monthIndex, 1));
    setMonthMenuOpen(false);
  };

  const selectYear = (year: number) => {
    setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1));
    setYearMenuOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={!canInteract}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)] px-3 text-left text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-color-brand)]/20 disabled:cursor-not-allowed disabled:opacity-100",
            canInteract
              ? "text-[var(--k-color-text-strong)]"
              : "border-[#e4dcc7] bg-[#f7f4ea] text-[#8b7a55]",
            className,
          )}
        >
          <span className={value ? "" : "text-muted-foreground"}>
            {value ? formatDisplay(value) : placeholder}
          </span>
          <CalendarDays className="size-4 text-[var(--k-color-text-subtle)]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[272px] border-[var(--k-color-border-soft)] bg-white p-0"
      >
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setMonthMenuOpen((current) => !current);
                    setYearMenuOpen(false);
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--k-color-border-soft)] bg-[#fbf8ef] px-2 text-[13px] font-semibold text-[var(--k-color-text-strong)] hover:bg-[#f5efe0]"
                >
                  {monthNames[visibleMonth.getMonth()]}
                  <ChevronDown className="size-3.5 opacity-75" />
                </button>
                {monthMenuOpen ? (
                  <div
                    ref={monthMenuRef}
                    className="absolute left-0 top-9 z-20 max-h-52 w-36 overflow-auto rounded-md border border-[var(--k-color-border-soft)] bg-white p-1 shadow-md"
                  >
                    {monthNames.map((name, monthIndex) => {
                      const selected = monthIndex === visibleMonth.getMonth();
                      return (
                        <button
                          key={`month-menu-${name}`}
                          type="button"
                          onClick={() => selectMonth(monthIndex)}
                          className={cn(
                            "block h-8 w-full rounded px-2 text-left text-[13px]",
                            selected
                              ? "bg-[var(--k-color-brand)] font-semibold text-white"
                              : "text-[var(--k-color-text-strong)] hover:bg-[#f5efe0]",
                          )}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setYearMenuOpen((current) => !current);
                    setMonthMenuOpen(false);
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--k-color-border-soft)] bg-[#fbf8ef] px-2 text-[13px] font-semibold text-[var(--k-color-text-strong)] hover:bg-[#f5efe0]"
                >
                  {visibleMonth.getFullYear()}
                  <ChevronDown className="size-3.5 opacity-75" />
                </button>
                {yearMenuOpen ? (
                  <div
                    ref={yearMenuRef}
                    className="absolute left-0 top-9 z-20 max-h-52 w-24 overflow-auto rounded-md border border-[var(--k-color-border-soft)] bg-white p-1 shadow-md"
                  >
                    {yearOptions.map((year) => {
                      const selected = year === visibleMonth.getFullYear();
                      return (
                        <button
                          key={`year-menu-${year}`}
                          type="button"
                          onClick={() => selectYear(year)}
                          className={cn(
                            "block h-8 w-full rounded px-2 text-left text-[13px]",
                            selected
                              ? "bg-[var(--k-color-brand)] font-semibold text-white"
                              : "text-[var(--k-color-text-strong)] hover:bg-[#f5efe0]",
                          )}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-md p-1 hover:bg-[#f5efe0]"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                  )
                }
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-[#f5efe0]"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                  )
                }
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 pb-1">
            {shortWeekdays.map((label) => (
              <span
                key={`weekday-${label}`}
                className="text-center text-[12px] font-medium text-[var(--k-color-text-subtle)]"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dayCells.map((cell) => {
              const isSelected = value === cell.iso;
              const isToday = cell.iso === todayIso;
              return (
                <button
                  key={`day-${cell.iso}`}
                  type="button"
                  disabled={cell.disabled}
                  onClick={() => pickDate(cell.iso)}
                  className={cn(
                    "h-8 rounded-md text-sm",
                    !cell.inMonth && "text-[#c4b9a2]",
                    cell.disabled && "cursor-not-allowed opacity-45",
                    !cell.disabled && !isSelected && "hover:bg-[#f5efe0]",
                    isToday && !isSelected && "font-semibold text-[var(--k-color-brand)]",
                    isSelected && "bg-[var(--k-color-brand)] font-semibold text-white",
                  )}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[var(--k-color-border-soft)] pt-2">
            <button
              type="button"
              className="text-sm text-[var(--k-color-brand)] hover:underline"
              onClick={() => onChange("")}
            >
              Clear
            </button>
            <button
              type="button"
              className="text-sm text-[var(--k-color-brand)] hover:underline"
              onClick={setToday}
            >
              Today
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
