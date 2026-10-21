import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contracts as contracts_api, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  History,
  Wallet,
  CheckCircle,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Star,
  CalendarCheck,
  Lock,
  ArrowRight,
  MapPin,
  Clock,
  Search,
  Filter,
  DollarSign,
  Zap,
  ArrowLeft,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { getContractState } from "@/lib/contractState";
import { ShieldCheck as PhosphorShieldCheck } from "@phosphor-icons/react";
import { expressInterestMock, getProfessionalDashboard } from "@/lib/pilotMockService";
import { formatBRL } from "@/lib/pilotPricing";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon } from "leaflet";
import { getMarketplaceJobs, getPilotSnapshot, getProfessionalPreferences, togglePreferenceMock } from "@/lib/pilotMockService";
import { PILOT_CENTER, PILOT_ZOOM } from "@/lib/marketplaceGeo";
import type { GeoBounds, MarketplaceJob } from "@/lib/pilotTypes";

const jobIcon = divIcon({ className: "", html: '<span class="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-primary text-sm font-bold text-primary-foreground shadow">R$</span>', iconSize: [36, 36], iconAnchor: [18, 18] });

const MarketplaceMapEvents = ({ onBounds, selectedJob }: { onBounds: (bounds: GeoBounds) => void; selectedJob?: MarketplaceJob }) => {
  const map = useMap();
  useMapEvents({ moveend: (event) => { const bounds = event.target.getBounds(); onBounds({ south: bounds.getSouth(), west: bounds.getWest(), north: bounds.getNorth(), east: bounds.getEast() }); } });
  useEffect(() => { if (selectedJob) map.flyTo([selectedJob.approximateLatitude, selectedJob.approximateLongitude], Math.max(map.getZoom(), 15)); }, [map, selectedJob]);
  return null;
};

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
  const [myContracts, setMyContracts] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [pilotRevision, setPilotRevision] = useState(0);
  const [marketBounds, setMarketBounds] = useState<GeoBounds>();
  const [appliedBounds, setAppliedBounds] = useState<GeoBounds>();
  const [selectedMarketJobId, setSelectedMarketJobId] = useState<string>();
  const [mapFailed, setMapFailed] = useState(false);
  const [marketOrigin, setMarketOrigin] = useState<{ latitude: number; longitude: number }>();

  const load = async () => {
    if (!profile) return;
    {
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

      if (freelancer) {
        // Contratos deste profissional: definem o que ja esta em execucao.
        const { data: cData } = await supabase
          .from("contracts")
          .select("*")
          .eq("freelancer_id", freelancer.id);
        setMyContracts(cData || []);
        setCheckedInJobIds((cData || []).filter((c: any) => c.status !== "FUNDS_SECURED").map((c: any) => c.job_id));
      }
    }
  };

  useEffect(() => {
    // Nenhum endpoint real é consultado no piloto.
    setPilotRevision((value) => value + 1);
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
      setSelectedJob(null);
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
    const contrato = myContracts.find((c: any) => c.job_id === jobId);
    if (!contrato) {
      toast.error("Este trabalho ainda não possui um contrato ativo para check-in.");
      return;
    }

    // O servidor registra a presenca e coloca o contrato em execucao numa so
    // transacao -- e' o que muda o estado para "Em andamento" dos dois lados.
    const { error } = await contracts_api.checkIn(contrato.id);
    if (error) {
      toast.error(error.message);
      return;
    }

    setCheckedInJobIds((prev) => [...prev, jobId]);
    toast.success(`Check-in confirmado para "${jobTitle}"!`, {
      description: "O contratante já vê o trabalho como em execução.",
    });
    load();
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

  void pilotRevision;
  const pilotDashboard = getProfessionalDashboard();
  const marketplaceJobs = getMarketplaceJobs({ search: searchTerm, categoryId: selectedCategory, bounds: appliedBounds, origin: marketOrigin });
  const selectedMarketJob = marketplaceJobs.find((job) => job.id === selectedMarketJobId);
  const marketplaceSnapshot = getPilotSnapshot();
  const activePreferences = getProfessionalPreferences(pilotDashboard.professional.id);
  const pilotInterestJobIds = pilotDashboard.interests.map((interest) => interest.jobId);
  const pilotApply = (jobId: string) => {
    const result = expressInterestMock(jobId, pilotDashboard.professional.id);
    if (result.success) { setPilotRevision((value) => value + 1); toast.success(result.message); }
    else toast.error(result.message);
  };
  const locateMarketplace = () => navigator.geolocation?.getCurrentPosition(
    (position) => setMarketOrigin({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
    () => toast.info("Localização não autorizada. Mantivemos o mapa na região-piloto."),
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
  );
  const toggleMarketplacePreference = (job: MarketplaceJob) => {
    const location = marketplaceSnapshot.interestLocations.find((item) => item.contractorId === job.contractorId);
    if (!location) return toast.error("Este local ainda não aceita currículos de interesse.");
    const result = togglePreferenceMock(pilotDashboard.professional.id, location.id, job.categoryId);
    if (result.success) { setPilotRevision((value) => value + 1); toast.success(result.message); }
    else toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-50 border-b bg-secondary/95"><div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4"><div className="flex items-center gap-2"><Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-secondary-foreground/70"><ArrowLeft className="mr-1 h-4 w-4" />Início</Button><img src={logo} alt="Trampô" className="h-7 w-7" /><span className="font-bold text-secondary-foreground">Painel profissional</span></div><Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="text-secondary-foreground/70"><LogOut className="mr-1 h-4 w-4" />Sair</Button></div></header>
      <main className="container mx-auto max-w-4xl space-y-6 px-4 py-6">
        <p className="pilot-demo-notice">Demonstração: vagas, seleções, taxa de confirmação, check-in e recibos são fictícios.</p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold">Olá, {profile?.name || "Ana Exemplo"}</h1><p className="mt-1 text-sm text-muted-foreground">{pilotDashboard.professional.roleLabel} · sem assinatura mensal</p></div><Button variant="outline" onClick={() => navigate("/meus-trampos")}>Ver trabalho selecionado</Button></div>
        <div className="grid gap-3 sm:grid-cols-3"><Card className="pilot-surface"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Oportunidades abertas</p><p className="mt-1 text-xl font-bold">{pilotDashboard.openJobs.length}</p></CardContent></Card><Card className="pilot-surface"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Diárias concluídas</p><p className="mt-1 text-xl font-bold">{pilotDashboard.professional.completedShifts}</p></CardContent></Card><Card className="pilot-surface"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Taxa após seleção</p><p className="mt-1 text-xl font-bold">R$ 7,90</p><p className="text-xs text-muted-foreground">Nunca para demonstrar interesse</p></CardContent></Card></div>
        <Tabs defaultValue="oportunidades"><TabsList className="grid h-auto w-full grid-cols-3"><TabsTrigger value="oportunidades">Oportunidades</TabsTrigger><TabsTrigger value="interesses">Meus interesses</TabsTrigger><TabsTrigger value="selecionado">Selecionado</TabsTrigger></TabsList>
          <TabsContent value="oportunidades" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Buscar oportunidades" placeholder="Buscar por função ou bairro" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pl-10" /></div><select aria-label="Filtrar categoria" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="min-h-11 rounded-md border bg-background px-3 text-sm"><option value="all">Todas as categorias</option>{SERVICE_CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
            <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={locateMarketplace}><MapPin className="mr-1 h-4 w-4" />Perto de mim</Button><Button size="sm" variant="outline" onClick={() => { setAppliedBounds(undefined); setMarketOrigin(undefined); setSelectedMarketJobId(undefined); }}>Região-piloto</Button>{marketBounds && <Button size="sm" onClick={() => setAppliedBounds(marketBounds)}>Buscar nesta área</Button>}</div>
            {mapFailed ? <div className="rounded-xl border border-dashed p-6 text-center"><p className="font-semibold">O mapa não carregou</p><p className="mt-1 text-sm text-muted-foreground">A lista continua disponível com todas as ações.</p><Button className="mt-3" variant="outline" onClick={() => setMapFailed(false)}>Tentar mapa novamente</Button></div> : <div className="overflow-hidden rounded-xl border" aria-label="Mapa interativo de oportunidades"><MapContainer center={marketOrigin ? [marketOrigin.latitude, marketOrigin.longitude] : PILOT_CENTER} zoom={PILOT_ZOOM} scrollWheelZoom className="h-[22rem]"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" eventHandlers={{ tileerror: () => setMapFailed(true) }} /><MarkerClusterGroup chunkedLoading><>{marketplaceJobs.map((job) => <Marker key={job.id} position={[job.approximateLatitude, job.approximateLongitude]} icon={jobIcon} eventHandlers={{ click: () => setSelectedMarketJobId(job.id) }}><Popup><div className="space-y-1"><strong>{job.title}</strong><p>{job.neighborhood} · local aproximado</p><p>{formatBRL(job.dailyRate)} · {job.quantity} posição(ões)</p><button className="font-semibold text-primary" onClick={() => setSelectedMarketJobId(job.id)}>Ver na lista</button></div></Popup></Marker>)}</></MarkerClusterGroup><MarketplaceMapEvents onBounds={setMarketBounds} selectedJob={selectedMarketJob} /></MapContainer></div>}
            <p className="text-xs text-muted-foreground">Os marcadores indicam o bairro aproximado. O endereço exato não é exibido nesta etapa.</p>
            <div className="space-y-3" aria-live="polite">{marketplaceJobs.length ? marketplaceJobs.map((job) => { const location = marketplaceSnapshot.interestLocations.find((item) => item.contractorId === job.contractorId); const hasPreference = Boolean(location && activePreferences.some((item) => item.locationId === location.id && item.categoryId === job.categoryId)); return <Card id={`market-job-${job.id}`} key={job.id} className={`pilot-surface ${selectedMarketJobId === job.id ? "ring-2 ring-primary" : ""}`}><CardContent className="space-y-3 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><button className="text-left" onClick={() => { setSelectedMarketJobId(job.id); document.getElementById(`market-job-${job.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }}><p className="font-bold">{job.title}</p><p className="text-sm text-muted-foreground">{job.roleLabel} · {job.neighborhood} · {new Date(job.startsAt).toLocaleDateString("pt-BR")}</p></button><div className="text-right"><strong className="block text-primary">{formatBRL(job.dailyRate)}</strong><span className="text-xs text-muted-foreground">valor da diária</span></div></div><p className="text-xs text-muted-foreground">{job.quantity} posição(ões). Local mostrado de forma aproximada.</p><div className="rounded-xl border border-dashed bg-muted/30 p-4"><p className="font-semibold">Gostaria de fazer freelas neste local?</p><p className="mt-1 text-xs text-muted-foreground">Envie seu currículo de interesse. O contratante verá apenas quantas pessoas têm preferência — nunca seu nome ou perfil.</p><Button size="sm" variant={hasPreference ? "outline" : "default"} className="mt-3" onClick={() => toggleMarketplacePreference(job)}>{hasPreference ? "Preferência enviada · remover" : "Enviar currículo de interesse"}</Button></div>{pilotInterestJobIds.includes(job.id) ? <Badge variant="outline"><CheckCircle className="mr-1 h-3.5 w-3.5" />Interesse registrado</Badge> : <Button size="sm" variant="outline" onClick={() => pilotApply(job.id)}>Candidatar-se a esta vaga</Button>}</CardContent></Card>; }) : <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhuma oportunidade nesta área. Remova filtros ou volte à região-piloto.</div>}</div>
          </TabsContent>
          <TabsContent value="interesses" className="space-y-3">{pilotDashboard.interests.length ? pilotDashboard.interests.map((interest) => { const job = pilotDashboard.jobs.find((item) => item.id === interest.jobId); return <Card key={interest.id} className="pilot-surface"><CardContent className="flex items-center justify-between gap-3 p-5"><div><p className="font-bold">{job?.title}</p><p className="text-sm text-muted-foreground">Nenhuma taxa é cobrada enquanto o interesse está em análise.</p></div><Badge variant="outline">{interest.status}</Badge></CardContent></Card>; }) : <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Você ainda não demonstrou interesse.</div>}</TabsContent>
          <TabsContent value="selecionado" className="space-y-3">{pilotDashboard.assignments.length ? pilotDashboard.assignments.map((assignment) => { const job = pilotDashboard.jobs.find((item) => item.id === assignment.jobId); return <Card key={assignment.id} className="pilot-surface"><CardContent className="space-y-3 p-5"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">{job?.title}</p><p className="text-sm text-muted-foreground">Você foi selecionado. A taxa só aparece agora.</p></div><Badge variant="outline">{assignment.status}</Badge></div><div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">Confirmação avulsa: <strong>{formatBRL(assignment.professionalFee)}</strong>. Nenhuma cobrança real será feita.</div><Button onClick={() => navigate("/meus-trampos")}>Continuar confirmação demonstrativa</Button></CardContent></Card>; }) : <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhuma seleção no momento.</div>}</TabsContent>
        </Tabs>
      </main>
    </div>
  );

  /* Fluxo legado preservado abaixo como referência durante o piloto. */
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14 max-w-4xl mx-auto px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="shrink-0 text-secondary-foreground/70">
              <ArrowLeft className="mr-1 h-4 w-4" /> Início
            </Button>
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
              <h1 className="text-2xl font-bold text-foreground">Olá, {profile?.name || "Profissional"}</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Diárias em Pintura, Piscinas, Elétrica, Gastronomia, Limpeza e Eventos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/perfil")}>
              <UserRound className="h-4 w-4 mr-1" /> Perfil
            </Button>
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
        <Card className="border-border bg-card shadow-none rounded-3xl">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <PhosphorShieldCheck size={20} weight="regular" className="text-emerald-600 shrink-0" />
              <span className="text-foreground leading-relaxed">
                <strong>Garantia Anti-Calote:</strong> O valor do serviço já fica bloqueado na conta da plataforma antes de você iniciar e é transferido para sua chave Pix assim que concluir.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-border text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary shrink-0 rounded-lg"
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
                  className={`px-1 py-1.5 border-b-2 border-transparent font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === "all"
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todas as Vagas
                </button>
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                  className={`px-1 py-1.5 border-b-2 border-transparent font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
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
                          R$ {Number(job.price || 150).toFixed(2).replace(".", ",")}{job.payment_type === "hourly" ? "/hora" : ""}
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
                          onClick={() => setSelectedJob(job)}
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
                const contrato = myContracts.find((c: any) => c.job_id === app.job_id);
                const estado = contrato ? getContractState(contrato.status) : null;

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
                            estado
                              ? estado.tone
                              : app.status === "rejected"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }
                        >
                          {estado
                            ? estado.label
                            : app.status === "rejected"
                            ? "Não selecionado"
                            : "Em análise pelo contratante"}
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
            <Card className="border-border bg-secondary text-white rounded-3xl p-6 shadow-md">
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

      <Dialog
        open={Boolean(selectedJob)}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          {selectedJob && (
            <>
              <DialogHeader className="pr-6 text-left">
                <DialogTitle className="text-xl">{selectedJob.title || "Sem título"}</DialogTitle>
                <DialogDescription>
                  Publicada por {selectedJob.companies?.name || "Contratante"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 rounded-xl bg-muted/40 p-4 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>
                      <span className="block text-xs text-muted-foreground">Pagamento</span>
                      <strong>R$ {Number(selectedJob.price || 150).toFixed(2).replace(".", ",")}{selectedJob.payment_type === "hourly" ? "/hora" : ""}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      <span className="block text-xs text-muted-foreground">Data</span>
                      <strong>{new Date(selectedJob.date).toLocaleDateString("pt-BR")}</strong>
                    </span>
                  </div>
                  {selectedJob.location && (
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>
                        <span className="block text-xs text-muted-foreground">Local</span>
                        <strong>{selectedJob.location}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-bold">Descrição da vaga</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {selectedJob.description || "O contratante ainda não adicionou uma descrição para esta vaga."}
                  </p>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-muted-foreground">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  O valor do serviço fica garantido em custódia antes do início do trabalho.
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Voltar
                </Button>
                <Button className="font-bold" onClick={() => handleApply(selectedJob.id)}>
                  Candidatar-se à vaga
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardFreelancer;
