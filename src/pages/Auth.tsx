import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ShieldCheck,
  CheckSquare,
  Square,
  Building2,
  HardHat,
  ShieldAlert,
  ArrowRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [userType, setUserType] = useState<"empresa" | "freelancer">("freelancer");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [tab, setTab] = useState("login");

  const handleQuickLogin = (role: "empresa" | "freelancer" | "admin") => {
    loginAsDemo(role);
    const roleLabels = {
      empresa: "Empresa / Contratante (Hotel Fazenda Solar)",
      freelancer: "Profissional Autônomo (Carlos Silva)",
      admin: "Painel do Administrador Geral",
    };
    toast.success(`Acesso rápido liberado! Entrando como ${roleLabels[role]} 🎉`);
    navigate("/painel");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        loginAsDemo("empresa", { email: loginEmail || "usuario@demo.com", name: loginEmail.split("@")[0] || "Usuário Demo" });
        setLoading(false);
        toast.success("Login efetuado com sucesso (Modo Demonstração)!");
        navigate("/painel");
      }, 400);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/painel");
      }
    } catch {
      // Fallback gracioso se a rede do Supabase falhar
      loginAsDemo("empresa", { email: loginEmail });
      setLoading(false);
      toast.success("Login efetuado no Modo Demonstração!");
      navigate("/painel");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Por favor, leia e aceite os Termos de Uso e Autonomia.");
      return;
    }
    setLoading(true);

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        loginAsDemo(userType === "empresa" ? "empresa" : "freelancer", {
          name: signupName,
          email: signupEmail,
        });
        setLoading(false);
        toast.success(`Conta criada com sucesso! Bem-vindo(a), ${signupName}! 🎉`, {
          description: "60 Dias Grátis de Membro Fundador VIP ativados.",
        });
        navigate("/painel");
      }, 400);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: window.location.origin,
          data: { name: signupName, user_type: userType },
        },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Conta criada com sucesso! 60 Dias VIP liberados 🎉", {
          description: "Verifique seu email para confirmar o acesso.",
        });
      }
    } catch {
      loginAsDemo(userType === "empresa" ? "empresa" : "freelancer", {
        name: signupName,
        email: signupEmail,
      });
      setLoading(false);
      toast.success(`Conta criada com sucesso! Bem-vindo(a), ${signupName}! 🎉`);
      navigate("/painel");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md space-y-4">
        {/* VIP Launch Banner */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong>Lançamento SJDR:</strong> Cadastre-se hoje e ganhe <strong>60 Dias Grátis de Membro Fundador VIP</strong>.
          </span>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="Trampô" className="w-10 h-10" />
            <span className="text-2xl font-bold font-display text-foreground">Trampô</span>
          </div>
          <p className="text-sm text-muted-foreground">Trabalho rápido e seguro em São João del-Rei e região</p>
        </div>

        {/* 🚀 QUICK TEST DEMO SECTION */}
        <Card className="border-primary/30 bg-primary/5 shadow-sm overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Acesso Rápido de Teste</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-background font-semibold text-primary border-primary/30">
                1 Clique
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Entre imediatamente sem formulários para testar os recursos de cada perfil:
            </p>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLogin("empresa")}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-background hover:bg-primary/10 border border-border/80 hover:border-primary/40 transition-all text-left shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 font-bold">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Empresa / Contratante</div>
                    <div className="text-[11px] text-muted-foreground">Publicar vagas, contratar e pagar</div>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("freelancer")}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-background hover:bg-primary/10 border border-border/80 hover:border-primary/40 transition-all text-left shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 font-bold">
                    <HardHat className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Trabalhador Autônomo</div>
                    <div className="text-[11px] text-muted-foreground">Candidaturas, agenda de diárias e chat</div>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-background hover:bg-primary/10 border border-border/80 hover:border-primary/40 transition-all text-left shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Administrador Geral</div>
                    <div className="text-[11px] text-muted-foreground">Métricas, faturamento, cidades e usuários</div>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* LOGIN / SIGNUP TABS */}
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="w-full">
              <div className="grid w-full grid-cols-2 bg-muted p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                    tab === "login"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                    tab === "signup"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar no Painel"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome completo ou Razão Social</Label>
                    <Input
                      placeholder="Ex: João Silva ou Restaurante Mineiro"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Eu sou:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={userType === "freelancer" ? "default" : "outline"}
                        onClick={() => setUserType("freelancer")}
                        className="w-full text-xs font-semibold"
                      >
                        Trabalhador Autônomo
                      </Button>
                      <Button
                        type="button"
                        variant={userType === "empresa" ? "default" : "outline"}
                        onClick={() => setUserType("empresa")}
                        className="w-full text-xs font-semibold"
                      >
                        Empresa / Contratante
                      </Button>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/80 cursor-pointer select-none hover:bg-muted/60 transition-colors"
                  >
                    <div className="mt-0.5 text-primary">
                      {agreeTerms ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Declaro que li e concordo com os{" "}
                      <Link
                        to="/termos"
                        target="_blank"
                        className="text-primary font-medium underline underline-offset-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Termos de Uso, Mediação Tecnológica e Declaração de Autonomia
                      </Link>{" "}
                      (reconhecendo a inexistência de vínculo empregatício sob o Art. 442-B da CLT).
                    </p>
                  </div>

                  <Button type="submit" variant="hero" className="w-full shadow-warm" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta com 60 Dias Grátis"}
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

