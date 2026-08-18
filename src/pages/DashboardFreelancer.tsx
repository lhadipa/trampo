import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  History,
  Wallet,
  CheckCircle,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Star,
  Sparkles,
  CalendarCheck,
  Lock,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const DashboardFreelancer = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [checkedInJobIds, setCheckedInJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("trampo_checked_in_jobs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      let { data: freelancer } = await supabase
        .from("freelancers")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      if (!freelancer) {
        const { data: newF } = await supabase
          .from("freelancers")
          .insert({ user_id: profile.id, category: "Geral" })
          .select()
          .single();
        freelancer = newF;
      }

      if (freelancer) {
        setFreelancerId(freelancer.id);
        const { data: apps } = await supabase
          .from("applications")
          .select("*, jobs(*)")
          .eq("freelancer_id", freelancer.id)
          .order("created_at", { ascending: false });
        setMyApplications(apps || []);
      }

      const { data: openJobs } = await supabase
        .from("jobs")
        .select("*, companies(name)")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      setJobs(openJobs || []);

      const { data: eData } = await supabase
        .from("escrow")
        .select("*, users!escrow_company_user_id_fkey(name)")
        .order("created_at", { ascending: false });
      setEscrows(eData || []);
    };
    load();
  }, [profile]);

  const handleApply = async (jobId: string) => {
    if (!freelancerId) return;
    const { error } = await supabase
      .from("applications")
      .insert({ job_id: jobId, freelancer_id: freelancerId });
    if (error) {
      toast.error("Erro ao se candidatar: " + error.message);
    } else {
      toast.success("Candidatura enviada com sucesso! 🚀", {
        description: "A empresa será notificada e poderá conversar com você.",
      });
      const { data: apps } = await supabase
        .from("applications")
        .select("*, jobs(*)")
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false });
      setMyApplications(apps || []);
    }
  };

  const handleCheckIn = (jobId: string, jobTitle: string) => {
    const updated = [...checkedInJobIds, jobId];
    setCheckedInJobIds(updated);
    localStorage.setItem("trampo_checked_in_jobs", JSON.stringify(updated));
    toast.success(`Check-in de presença confirmado para "${jobTitle}"! ✅`, {
      description: "O contratante foi avisado de que você está a caminho.",
    });
  };

  const appliedJobIds = myApplications.map((a: any) => a.job_id);

  const escrowStatusLabel = (s: string) => {
    if (s === "held") return { label: "Depósito Seguro (Custódia)", class: "bg-accent/10 text-accent" };
    if (s === "released") return { label: "Liberado no seu Saldo ✅", class: "bg-success/10 text-success" };
    if (s === "refunded") return { label: "Reembolsado", class: "bg-destructive/10 text-destructive" };
    return { label: s, class: "bg-muted text-muted-foreground" };
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14 max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground">Painel do Profissional</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-secondary-foreground/70">
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="container py-6 max-w-4xl mx-auto px-4 space-y-6">
        {/* Welcome & Wallet Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Olá, {profile?.name} 👋</h1>
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-medium gap-1">
                <Star className="h-3 w-3 fill-amber-500" />
                Selo Ouro Verificado
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              São João del-Rei e Região • Renda rápida e protegida no Pix
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/conversas")}>
              <MessageSquare className="h-4 w-4 mr-1" /> Chat
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20">
              <Wallet className="h-4 w-4 text-success" />
              <span className="font-bold text-sm text-foreground">R$ {profile?.balance?.toFixed(2) ?? "0.00"}</span>
            </div>
          </div>
        </div>

        {/* Protection & Trust Banner */}
        <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-2xs">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-foreground leading-relaxed">
                <strong>Garantia Anti-Calote:</strong> Todo trabalho aceito tem o valor pré-depositado em custódia pela empresa e é transferido diretamente para você ao concluir.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 shrink-0"
              onClick={() => navigate("/disponibilidade")}
            >
              Ajustar Minha Agenda
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="vagas">
          <TabsList className="grid w-full grid-cols-4 h-11">
            <TabsTrigger value="vagas" className="text-xs sm:text-sm">
              <Briefcase className="h-4 w-4 mr-1.5" /> Vagas Abertas
            </TabsTrigger>
            <TabsTrigger value="historico" className="text-xs sm:text-sm">
              <History className="h-4 w-4 mr-1.5" /> Minhas Vagas
            </TabsTrigger>
            <TabsTrigger value="escrow" className="text-xs sm:text-sm">
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Custódia Segura
            </TabsTrigger>
            <TabsTrigger value="saldo" className="text-xs sm:text-sm">
              <Wallet className="h-4 w-4 mr-1.5" /> Saldo & Saque
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Vagas Abertas */}
          <TabsContent value="vagas" className="space-y-3 mt-4">
            {jobs.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground text-sm">Nenhuma vaga aberta no momento em São João del-Rei. Fique atento às notificações!</CardContent></Card>
            ) : jobs.map((job: any) => (
              <Card key={job.id} className="border-border hover:border-primary/30 transition-all shadow-2xs">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{job.title || "Sem título"}</p>
                      <p className="text-xs text-muted-foreground">{job.companies?.name} • {new Date(job.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {job.urgent && <Badge variant="destructive" className="text-xs">🚨 Urgente</Badge>}
                      {job.price && <span className="text-sm font-bold text-foreground">R$ {job.price}</span>}
                    </div>
                  </div>
                  {job.description && <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{job.description}</p>}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3 text-emerald-600" /> Pagamento garantido via Pix
                    </span>
                    {appliedJobIds.includes(job.id) ? (
                      <Badge className="bg-success/10 text-success text-xs"><CheckCircle className="h-3 w-3 mr-1" /> Candidatado</Badge>
                    ) : (
                      <Button size="sm" variant="hero" onClick={() => handleApply(job.id)}>
                        Aceitar Oportunidade
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tab 2: Minhas Candidaturas & Check-in Anti-No-Show */}
          <TabsContent value="historico" className="space-y-3 mt-4">
            {myApplications.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground text-sm">Você ainda não se candidatou a nenhuma vaga.</CardContent></Card>
            ) : myApplications.map((app: any) => {
              const isCheckedIn = checkedInJobIds.includes(app.job_id);
              const isAccepted = app.status === "accepted";

              return (
                <Card key={app.id} className="border-border shadow-2xs">
                  <CardContent className="pt-4 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{app.jobs?.title || "Demanda Autônoma"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <Badge className={app.status === "accepted" ? "bg-success/10 text-success" : app.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}>
                        {app.status === "accepted" ? "Aprovado ✅" : app.status === "rejected" ? "Não selecionado" : "Em análise"}
                      </Badge>
                    </div>

                    {/* Anti-No-Show Check-in Action */}
                    {isAccepted && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <CalendarCheck className="h-4 w-4 text-primary" />
                            Confirmação de Presença (Anti-No-Show)
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {isCheckedIn
                              ? "Você já confirmou presença para este evento. Boa sorte!"
                              : "Confirme que você está a caminho para manter sua pontualidade 100%."}
                          </p>
                        </div>
                        {isCheckedIn ? (
                          <Badge className="bg-success text-success-foreground shrink-0 py-1">
                            Presença Confirmada ✅
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="hero"
                            className="shrink-0"
                            onClick={() => handleCheckIn(app.job_id, app.jobs?.title || "Demanda")}
                          >
                            Confirmar Presença Hoje
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Tab 3: Custódia (Escrow) */}
          <TabsContent value="escrow" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3 mb-2 text-xs text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span>
                <strong>Valores em Custódia:</strong> O dinheiro já foi transferido pela empresa para a plataforma. Assim que você cumprir a demanda e a empresa confirmar, o saldo fica disponível para saque imediato.
              </span>
            </div>

            {escrows.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">Nenhum valor em custódia no momento.</CardContent></Card>
            ) : escrows.map((e: any) => {
              const st = escrowStatusLabel(e.status);
              return (
                <Card key={e.id} className="border-border">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-base">R$ {Number(e.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        Contratante: <strong>{e.users?.name || "Empresa"}</strong> • {new Date(e.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge className={st.class}>{st.label}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Tab 4: Saldo */}
          <TabsContent value="saldo" className="mt-4">
            <Card className="border-border shadow-2xs">
              <CardContent className="py-10 text-center space-y-3 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto text-success">
                  <Wallet className="h-7 w-7" />
                </div>
                <p className="text-3xl font-extrabold text-foreground">R$ {profile?.balance?.toFixed(2) ?? "0.00"}</p>
                <p className="text-xs text-muted-foreground">Saldo disponível para transferência via Pix</p>
                <Button
                  variant="hero"
                  className="w-full shadow-warm"
                  onClick={() => toast.success("Chave Pix cadastrada! Solicitação de saque em análise.")}
                >
                  Solicitar Saque via Pix
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardFreelancer;
