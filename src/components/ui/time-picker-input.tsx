"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TimePickerInputProps = {
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

type Meridiem = "AM" | "PM";

const parseTimeToMinutes = (value: string) => {
  const ampm = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    const hour12 = Number(ampm[1]);
    const minute = Number(ampm[2]);
    const meridiem = ampm[3].toUpperCase() as Meridiem;
    if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) {
      return null;
    }
    const hour24 = (hour12 % 12) + (meridiem === "PM" ? 12 : 0);
    return hour24 * 60 + minute;
  }

  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  return hour * 60 + minute;
};

const toTime = (hour: number, minute: number) =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const normalizeMinutes = (minutes: number) => {
  const day = 24 * 60;
  return ((minutes % day) + day) % day;
};

const pickerRowHeight = 36;

const toTwelveHourText = (minutes: number) => {
  const safe = normalizeMinutes(minutes);
  const hour24 = Math.floor(safe / 60);
  const minute = safe % 60;
  const meridiem: Meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${meridiem}`;
};

const hour12To24 = (hour12: number, meridiem: Meridiem) =>
  (hour12 % 12) + (meridiem === "PM" ? 12 : 0);

export function TimePickerInput({
  id,
  value,
  onChange,
  min,
  max,
  disabled,
  readOnly,
  placeholder = "hh:mm AM/PM",
  className,
}: TimePickerInputProps) {
  const [open, setOpen] = useState(false);
  const hourListRef = useRef<HTMLDivElement | null>(null);
  const minuteListRef = useRef<HTMLDivElement | null>(null);
  const selectedMinutes = useMemo(() => parseTimeToMinutes(value), [value]);
  const selectedHour = selectedMinutes === null ? null : Math.floor(selectedMinutes / 60);
  const selectedMinute = selectedMinutes === null ? null : selectedMinutes % 60;
  const selectedMeridiem: Meridiem =
    selectedHour !== null && selectedHour >= 12 ? "PM" : "AM";
  const selectedHour12 =
    selectedHour === null ? null : selectedHour % 12 || 12;

  const minMinutes = min ? parseTimeToMinutes(min) : null;
  const maxMinutes = max ? parseTimeToMinutes(max) : null;
  const canInteract = !disabled && !readOnly;
  const now = new Date();
  const nowValue = toTwelveHourText(now.getHours() * 60 + now.getMinutes());

  const isDisabledValue = (minutes: number) => {
    if (minMinutes !== null && minutes < minMinutes) {
      return true;
    }
    if (maxMinutes !== null && minutes > maxMinutes) {
      return true;
    }
    return false;
  };

  const selectHour = (hour: number) => {
    const minute = selectedMinute ?? 0;
    const meridiem = selectedMeridiem;
    const nextMinutes = hour12To24(hour, meridiem) * 60 + minute;
    if (isDisabledValue(nextMinutes)) {
      return;
    }
    onChange(toTwelveHourText(nextMinutes));
  };

  const selectMinute = (minute: number) => {
    const hour12 = selectedHour12 ?? ((now.getHours() % 12) || 12);
    const meridiem = selectedMeridiem;
    const nextMinutes = hour12To24(hour12, meridiem) * 60 + minute;
    if (isDisabledValue(nextMinutes)) {
      return;
    }
    onChange(toTwelveHourText(nextMinutes));
  };

  const selectMeridiem = (meridiem: Meridiem) => {
    const hour12 = selectedHour12 ?? ((now.getHours() % 12) || 12);
    const minute = selectedMinute ?? now.getMinutes();
    const nextMinutes = hour12To24(hour12, meridiem) * 60 + minute;
    if (isDisabledValue(nextMinutes)) {
      return;
    }
    onChange(toTwelveHourText(nextMinutes));
  };

  const setNow = () => {
    const minutes = parseTimeToMinutes(nowValue);
    if (minutes === null || isDisabledValue(minutes)) {
      return;
    }
    onChange(nowValue);
  };

  const applyMinutes = (minutes: number) => {
    const safe = normalizeMinutes(minutes);
    if (isDisabledValue(safe)) {
      return;
    }
    onChange(toTwelveHourText(safe));
  };

  const nudgeMinutes = (delta: number) => {
    const base = selectedMinutes ?? parseTimeToMinutes(nowValue) ?? 0;
    for (let attempt = 1; attempt <= 24 * 60; attempt += 1) {
      const candidate = normalizeMinutes(base + delta * attempt);
      if (!isDisabledValue(candidate)) {
        applyMinutes(candidate);
        return;
      }
    }
  };

  const nudgeHours = (delta: number) => {
    nudgeMinutes(delta * 60);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const hourIndex = selectedHour12 ? selectedHour12 - 1 : null;
    if (hourIndex !== null && hourListRef.current) {
      hourListRef.current.scrollTop = Math.max(0, hourIndex * pickerRowHeight);
    }

    if (selectedMinute !== null && minuteListRef.current) {
      minuteListRef.current.scrollTop = Math.max(0, selectedMinute * pickerRowHeight);
    }
  }, [open, selectedHour12, selectedMinute]);

  const handleWheelListScroll = (
    event: React.WheelEvent<HTMLDivElement>,
    listRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    event.preventDefault();
    list.scrollTop += event.deltaY;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={!canInteract}
          onKeyDown={(event) => {
            if (!canInteract) {
              return;
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              nudgeMinutes(1);
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              nudgeMinutes(-1);
              return;
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              nudgeHours(1);
              return;
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudgeHours(-1);
            }
          }}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)] px-3 text-left text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-color-brand)]/20 disabled:cursor-not-allowed disabled:opacity-100",
            canInteract
              ? "text-[var(--k-color-text-strong)]"
              : "border-[#e4dcc7] bg-[#f7f4ea] text-[#8b7a55]",
            className,
          )}
        >
          <span className={value ? "" : "text-muted-foreground"}>
            {value ? toTwelveHourText(parseTimeToMinutes(value) ?? 0) : placeholder}
          </span>
          <Clock3 className="size-4 text-[var(--k-color-text-subtle)]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[250px] border-[var(--k-color-border-soft)] bg-white p-0"
      >
        <div className="p-3">
          <div className="mb-2 text-sm font-semibold text-[var(--k-color-text-strong)]">
            Select Time
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--k-color-text-subtle)]">
                Hour
              </p>
              <div
                ref={hourListRef}
                className="max-h-44 space-y-1 overflow-auto rounded-md border border-[var(--k-color-border-soft)] p-1"
                onWheel={(event) => handleWheelListScroll(event, hourListRef)}
              >
                {Array.from({ length: 12 }).map((_, offset) => {
                  const hour = offset + 1;
                  const minute = selectedMinute ?? 0;
                  const itemMinutes = hour12To24(hour, selectedMeridiem) * 60 + minute;
                  const itemDisabled = isDisabledValue(itemMinutes);
                  const selected = selectedHour12 === hour;
                  return (
                    <button
                      key={`hour-${hour}`}
                      type="button"
                      disabled={itemDisabled}
                      onClick={() => selectHour(hour)}
                      className={cn(
                        "flex h-8 w-full items-center justify-between rounded px-2 text-sm",
                        itemDisabled && "cursor-not-allowed opacity-45",
                        !itemDisabled && "hover:bg-[#f5efe0]",
                        selected && "bg-[var(--k-color-brand)] text-white hover:bg-[var(--k-color-brand)]",
                      )}
                    >
                      <span>{String(hour).padStart(2, "0")}</span>
                      {selected ? <Check className="size-3.5" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--k-color-text-subtle)]">
                Minute
              </p>
              <div
                ref={minuteListRef}
                className="max-h-44 space-y-1 overflow-auto rounded-md border border-[var(--k-color-border-soft)] p-1"
                onWheel={(event) => handleWheelListScroll(event, minuteListRef)}
              >
                {Array.from({ length: 60 }).map((_, minute) => {
                  const hour12 = selectedHour12 ?? ((now.getHours() % 12) || 12);
                  const itemMinutes = hour12To24(hour12, selectedMeridiem) * 60 + minute;
                  const itemDisabled = isDisabledValue(itemMinutes);
                  const selected = selectedMinute === minute;
                  return (
                    <button
                      key={`minute-${minute}`}
                      type="button"
                      disabled={itemDisabled}
                      onClick={() => selectMinute(minute)}
                      className={cn(
                        "flex h-8 w-full items-center justify-between rounded px-2 text-sm",
                        itemDisabled && "cursor-not-allowed opacity-45",
                        !itemDisabled && "hover:bg-[#f5efe0]",
                        selected && "bg-[var(--k-color-brand)] text-white hover:bg-[var(--k-color-brand)]",
                      )}
                    >
                      <span>{String(minute).padStart(2, "0")}</span>
                      {selected ? <Check className="size-3.5" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["AM", "PM"] as const).map((period) => {
              const selected = selectedMeridiem === period;
              return (
                <button
                  key={`meridiem-${period}`}
                  type="button"
                  onClick={() => selectMeridiem(period)}
                  className={cn(
                    "h-8 rounded-md border text-sm font-semibold",
                    selected
                      ? "border-[var(--k-color-brand)] bg-[var(--k-color-brand)] text-white"
                      : "border-[var(--k-color-border-soft)] bg-white text-[var(--k-color-text-strong)] hover:bg-[#f5efe0]",
                  )}
                >
                  {period}
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
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-sm text-[var(--k-color-brand)] hover:underline"
                onClick={setNow}
              >
                Now
              </button>
              <button
                type="button"
                className="text-sm text-[var(--k-color-brand)] hover:underline"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
