"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export default function PatientProfileOnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      if (!token) {
        if (active) {
          router.replace("/login");
        }
        return;
      }

      const response = await fetch("/api/patient-onboarding", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => null);

      if (!response) {
        if (active) {
          setError("Unable to check onboarding status right now.");
          setIsLoading(false);
        }
        return;
      }

      if (response.status === 403) {
        if (active) {
          router.replace("/dashboard");
        }
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { message?: string };
        if (active) {
          setError(payload.message ?? "Unable to load onboarding details.");
          setIsLoading(false);
        }
        return;
      }

      const payload = (await response.json()) as {
        needsProfile: boolean;
        user?: { full_name?: string | null };
      };

      if (!payload.needsProfile) {
        if (active) {
          router.replace("/dashboard");
        }
        return;
      }

      if (active) {
        setFullName(payload.user?.full_name?.trim() ?? "");
        setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !dob.trim()) {
      setError("Full name, phone, and DOB are required.");
      return;
    }

    const token = (await supabase?.auth.getSession())?.data.session?.access_token;
    if (!token) {
      setError("Session expired. Please sign in again.");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/patient-onboarding", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: fullName.trim(),
        phone: phone.trim(),
        dob: dob.trim(),
      }),
    }).catch(() => null);
    setIsSubmitting(false);

    if (!response) {
      setError("Unable to save profile right now.");
      return;
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      setError(payload.message ?? "Unable to save profile.");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen k-shell-bg px-4 py-8 md:px-8 md:py-12 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--k-color-border-soft)] bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold k-text-strong">Complete Your Patient Profile</h1>
        <p className="mt-1 text-sm k-text-body">
          We need a few details to link your account and enable appointments, billing, and feedback.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="onboarding-name" className="block text-xs font-semibold k-text-subtle uppercase tracking-wide">
              Full Name
            </label>
            <Input
              id="onboarding-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading || isSubmitting}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="onboarding-phone" className="block text-xs font-semibold k-text-subtle uppercase tracking-wide">
              Phone
            </label>
            <Input
              id="onboarding-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
              disabled={isLoading || isSubmitting}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="onboarding-dob" className="block text-xs font-semibold k-text-subtle uppercase tracking-wide">
              Date of Birth
            </label>
            <Input
              id="onboarding-dob"
              type="date"
              value={dob}
              onChange={(event) => setDob(event.target.value)}
              disabled={isLoading || isSubmitting}
              className="mt-1"
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
