import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [userType, setUserType] = useState<"empresa" | "freelancer">("freelancer");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [tab, setTab] = useState("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Por favor, leia e aceite os Termos de Uso e Autonomia.");
      return;
    }
    setLoading(true);
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
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
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
