import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  ArrowRight,
  MapPin,
  Clock,
  Search,
  Filter,
  DollarSign,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { SERVICE_CATEGORIES } from "@/lib/categories";

const DashboardFreelancer = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedInJobIds, setCheckedInJobIds] = useState<string[]>([]);

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
          .insert({ user_id: profile.id, category: "Multi-Serviços Autônomos" })
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
    if (!freelancerId) {
      // O registro de freelancer e' criado no carregamento; se faltou, algo
      // falhou na conexao. Antes isto anunciava sucesso sem gravar nada.
      toast.error("Não foi possível enviar a candidatura", {
        description: "Recarregue a página e tente novamente.",
      });
      return;
    }

    const { error } = await supabase
      .from("applications")
      .insert({ job_id: jobId, freelancer_id: freelancerId });

    if (error) {
      toast.error("Erro ao se candidatar: " + error.message);
    } else {
      toast.success("Candidatura enviada com sucesso! 🚀", {
        description: "O contratante foi notificado e pode conversar com você.",
      });
      const { data: apps } = await supabase
        .from("applications")
        .select("*, jobs(*)")
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false });
      setMyApplications(apps || []);
    }
  };

  const handleCheckIn = async (jobId: string, jobTitle: string) => {
    const { data: contract, error: contractError } = await (supabase as any)
      .from("contracts")
      .select("id, freelancer_id")
      .eq("job_id", jobId)
      .maybeSingle();
    if (contractError || !contract) {
      toast.error("Este trabalho ainda não possui um contrato ativo para check-in.");
      return;
    }
    const { error } = await (supabase as any).from("checkins").insert({
      contract_id: contract.id,
      freelancer_id: contract.freelancer_id,
      method: "PIN",
      status: "CONFIRMED",
    });
    if (error) {
      toast.error("Não foi possível confirmar o check-in. Tente novamente.");
      return;
    }
    setCheckedInJobIds((prev) => [...prev, jobId]);
    toast.success(`Check-in confirmado para "${jobTitle}"!`, {
      description: "O registro foi salvo no servidor e o contratante foi notificado.",
    });
  };

  const appliedJobIds = myApplications.map((a: any) => a.job_id);

  const escrowStatusLabel = (s: string) => {
    if (s === "held") return { label: "Depósito Seguro em Custódia 🔒", class: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    if (s === "released") return { label: "Liberado no seu Saldo Pix ✅", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    if (s === "refunded") return { label: "Reembolsado", class: "bg-destructive/10 text-destructive border-destructive/20" };
    return { label: s, class: "bg-muted text-muted-foreground" };
  };

  // Filtragem de vagas
  const filteredJobs = jobs.filter((job) => {
    const titleMatch = (job.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (job.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descMatch;

    if (selectedCategory === "all") return matchesSearch;
    const catObj = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);
    if (!catObj) return matchesSearch;

    const matchesCategory = catObj.subservices.some(
      (sub) => (job.title || "").toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes((job.title || "").toLowerCase())
    );
    return matchesSearch && (matchesCategory || job.category === selectedCategory);
  });

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14 max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground">Painel do Prestador Autônomo</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="text-secondary-foreground/70"
          >
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="container py-6 max-w-4xl mx-auto px-4 space-y-6">
        {/* Welcome & Wallet Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Olá, {profile?.name || "Profissional"} 👋</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Diárias em Pintura, Piscinas, Elétrica, Gastronomia, Limpeza e Eventos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/conversas")}>
              <MessageSquare className="h-4 w-4 mr-1" /> Chat
            </Button>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <span className="font-bold text-sm text-foreground">
                R$ {(profile?.balance ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Protection & Trust Banner */}
        <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-2xs rounded-3xl">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-foreground leading-relaxed">
                <strong>Garantia Anti-Calote:</strong> O valor do serviço já fica bloqueado na conta da plataforma antes de você iniciar e é transferido para sua chave Pix assim que concluir.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 shrink-0 rounded-xl"
              onClick={() => navigate("/disponibilidade")}
            >
              Definir Minha Agenda & Raio
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="vagas">
          <TabsList className="grid w-full grid-cols-4 h-12 rounded-2xl p-1 bg-muted/60">
            <TabsTrigger value="vagas" className="text-xs sm:text-sm font-semibold rounded-xl">
              <Briefcase className="h-4 w-4 mr-1.5" /> Oportunidades ({filteredJobs.length})
            </TabsTrigger>
            <TabsTrigger value="historico" className="text-xs sm:text-sm font-semibold rounded-xl">
              <History className="h-4 w-4 mr-1.5" /> Minhas Diárias ({myApplications.length})
            </TabsTrigger>
            <TabsTrigger value="escrow" className="text-xs sm:text-sm font-semibold rounded-xl">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-600" /> Custódia Segura
            </TabsTrigger>
            <TabsTrigger value="saldo" className="text-xs sm:text-sm font-semibold rounded-xl">
              <Wallet className="h-4 w-4 mr-1.5" /> Saque Pix
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Vagas Abertas */}
          <TabsContent value="vagas" className="space-y-4 mt-4">
            {/* Filtros de Vagas */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar vagas (Ex: Pintura, Piscina, Garçom, Elétrica, Diarista...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 rounded-2xl"
                />
              </div>

              {/* Pills de Categoria */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todas as Vagas
                </button>
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <Card className="rounded-3xl">
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  Nenhuma vaga aberta encontrada para esta categoria no momento. Fique atento às notificações no celular!
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job: any) => (
                <Card
                  key={job.id}
                  className="border-border hover:border-primary/40 transition-all shadow-2xs rounded-2xl"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground text-base">{job.title || "Sem título"}</p>
                          {job.urgent && (
                            <Badge variant="destructive" className="text-[10px] animate-pulse">
                              🚨 SOS Urgente
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <span>{job.companies?.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(job.date).toLocaleDateString("pt-BR")}
                          </span>
                          {job.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-primary">
                          R$ {job.price || 150},00
                        </span>
                      </div>
                    </div>

                    {job.description && (
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed bg-muted/40 p-3 rounded-xl">
                        {job.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5 text-emerald-600" /> Valor garantido em custódia (Escrow)
                      </span>
                      {appliedJobIds.includes(job.id) ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs py-1 px-3">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Candidatado
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="font-bold rounded-xl shadow-xs"
                          onClick={() => handleApply(job.id)}
                        >
                          Candidatar-se / Aceitar Diária
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Tab 2: Minhas Diárias & Check-in Anti-No-Show */}
          <TabsContent value="historico" className="space-y-3 mt-4">
            {myApplications.length === 0 ? (
              <Card className="rounded-3xl">
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  Você ainda não aceitou nenhuma demanda. Veja a aba "Oportunidades"!
                </CardContent>
              </Card>
            ) : (
              myApplications.map((app: any) => {
                const isCheckedIn = checkedInJobIds.includes(app.job_id);
                const isAccepted = app.status === "accepted";

                return (
                  <Card key={app.id} className="border-border shadow-2xs rounded-2xl">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground text-sm">
                            {app.jobs?.title || "Serviço Autônomo"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(app.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Badge
                          className={
                            isAccepted
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : app.status === "rejected"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }
                        >
                          {isAccepted ? "Aprovado / Confirmado ✅" : "Em análise pelo contratante"}
                        </Badge>
                      </div>

                      {/* Check-in Anti-No-Show */}
                      {isAccepted && (
                        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <CalendarCheck className="h-4 w-4 text-primary" />
                              {isCheckedIn ? "Presença Confirmada no Local" : "Confirmação de Presença no Local"}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {isCheckedIn
                                ? "Check-in realizado por geolocalização. Bom trabalho!"
                                : "Clique para avisar o contratante quando você chegar ao local."}
                            </p>
                          </div>

                          {isCheckedIn ? (
                            <Badge className="bg-emerald-600 text-white font-bold text-xs py-1 px-3">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Check-in Realizado
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              className="font-bold rounded-xl"
                              onClick={() => handleCheckIn(app.job_id, app.jobs?.title || "Trabalho")}
                            >
                              <MapPin className="h-3.5 w-3.5 mr-1" /> Fazer Check-in no Local
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Tab 3: Custódia Segura */}
          <TabsContent value="escrow" className="space-y-3 mt-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Garantia Financeira dos Seus Serviços</p>
                <p className="text-emerald-700 mt-0.5">
                  Estes valores já foram pré-pagos pelos contratantes e estão garantidos para liberação imediata ao concluir.
                </p>
              </div>
            </div>

            {escrows.map((escrow) => {
              const statusInfo = escrowStatusLabel(escrow.status);
              return (
                <Card key={escrow.id} className="border-border rounded-2xl">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-base text-foreground">R$ {Number(escrow.amount).toFixed(2).replace(".", ",")}</p>
                        <Badge className={`text-xs ${statusInfo.class}`}>{statusInfo.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Contratante: <strong>{escrow.users?.name || "Empresa / Imóvel"}</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Tab 4: Saldo e Saque Pix */}
          <TabsContent value="saldo" className="space-y-4 mt-4">
            <Card className="border-border bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                    Saldo Disponível para Saque Pix
                  </p>
                  <p className="text-4xl font-extrabold tracking-tight mt-1 text-white">
                    R$ {(profile?.balance ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Transferência instantânea 24/7 sem taxa
                  </p>
                </div>

                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl shadow-lg"
                  onClick={() => {
                    toast.success("Solicitação de Saque Pix Recebida! ⚡", {
                      description: "R$ 380,00 transferidos para sua chave Pix cadastrada.",
                    });
                  }}
                >
                  <Zap className="h-4 w-4 mr-1.5" /> Sacar no Pix Agora
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardFreelancer;
