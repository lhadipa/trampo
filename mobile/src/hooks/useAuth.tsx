import AsyncStorage from "@react-native-async-storage/async-storage";
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

export type DemoRole = "empresa" | "freelancer" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  isDemoUser: boolean;
  signOut: () => Promise<void>;
  loginAsDemo: (role: DemoRole, customData?: { name?: string; email?: string }) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  loading: true,
  isDemoUser: false,
  signOut: async () => {},
  loginAsDemo: () => {},
});

export const useAuth = () => useContext(AuthContext);

const DEMO_KEY = "trampo_demo_auth";

/** Perfis de demonstracao — identicos aos do app web, para a apresentacao bater. */
const demoProfile = (role: DemoRole, customData?: { name?: string; email?: string }): Profile => {
  if (role === "admin") {
    return {
      id: "demo-admin-id",
      auth_id: "demo-admin-auth-id",
      name: customData?.name || "Administrador Geral Trampô",
      email: customData?.email || "admin@trampo.com.br",
      type: "empresa",
      blocked: false,
      balance: 15420.5,
    };
  }
  if (role === "empresa") {
    return {
      id: "demo-company-id",
      auth_id: "demo-company-auth-id",
      name: customData?.name || "Restaurante & Hotel Fazenda Solar",
      email: customData?.email || "contato@hotelsolar.com.br",
      type: "empresa",
      blocked: false,
      balance: 850.0,
    };
  }
  return {
    id: "demo-freelancer-id",
    auth_id: "demo-freelancer-auth-id",
    name: customData?.name || "Carlos Silva (Eletricista & Pintor)",
    email: customData?.email || "carlos.silva@email.com",
    type: "freelancer",
    blocked: false,
    balance: 420.0,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginAsDemo = (role: DemoRole, customData?: { name?: string; email?: string }) => {
    const mockProfile = demoProfile(role, customData);

    const mockUser = {
      id: mockProfile.auth_id,
      app_metadata: {},
      user_metadata: { name: mockProfile.name, user_type: mockProfile.type },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: mockProfile.email,
    } as unknown as User;

    const mockSession = {
      access_token: "demo-token",
      token_type: "bearer",
      user: mockUser,
    } as unknown as Session;

    AsyncStorage.setItem(DEMO_KEY, JSON.stringify({ role, customData })).catch(() => {});

    setUser(mockUser);
    setSession(mockSession);
    setProfile(mockProfile);
    setIsAdmin(role === "admin");
    setIsDemoUser(true);
    setLoading(false);
  };

  const fetchProfile = async (authId: string) => {
    try {
      const { data } = await api.from("users").select("*").eq("auth_id", authId).single();
      if (!data) return;
      setProfile(data as Profile);

      // user_roles.user_id referencia users.id, nao o auth_id do token.
      const { data: roles } = await api.from("user_roles").select("role").eq("user_id", data.id);
      setIsAdmin(data.type === "admin" || (roles?.some((r: any) => r.role === "admin") ?? false));
    } catch {
      // API local fora do ar: segue sem perfil enriquecido
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      // 1. Sessao de demonstracao salva tem precedencia (fluxo da apresentacao)
      try {
        const savedDemo = await AsyncStorage.getItem(DEMO_KEY);
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          if (active) loginAsDemo(parsed.role, parsed.customData);
          return;
        }
      } catch {
        await AsyncStorage.removeItem(DEMO_KEY).catch(() => {});
      }

      // 2. Sessao real vinda da API local
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
    } = api.auth.onAuthStateChange((_event: string, nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        fetchProfile(nextSession.user.id);
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
    await AsyncStorage.removeItem(DEMO_KEY).catch(() => {});
    try {
      await api.auth.signOut();
    } catch {
      // ignora
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setIsDemoUser(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, isAdmin, loading, isDemoUser, signOut, loginAsDemo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
