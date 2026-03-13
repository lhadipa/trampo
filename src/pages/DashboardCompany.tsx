import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, Users, CreditCard, LogOut, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const DashboardCompany = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      // Get or create company
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
    };
    load();
  }, [profile]);

  const statusColor = (s: string) => {
    if (s === "open") return "bg-success/10 text-success";
    if (s === "closed") return "bg-muted text-muted-foreground";
    return "bg-accent/10 text-accent";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground">Painel Empresa</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-secondary-foreground/70">
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="container py-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Olá, {profile?.name} 👋</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/conversas")}>
              <MessageSquare className="h-4 w-4 mr-1" /> Chat
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/criar-vaga")}>
              <Plus className="h-4 w-4 mr-1" /> Criar Vaga
            </Button>
          </div>
        </div>

        <Tabs defaultValue="vagas">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vagas"><Briefcase className="h-4 w-4 mr-1" /> Vagas</TabsTrigger>
            <TabsTrigger value="freelancers"><Users className="h-4 w-4 mr-1" /> Freelancers</TabsTrigger>
            <TabsTrigger value="pagamentos"><CreditCard className="h-4 w-4 mr-1" /> Pagar</TabsTrigger>
          </TabsList>

          <TabsContent value="vagas" className="space-y-3 mt-4">
            {jobs.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma vaga criada ainda.</CardContent></Card>
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

          <TabsContent value="freelancers" className="space-y-3 mt-4">
            {freelancers.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum freelancer encontrado.</CardContent></Card>
            ) : freelancers.map((f: any) => {
              const startChat = async () => {
                if (!companyId || !profile) return;
                // Check if conversation exists
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
                <Card key={f.id} className="border-border">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{f.users?.name || "Sem nome"}</p>
                      <p className="text-xs text-muted-foreground">{f.category}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={startChat}>
                      <MessageSquare className="h-4 w-4 mr-1" /> Chat
                    </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="freelancers" className="space-y-3 mt-4">
            {freelancers.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum freelancer encontrado.</CardContent></Card>
            ) : freelancers.map((f: any) => (
              <Card key={f.id} className="border-border">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{f.users?.name || "Sem nome"}</p>
                    <p className="text-xs text-muted-foreground">{f.category}</p>
                  </div>
                  <Badge variant="outline">{f.users?.email}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pagamentos" className="space-y-3 mt-4">
            {payments.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum pagamento realizado.</CardContent></Card>
            ) : payments.map(p => (
              <Card key={p.id} className="border-border">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">R$ {p.amount}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <Badge className={p.status === "paid" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}>{p.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardCompany;
