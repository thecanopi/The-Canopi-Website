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

// ✅ Customize admin logic if you want.
// For now it’s false unless Supabase is enabled and a session exists.
// (If your project already has an admin rule, tell me and I’ll match it.)
function computeIsAdmin(user: User | null): boolean {
  if (!user?.email) return false;

  // Example options (choose ONE):
  // 1) domain-based admin
  // return user.email.endsWith("@yourdomain.com");

  // 2) email list-based admin
  // return ["admin@yourdomain.com"].includes(user.email);

  // Default: not admin
  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔒 Supabase disabled in production (keys moved to backend)
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return;
    }

    // Load initial session
    supabase.auth
      .getSession()
      .then(({ data }) => {
        const nextSession = data.session ?? null;
        const nextUser = data.session?.user ?? null;

        setSession(nextSession);
        setUser(nextUser);
        setIsAdmin(computeIsAdmin(nextUser));
      })
      .finally(() => setIsLoading(false));

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;

      setSession(nextSession);
      setUser(nextUser);
      setIsAdmin(computeIsAdmin(nextUser));
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Auth is disabled (server mode).") };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: (error as unknown as Error) ?? null };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Auth is disabled (server mode).") };

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
