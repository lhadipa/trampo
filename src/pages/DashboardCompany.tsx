import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contracts as contracts_api, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Briefcase,
  Users,
  CreditCard,
  LogOut,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Heart,
  TrendingUp,
  Clock,
  FileText,
  Printer,
  BellRing,
  Scale,
  Search,
  MapPin,
  Star,
  Paintbrush,
  Waves,
  Utensils,
  Scissors,
  Truck,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { getContractState } from "@/lib/contractState";

// Seed de profissionais caso o banco esteja em estágio inicial
const DashboardCompany = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("trampo_favorite_freelancers");
    return saved ? JSON.parse(saved) : ["u-1", "u-2", "u-4"];
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const load = async () => {
    if (!profile) return;
    {
      let { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      if (!company) {
        const { data: newCompany } = await supabase
          .from("companies")
          .insert({ user_id: profile.id, name: profile.name || "Minha Empresa / Residência" })
          .select()
          .single();
        company = newCompany;
      }

      if (company) {
        setCompanyId(company.id);
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false });
        setJobs(jobsData || []);
      }

      const { data: fData } = await supabase
        .from("freelancers")
        .select("*, users!freelancers_user_id_fkey(name, email)");
      
      setFreelancers(fData || []);

      const { data: pData } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      setPayments(pData || []);

      const { data: eData } = await supabase
        .from("escrow")
        .select("*, users!escrow_freelancer_user_id_fkey(name)")
        .order("created_at", { ascending: false });
      
      setEscrows(eData || []);

      // Candidaturas e contratos das vagas desta empresa, para o fluxo de aceite.
      const { data: aData } = await supabase
        .from("applications")
        .select("*, jobs(*), freelancers(name)")
        .order("created_at", { ascending: false });
      setApplications(aData || []);

      const { data: cData } = await supabase.from("contracts").select("*");
      setContracts(cData || []);
    }
  };

  useEffect(() => {
    load();
  }, [profile]);

  /** A empresa escolhe o profissional: cria contrato e retem o valor. */
  const handleAccept = async (applicationId: string, nome: string) => {
    setAcceptingId(applicationId);
    const { error } = await contracts_api.acceptApplication(applicationId);
    setAcceptingId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${nome} contratado! 🎉`, {
      description: "O valor ficou retido em custódia até a conclusão do serviço.",
    });
    load();
  };

  /** Conclusao confirmada: libera a custodia ao profissional. */
  const handleComplete = async (contractId: string) => {
    const { error } = await contracts_api.complete(contractId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Serviço concluído! Pagamento liberado ao profissional. ✅");
    load();
  };

  const toggleFavorite = (fUserId: string, fName: string) => {
    setFavoriteIds((prev) => {
      let updated;
      if (prev.includes(fUserId)) {
        updated = prev.filter((id) => id !== fUserId);
        toast.info(`${fName} removido da sua equipe.`);
      } else {
        updated = [...prev, fUserId];
        toast.success(`⭐ ${fName} adicionado à sua Equipe Favorita!`, {
          description: "Você pode chamá-lo diretamente com 1 clique para novas diárias.",
        });
      }
      localStorage.setItem("trampo_favorite_freelancers", JSON.stringify(updated));
      return updated;
    });
  };

  const statusColor = (s: string) => {
    if (s === "open") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (s === "closed") return "bg-muted text-muted-foreground";
    return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  };

  const escrowStatusLabel = (s: string) => {
    if (s === "held") return { label: "Retido em Custódia Segura 🔒", class: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    if (s === "released") return { label: "Liberado ao Profissional ✅", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    if (s === "refunded") return { label: "Reembolsado", class: "bg-destructive/10 text-destructive border-destructive/20" };
    return { label: s, class: "bg-muted text-muted-foreground" };
  };

  const handleReleaseEscrow = async (escrowId: string) => {
    const { error } = await supabase
      .from("escrow")
      .update({ status: "released", released_at: new Date().toISOString() })
      .eq("id", escrowId);

    if (error) {
      // Local fallback para demo
      setEscrows((prev) =>
        prev.map((e) => (e.id === escrowId ? { ...e, status: "released", released_at: new Date().toISOString() } : e))
      );
    } else {
      setEscrows((prev) =>
        prev.map((e) => (e.id === escrowId ? { ...e, status: "released", released_at: new Date().toISOString() } : e))
      );
    }

    toast.success("Pagamento liberado com sucesso! ✅", {
      description: "O valor foi repassado instantaneamente via Pix para o profissional.",
    });
  };

  const handleGenerateReceipt = (item: any) => {
    setReceiptData({
      id: item.id || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: item.amount,
      freelancerName: item.users?.name || "Prestador Autônomo",
      companyName: profile?.name || "Contratante / Imóvel",
      date: item.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
      service: item.service || "Prestação de Serviços Autônomos Eventuais (Art. 442-B da CLT - Sem Vínculo Empregatício)",
    });
    setReceiptModalOpen(true);
  };

  // Filtragem de freelancers
  const filteredFreelancers = freelancers.filter((f) => {
    const nameMatch = (f.users?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const catMatch = (f.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || catMatch;

    if (selectedCategoryFilter === "all") return matchesSearch;
    const catObj = SERVICE_CATEGORIES.find((c) => c.id === selectedCategoryFilter);
    if (!catObj) return matchesSearch;

    const matchesCategory = catObj.subservices.some(
      (sub) => f.category?.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes((f.category || "").toLowerCase())
    );
    return matchesSearch && matchesCategory;
  });

  const favoriteFreelancers = freelancers.filter((f) => favoriteIds.includes(f.user_id));

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14 max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground">Painel Contratante & Empresa</span>
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

      <main className="container py-6 max-w-5xl mx-auto px-4 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Olá, {profile?.name || "Contratante"}</h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs">
                Membro Fundador VIP
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gestão de Diárias, Reformas, Piscinas, Eventos e Força de Trabalho
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/conversas")}>
              <MessageSquare className="h-4 w-4 mr-1" /> Conversas
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary font-semibold"
              onClick={() => navigate("/urgente")}
            >
              <BellRing className="h-4 w-4 mr-1 text-primary" /> Chamada urgente
            </Button>
            <Button size="sm" className="font-bold" onClick={() => navigate("/criar-vaga")}>
              <Plus className="h-4 w-4 mr-1" /> Criar Vaga
            </Button>
          </div>
        </div>

        {/* ROI & Membership Widget */}
        <Card className="border-border bg-card shadow-none rounded-3xl">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    Período VIP Ativo: Acesso Completo Liberado (São João del-Rei & Brasil)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contrate pintores, piscineiros, garçons e diaristas sem intermediários e com recibo digital automático.
                </p>
              </div>

              {/* Numeros reais da conta */}
              <div className="flex items-center gap-4 border-l border-border pl-4">
                <div className="text-center px-2">
                  <div className="flex items-center justify-center gap-1 text-primary font-bold text-base">
                    <Clock className="h-4 w-4" />
                    <span>{jobs.filter((j) => j.status === "open").length}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Vagas abertas</p>
                </div>
                <div className="h-7 w-px bg-border" />
                <div className="text-center px-2">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-base">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      R${" "}
                      {escrows
                        .filter((e) => e.status === "held")
                        .reduce((total, e) => total + Number(e.amount || 0), 0)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Em custódia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="freelancers">
          <TabsList className="grid w-full grid-cols-5 h-12 rounded-2xl p-1 bg-muted/60">
            <TabsTrigger value="freelancers" className="text-xs sm:text-sm font-semibold rounded-xl">
              <Users className="h-4 w-4 mr-1.5" /> Explorar ({freelancers.length})
            </TabsTrigger>
            <TabsTrigger value="equipe" className="text-xs sm:text-sm font-semibold rounded-xl">
              <Heart className="h-4 w-4 mr-1.5 text-primary" /> Favoritos ({favoriteFreelancers.length})
            </TabsTrigger>
            <TabsTrigger value="vagas" className="text-xs sm:text-sm font-semibold rounded-xl">
              <Briefcase className="h-4 w-4 mr-1.5" /> Vagas ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="escrow" className="text-xs sm:text-sm font-semibold rounded-xl">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-600" /> Custódia ({escrows.length})
            </TabsTrigger>
            <TabsTrigger value="pagamentos" className="text-xs sm:text-sm font-semibold rounded-xl">
              <CreditCard className="h-4 w-4 mr-1.5" /> Recibos (RPA)
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Explorar Todos os Prestadores */}
          <TabsContent value="freelancers" className="space-y-4 mt-4">
            {/* Search & Category Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou especialidade (Ex: Pintor, Piscina, Garçom, Diarista, Eletricista...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 rounded-2xl"
                />
              </div>

              {/* Pills de Categoria */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategoryFilter("all")}
                  className={`px-1 py-1.5 border-b-2 border-transparent font-semibold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === "all"
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todas as Áreas
                </button>
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-1 py-1.5 border-b-2 border-transparent font-semibold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === cat.id
                      ? "border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {filteredFreelancers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  Nenhum profissional encontrado com esse filtro.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredFreelancers.map((f: any) => {
                  const isFav = favoriteIds.includes(f.user_id);
                  const startChat = async () => {
                    if (!profile) return;
                    const { data: existing } = await supabase
                      .from("conversations")
                      .select("id")
                      .eq("company_user_id", profile.id)
                      .eq("freelancer_user_id", f.user_id)
                      .single();

                    if (existing) {
                      navigate(`/chat/${existing.id}`);
                      return;
                    }
                    const { data: newConv, error } = await supabase
                      .from("conversations")
                      .insert({ company_user_id: profile.id, freelancer_user_id: f.user_id })
                      .select()
                      .single();
                    if (error) {
                      toast.info(`Iniciando contato direto com ${f.users?.name}...`);
                      navigate(`/conversas`);
                      return;
                    }
                    navigate(`/chat/${newConv.id}`);
                  };

                  return (
                    <Card
                      key={f.id}
                      className="border-border hover:border-primary/40 transition-all shadow-2xs rounded-2xl"
                    >
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-foreground truncate">
                              {f.users?.name || "Profissional"}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">
                            {f.category || "Serviços Gerais"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(f.user_id, f.users?.name || "Profissional")}
                            className={isFav ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"}
                            title={isFav ? "Remover da equipe" : "Adicionar à equipe favorita"}
                          >
                            <Heart className={`h-4 w-4 ${isFav ? "fill-primary" : ""}`} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={startChat} className="text-xs">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Minha Equipe Favorita */}
          <TabsContent value="equipe" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Seus prestadores de confiança favoritos. Chame com 1 clique quando precisar.
              </p>
            </div>

            {favoriteFreelancers.length === 0 ? (
              <Card className="border-dashed border-border rounded-3xl">
                <CardContent className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">Sua equipe favorita está vazia</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Navegue na aba <strong>"Explorar"</strong> e clique no coração dos pintores, piscineiros, garçons ou diaristas de sua preferência.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favoriteFreelancers.map((f: any) => (
                  <Card key={f.id} className="border-border hover:border-primary/40 transition-all shadow-2xs rounded-2xl">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-foreground">{f.users?.name || "Profissional"}</p>
                          <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] py-0 border-emerald-500/20">
                            Disponível
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{f.category || "Geral"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(f.user_id, f.users?.name || "Profissional")}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Remover dos favoritos"
                        >
                          <Heart className="h-4 w-4 fill-primary" />
                        </button>
                        <Button
                          size="sm"
                          onClick={() => {
                            toast.success(`Convite prioritário enviado para ${f.users?.name}! 🚀`, {
                              description: "O prestador receberá notificação imediata.",
                            });
                          }}
                        >
                          Convidar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Vagas Criadas */}
          <TabsContent value="vagas" className="space-y-3 mt-4">
            {jobs.length === 0 ? (
              <Card className="rounded-3xl">
                <CardContent className="py-10 text-center text-muted-foreground text-sm space-y-3">
                  <p>Nenhuma vaga aberta no momento.</p>
                  <Button size="sm" onClick={() => navigate("/criar-vaga")}>
                    <Plus className="h-4 w-4 mr-1" /> Publicar Primeira Vaga
                  </Button>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => {
                const contrato = contracts.find((c) => c.job_id === job.id);
                const candidatos = applications.filter((a) => a.job_id === job.id);
                const estado = contrato ? getContractState(contrato.status) : null;

                return (
                  <Card key={job.id} className="border-border rounded-2xl">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-foreground text-sm">{job.title || "Sem título"}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(job.date).toLocaleDateString("pt-BR")} • Diária: R${" "}
                            {Number(job.price || 0).toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {job.urgent && (
                            <Badge variant="destructive" className="text-[11px]">
                              Urgente
                            </Badge>
                          )}
                          <Badge className={estado ? estado.tone : statusColor(job.status)}>
                            {estado ? estado.label : job.status}
                          </Badge>
                        </div>
                      </div>

                      {contrato ? (
                        <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
                          <p className="text-xs text-muted-foreground">
                            {contrato.status === "FUNDS_SECURED" &&
                              "Profissional contratado. Aguardando o check-in dele no local."}
                            {contrato.status === "IN_PROGRESS" &&
                              "O profissional confirmou presença — trabalho em execução agora."}
                            {contrato.status === "RELEASED" && "Serviço concluído e pagamento liberado."}
                          </p>
                          {contrato.status === "IN_PROGRESS" && (
                            <Button size="sm" className="w-full sm:w-auto" onClick={() => handleComplete(contrato.id)}>
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Confirmar conclusão e liberar pagamento
                            </Button>
                          )}
                        </div>
                      ) : candidatos.length === 0 ? (
                        <p className="text-xs text-muted-foreground border-t pt-3">
                          Nenhuma candidatura ainda.
                        </p>
                      ) : (
                        <div className="border-t pt-3 space-y-2">
                          <p className="text-xs font-semibold text-foreground">
                            {candidatos.length} candidatura(s) aguardando sua escolha
                          </p>
                          {candidatos.map((candidatura) => (
                            <div
                              key={candidatura.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-border p-2.5"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {candidatura.freelancers?.name || "Profissional"}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {candidatura.freelancers?.category || "Serviços gerais"}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                disabled={acceptingId === candidatura.id}
                                onClick={() =>
                                  handleAccept(candidatura.id, candidatura.freelancers?.name || "Profissional")
                                }
                              >
                                {acceptingId === candidatura.id ? "Contratando..." : "Contratar"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Tab 4: Escrow / Custódia */}
          <TabsContent value="escrow" className="space-y-3 mt-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Garantia Escrow Antifraude</p>
                <p className="text-emerald-700 mt-0.5">
                  Os valores ficam retidos com segurança e só são repassados ao profissional após a conclusão confirmada da diária.
                </p>
              </div>
            </div>

            {escrows.map((escrow) => {
              const statusInfo = escrowStatusLabel(escrow.status);
              return (
                <Card key={escrow.id} className="border-border rounded-2xl">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-base text-foreground">R$ {Number(escrow.amount).toFixed(2).replace(".", ",")}</p>
                        <Badge className={`text-xs ${statusInfo.class}`}>{statusInfo.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Profissional: <strong>{escrow.users?.name || "Prestador"}</strong> • {escrow.service || "Serviço Autônomo"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {escrow.status === "held" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          onClick={() => handleReleaseEscrow(escrow.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Liberar Pagamento Pix
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateReceipt(escrow)}
                        className="text-xs"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" /> Recibo RPA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Tab 5: Recibos Contábeis */}
          <TabsContent value="pagamentos" className="space-y-3 mt-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-foreground space-y-1">
              <div className="flex items-center gap-2 font-bold text-primary text-sm">
                <Scale className="h-4 w-4" />
                <span>Emissão de Recibos Digitais e Conformidade Trabalhista</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Todos os comprovantes emitidos pelo Trampô possuem respaldo legal (Art. 442-B da CLT) declarando a autonomia do prestador e isentando vínculo empregatício.
              </p>
            </div>

            {escrows.map((escrow) => (
              <Card key={escrow.id} className="border-border rounded-2xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      Recibo #{escrow.id.slice(0, 8)} • R$ {Number(escrow.amount).toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {escrow.users?.name} • {new Date(escrow.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateReceipt(escrow)}
                    className="text-xs"
                  >
                    <Printer className="h-3.5 w-3.5 mr-1" /> Ver / Imprimir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Recibo Digital RPA */}
      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Recibo de Prestação de Serviços Autônomos (RPA)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Documento comprobatório digital para fins contábeis e fiscais.
            </DialogDescription>
          </DialogHeader>

          {receiptData && (
            <div className="space-y-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-2">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Número do Recibo:</span>
                  <span className="font-mono font-bold text-foreground">{receiptData.id}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Contratante / Tomador:</span>
                  <span className="font-bold text-foreground">{receiptData.companyName}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Prestador Autônomo:</span>
                  <span className="font-bold text-foreground">{receiptData.freelancerName}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Data da Execução:</span>
                  <span className="font-bold text-foreground">{receiptData.date}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-sm text-foreground">Valor Líquido Quitado:</span>
                  <span className="font-bold text-base text-emerald-600">R$ {receiptData.amount},00</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-muted-foreground leading-relaxed">
                <strong>Declaração de Inexistência de Vínculo:</strong> Declaramos para os devidos fins legais que a presente contratação decorreu de demanda eventual e autônoma, sem subordinação ou habitualidade, nos termos do Art. 442-B da Consolidação das Leis do Trabalho (CLT).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.print();
                  }}
                >
                  <Printer className="h-4 w-4 mr-1" /> Imprimir Comprovante
                </Button>
                <Button size="sm" onClick={() => setReceiptModalOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCompany;
