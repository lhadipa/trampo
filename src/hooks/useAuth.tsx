import { useState, useEffect, createContext, useContext } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

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
  isDemoUser: boolean;
  signOut: () => Promise<void>;
  loginAsDemo: (role: "empresa" | "freelancer" | "admin", customData?: { name?: string; email?: string }) => void;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginAsDemo = (role: "empresa" | "freelancer" | "admin", customData?: { name?: string; email?: string }) => {
    let mockProfile: Profile;
    let isUserAdmin = false;

    if (role === "admin") {
      isUserAdmin = true;
      mockProfile = {
        id: "demo-admin-id",
        auth_id: "demo-admin-auth-id",
        name: customData?.name || "Administrador Geral Trampô",
        email: customData?.email || "admin@trampo.com.br",
        type: "empresa",
        blocked: false,
        balance: 15420.5,
      };
    } else if (role === "empresa") {
      mockProfile = {
        id: "demo-company-id",
        auth_id: "demo-company-auth-id",
        name: customData?.name || "Restaurante & Hotel Fazenda Solar",
        email: customData?.email || "contato@hotelsolar.com.br",
        type: "empresa",
        blocked: false,
        balance: 850.0,
      };
    } else {
      mockProfile = {
        id: "demo-freelancer-id",
        auth_id: "demo-freelancer-auth-id",
        name: customData?.name || "Carlos Silva (Eletricista & Pintor)",
        email: customData?.email || "carlos.silva@email.com",
        type: "freelancer",
        blocked: false,
        balance: 420.0,
      };
    }

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

    localStorage.setItem("trampo_demo_auth", JSON.stringify({ role, customData }));
    setUser(mockUser);
    setSession(mockSession);
    setProfile(mockProfile);
    setIsAdmin(isUserAdmin);
    setIsDemoUser(true);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", userId)
        .single();
      if (!data) return;
      setProfile(data as any);

      // user_roles.user_id referencia users.id, nao o auth_id do token.
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.id);
      setIsAdmin(data.type === "admin" || (roles?.some((r: any) => r.role === "admin") ?? false));
    } catch {
      // Ignora erro se backend não responder
    }
  };

  useEffect(() => {
    // 1. Verifica se há sessão demo salva
    const savedDemo = localStorage.getItem("trampo_demo_auth");
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        loginAsDemo(parsed.role, parsed.customData);
        return;
      } catch {
        localStorage.removeItem("trampo_demo_auth");
      }
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    /**
     * O perfil precisa estar carregado antes de baixar o loading.
     *
     * Antes o loading virava false na hora e o fetchProfile corria solto: o
     * Dashboard renderizava com profile ainda null e, como ele redireciona
     * quem nao tem perfil, mandava de volta para /auth. Na pratica, entrar ou
     * recarregar o painel logado devolvia a tela de login.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Volta para loading enquanto busca o perfil. No login o loading ja
          // era false, entao a tela de destino renderizava com profile null e
          // devolvia o usuario para /auth antes de o perfil chegar.
          setLoading(true);
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem("trampo_demo_auth");
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignora
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setIsDemoUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isAdmin, loading, isDemoUser, signOut, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};
