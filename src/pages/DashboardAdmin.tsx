import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users,
  CreditCard,
  Shield,
  LogOut,
  Ban,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Activity,
  PieChart,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const DashboardAdmin = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);

  const load = async () => {
    const { data: uData } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    setUsers(uData || []);

    const { data: pData } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
    setPayments(pData || []);

    const { data: jData } = await supabase.from("jobs").select("*, companies(name)").order("created_at", { ascending: false });
    setJobs(jData || []);

    const { data: eData } = await supabase.from("escrow").select("*").order("created_at", { ascending: false });
    setEscrows(eData || []);
  };

  const soma = (linhas: any[]) => linhas.reduce((total, l) => total + Number(l.amount || 0), 0);
  const moeda = (valor: number) => `R$ ${valor.toFixed(2).replace(".", ",")}`;

  const volumeTransacionado = soma(payments);
  const emCustodia = soma(escrows.filter((e) => e.status === "held"));
  const vagasAbertas = jobs.filter((j) => j.status === "open").length;

  // Distribuicao de vagas por categoria, calculada sobre os dados reais.
  const porCategoria = Object.entries(
    jobs.reduce<Record<string, number>>((acumulado, job) => {
      const chave = job.category || "Sem categoria";
      acumulado[chave] = (acumulado[chave] || 0) + 1;
      return acumulado;
    }, {}),
  )
    .map(([nome, total]) => ({ nome, total, percentual: jobs.length ? Math.round((total / jobs.length) * 100) : 0 }))
    .sort((a, b) => b.total - a.total);

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (userId: string, currentBlocked: boolean) => {
    const { error } = await supabase.from("users").update({ blocked: !currentBlocked }).eq("id", userId);
    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      toast.success(currentBlocked ? "Usuário desbloqueado" : "Usuário bloqueado");
      load();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> Painel de Governança & Métricas Executivas
            </span>
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

      <main className="container py-8 max-w-6xl mx-auto px-4 space-y-8">
        {/* Header Executivo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Visão Geral de Desempenho
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Administração do Trampô
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Usuários, vagas, custódia e pagamentos da plataforma.
            </p>
          </div>
        </div>

        {/* 4 KPIs Principais para Investidores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border rounded-2xl shadow-xs">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Volume transacionado</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {moeda(volumeTransacionado)}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {payments.length} pagamento(s) registrado(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-border rounded-2xl shadow-xs">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Em custódia</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {moeda(emCustodia)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Retido até a conclusão do serviço
              </p>
            </CardContent>
          </Card>

          <Card className="border-border rounded-2xl shadow-xs">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Base de Usuários</span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {users.length}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Profissionais e contratantes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border rounded-2xl shadow-xs">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Vagas abertas</span>
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {vagasAbertas}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">
                De {jobs.length} vaga(s) publicada(s)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribuicao de vagas por categoria, calculada sobre os dados reais */}
        <Card className="border-border rounded-3xl shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-base">Vagas por categoria</h3>
            </div>

            {porCategoria.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma vaga publicada ainda.</p>
            ) : (
              <div className="space-y-3.5 pt-2">
                {porCategoria.map((cat) => (
                  <div key={cat.nome} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{cat.nome}</span>
                      <span className="font-bold text-foreground">
                        {cat.percentual}% ({cat.total})
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${cat.percentual}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abas de Governança: Usuários, Vagas e Pagamentos */}
        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-12 rounded-2xl p-1 bg-muted/60">
            <TabsTrigger value="usuarios" className="text-xs sm:text-sm font-semibold rounded-xl">
              <Users className="h-4 w-4 mr-1.5" /> Gestão de Usuários
            </TabsTrigger>
            <TabsTrigger value="vagas" className="text-xs sm:text-sm font-semibold rounded-xl">
              <Briefcase className="h-4 w-4 mr-1.5" /> Auditoria de Vagas
            </TabsTrigger>
            <TabsTrigger value="pagamentos" className="text-xs sm:text-sm font-semibold rounded-xl">
              <CreditCard className="h-4 w-4 mr-1.5" /> Fluxo Financeiro (Pix / Escrow)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="mt-4">
            <Card className="border-border overflow-hidden rounded-2xl shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum usuário cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-bold text-foreground">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{u.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {u.blocked ? (
                            <Badge variant="destructive">Bloqueado</Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              Ativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={u.blocked ? "outline" : "destructive"}
                            onClick={() => toggleBlock(u.id, u.blocked)}
                            className="rounded-xl text-xs"
                          >
                            {u.blocked ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" /> Desbloquear
                              </>
                            ) : (
                              <>
                                <Ban className="h-3 w-3 mr-1" /> Bloquear
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="vagas" className="space-y-3 mt-4">
            {jobs.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="py-8 text-center text-muted-foreground text-sm">
                  Nenhuma vaga registrada no momento.
                </CardContent>
              </Card>
            ) : (
              jobs.map((job: any) => (
                <Card key={job.id} className="border-border rounded-2xl">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground text-sm">{job.title || "Sem título"}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.companies?.name} • {new Date(job.date).toLocaleDateString("pt-BR")} • Diária: R$ {job.price || "150"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {job.urgent && <Badge variant="destructive">Urgente</Badge>}
                      <Badge variant="outline">{job.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pagamentos" className="mt-4">
            <Card className="border-border overflow-hidden rounded-2xl shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Nenhum pagamento registrado no banco no momento.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-bold">R$ {p.amount}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-600">{p.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardAdmin;
