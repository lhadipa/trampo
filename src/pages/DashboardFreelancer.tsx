import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, History, Wallet, CheckCircle, LogOut, MessageSquare, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const DashboardFreelancer = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);

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

      // Load escrows for this freelancer
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
      toast.success("Candidatura enviada! ✅");
      const { data: apps } = await supabase
        .from("applications")
        .select("*, jobs(*)")
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false });
      setMyApplications(apps || []);
    }
  };

  const appliedJobIds = myApplications.map((a: any) => a.job_id);

  const escrowStatusLabel = (s: string) => {
    if (s === "held") return { label: "Aguardando liberação", class: "bg-accent/10 text-accent" };
    if (s === "released") return { label: "Liberado ✅", class: "bg-success/10 text-success" };
    if (s === "refunded") return { label: "Reembolsado", class: "bg-destructive/10 text-destructive" };
    return { label: s, class: "bg-muted text-muted-foreground" };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground">Painel Freelancer</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-secondary-foreground/70">
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="container py-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Olá, {profile?.name} 👋</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/conversas")}>
              <MessageSquare className="h-4 w-4 mr-1" /> Chat
            </Button>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-success" />
              <span className="font-bold text-foreground">R$ {profile?.balance?.toFixed(2) ?? "0.00"}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="vagas">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vagas"><Briefcase className="h-4 w-4 mr-1" /> Vagas</TabsTrigger>
            <TabsTrigger value="historico"><History className="h-4 w-4 mr-1" /> Histórico</TabsTrigger>
            <TabsTrigger value="escrow"><ShieldCheck className="h-4 w-4 mr-1" /> Escrow</TabsTrigger>
            <TabsTrigger value="saldo"><Wallet className="h-4 w-4 mr-1" /> Saldo</TabsTrigger>
          </TabsList>

          <TabsContent value="vagas" className="space-y-3 mt-4">
            {jobs.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma vaga disponível no momento.</CardContent></Card>
            ) : jobs.map((job: any) => (
              <Card key={job.id} className="border-border">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{job.title || "Sem título"}</p>
                      <p className="text-xs text-muted-foreground">{job.companies?.name} • {new Date(job.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {job.urgent && <Badge variant="destructive" className="text-xs">Urgente</Badge>}
                      {job.price && <span className="text-sm font-bold text-foreground">R$ {job.price}</span>}
                    </div>
                  </div>
                  {job.description && <p className="text-sm text-muted-foreground mb-3">{job.description}</p>}
                  {appliedJobIds.includes(job.id) ? (
                    <Badge className="bg-success/10 text-success"><CheckCircle className="h-3 w-3 mr-1" /> Candidatado</Badge>
                  ) : (
                    <Button size="sm" variant="hero" onClick={() => handleApply(job.id)}>Aceitar vaga</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="historico" className="space-y-3 mt-4">
            {myApplications.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma candidatura ainda.</CardContent></Card>
            ) : myApplications.map((app: any) => (
              <Card key={app.id} className="border-border">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{app.jobs?.title || "Sem título"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <Badge className={app.status === "accepted" ? "bg-success/10 text-success" : app.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}>
                    {app.status === "accepted" ? "Aceito" : app.status === "rejected" ? "Rejeitado" : "Pendente"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="escrow" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                <strong>Escrow:</strong> O pagamento fica retido até a empresa confirmar o serviço. Depois é liberado para você.
              </p>
            </div>
            {escrows.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum escrow encontrado.</CardContent></Card>
            ) : escrows.map((e: any) => {
              const st = escrowStatusLabel(e.status);
              return (
                <Card key={e.id} className="border-border">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">R$ {Number(e.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        De: {e.users?.name || "Empresa"} • {new Date(e.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge className={st.class}>{st.label}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="saldo" className="mt-4">
            <Card className="border-border">
              <CardContent className="py-8 text-center">
                <Wallet className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">R$ {profile?.balance?.toFixed(2) ?? "0.00"}</p>
                <p className="text-sm text-muted-foreground mt-2">Saldo disponível para saque</p>
                <Button variant="hero" className="mt-4" onClick={() => toast.info("Função de saque em breve!")}>
                  Solicitar saque
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
