import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { setState } from "@/lib/app-store";

type AuthState = {
  session: Session | null;
  loading: boolean;
};

let cached: AuthState = { session: null, loading: true };
const listeners = new Set<() => void>();
let initialized = false;

async function syncPremium(session: Session | null) {
  if (!session) {
    setState({ isPremium: false });
    return;
  }
  const { data } = await supabase
    .from("profiles")
    .select("premium_until")
    .eq("id", session.user.id)
    .maybeSingle();
  const until = data?.premium_until ? new Date(data.premium_until) : null;
  setState({ isPremium: !!until && until.getTime() > Date.now() });
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  supabase.auth.getSession().then(({ data }) => {
    cached = { session: data.session, loading: false };
    listeners.forEach((l) => l());
    void syncPremium(data.session);
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    cached = { session, loading: false };
    listeners.forEach((l) => l());
    void syncPremium(session);
  });
}

export function useAuth() {
  const [, setTick] = useState(0);
  useEffect(() => {
    init();
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return cached;
}

export async function refreshPremium() {
  const { data } = await supabase.auth.getSession();
  await syncPremium(data.session);
}

export async function signOut() {
  await supabase.auth.signOut();
}
