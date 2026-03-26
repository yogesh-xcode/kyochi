"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Lock, Printer } from "lucide-react";

import { type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
import { Button } from "@/components/ui/button";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { buildBillingKpis } from "@/lib/metrics";
import { resolveUserContext } from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";

type BillingRecord = {
  id: string;
  appointment_id: string;
  patient_id: string;
  franchise_id: string;
  amount: number;
  currency: string;
  due_date: string | null;
  status: "unpaid" | "paid";
  patients?: { full_name?: string | null } | null;
  appointments?:
    | {
        therapies?: { name?: string | null } | null;
      }
    | {
        therapies?: { name?: string | null } | null;
      }[]
    | null;
};

type FlashState = {
  tone: "success" | "error";
  message: string;
};

const getTherapyName = (entry: BillingRecord) => {
  if (Array.isArray(entry.appointments)) {
    return entry.appointments[0]?.therapies?.name ?? "—";
  }
  return entry.appointments?.therapies?.name ?? "—";
};

const toDueDateLabel = (dueDate: string | null) => {
  if (!dueDate) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dueDate}T00:00:00`));
};

const toCurrencyLabel = (amount: number, currency: string | null | undefined) => {
  const safeCurrency = (currency ?? "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${safeCurrency} ${amount.toFixed(2)}`;
  }
};

