"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Mail, Menu, Plus, Send, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { supabase } from "@/lib/supabase/client";
import type { NotificationRow } from "@/lib/supabase/types";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Admin Intelligence Dashboard",
    subtitle: "Daily system health and operational summary.",
  },
  "/dashboard": {
    title: "Admin Intelligence Dashboard",
    subtitle: "Daily system health and operational summary.",
  },
  "/patients": {
    title: "Patient Directory",
    subtitle: "Track patient wellbeing, progress, and care details.",
  },
  "/therapists": {
    title: "Therapist Directory",
    subtitle: "Manage therapist profiles, availability, and assignment load.",
  },
  "/therapies": {
    title: "Therapy Catalog",
    subtitle: "Review therapy programs and session frameworks.",
  },
  "/appointments": {
    title: "Appointment Details",
    subtitle: "Monitor upcoming sessions and scheduling operations.",
  },
  "/feedback": {
    title: "Feedback Collection",
    subtitle: "Monitor patient sessions and improving the service accordingly.",
  },
  "/add-feedback": {
    title: "Add Feedback",
    subtitle: "Capture and submit session feedback for completed appointments.",
  },
  "/billing": {
    title: "Billing & Invoice",
    subtitle: "Track invoices, payment status, and financial summaries.",
  },
  "/ai-insights": {
    title: "Wellness Intelligence",
    subtitle: "Explore AI-driven trends and recommendations.",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Measure performance with operational and clinical metrics.",
  },
  "/access-manager": {
    title: "Access Manager",
    subtitle: "Review access requests and assign roles and scope.",
  },
};

const headerActionByPath: Record<string, { label: string; href: string }> = {
  "/": { label: "Book Appointment", href: "/appointments?create=1" },
  "/dashboard": { label: "Book Appointment", href: "/appointments?create=1" },
  "/appointments": { label: "Book Appointment", href: "/appointments?create=1" },
  "/patients": { label: "Register Patient", href: "/patients?create=1" },
  "/therapists": { label: "Onboard Therapist", href: "/therapists?create=1" },
  "/therapies": { label: "Create Therapy Program", href: "/therapies?create=1" },
  "/feedback": { label: "Record Feedback", href: "/feedback?create=1" },
  "/add-feedback": { label: "Capture Feedback", href: "/add-feedback?create=1" },
  "/billing": { label: "Create Invoice", href: "/billing?create=1" },
  "/franchises": { label: "Add Franchise Location", href: "/franchises?create=1" },
};

type DashboardHeaderProps = {
  notifications: NotificationRow[];
  currentUserInitials?: string;
  currentUserName?: string;
  currentUserEmail?: string;
  currentUserRole?: "admin" | "franchisee" | "therapist" | "patient";
  currentTherapistId?: string | null;
  onMenuToggle?: () => void;
};

