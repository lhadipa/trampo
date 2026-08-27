import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", authId)
        .single();
      if (!data) return;
      setProfile(data as Profile);

      // user_roles.user_id referencia users.id, nao o auth_id do token.
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.id);
      setIsAdmin(data.type === "admin" || (roles?.some((r: any) => r.role === "admin") ?? false));
    } catch {
      // Sem perfil o usuario e' tratado como nao autenticado pelas telas.
    }
  };

  useEffect(() => {
    /**
     * O perfil precisa estar carregado antes de baixar o loading: as telas
     * redirecionam quem nao tem perfil, entao com loading ja em false elas
     * devolviam o usuario para /auth antes de o perfil chegar.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
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
    try {
      await supabase.auth.signOut();
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