const isOverdue = (entry: BillingRecord) => {
  if (entry.status !== "unpaid" || !entry.due_date) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${entry.due_date}T00:00:00`);
  return due < today;
};

export default function BillingPage() {
  const { data, isLoading: isBootstrapLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });

  const role = context.role;
  const franchiseId = context.franchiseId;
  const patientId = context.patientId;

  const [billingRowsRaw, setBillingRowsRaw] = useState<BillingRecord[]>([]);
  const [flash, setFlash] = useState<FlashState | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!flash) {
      return;
    }
    const timer = window.setTimeout(() => setFlash(null), 2800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const loadBilling = useCallback(async () => {
    if (!supabase || role === "therapist") {
      return;
    }

    let query = supabase
      .from("billing")
      .select(`
        id,
        appointment_id,
        patient_id,
        franchise_id,
        amount,
        currency,
        due_date,
        status,
        patients(full_name),
        appointments(
          therapy_id,
          therapies(name)
        )
      `)
      .order("id", { ascending: false });

    if (role === "franchisee") {
      query = query.eq("franchise_id", franchiseId);
    } else if (role === "patient") {
      query = query.eq("patient_id", patientId);
    }

    const { data: rows, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    setBillingRowsRaw((rows ?? []) as BillingRecord[]);
  }, [franchiseId, patientId, role]);

  const printInvoice = useCallback((entry: BillingRecord) => {
    if (typeof window === "undefined") {
      return;
    }

    const patientName = entry.patients?.full_name ?? "Unknown";
    const therapyName = getTherapyName(entry);
    const popup = window.open("", "_blank", "noopener,noreferrer,width=860,height=700");
    if (!popup) {
      return;
    }
    popup.document.write(`
      <!doctype html>
      <html><head><meta charset=\"utf-8\"><title>Invoice ${entry.id}</title></head>
      <body style=\"font-family: 'Manrope', sans-serif; padding: 24px;\">
        <h1>Invoice ${entry.id}</h1>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Therapy:</strong> ${therapyName}</p>
        <p><strong>Amount:</strong> ${toCurrencyLabel(entry.amount, entry.currency)}</p>
        <p><strong>Due Date:</strong> ${toDueDateLabel(entry.due_date)}</p>
        <p><strong>Status:</strong> ${entry.status.toUpperCase()}</p>
      </body></html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  }, []);

  useEffect(() => {
    let active = true;
    void loadBilling()
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Failed to load billing.";
        setFlash({ tone: "error", message });
      })
      .finally(() => {
        if (active) {
          setIsPageLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [loadBilling]);

  const markPaid = useCallback(
    async (entry: BillingRecord) => {
      if (!supabase || entry.status !== "unpaid") {
        return;
      }

      const confirmed = window.confirm("Mark this invoice as paid? This cannot be undone.");
      if (!confirmed) {
        return;
      }

      const { error } = await supabase
        .from("billing")
        .update({ status: "paid" })
        .eq("id", entry.id)
        .eq("status", "unpaid");

      if (error) {
        setFlash({ tone: "error", message: error.message });
        return;
      }

      await loadBilling();
      setFlash({ tone: "success", message: "Invoice marked as paid" });
    },
    [loadBilling],
  );

  const kpis = useMemo(() => buildBillingKpis(billingRowsRaw, role), [billingRowsRaw, role]);

  const billingRows: KyochiTableRow[] = useMemo(
    () =>
      billingRowsRaw.map((entry) => {
        const therapyName = getTherapyName(entry);
        const patientName = entry.patients?.full_name ?? "Unknown";
        const overdue = isOverdue(entry);
        const dueDateLabel = toDueDateLabel(entry.due_date);
        const statusLabel = overdue ? "Overdue" : entry.status === "paid" ? "Paid" : "Unpaid";

        const actions = role === "patient" ? (
          <Button
            type="button"
            variant="outline"
            size="xs"
            aria-label="Print Invoice"
            title="Print Invoice"
            onClick={() => {
              printInvoice(entry);
            }}
          >
            <Printer className="size-3.5" />
            Print
          </Button>
        ) : entry.status === "unpaid" ? (
          <Button
            type="button"
            variant="outline"
            size="xs"
            aria-label="Mark Paid"
            title="Mark Paid"
            onClick={() => {
              void markPaid(entry);
            }}
          >
            <Check className="size-3.5" />
            Mark Paid
          </Button>
        ) : (
          <span
            className="inline-flex items-center justify-center rounded-md border border-[var(--k-color-border-soft)] bg-[#f7f4ea] p-1.5 text-[#8b7a55]"
            title="Invoice is locked after payment"
            aria-label="Invoice is locked after payment"
          >
            <Lock className="size-3.5" />
          </span>
        );

        return {
          id: entry.id,
          actions,
          sortValues: [
            patientName,
            therapyName,
            entry.amount,
            dueDateLabel,
            statusLabel,
          ],
          cells: [
            <span key={`${entry.id}-patient`} className="font-semibold text-[#1e293b]">
              {patientName}
            </span>,
            <span key={`${entry.id}-therapy`}>{therapyName}</span>,
            <span key={`${entry.id}-amount`} className="font-medium text-[#334155]">
              {toCurrencyLabel(entry.amount, entry.currency)}
            </span>,
            <span
              key={`${entry.id}-due-date`}
              className={overdue ? "font-semibold text-[#dc2626]" : "text-[#334155]"}
            >
              {dueDateLabel}
            </span>,
            <StatusPill key={`${entry.id}-status`} status={statusLabel} />,
          ],
        };
      }),
    [billingRowsRaw, markPaid, printInvoice, role],
  );

  const tableConfig = tableViewConfigs.billing;

  if (role === "therapist") {
    return null;
  }

  return (
    <div className="space-y-3">
      {flash ? (
        <div
          className={`rounded-xl border px-4 py-2 text-sm font-medium ${
            flash.tone === "success"
              ? "border-[#d1fae5] bg-[#ecfdf5] text-[#065f46]"
              : "border-[#fecaca] bg-[#fff1f2] text-[#991b1b]"
          }`}
        >
          {flash.message}
        </div>
      ) : null}

      <ManagementPageLayout
        title="Billing"
        searchPlaceholder="Search billing records..."
        kpis={kpis}
        columns={tableConfig.columns}
        centeredBodyColumns={tableConfig.centeredBodyColumns}
        showAddAction={false}
        showUploadAction={false}
        enableRowEdit={false}
        enableRowDelete={false}
        enableBulkDelete={false}
        showSelection={false}
        isLoading={isBootstrapLoading || isPageLoading}
        rows={billingRows}
      />
    </div>
  );
}
