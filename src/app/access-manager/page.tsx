"use client";

import { useEffect, useMemo, useState } from "react";

import { AlertCircle, Check, CheckCircle2, Users } from "lucide-react";

import { AccessManagerSkeleton } from "@/components/kyochi/PageSkeletons";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { resolveUserContext } from "@/lib/roleScope";

type AccessRequestRow = {
  id: string;
  requester_user_id: string;
  requester_name: string;
  requester_email: string;
  requested_role: "therapist" | "franchisee";
  requested_franchise_id: string | null;
  status: "pending" | "approved" | "rejected";
  message: string;
  created_at: string;
};

type RequestDecisionDraft = {
  role: "therapist" | "franchisee" | "admin";
  franchiseId: string;
  createNewTherapist: boolean;
  therapistId: string;
};

const defaultDraft: RequestDecisionDraft = {
  role: "therapist",
  franchiseId: "",
  createNewTherapist: true,
  therapistId: "",
};

export default function AccessManagerPage() {
  const { data, isLoading: isBootstrapLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });
  const [requests, setRequests] = useState<AccessRequestRow[]>([]);
  const [decisionByRequestId, setDecisionByRequestId] = useState<
    Record<string, RequestDecisionDraft>
  >({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingForRequestId, setIsSubmittingForRequestId] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const franchiseOptions = useMemo(
    () => data.franchises.map((row) => ({ id: row.id, name: row.name })),
    [data.franchises],
  );
  const therapistOptions = useMemo(
    () => data.therapists.map((row) => ({ id: row.id, name: row.full_name })),
    [data.therapists],
  );

  const loadRequests = async () => {
    const accessToken =
      (await supabase?.auth.getSession())?.data.session?.access_token ?? undefined;
    if (!accessToken) {
      setRequests([]);
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/access-requests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }).catch(() => null);

    if (!response?.ok) {
      setRequests([]);
      setIsLoading(false);
      return;
    }

    const payload = (await response.json()) as AccessRequestRow[];
    setRequests(payload);
    setDecisionByRequestId((prev) => {
      const next = { ...prev };
      for (const row of payload) {
        if (!next[row.id]) {
          next[row.id] = {
            ...defaultDraft,
            role: row.requested_role === "franchisee" ? "franchisee" : "therapist",
            franchiseId: row.requested_franchise_id ?? franchiseOptions[0]?.id ?? "",
          };
        }
      }
      return next;
    });
    setIsLoading(false);
  };

  useEffect(() => {
    void loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDraft = (
    requestId: string,
    updater: (prev: RequestDecisionDraft) => RequestDecisionDraft,
  ) => {
    setDecisionByRequestId((prev) => ({
      ...prev,
      [requestId]: updater(prev[requestId] ?? defaultDraft),
    }));
  };

  const approveRequest = async (requestId: string) => {
    const accessToken =
      (await supabase?.auth.getSession())?.data.session?.access_token ?? undefined;
    if (!accessToken) {
      setStatusMessage("Session missing. Please sign in again.");
      return;
    }

    const draft = decisionByRequestId[requestId] ?? defaultDraft;
    setIsSubmittingForRequestId(requestId);
    setStatusMessage(null);

    const response = await fetch("/api/access-requests/approve", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        requestId,
        role: draft.role,
        franchiseId: draft.franchiseId || null,
        createNewTherapist: draft.createNewTherapist,
        therapistId:
          draft.role === "therapist" && !draft.createNewTherapist
            ? draft.therapistId
            : undefined,
      }),
    }).catch(() => null);

    if (!response) {
      setStatusMessage("Approval failed. Try again.");
      setIsSubmittingForRequestId(null);
      return;
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      setStatusMessage(payload.message ?? "Approval failed.");
      setIsSubmittingForRequestId(null);
      return;
    }

    setStatusMessage("Request approved.");
    setIsSubmittingForRequestId(null);
    await loadRequests();
  };

  if (isBootstrapLoading) {
    return <AccessManagerSkeleton />;
  }

  if (context.role !== "admin") {
    return (
      <div className="rounded-xl border k-border-soft bg-white p-6">
        <h1 className="text-lg font-semibold k-text-strong">Access Manager</h1>
        <p className="mt-2 text-sm k-text-body">Admin access only.</p>
      </div>
    );
  }

  if (isLoading) {
    return <AccessManagerSkeleton />;
  }

  const pendingCount = requests.filter((row) => row.status === "pending").length;
  const approvedCount = requests.filter((row) => row.status === "approved").length;
  const filteredRequests = requests.filter((row) =>
    filter === "all" ? true : row.status === filter,
  );

  const statusPillClass = (status: AccessRequestRow["status"]) => {
    if (status === "approved") {
      return "bg-[#d9f0df] text-[#326e48]";
    }
    if (status === "rejected") {
      return "bg-[#f7dddd] text-[#ad4a4a]";
    }
    return "bg-[#f6e3e3] text-[#b35f5f]";
  };

  return (
    <div className="space-y-4">
      <div className="px-1 pt-1">
        <h1 className="text-[24px] leading-none tracking-tight text-[#2b2418] [font-family:var(--font-manrope),system-ui,sans-serif]">
          Access Manager
        </h1>
        <p className="mt-1 text-[12px] text-[#8f7e64]">
          Review pending access requests and assign role and context.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
        <div className="rounded-xl border border-[#ddd6c7] bg-white px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-[#f7e4e4] p-1.5 text-[#ba5555]">
              <AlertCircle className="size-4" />
            </div>
            <div>
              <p className="text-[22px] leading-none text-[#2b2418] [font-family:var(--font-manrope),system-ui,sans-serif]">
                {pendingCount}
              </p>
              <p className="mt-0.5 text-xs text-[#8f7e64]">Pending review</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[#ddd6c7] bg-white px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-[#d9ecdf] p-1.5 text-[#4f7b62]">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <p className="text-[22px] leading-none text-[#2b2418] [font-family:var(--font-manrope),system-ui,sans-serif]">
                {approvedCount}
              </p>
              <p className="mt-0.5 text-xs text-[#8f7e64]">Approved</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[#ddd6c7] bg-white px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-[#ece6d9] p-1.5 text-[#7b6a4f]">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-[22px] leading-none text-[#2b2418] [font-family:var(--font-manrope),system-ui,sans-serif]">
                {requests.length}
              </p>
              <p className="mt-0.5 text-xs text-[#8f7e64]">Total requests</p>
            </div>
          </div>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-lg border k-border-soft bg-white px-4 py-2 text-sm k-text-body">
          {statusMessage}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-[#ddd6c7] bg-white">
        <div className="flex items-center justify-between border-b border-[#e8e1d1] px-5 py-4">
          <p className="text-sm font-semibold text-[#2b2418]">Access requests</p>
          <span className="rounded-full bg-[#f2ede1] px-3 py-1 text-xs text-[#8f7e64]">
            {requests.length} users
          </span>
        </div>

        <div className="flex items-center gap-2 border-b border-[#e8e1d1] bg-[#fdfbf5] px-5 py-2.5">
          {(["all", "pending", "approved"] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={`rounded-full border px-3 py-0.5 text-[11px] font-medium transition ${
                filter === status
                  ? "border-[#2c2416] bg-[#2c2416] text-[#f7f4ee]"
                  : "border-[#ddd6c7] bg-transparent text-[#8f7e64] hover:bg-[#f2ede1] hover:text-[#2b2418]"
              }`}
              onClick={() => setFilter(status)}
            >
              {status[0]?.toUpperCase()}
              {status.slice(1)}
            </button>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-12 gap-2 bg-[#faf7f1] px-5 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9d8d74]">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-6">Assignment</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="px-5 py-8 text-base text-[#8f7e64]">No access requests.</div>
        ) : (
          filteredRequests.map((row) => {
            const draft = decisionByRequestId[row.id] ?? defaultDraft;
            const isPending = row.status === "pending";

            return (
              <div
                key={row.id}
                className="grid grid-cols-1 gap-2.5 border-b border-[#efe8d9] px-5 py-3 md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-3">
                  <p className="text-[15px] font-semibold leading-tight text-[#1f1a12]">{row.requester_name}</p>
                  <p className="mt-0.5 text-xs text-[#8f7e64]">{row.requester_email}</p>
                </div>
                <div className="md:col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusPillClass(row.status)}`}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {row.status}
                  </span>
                  <p className="mt-0.5 text-xs capitalize text-[#8f7e64]">{row.requested_role}</p>
                </div>
                <div className="space-y-2 md:col-span-6">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <select
                      className="rounded-lg border border-[#ddd6c7] bg-[#f7f4ee] px-2.5 py-1.5 text-xs text-[#2b2418]"
                      value={draft.role}
                      onChange={(event) =>
                        setDraft(row.id, (prev) => ({
                          ...prev,
                          role: event.target.value as RequestDecisionDraft["role"],
                        }))
                      }
                    >
                      <option value="therapist">Therapist</option>
                      <option value="franchisee">Franchisee</option>
                      <option value="admin">Admin</option>
                    </select>

                    <select
                      className="rounded-lg border border-[#ddd6c7] bg-[#f7f4ee] px-2.5 py-1.5 text-xs text-[#2b2418]"
                      value={draft.franchiseId}
                      onChange={(event) =>
                        setDraft(row.id, (prev) => ({
                          ...prev,
                          franchiseId: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select franchise</option>
                      {franchiseOptions.map((fr) => (
                        <option key={fr.id} value={fr.id}>
                          {fr.name}
                        </option>
                      ))}
                    </select>

                    {draft.role === "therapist" ? (
                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2b7088]">
                        <input
                          type="checkbox"
                          checked={draft.createNewTherapist}
                          onChange={(event) =>
                            setDraft(row.id, (prev) => ({
                              ...prev,
                              createNewTherapist: event.target.checked,
                            }))
                          }
                        />
                        Generate ID
                      </label>
                    ) : (
                      <div />
                    )}
                  </div>

                    {draft.role === "therapist" && !draft.createNewTherapist ? (
                    <select
                      className="w-full rounded-lg border border-[#ddd6c7] bg-[#f7f4ee] px-2.5 py-1.5 text-xs text-[#2b2418]"
                      value={draft.therapistId}
                      onChange={(event) =>
                        setDraft(row.id, (prev) => ({
                          ...prev,
                          therapistId: event.target.value,
                        }))
                      }
                    >
                      <option value="">Assign existing therapist ID</option>
                      {therapistOptions.map((th) => (
                        <option key={th.id} value={th.id}>
                          {th.id} · {th.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    size="icon-sm"
                    onClick={() => approveRequest(row.id)}
                    disabled={!isPending || isSubmittingForRequestId === row.id}
                    variant={isPending ? "outline" : "default"}
                    className={
                      isPending
                        ? "h-10 w-10 rounded-xl border-[#d9cfbb] bg-white text-[#4e8060] hover:border-[#4e8060] hover:bg-[#d9f0df]"
                        : "h-10 w-10 rounded-xl border-[#4e8060] bg-[#d9f0df] text-[#4e8060]"
                    }
                  >
                    <Check className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
