import { createContext, useContext, useEffect, useState } from "react";

import { api, restoreSession } from "../lib/api";

type User = { id: string; email?: string; user_metadata?: Record<string, any>; [key: string]: any };
type Session = { access_token: string; user: User; [key: string]: any };

export interface Profile {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  type: string;
  blocked: boolean;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authId: string) => {
    try {
      const { data } = await api.from("users").select("*").eq("auth_id", authId).single();
      if (!data) return;
      setProfile(data as Profile);

      // user_roles.user_id referencia users.id, nao o auth_id do token.
      const { data: roles } = await api.from("user_roles").select("role").eq("user_id", data.id);
      setIsAdmin(data.type === "admin" || (roles?.some((r: any) => r.role === "admin") ?? false));
    } catch {
      // API fora do ar: segue sem perfil enriquecido
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      const restored = await restoreSession();
      if (!active) return;

      if (restored) {
        setSession(restored);
        setUser(restored.user ?? null);
        // Aguarda o perfil: as telas que dependem dele redirecionam para o
        // login quando ele ainda e' null com loading ja em false.
        if (restored.user?.id) await fetchProfile(restored.user.id);
      }
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = api.auth.onAuthStateChange(async (_event: string, nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        // Volta para loading enquanto busca o perfil: no login o loading ja era
        // false e as telas que exigem perfil devolviam o usuario para o login.
        setLoading(true);
        await fetchProfile(nextSession.user.id);
        if (!active) return;
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await api.auth.signOut();
    } catch {
      // ignora
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
