import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  Sparkles,
  TrendingUp,
  Clock,
  FileText,
  Printer,
  Zap,
  Scale
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const DashboardCompany = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("trampo_favorite_freelancers");
    return saved ? JSON.parse(saved) : [];
  });
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      let { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      if (!company) {
        const { data: newCompany } = await supabase
          .from("companies")
          .insert({ user_id: profile.id, name: profile.name })
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
    };
    load();
  }, [profile]);

  const toggleFavorite = (fUserId: string, fName: string) => {
    setFavoriteIds((prev) => {
      let updated;
      if (prev.includes(fUserId)) {
        updated = prev.filter((id) => id !== fUserId);
        toast.info(`${fName} removido da sua equipe.`);
      } else {
        updated = [...prev, fUserId];
        toast.success(`⭐ ${fName} adicionado à sua Equipe Favorita!`, {
          description: "Você pode chamá-lo com 1 clique nos próximos chamados.",
        });
      }
      localStorage.setItem("trampo_favorite_freelancers", JSON.stringify(updated));
      return updated;
    });
  };

  const statusColor = (s: string) => {
    if (s === "open") return "bg-success/10 text-success";
    if (s === "closed") return "bg-muted text-muted-foreground";
    return "bg-accent/10 text-accent";
  };

  const escrowStatusLabel = (s: string) => {
    if (s === "held") return { label: "Retido em Custódia", class: "bg-accent/10 text-accent" };
    if (s === "released") return { label: "Liberado ao Profissional ✅", class: "bg-success/10 text-success" };
    if (s === "refunded") return { label: "Reembolsado", class: "bg-destructive/10 text-destructive" };
    return { label: s, class: "bg-muted text-muted-foreground" };
  };

  const handleReleaseEscrow = async (escrowId: string) => {
    const { error } = await supabase
      .from("escrow")
      .update({ status: "released", released_at: new Date().toISOString() })
      .eq("id", escrowId);

    if (error) {
      toast.error("Erro ao liberar pagamento");
      return;
    }

    toast.success("Pagamento liberado com sucesso! ✅", {
      description: "O valor foi creditado na carteira do profissional.",
    });
    setEscrows((prev) =>
      prev.map((e) => (e.id === escrowId ? { ...e, status: "released", released_at: new Date().toISOString() } : e))
    );
  };

  const handleGenerateReceipt = (item: any) => {
    setReceiptData({
      id: item.id || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: item.amount,
      freelancerName: item.users?.name || "Prestador Autônomo",
      companyName: profile?.name || "Empresa Contratante",
      date: item.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
      service: "Prestação de Serviços Autônomos Eventuais (Sem vínculo empregatício - Art. 442-B CLT)",
    });
    setReceiptModalOpen(true);
  };

  const favoriteFreelancers = freelancers.filter((f) => favoriteIds.includes(f.user_id));

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14 max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground">Painel Empresa</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-secondary-foreground/70">
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="container py-6 max-w-5xl mx-auto px-4 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Olá, {profile?.name} 👋</h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                Membro Fundador VIP
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              São João del-Rei e Região • Acesso completo liberado
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/conversas")}>
              <MessageSquare className="h-4 w-4 mr-1" /> Conversas
            </Button>
            <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => navigate("/urgente")}>
              <Zap className="h-4 w-4 mr-1 text-destructive" /> Radar Turbo
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/criar-vaga")}>
              <Plus className="h-4 w-4 mr-1" /> Criar Vaga
            </Button>
          </div>
        </div>

        {/* ROI & Membership Widget */}
        <Card className="border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    Período Gratuito Ativo: Restam 54 dias de 60
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aproveite para favoritar seus profissionais de confiança e proteger seus finais de semana sem desfalque.
                </p>
              </div>

              {/* Stats pill */}
              <div className="flex items-center gap-4 bg-background/80 border border-border/80 rounded-2xl p-3 shadow-2xs">
                <div className="text-center px-2">
                  <div className="flex items-center justify-center gap-1 text-primary font-bold text-base">
                    <Clock className="h-4 w-4" />
                    <span>~16h</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Tempo Poupado</p>
                </div>
                <div className="h-7 w-px bg-border" />
                <div className="text-center px-2">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-base">
                    <TrendingUp className="h-4 w-4" />
                    <span>R$ 2.800+</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Operação Protegida</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="equipe">
          <TabsList className="grid w-full grid-cols-5 h-11">
            <TabsTrigger value="equipe" className="text-xs sm:text-sm">
              <Heart className="h-4 w-4 mr-1.5 text-primary" /> Minha Equipe ({favoriteFreelancers.length})
            </TabsTrigger>
            <TabsTrigger value="vagas" className="text-xs sm:text-sm">
              <Briefcase className="h-4 w-4 mr-1.5" /> Vagas
            </TabsTrigger>
            <TabsTrigger value="freelancers" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-1.5" /> Explorar
            </TabsTrigger>
            <TabsTrigger value="escrow" className="text-xs sm:text-sm">
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Custódia
            </TabsTrigger>
            <TabsTrigger value="pagamentos" className="text-xs sm:text-sm">
              <CreditCard className="h-4 w-4 mr-1.5" /> Recibos
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Minha Equipe Favorita */}
          <TabsContent value="equipe" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Profissionais de confiança favoritados por você. Chame-os diretamente com prioridade.
              </p>
            </div>

            {favoriteFreelancers.length === 0 ? (
              <Card className="border-dashed border-border/80">
                <CardContent className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">Sua equipe favorita está vazia</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Navegue na aba <strong>"Explorar"</strong> e clique no coração dos garçons, cozinheiros e atendentes que você quer manter no seu time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favoriteFreelancers.map((f: any) => (
                  <Card key={f.id} className="border-border hover:border-primary/40 transition-all shadow-2xs">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-foreground">{f.users?.name || "Profissional"}</p>
                          <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] py-0">Disponível</Badge>
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
                          variant="hero"
                          onClick={() => {
                            toast.success(`Convite prioritário enviado para ${f.users?.name}! 🚀`);
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

          {/* Tab 2: Vagas */}
          <TabsContent value="vagas" className="space-y-3 mt-4">
            {jobs.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">Nenhuma vaga criada ainda. Clique em "Criar Vaga" para começar.</CardContent></Card>
            ) : jobs.map(job => (
              <Card key={job.id} className="border-border">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{job.title || "Sem título"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(job.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.urgent && <Badge variant="destructive" className="text-xs">Urgente</Badge>}
                    <Badge className={statusColor(job.status)}>{job.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tab 3: Explorar Freelancers */}
          <TabsContent value="freelancers" className="space-y-3 mt-4">
            {freelancers.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">Nenhum profissional encontrado no momento.</CardContent></Card>
            ) : freelancers.map((f: any) => {
              const isFav = favoriteIds.includes(f.user_id);
              const startChat = async () => {
                if (!companyId || !profile) return;
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
                  toast.error("Erro ao iniciar conversa");
                  return;
                }
                navigate(`/chat/${newConv.id}`);
              };

              return (
                <Card key={f.id} className="border-border hover:border-primary/20 transition-colors">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{f.users?.name || "Sem nome"}</p>
                      <p className="text-xs text-muted-foreground">{f.category || "Geral"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(f.user_id, f.users?.name || "Profissional")}
                        className={isFav ? "text-primary" : "text-muted-foreground hover:text-primary"}
                        title={isFav ? "Remover da equipe" : "Adicionar à equipe favorita"}
                      >
                        <Heart className={`h-4 w-4 ${isFav ? "fill-primary" : ""}`} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={startChat}>
                        <MessageSquare className="h-4 w-4 mr-1" /> Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Tab 4: Custódia (Escrow) */}
          <TabsContent value="escrow" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3 mb-2 text-xs text-foreground leading-relaxed">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span>
                <strong>Garantia de Custódia (Escrow):</strong> O valor fica retido com segurança e só é transferido ao prestador após a confirmação de que o serviço foi finalizado.
              </span>
            </div>

            {escrows.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">Nenhum pagamento em custódia no momento.</CardContent></Card>
            ) : escrows.map((e: any) => {
              const st = escrowStatusLabel(e.status);
              return (
                <Card key={e.id} className="border-border">
                  <CardContent className="pt-4 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-base">R$ {Number(e.amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Para: <strong>{e.users?.name || "Profissional Autônomo"}</strong> • {new Date(e.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Badge className={st.class}>{st.label}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
                      {e.status === "held" && (
                        <Button
                          size="sm"
                          variant="hero"
                          onClick={() => handleReleaseEscrow(e.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Liberar Pagamento ao Autônomo
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateReceipt(e)}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" /> Emitir Recibo Digital (RPA)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Tab 5: Recibos e Comprovantes Contábeis */}
          <TabsContent value="pagamentos" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Comprovantes & Recibos Fiscais</h3>
                <p className="text-xs text-muted-foreground">
                  Gere comprovantes formais de prestação de serviços autônomos para dedução contábil.
                </p>
              </div>
            </div>

            {payments.length === 0 && escrows.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">Nenhum histórico de pagamentos registrado.</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {[...escrows, ...payments].map((p, i) => (
                  <Card key={p.id || i} className="border-border">
                    <CardContent className="pt-3 pb-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm">R$ {Number(p.amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString("pt-BR")} • Prestação de Serviços
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleGenerateReceipt(p)}>
                        <FileText className="h-3.5 w-3.5 mr-1" /> Ver Recibo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Recibo Digital Modal (RPA) */}
      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent className="max-w-md p-6 bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Recibo de Prestação de Serviço Autônomo
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Comprovante digital emitido pela plataforma Trampô (São João del-Rei/MG)
            </DialogDescription>
          </DialogHeader>

          {receiptData && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número de Registro:</span>
                  <span className="font-mono font-semibold text-foreground">{receiptData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tomador (Contratante):</span>
                  <span className="font-semibold text-foreground">{receiptData.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prestador (Autônomo):</span>
                  <span className="font-semibold text-foreground">{receiptData.freelancerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data da Liquidação:</span>
                  <span className="font-semibold text-foreground">{receiptData.date}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>Valor Total Líquido:</span>
                  <span className="text-primary">R$ {Number(receiptData.amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                <Scale className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Afastamento de Vínculo Trabalhista:</strong> Documento comprobatório de prestação de serviços civis autônomos sem subordinação jurídica, regido pelo Art. 442-B da CLT.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast.success("Recibo copiado para a área de transferência!");
                    setReceiptModalOpen(false);
                  }}
                >
                  Copiar Dados
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={() => {
                    window.print();
                  }}
                >
                  <Printer className="h-4 w-4 mr-1.5" /> Imprimir Recibo
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
