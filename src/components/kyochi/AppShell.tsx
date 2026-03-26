"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { roleNavSections } from "@/components/kyochi/data";
import { DashboardHeader } from "@/components/kyochi/DashboardHeader";
import { KyochiAiBot } from "@/components/kyochi/KyochiAiBot";
import { Sidebar } from "@/components/kyochi/Sidebar";
import { ShellLoadingSkeleton } from "@/components/kyochi/PageSkeletons";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { resolveUserContext, toCurrentUserDisplay } from "@/lib/roleScope";
import { hasSupabaseConfig, supabase } from "@/lib/supabase/client";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(!hasSupabaseConfig);
  const [isAuthenticated, setIsAuthenticated] = useState(!hasSupabaseConfig);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const { data, isLoading } = useBootstrapData();
  const context = useMemo(
    () =>
      resolveUserContext({
        users: data.users,
        currentUser: data.current_user,
        authUserId,
      }),
    [authUserId, data.current_user, data.users],
  );
  const currentUser = toCurrentUserDisplay(context);
  const navSections = roleNavSections[context.role];

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    let active = true;
    const check = async () => {
      const session = (await supabase?.auth.getSession())?.data.session ?? null;
      if (active) {
        setIsAuthenticated(Boolean(session));
        setAuthUserId(session?.user.id ?? null);
        setIsAuthReady(true);
      }
    };
    void check();

    const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setAuthUserId(session?.user.id ?? null);
      setIsAuthReady(true);
    });

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig || !isAuthReady) {
      return;
    }
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    } else if (isAuthenticated && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isAuthReady, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (!hasSupabaseConfig || !isAuthReady || !isAuthenticated || isLoading || !context.user) {
      return;
    }

    const needsPatientOnboarding = context.role === "patient" && !context.user.patient_id;
    if (needsPatientOnboarding && pathname !== "/onboarding/patient-profile") {
      router.replace("/onboarding/patient-profile");
      return;
    }

    if (!needsPatientOnboarding && pathname === "/onboarding/patient-profile") {
      router.replace("/dashboard");
    }
  }, [context.role, context.user, isAuthReady, isAuthenticated, isLoading, pathname, router]);

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.replace("/login");
  };

  if (pathname === "/login") {
    return <div className="k-shell-bg min-h-screen">{children}</div>;
  }

  if (pathname === "/onboarding/patient-profile") {
    return <div className="k-shell-bg min-h-screen">{children}</div>;
  }

  if (hasSupabaseConfig && (!isAuthReady || !isAuthenticated)) {
    return (
      <div className="k-shell-bg min-h-screen flex items-center justify-center">
        <p className="k-text-body text-sm">Checking session...</p>
      </div>
    );
  }

  const shellLoaderVariant =
    pathname === "/" || pathname === "/dashboard" ? "dashboard" : "management";

  // Fail closed: never render dashboard shell unless a mapped app_user context exists.
  if (hasSupabaseConfig && isAuthenticated && (isLoading || !context.user)) {
    return <ShellLoadingSkeleton variant={shellLoaderVariant} />;
  }

  return (
    <div className="k-shell-bg k-text-strong flex min-h-screen overflow-hidden">
      <Sidebar
        navSections={navSections}
        role={context.role}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className="lg:ml-60 flex-1 pb-3 pt-0 md:pb-4 lg:pb-6 k-shell-bg min-h-screen">
        <DashboardHeader
          notifications={data.notifications}
          currentUserInitials={currentUser.initials}
          currentUserName={currentUser.name}
          currentUserEmail={context.user?.email ?? "-"}
          currentUserRole={context.role}
          currentTherapistId={context.user?.therapist_id ?? null}
          onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)}
        />
        <div className="px-3 md:px-4 lg:px-6 pt-15.5">
          <div className="pt-3 md:pt-4">{children}</div>
        </div>
        <KyochiAiBot />
      </main>
    </div>
  );
}