export function DashboardHeader({
  notifications,
  currentUserInitials = "AK",
  currentUserName = "Unknown User",
  currentUserEmail = "-",
  currentUserRole = "therapist",
  currentTherapistId = null,
  onMenuToggle,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [hasPendingAccessRequest, setHasPendingAccessRequest] = useState(false);
  const [readMap, setReadMap] = useState<Record<string, boolean>>(
    Object.fromEntries(
      notifications.map((notification) => [
        notification.id,
        Boolean(notification.is_read),
      ]),
    ),
  );
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];
  const isDashboard = pathname === "/" || pathname === "/dashboard";
  const headerTitle = isDashboard
    ? currentUserRole === "patient"
      ? "Wellness Dashboard"
      : "Dashboard"
    : meta.title;
  const roleAllowsQuickCreate = currentUserRole !== "patient";
  const headerAction =
    roleAllowsQuickCreate ? (headerActionByPath[pathname] ?? null) : null;
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !readMap[notification.id]).length,
    [notifications, readMap],
  );
  const visibleNotifications = notifications.slice(0, 8);
  const isPendingContext =
    currentUserRole === "therapist" && (!currentTherapistId || currentTherapistId.length === 0);
  const contextLabel = isPendingContext
    ? "Pending"
    : currentUserRole === "admin"
      ? "Admin"
      : currentUserRole === "franchisee"
        ? "Franchise"
        : currentUserRole === "patient"
          ? "Patient"
          : "Therapist";
  const contextBadgeClass = isPendingContext
    ? "bg-[#fff7e6] text-[#b7791f] border-[#f7d794]"
    : "bg-[#e7f7ef] text-[#1f8f4c] border-[#bde7ce]";

  useEffect(() => {
    const loadPendingState = async () => {
      const accessToken =
        (await supabase?.auth.getSession())?.data.session?.access_token ?? undefined;
      if (!accessToken) {
        setHasPendingAccessRequest(false);
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
        setHasPendingAccessRequest(false);
        return;
      }

      const rows = (await response.json()) as Array<{ status?: string }>;
      setHasPendingAccessRequest(rows.some((row) => row.status === "pending"));
    };

    void loadPendingState();
  }, []);

  const submitAccessRequest = async () => {
    const accessToken =
      (await supabase?.auth.getSession())?.data.session?.access_token ?? undefined;
    if (!accessToken) {
      setRequestStatus("Please sign in again.");
      return;
    }
    setIsSubmittingRequest(true);
    setRequestStatus(null);

    const response = await fetch("/api/access-requests", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        requestedRole: "therapist",
        message: "Requesting therapist context assignment.",
      }),
    }).catch(() => null);

    if (!response) {
      setRequestStatus("Request failed. Try again.");
      setIsSubmittingRequest(false);
      return;
    }

    if (response.status === 409) {
      setHasPendingAccessRequest(true);
      setRequestStatus("A pending access request already exists.");
      setIsSubmittingRequest(false);
      return;
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      setRequestStatus(payload.message ?? "Unable to submit request.");
      setIsSubmittingRequest(false);
      return;
    }

    setHasPendingAccessRequest(true);
    setRequestStatus("Access request submitted. Admin will review it.");
    setIsSubmittingRequest(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 lg:left-60 z-20 k-surface border-b k-border-soft h-[62px] px-3 md:px-4 lg:px-6 flex items-center">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="min-w-0 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onMenuToggle}
                className="lg:hidden"
                aria-label="Toggle navigation menu"
              >
                <Menu className="size-4" />
              </Button>
              <h2 className="type-h3 text-[18px] md:text-[20px] leading-none k-text-strong">{headerTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            {headerAction ? (
              <Button
                size="xs"
                className="hidden sm:inline-flex h-8 px-3"
                onClick={() => router.push(headerAction.href)}
              >
                <Plus className="size-3.5" />
                {headerAction.label}
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="icon-sm"
              className="relative"
              onClick={() => setNotificationDialogOpen(true)}
              aria-label="Open notifications"
            >
              <Bell className="size-4" />
              {unreadCount > 0 ? (
                <span className="absolute top-0.5 right-0.5 min-w-3 h-3 px-0.5 k-notify-bg rounded-full text-[8px] text-white font-bold inline-flex items-center justify-center">
                  {unreadCount}
                </span>
              ) : null}
            </Button>
            <div className="relative">
              <Button
                variant="dark"
                size="icon-sm"
                className="text-[10px] font-bold"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              >
                {currentUserInitials}
              </Button>
              {profileMenuOpen ? (
                <div className="absolute right-0 top-10 z-40 w-72 rounded-xl border k-border-soft bg-white shadow-lg p-3 space-y-2">
                  <div className="font-semibold k-text-strong">{currentUserName}</div>
                  <div className="flex items-center gap-2 k-text-body text-sm">
                    <Mail className="size-3.5" />
                    <span>{currentUserEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <ShieldCheck className="size-3.5 k-text-subtle" />
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${contextBadgeClass}`}
                    >
                      {contextLabel}
                    </span>
                  </div>
                  {isPendingContext ? (
                    <p className="text-xs k-text-subtle">
                      Therapist ID is not assigned yet. Request admin access assignment.
                    </p>
                  ) : null}
                  {requestStatus ? <p className="text-xs k-text-body">{requestStatus}</p> : null}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {currentUserRole === "admin" ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          router.push("/access-manager");
                        }}
                      >
                        Open Access Manager
                      </Button>
                    ) : null}
                    {isPendingContext ? (
                      <Button
                        type="button"
                        onClick={submitAccessRequest}
                        disabled={isSubmittingRequest || hasPendingAccessRequest}
                      >
                        <Send className="size-3.5" />
                        {hasPendingAccessRequest
                          ? "Request Pending"
                          : isSubmittingRequest
                            ? "Sending..."
                            : "Request Access"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <AlertDialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              Latest operational updates and alerts.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="max-h-[55vh] space-y-2 overflow-auto pr-1">
            {visibleNotifications.map((notification) => {
              const isRead = readMap[notification.id];
              return (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-3 ${isRead ? "bg-white border-[var(--k-color-border-soft)]" : "bg-[#fff8e8] border-[var(--kyochi-gold-200)]"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-semibold k-text-strong">{notification.title}</p>
                    <span className="text-[10px] k-text-subtle whitespace-nowrap">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-[12px] k-text-body">{notification.message}</p>
                </div>
              );
            })}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                onClick={() => {
                  setReadMap(
                    Object.fromEntries(
                      notifications.map((notification) => [notification.id, true]),
                    ),
                  );
                }}
              >
                Mark All As Read
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}
