import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CreditCard, Shield, LogOut, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

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

  useEffect(() => { load(); }, []);

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Trampô" className="w-7 h-7" />
            <span className="font-bold text-secondary-foreground">
              <Shield className="inline h-4 w-4 mr-1" />Painel Admin
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-secondary-foreground/70">
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="container py-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-foreground mb-6">Administração 🛡️</h1>

        <Tabs defaultValue="usuarios">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usuarios"><Users className="h-4 w-4 mr-1" /> Usuários</TabsTrigger>
            <TabsTrigger value="vagas"><Shield className="h-4 w-4 mr-1" /> Vagas</TabsTrigger>
            <TabsTrigger value="pagamentos"><CreditCard className="h-4 w-4 mr-1" /> Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="mt-4">
            <Card className="border-border overflow-hidden">
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
                  {users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell><Badge variant="outline">{u.type}</Badge></TableCell>
                      <TableCell>
                        {u.blocked ? (
                          <Badge variant="destructive">Bloqueado</Badge>
                        ) : (
                          <Badge className="bg-success/10 text-success">Ativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={u.blocked ? "outline" : "destructive"}
                          onClick={() => toggleBlock(u.id, u.blocked)}
                        >
                          {u.blocked ? <><CheckCircle className="h-3 w-3 mr-1" /> Desbloquear</> : <><Ban className="h-3 w-3 mr-1" /> Bloquear</>}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="vagas" className="space-y-3 mt-4">
            {jobs.map((job: any) => (
              <Card key={job.id} className="border-border">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{job.title || "Sem título"}</p>
                    <p className="text-xs text-muted-foreground">{job.companies?.name} • {new Date(job.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex gap-2">
                    {job.urgent && <Badge variant="destructive">Urgente</Badge>}
                    <Badge variant="outline">{job.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {jobs.length === 0 && (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma vaga.</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="pagamentos" className="mt-4">
            <Card className="border-border overflow-hidden">
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
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Nenhum pagamento.</TableCell></TableRow>
                  ) : payments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold">R$ {p.amount}</TableCell>
                      <TableCell>
                        <Badge className={p.status === "paid" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
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
