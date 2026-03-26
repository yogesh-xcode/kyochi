"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const check = async () => {
      const session = (await supabase?.auth.getSession())?.data.session ?? null;
      if (session) {
        router.replace("/dashboard");
      }
    };
    void check();
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError("Supabase is not configured.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsSubmitting(false);
        return;
      }

      router.replace("/dashboard");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    const hasSession = Boolean(data.session);
    if (hasSession) {
      setMessage("Registration complete. Redirecting to dashboard...");
      router.replace("/dashboard");
      return;
    }
    setMessage("Registration successful. Check your email to confirm your account.");
    setMode("login");
    setFullName("");
    setPassword("");
    setIsSubmitting(false);
  };

  const onForgotPassword = async () => {
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setIsResetSubmitting(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : undefined;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo,
      },
    );
    setIsResetSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Password reset email sent. Check your inbox.");
  };

  return (
    <div className="min-h-screen k-shell-bg px-4 py-6 md:px-8 md:py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-[28px] border border-[var(--k-color-brand-border)] bg-[var(--k-color-surface-muted)] shadow-[0_8px_24px_rgba(107,81,42,0.14)] overflow-hidden">
        <div className="grid md:grid-cols-[1.06fr_1fr]">
          <section className="bg-[var(--k-color-brand-soft-tint)] px-7 py-8 md:px-9 md:py-10">
            <div className="inline-flex items-center gap-3 rounded-xl border border-[var(--k-color-brand-border)] bg-[var(--k-color-surface)] px-3 py-2">
              <div className="size-8 rounded-full k-brand-soft-bg border k-brand-border-soft flex items-center justify-center k-brand shadow-sm">
                <Leaf className="size-4" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold tracking-[0.14em] text-[var(--k-color-text-strong)]">KYOCHI INTELLIGENCE</p>
                <p className="text-[12px] text-[var(--k-color-text-body)]">Wellness Operations</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h1 className="text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[var(--k-color-text-strong)]">
                Kyochi Wellness Intelligence
              </h1>
              <p className="max-w-md text-lg text-[var(--k-color-text-body)]">
                Run patient care operations across franchises with unified records, appointments, therapy programs, feedback capture, and billing.
              </p>
            </div>

            <div className="mt-9 space-y-4">
              <p className="text-[12px] font-bold tracking-[0.32em] text-[var(--k-color-text-subtle)]">USE CASES</p>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--k-color-brand-border)] bg-[var(--k-color-surface)] px-3 py-1.5 text-[13px] font-semibold text-[var(--k-color-text-strong)]">
                  <Check className="size-3.5" />
                  Patient & Therapist Management
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--k-color-brand-border)] bg-[var(--k-color-surface)] px-3 py-1.5 text-[13px] font-semibold text-[var(--k-color-text-strong)]">
                  <Check className="size-3.5" />
                  Appointment & Therapy Scheduling
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--k-color-brand-border)] bg-[var(--k-color-surface)] px-3 py-1.5 text-[13px] font-semibold text-[var(--k-color-text-strong)]">
                  <Check className="size-3.5" />
                  Feedback, Billing & Access Control
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--k-color-brand-border)] bg-[var(--k-color-surface)] px-4 py-2 text-[13px] font-semibold text-[var(--k-color-text-strong)]">
                <Check className="size-3.5" />
                Built for admins, franchise managers, therapists, and patients
              </div>
              <p className="text-sm text-[var(--k-color-text-subtle)]">Role-based data scope · Secure auth · Live operational visibility</p>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--k-color-brand-border)] bg-white px-3 py-2">
                <span className="size-5 rounded-full k-brand-soft-bg border k-brand-border-soft flex items-center justify-center k-brand">
                  <Leaf className="size-3" strokeWidth={2.2} />
                </span>
                <span className="text-xs font-bold tracking-[0.12em] text-[var(--k-color-text-strong)]">KYOCHI INTELLIGENCE</span>
              </div>
            </div>
          </section>

          <section className="bg-[var(--k-color-surface-muted)] px-5 py-6 md:px-7 md:py-10 md:flex md:items-center">
            <div className="w-full rounded-2xl border border-[var(--k-color-border-soft)] bg-white p-4 md:p-6 shadow-[0_4px_16px_rgba(107,81,42,0.10)]">
              <div className="mb-4 rounded-xl border border-[var(--k-color-brand-border)] bg-[var(--k-color-brand-soft-tint)] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full k-brand-soft-bg border k-brand-border-soft flex items-center justify-center k-brand shadow-sm">
                    <Leaf className="size-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold tracking-[0.14em] text-[var(--k-color-text-strong)]">KYOCHI INTELLIGENCE</p>
                    <p className="text-[12px] text-[var(--k-color-text-body)]">Wellness Operations</p>
                  </div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-[var(--k-color-brand-soft-tint)] p-1">
                <button
                  type="button"
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    mode === "login" ? "bg-white text-[var(--k-color-text-strong)] shadow-sm" : "text-[var(--k-color-text-body)]"
                  }`}
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setMessage(null);
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    mode === "register" ? "bg-white text-[var(--k-color-text-strong)] shadow-sm" : "text-[var(--k-color-text-body)]"
                  }`}
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setMessage(null);
                  }}
                >
                  Create Account
                </button>
              </div>

              <div className="mb-4">
                <h2 className="text-3xl font-extrabold tracking-[-0.01em] text-[var(--k-color-text-strong)]">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="mt-1 text-sm text-[var(--k-color-text-body)]">
                  {mode === "login"
                    ? "Sign in to manage patient care, therapist schedules, feedback workflows, and billing."
                    : "Create your account to access role-based Kyochi wellness operations."}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-3.5">
                {mode === "register" ? (
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[var(--k-color-text-strong)]">Full Name</label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--k-color-text-subtle)]" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        required
                        className="h-11 rounded-xl border-[var(--k-color-border-soft)] bg-[var(--k-color-surface-muted)] pl-9 pr-3 text-[14px]"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[var(--k-color-text-strong)]">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--k-color-text-subtle)]" />
                    <Input
                      type="email"
                      placeholder="you@kyochi.in"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-11 rounded-xl border-[var(--k-color-border-soft)] bg-[var(--k-color-surface-muted)] pl-9 pr-3 text-[14px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[var(--k-color-text-strong)]">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--k-color-text-subtle)]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "login" ? "Enter your secure password" : "Create a secure password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="h-11 rounded-xl border-[var(--k-color-border-soft)] bg-[var(--k-color-surface-muted)] pl-9 pr-10 text-[14px]"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--k-color-text-subtle)] hover:text-[var(--k-color-brand-strong)]"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {mode === "login" ? (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <label className="inline-flex items-center gap-2 text-[var(--k-color-text-body)]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 rounded border-[var(--k-color-brand-border)] text-[var(--k-color-brand-strong)]"
                      />
                      Remember me for 30 days
                    </label>
                    <button
                      type="button"
                      className="font-semibold text-[var(--k-color-brand-strong)] hover:text-[var(--k-color-brand)] disabled:opacity-60"
                      onClick={() => {
                        void onForgotPassword();
                      }}
                      disabled={isResetSubmitting}
                    >
                      {isResetSubmitting ? "Sending..." : "Forgot Password?"}
                    </button>
                  </div>
                ) : null}

                {message ? (
                  <p className="rounded-lg border border-[#cbe8da] bg-[#ecfbf3] px-3 py-2 text-xs text-[#0f7a4f]">
                    {message}
                  </p>
                ) : null}
                {error ? (
                  <p className="rounded-lg border border-[#f5c8c8] bg-[#fff1f1] px-3 py-2 text-xs text-[#b42323]">
                    {error}
                  </p>
                ) : null}

                  <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl bg-[var(--k-color-brand)] text-[var(--k-color-text-strong)] hover:bg-[var(--k-color-brand-strong)] hover:text-white"
                >
                  {isSubmitting
                    ? mode === "login"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "login"
                      ? "Sign In to Dashboard"
                      : "Create Account"}
                  {!isSubmitting ? <ArrowRight className="ml-1 size-4" /> : null}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
