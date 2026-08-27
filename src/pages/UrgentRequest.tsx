import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Zap,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Loader2,
  Star,
  Search,
  Sparkles,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ALL_SERVICE_TYPES, SERVICE_CATEGORIES } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";

const UrgentRequest = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "searching" | "results">("form");
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("Centro / São João del-Rei - MG");
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);

  const selectedServiceText = customService.trim() || service;

  // Profissionais reais cadastrados; a busca filtra pela categoria informada.
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("freelancers")
        .select("*, users!freelancers_user_id_fkey(name, email)");
      setWorkers(data || []);
    };
    load();
  }, []);

  const iniciais = (nome: string) =>
    nome.split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]?.toUpperCase()).join("");

  const displayWorkers = (selectedServiceText
    ? workers.filter((w) => {
        const categoria = (w.category || "").toLowerCase();
        const busca = selectedServiceText.toLowerCase();
        return categoria.includes(busca) || busca.includes(categoria);
      })
    : workers
  ).map((w) => ({
    id: w.id as string,
    name: w.users?.name || "Profissional",
    service: w.category || "Serviços gerais",
    avatar: iniciais(w.users?.name || "P"),
  }));

  const handleSearch = () => {
    if (!selectedServiceText) {
      toast.error("Por favor, selecione ou digite a especialidade desejada.");
      return;
    }
    setStep("searching");
    setTimeout(() => setStep("results"), 2000);
  };

  const handleInvite = (workerId: string, workerName: string) => {
    setInvitedIds((prev) => [...prev, workerId]);
    toast.success(`Disparo SOS enviado para ${workerName}! 🚀`, {
      description: "Notificação push e WhatsApp enviada com sucesso.",
    });
  };

  const handleInviteAll = () => {
    const newIds = displayWorkers.map((w) => w.id);
    setInvitedIds(newIds);
    toast.success(`${displayWorkers.length} profissionais notificados em tempo real! 🚨`, {
      description: "O primeiro a aceitar iniciará o atendimento imediato.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-destructive text-destructive-foreground shadow-md backdrop-blur-md">
        <div className="container flex items-center justify-between h-14 max-w-2xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-destructive-foreground/90 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <Zap className="h-5 w-5 animate-bounce" />
            <span className="text-sm uppercase tracking-wider">Radar SOS • Chamado Imediato</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-8 max-w-2xl mx-auto px-4 space-y-6">
        {/* Step 1: Form */}
        {step === "form" && (
          <>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto shadow-inner">
                <Zap className="h-8 w-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Preciso de um profissional <span className="text-destructive">AGORA</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Pintores, piscineiros, eletricistas, garçons, diaristas e dezenas de outros serviços com resposta em minutos.
              </p>
            </div>

            <Card className="border-destructive/20 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Qual especialidade você precisa? *</Label>
                  <Select
                    value={service}
                    onValueChange={(val) => {
                      setService(val);
                      setCustomService("");
                    }}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione no catálogo de serviços..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="p-1">
                          <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/60 rounded">
                            {cat.name}
                          </div>
                          {cat.subservices.map((sub) => (
                            <SelectItem key={sub} value={sub} className="text-sm">
                              {sub}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Ou digite um serviço personalizado caso não esteja na lista:
                  </Label>
                  <Input
                    placeholder="Ex: Pintor para retoque urgente, Piscineiro para hoje..."
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Local do Atendimento / Cidade</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-9 h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Instruções rápidas (opcional)</Label>
                  <Textarea
                    placeholder="Ex: Preciso de pintor para terminar 2 paredes hoje; ou piscineiro para tratar água turva antes do evento..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="resize-none text-sm"
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-destructive/5 border border-destructive/15">
                  <Clock className="h-5 w-5 text-destructive shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    O <strong>Radar Turbo</strong> dispara alertas prioritários para todos os profissionais de plantão num raio de até 15km.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              size="lg"
              className="w-full text-base py-6 font-bold shadow-lg shadow-destructive/20 hover:shadow-xl transition-all rounded-2xl"
              onClick={handleSearch}
            >
              <Zap className="mr-2 h-5 w-5" />
              Ativar Radar Turbo & Buscar Agora
            </Button>
          </>
        )}

        {/* Step 2: Searching Radar animation */}
        {step === "searching" && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-destructive/15 flex items-center justify-center animate-pulse">
                <Zap className="h-14 w-14 text-destructive" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-destructive/40 animate-ping" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-foreground">Localizando profissionais de plantão...</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                Varrendo raio de 15 km em {address}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "results" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  {displayWorkers.length} profissionais no radar
                  <Badge variant="destructive" className="animate-pulse text-xs">
                    🔴 PLANTÃO AO VIVO
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {address} • Especialidade: <strong>{selectedServiceText || "Geral"}</strong>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setStep("form")}
              >
                Nova busca
              </Button>
            </div>

            {/* Invite all */}
            {displayWorkers.length > 1 && invitedIds.length < displayWorkers.length && (
              <Button
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 font-bold py-5 rounded-2xl"
                onClick={handleInviteAll}
              >
                <Users className="mr-2 h-4 w-4" />
                Disparar Alerta para Todos ({displayWorkers.length})
              </Button>
            )}

            {/* Worker list */}
            {displayWorkers.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Nenhum profissional cadastrado nessa especialidade ainda.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tente outra especialidade ou publique uma vaga para receber candidaturas.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {displayWorkers.map((worker) => {
                const invited = invitedIds.includes(worker.id);
                return (
                  <Card
                    key={worker.id}
                    className={`border-border transition-all hover:border-destructive/30 hover:shadow-xs rounded-2xl ${
                      invited ? "opacity-75 bg-emerald-50/40 border-emerald-300" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-13 h-13 rounded-2xl bg-secondary/80 flex items-center justify-center text-secondary-foreground font-bold text-sm shrink-0 shadow-inner">
                          {worker.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{worker.name}</p>
                          <p className="text-xs font-medium text-muted-foreground truncate">{worker.service}</p>
                        </div>

                        {invited ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            <CheckCircle2 className="h-4 w-4" />
                            Notificado
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-xl font-bold"
                            onClick={() => handleInvite(worker.id, worker.name)}
                          >
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            Chamar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UrgentRequest;
