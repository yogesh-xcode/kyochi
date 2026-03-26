"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { 
  Building2, 
  CalendarDays,
  ChevronRight, 
  Clock, 
  CreditCard, 
  MapPin, 
  Phone, 
  Plus, 
  TrendingUp, 
  UserCheck,
  Wallet 
} from "lucide-react";

import { FeaturePlaceholder } from "@/components/kyochi/FeaturePlaceholder";
import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { buildFranchiseKpis, formatCurrencyINR } from "@/lib/metrics";
import { resolveUserContext } from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";
import { generateId } from "@/lib/utils";
import type { FranchiseRow } from "@/lib/supabase/types";

type FlashState = {
  tone: "success" | "error";
  message: string;
};

const toLongDateLabel = (value: string | null | undefined) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export default function FranchisesPage() {
  const { data, reload, isLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });

  const [flash, setFlash] = useState<FlashState | null>(null);
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false);
  const [selectedFranchiseIdForInvoice, setSelectedFranchiseIdForInvoice] = useState<string | null>(null);
  const [selectedFranchiseNameForInvoice, setSelectedFranchiseNameForInvoice] = useState<string | null>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileFranchise, setProfileFranchise] = useState<FranchiseRow | null>(null);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 2800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const showSuccess = useCallback((message: string) => {
    setFlash({ tone: "success", message });
  }, []);

  const openInvoiceSheet = useCallback((franchiseId: string, franchiseName: string) => {
    setSelectedFranchiseIdForInvoice(franchiseId);
    setSelectedFranchiseNameForInvoice(franchiseName);
    setIsInvoiceSheetOpen(true);
  }, []);

  const closeInvoiceSheet = useCallback(() => {
    setIsInvoiceSheetOpen(false);
    setSelectedFranchiseIdForInvoice(null);
    setSelectedFranchiseNameForInvoice(null);
  }, []);

  const openFranchiseProfile = (franchise: FranchiseRow) => {
    setProfileFranchise(franchise);
    setProfileOpen(true);
  };

  const kpis = buildFranchiseKpis(data.franchises, context.role);
  const tableConfig = tableViewConfigs.franchises;
  const locationOptions = data.franchises.map((franchise) => franchise.name);
  const cityOptions = Array.from(new Set(data.franchises.map((franchise) => franchise.city)));
  const regionOptions = Array.from(new Set(data.franchises.map((franchise) => franchise.region)));

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = (await supabase?.auth.getSession())?.data.session?.access_token;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, []);

  const persistFranchiseCreate = useCallback(
    async ({ values }: { values: string[] }) => {
      const payload = {
        id: values[0]?.trim() ?? "",
        name: values[1]?.trim() ?? "",
        address: values[2]?.trim() ?? "",
        city: values[3]?.trim() ?? "",
        region: values[4]?.trim() ?? "",
        phone: values[5]?.trim() ?? "",
        whatsapp: values[6]?.trim() ?? "",
      };
      if (!payload.id || !payload.name || !payload.address || !payload.city || !payload.region || !payload.phone || !payload.whatsapp) {
        throw new Error("Missing required franchise fields.");
      }
      const response = await fetch("/api/franchises", {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const payloadErr = await response.json().catch(() => ({}));
        throw new Error(payloadErr.message ?? "Failed to create franchise.");
      }
      await reload();
      showSuccess("Franchise location added.");
    },
    [getAuthHeaders, reload, showSuccess],
  );

  const persistFranchiseUpdate = useCallback(
    async ({ rowId, values }: { rowId: string; values: string[] }) => {
      const payload = {
        name: values[1]?.trim() ?? "",
        address: values[2]?.trim() ?? "",
        city: values[3]?.trim() ?? "",
        region: values[4]?.trim() ?? "",
        phone: values[5]?.trim() ?? "",
        whatsapp: values[6]?.trim() ?? "",
      };
      if (!payload.name || !payload.address || !payload.city || !payload.region || !payload.phone || !payload.whatsapp) {
        throw new Error("Missing required franchise fields.");
      }
      const response = await fetch(`/api/franchises/${encodeURIComponent(rowId)}`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const payloadErr = await response.json().catch(() => ({}));
        throw new Error(payloadErr.message ?? "Failed to update franchise.");
      }
      await reload();
      showSuccess("Franchise details updated.");
    },
    [getAuthHeaders, reload, showSuccess],
  );

  const persistFranchiseDelete = useCallback(
    async (rowIds: string[]) => {
      const headers = await getAuthHeaders();
      for (const rowId of rowIds) {
        const response = await fetch(`/api/franchises/${encodeURIComponent(rowId)}`, {
          method: "DELETE",
          headers,
        });
        if (!response.ok) {
          const payloadErr = await response.json().catch(() => ({}));
          throw new Error(payloadErr.message ?? `Failed to delete franchise ${rowId}.`);
        }
      }
      await reload();
      showSuccess("Franchise record removed.");
    },
    [getAuthHeaders, reload, showSuccess],
  );

  const persistFranchiseInvoice = useCallback(
    async ({
      franchiseId,
      amount,
      periodStart,
      periodEnd,
      dueDate,
    }: {
      franchiseId: string;
      amount: number;
      periodStart: string;
      periodEnd: string;
      dueDate?: string;
    }) => {
      const response = await fetch(`/api/franchises/${encodeURIComponent(franchiseId)}/invoices`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          amount,
          period_start: periodStart,
          period_end: periodEnd,
          due_date: dueDate,
        }),
      });
      if (!response.ok) {
        const payloadErr = await response.json().catch(() => ({}));
        throw new Error(payloadErr.message ?? "Failed to generate invoice.");
      }
      await reload();
      showSuccess("Royalty invoice generated.");
    },
    [getAuthHeaders, reload, showSuccess],
  );

  const franchiseInvoices = useMemo(() => {
    if (!profileFranchise) return [];
    // Assuming bootstrap data or a separate hook provides invoices.
    // In this project structure, billing might contain them or they are fetched on profile open.
    // For now, let's filter from billing if applicable or show dummy if no global invoices array.
    return (data as any).franchise_invoices?.filter((inv: any) => inv.franchise_id === profileFranchise.id) || [];
  }, [data, profileFranchise]);

  const franchiseStats = useMemo(() => {
    if (!profileFranchise) return { totalRevenue: 0, totalSessions: 0, therapistCount: 0 };
    const billing = data.billing.filter(b => b.franchise_id === profileFranchise.id && b.status === 'paid');
    const sessions = data.appointments.filter(a => a.franchise_id === profileFranchise.id);
    const therapists = data.therapists.filter(t => t.franchise_id === profileFranchise.id);
    
    return {
      totalRevenue: billing.reduce((sum, b) => sum + b.amount, 0),
      totalSessions: sessions.length,
      therapistCount: therapists.length,
    };
  }, [data.appointments, data.billing, data.therapists, profileFranchise]);

  if (context.role !== "admin") {
    return (
      <FeaturePlaceholder
        heading="Franchise Directory"
        description="This page is available to admin users only."
      />
    );
  }

  return (
    <div className="space-y-3">
      {flash ? (
        <div className="fixed right-5 top-20 z-[80]">
          <div className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${
            flash.tone === "success" ? "border-[#86efac] bg-[#f0fdf4] text-[#166534]" : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
          }`}>
            {flash.message}
          </div>
        </div>
      ) : null}

      <ManagementPageLayout
        title="Franchise Directory"
        searchPlaceholder="Search franchise locations..."
        addActionLabel="Add Franchise Location"
        createSheetTitle="Add Franchise Location"
        kpis={kpis}
        columns={tableConfig.columns}
        centeredBodyColumns={tableConfig.centeredBodyColumns}
        onCreateRow={persistFranchiseCreate}
        onUpdateRow={persistFranchiseUpdate}
        onDeleteRows={persistFranchiseDelete}
        onRowClick={(row) => {
          const franchise = data.franchises.find(f => f.id === row.id);
          if (franchise) openFranchiseProfile(franchise);
        }}
        formFieldConfigs={{
          Location: { type: "typeahead", options: locationOptions, placeholder: "Type location...", debounceMs: 250 },
          City: { type: "select", options: cityOptions },
          Region: { type: "select", options: regionOptions },
        }}
        isLoading={isLoading}
        rows={data.franchises.map((franchise) => ({
          id: franchise.id,
          cells: [
            franchise.id,
            franchise.name,
            franchise.address,
            franchise.city,
            franchise.region,
            franchise.phone,
            franchise.whatsapp,
          ],
          actions: (
            <Button
              key={`invoice-${franchise.id}`}
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label="Generate Invoice"
              title="Generate Invoice"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                openInvoiceSheet(franchise.id, franchise.name);
              }}
            >
              <Plus className="size-3.5" />
            </Button>
          ),
        }))}
      />

      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="center" className="w-[min(96vw,43.75rem)] max-h-[92vh] overflow-hidden rounded-2xl border border-[#ddd8cc] bg-white p-0 shadow-2xl [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>{profileFranchise?.name ?? "Franchise Profile"}</SheetTitle>
            <SheetDescription>Operational performance and contact details.</SheetDescription>
          </SheetHeader>

          {profileFranchise ? (
            <div className="flex max-h-[92vh] flex-col">
              <div className="flex items-start justify-between border-b border-[#ede8dc] px-6 pb-4 pt-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-[52px] place-items-center rounded-full bg-[#d4af35] text-lg font-semibold text-white">
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <p className="display-heading text-[22px] leading-none text-[#2c2416]">{profileFranchise.name}</p>
                    <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#a09080]">
                      {profileFranchise.id} · {profileFranchise.city}, {profileFranchise.region}
                    </p>
                  </div>
                </div>
                <SheetClose asChild>
                  <button type="button" className="grid size-[30px] place-items-center rounded-[7px] border border-[#ddd8cc] text-[#a09080] transition hover:bg-[#f0ede6] hover:text-[#2c2416]">×</button>
                </SheetClose>
              </div>

              <div className="overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Address</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><MapPin className="size-3 text-[#a09080]" /> {profileFranchise.address}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Primary Phone</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><Phone className="size-3 text-[#a09080]" /> {profileFranchise.phone}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">WhatsApp</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><Phone className="size-3 text-[#a09080]" /> {profileFranchise.whatsapp}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Region</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416]">{profileFranchise.region}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#fdf3dc] text-[#c8993a]">
                      <Wallet className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{formatCurrencyINR(franchiseStats.totalRevenue)}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Gross Revenue</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4e8d8] text-[#4e8060]">
                      <CalendarDays className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{franchiseStats.totalSessions}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Total Sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4ebf0] text-[#3a7a8c]">
                      <UserCheck className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{franchiseStats.therapistCount}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Therapists</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                   <div className="flex items-center justify-between mb-2.5">
                     <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a09080]">Royalty Invoices</p>
                     <Button 
                       size="xs" 
                       variant="ghost" 
                       className="h-6 text-[10px] text-[#d4af35] hover:text-[#b8941f] hover:bg-[#fdf3dc]"
                       onClick={() => openInvoiceSheet(profileFranchise.id, profileFranchise.name)}
                     >
                       <Plus className="size-3 mr-1" /> Generate New
                     </Button>
                   </div>
                  <div className="overflow-x-auto rounded-[10px] border border-[#ede8dc]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">ID</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Period</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Amount</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ede8dc]">
                        {franchiseInvoices.map((inv: any) => (
                          <tr key={inv.id} className="text-[12px] text-[#2c2416]">
                            <td className="px-3 py-2 font-medium">{inv.id}</td>
                            <td className="px-3 py-2 text-[#a09080]">{toLongDateLabel(inv.period_start)} - {toLongDateLabel(inv.period_end)}</td>
                            <td className="px-3 py-2 font-semibold">{formatCurrencyINR(inv.amount)}</td>
                            <td className="px-3 py-2"><StatusPill status={inv.status} /></td>
                          </tr>
                        ))}
                        {franchiseInvoices.length === 0 && (
                          <tr><td colSpan={4} className="px-3 py-8 text-center text-[#a09080]">No royalty invoices generated yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={isInvoiceSheetOpen} onOpenChange={setIsInvoiceSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Generate Invoice for {selectedFranchiseNameForInvoice}</SheetTitle>
            <SheetDescription>Fill in the details to generate a royalty invoice for this franchise.</SheetDescription>
          </SheetHeader>
          <InvoiceForm
            franchiseId={selectedFranchiseIdForInvoice ?? ""}
            onClose={closeInvoiceSheet}
            onSubmit={persistFranchiseInvoice}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

type InvoiceFormProps = {
  franchiseId: string;
  onClose: () => void;
  onSubmit: (data: {
    franchiseId: string;
    amount: number;
    periodStart: string;
    periodEnd: string;
    dueDate?: string;
  }) => Promise<void>;
};

function InvoiceForm({ franchiseId, onClose, onSubmit }: InvoiceFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!franchiseId || !amount || !periodStart || !periodEnd) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        franchiseId,
        amount: parseFloat(amount),
        periodStart,
        periodEnd,
        dueDate: dueDate || undefined,
      });
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to generate invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">Amount (INR)</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0" step="0.01" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="periodStart">Period Start Date</Label>
        <DatePickerInput id="periodStart" value={periodStart} onChange={setPeriodStart} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="periodEnd">Period End Date</Label>
        <DatePickerInput id="periodEnd" value={periodEnd} onChange={setPeriodEnd} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dueDate">Due Date (Optional)</Label>
        <DatePickerInput id="dueDate" value={dueDate} onChange={setDueDate} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Generating..." : "Generate Invoice"}</Button>
      </div>
    </form>
  );
}
