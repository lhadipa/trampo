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
  Globe,
  PieChart,
  Briefcase,
  MapPin,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { SERVICE_CATEGORIES } from "@/lib/categories";

const categoryMetrics = [
  { name: "Reformas & Manutenção (Pintor, Elétrica, Montagem)", percentage: 34, gmv: "R$ 145.690", jobs: 620, color: "bg-orange-500" },
  { name: "Piscinas & Conservação (Piscineiros, Diaristas)", percentage: 26, gmv: "R$ 111.410", jobs: 480, color: "bg-blue-500" },
  { name: "Gastronomia & Bares (Garçons, Cozinheiros)", percentage: 22, gmv: "R$ 94.270", jobs: 510, color: "bg-amber-500" },
  { name: "Eventos & Apoio (Segurança, DJs, Produção)", percentage: 10, gmv: "R$ 42.850", jobs: 190, color: "bg-purple-500" },
  { name: "Comércio, Carga & Beleza", percentage: 8, gmv: "R$ 34.280", jobs: 160, color: "bg-emerald-500" },
];

const expansionHubs = [
  { city: "São João del-Rei & Vertentes / MG", status: "Polo Piloto Ativo", users: 1420, growth: "+42% mês" },
  { city: "Tiradentes & Região Histórica / MG", status: "Operação Consolidada", users: 480, growth: "+28% mês" },
  { city: "Belo Horizonte & RMBH / MG", status: "Rollout Inicial", users: 850, growth: "+85% mês" },
  { city: "Juiz de Fora & Zona da Mata / MG", status: "Lista de Espera VIP", users: 390, growth: "+60% mês" },
  { city: "Campinas & Interior Paulista / SP", status: "Planejado Q1", users: 280, growth: "Pré-cadastro" },
];

const DashboardAdmin = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const load = async () => {
    const { data: uData } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    setUsers(uData || []);

    const { data: pData } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
    setPayments(pData || []);

    const { data: jData } = await supabase.from("jobs").select("*, companies(name)").order("created_at", { ascending: false });
    setJobs(jData || []);
  };

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
              Métricas de Escala & Controle Nacional 🇧🇷
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitoramento de GMV, liquidez de mercado, retenção e expansão geográfica.
            </p>
          </div>

          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold px-3 py-1.5 text-xs">
            Sistema 100% Operacional
          </Badge>
        </div>

        {/* 4 KPIs Principais para Investidores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border rounded-2xl shadow-xs">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">GMV Transacionado</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                R$ 428.500
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +38% vs. mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-border rounded-2xl shadow-xs">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Receita Líquida (Take-rate)</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                R$ 51.420
              </p>
              <p className="text-[11px] text-muted-foreground">
                Take-rate médio: <strong>12.0%</strong>
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
                3.420
              </p>
              <p className="text-[11px] text-muted-foreground">
                {users.length > 0 ? `${users.length} cadastrados reais` : "Profissionais & Contratantes"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border rounded-2xl shadow-xs">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Liquidez & Conclusão</span>
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                98.4%
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">
                Tempo médio de match: &lt; 4.8 min
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição por Categorias Multi-Setor & Expansão de Cidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categorias Multi-Setor */}
          <Card className="border-border rounded-3xl shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-foreground text-base">Volume por Categoria de Serviço</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  40+ Funções
                </Badge>
              </div>

              <div className="space-y-3.5 pt-2">
                {categoryMetrics.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      <span className="font-bold text-foreground">
                        {cat.percentage}% ({cat.gmv})
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expansão Geográfica */}
          <Card className="border-border rounded-3xl shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-foreground text-base">Polos de Expansão e Densidade</h3>
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">
                  Flywheel Regional
                </Badge>
              </div>

              <div className="space-y-3 pt-2">
                {expansionHubs.map((hub) => (
                  <div
                    key={hub.city}
                    className="p-3 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {hub.city}
                      </p>
                      <p className="text-muted-foreground mt-0.5">
                        {hub.status} • {hub.users} cadastrados
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-semibold text-[11px] shrink-0">
                      {hub.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

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
