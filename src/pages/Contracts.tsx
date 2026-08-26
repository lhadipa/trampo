import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getContractState } from "@/lib/contractState";

const demoContracts = [
  { id: "demo-contract-1", status: "FUNDS_SECURED", amount: 180, start_at: new Date(Date.now() + 3600000 * 5).toISOString(), description: "Garçom para evento", jobs: { title: "Garçom para evento", companies: { name: "Restaurante XPTO" } } },
  { id: "demo-contract-2", status: "COMPLETED", amount: 220, start_at: new Date(Date.now() - 86400000 * 3).toISOString(), description: "Pintura comercial", jobs: { title: "Pintura comercial", companies: { name: "Imobiliária Vertentes" } } },
];

const Contracts = () => {
  const { profile } = useAuth();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const load = async () => { if (!profile) return; const { data, error } = await (supabase as any).from("contracts").select("*, jobs(title, companies(name))").order("start_at", { ascending: true }); setContracts(!error && data?.length ? data : demoContracts); setLoading(false); }; load(); }, [profile]);
  const active = contracts.filter((c) => !["COMPLETED", "RELEASED", "CANCELLED"].includes(c.status));
  const completed = contracts.filter((c) => ["COMPLETED", "RELEASED"].includes(c.status));
  const ContractCard = ({ contract }: { contract: any }) => { const state = getContractState(contract.status); return <Card className="rounded-2xl border-border shadow-sm"><CardContent className="p-4 space-y-3"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-foreground">{contract.jobs?.title || contract.description || "Trampo contratado"}</p><p className="text-xs text-muted-foreground mt-1">{contract.jobs?.companies?.name || "Empresa parceira"}</p></div><Badge variant="outline" className={state.tone}>{state.label}</Badge></div><div className="grid grid-cols-2 gap-2 text-xs"><span className="flex items-center gap-1.5 text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{new Date(contract.start_at).toLocaleDateString("pt-BR")}</span><span className="flex items-center gap-1.5 text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{new Date(contract.start_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></div><div className="flex items-center justify-between border-t pt-3"><span className="font-extrabold text-emerald-600">R$ {Number(contract.amount).toFixed(2).replace(".", ",")}</span>{["FUNDS_SECURED", "RELEASED"].includes(contract.status) && <span className="text-[11px] text-emerald-700 flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Pagamento protegido</span>}</div></CardContent></Card>; };
  const Empty = ({ text }: { text: string }) => <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground"><CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-muted-foreground/50" />{text}</div>;
  return <div className="min-h-screen bg-background pb-10"><header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"><div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4"><Button variant="ghost" size="icon" asChild><Link to="/painel"><ArrowLeft className="h-4 w-4" /></Link></Button><div><p className="font-bold">Meus Trampos</p><p className="text-[11px] text-muted-foreground">Tudo que você precisa fazer agora</p></div></div></header><main className="mx-auto max-w-2xl space-y-5 px-4 py-5"><div className="rounded-2xl bg-primary/10 p-4"><p className="text-sm font-bold flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-primary" /> Seu próximo trampo</p><p className="mt-1 text-xs text-muted-foreground">Agenda, pagamento protegido e execução em um só lugar.</p></div><Tabs defaultValue="proximos"><TabsList className="grid h-auto w-full grid-cols-3 rounded-xl p-1"><TabsTrigger value="proximos">Próximos</TabsTrigger><TabsTrigger value="andamento">Em andamento</TabsTrigger><TabsTrigger value="concluidos">Concluídos</TabsTrigger></TabsList>{loading ? <div className="py-12 text-center text-sm text-muted-foreground">Carregando seus trampos...</div> : <><TabsContent value="proximos" className="space-y-3">{active.filter((c) => c.status !== "IN_PROGRESS").map((c) => <ContractCard key={c.id} contract={c} />)}{!active.filter((c) => c.status !== "IN_PROGRESS").length && <Empty text="Você ainda não tem trabalhos agendados." />}</TabsContent><TabsContent value="andamento" className="space-y-3">{active.filter((c) => c.status === "IN_PROGRESS").map((c) => <ContractCard key={c.id} contract={c} />)}{!active.filter((c) => c.status === "IN_PROGRESS").length && <Empty text="Nenhum trabalho em andamento." />}</TabsContent><TabsContent value="concluidos" className="space-y-3">{completed.map((c) => <ContractCard key={c.id} contract={c} />)}{!completed.length && <Empty text="Seus trabalhos concluídos aparecerão aqui." />}</TabsContent></>}</Tabs></main></div>;
};
export default Contracts;
