import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function checkAdmin(accessToken: string | undefined | null): Promise<boolean> {
  if (!accessToken) return false;

  try {
    const res = await fetch("/api/admin/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 200 => admin
    if (res.ok) return true;

    // 401/403 => not admin
    return false;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Supabase client isn't configured, auth can't work
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return;
    }

    let cancelled = false;

    // Load initial session
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const nextSession = data.session ?? null;
        const nextUser = data.session?.user ?? null;

        if (cancelled) return;

        setSession(nextSession);
        setUser(nextUser);

        const admin = await checkAdmin(nextSession?.access_token);
        if (!cancelled) setIsAdmin(admin);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;

      setSession(nextSession ?? null);
      setUser(nextUser);

      const admin = await checkAdmin(nextSession?.access_token);
      setIsAdmin(admin);

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Auth is disabled (Supabase not configured).") };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: (error as unknown as Error) ?? null };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Auth is disabled (Supabase not configured).") };

    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });

    return { error: (error as unknown as Error) ?? null };
  };

  const signOut = async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      isLoading,
      isAdmin,
      signIn,
      signUp,
      signOut,
    }),
    [user, session, isLoading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
