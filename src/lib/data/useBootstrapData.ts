"use client";

import { useCallback, useEffect, useState } from "react";

import { hasSupabaseConfig, supabase } from "@/lib/supabase/client";
import type { BootstrapData } from "@/lib/supabase/types";

const emptySupabaseData: BootstrapData = {
  franchises: [],
  patients: [],
  therapists: [],
  therapies: [],
  appointments: [],
  billing: [],
  feedback: [],
  users: [],
  current_user: null,
  notifications: [],
  source: "supabase",
};

export const useBootstrapData = () => {
  const [data, setData] = useState<BootstrapData>(emptySupabaseData);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (accessToken?: string) => {
    try {
      const response = await fetch("/api/bootstrap", {
        method: "GET",
        cache: "no-store",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      });
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as BootstrapData;
      setData(payload);
    } catch {
      // Keep empty Supabase-shaped data when API is unavailable.
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reload = useCallback(async () => {
    if (!hasSupabaseConfig) {
      return;
    }
    const token =
      (await supabase?.auth.getSession())?.data.session?.access_token ??
      undefined;
    await load(token);
  }, [load]);

  useEffect(() => {
    let active = true;
    const guardedLoad = async (accessToken?: string) => {
      try {
        const response = await fetch("/api/bootstrap", {
          method: "GET",
          cache: "no-store",
          headers: accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
        });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as BootstrapData;
        if (active) setData(payload);
      } catch {
        // Keep empty Supabase-shaped data when API is unavailable.
      } finally {
        if (active) setIsLoading(false);
      }
    };

    const boot = async () => {
      if (!hasSupabaseConfig) {
        setIsLoading(false);
        return;
      }
      const token =
        (await supabase?.auth.getSession())?.data.session?.access_token ??
        undefined;
      await guardedLoad(token);
    };

    void boot();

    const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
      void guardedLoad(session?.access_token);
    });

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  return { data, isLoading, reload };
};
