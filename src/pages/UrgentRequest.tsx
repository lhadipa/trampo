import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const serviceTypes = [
  "Garçom",
  "Cozinheiro(a)",
  "Auxiliar de cozinha",
  "Atendente",
  "Faxineira / Diarista",
  "Barman",
  "Manutenção",
  "Cabeleireiro(a)",
  "Manicure",
  "Outro",
];

const mockAvailableWorkers = [
  { id: 1, name: "João S.", service: "Garçom", rating: 4.8, distance: "1.2 km", avatar: "JS" },
  { id: 2, name: "Maria L.", service: "Garçom", rating: 4.9, distance: "2.5 km", avatar: "ML" },
  { id: 3, name: "Lucas R.", service: "Auxiliar de cozinha", rating: 4.6, distance: "0.8 km", avatar: "LR" },
  { id: 4, name: "Ana P.", service: "Faxineira / Diarista", rating: 5.0, distance: "3.1 km", avatar: "AP" },
  { id: 5, name: "Carlos M.", service: "Barman", rating: 4.7, distance: "1.8 km", avatar: "CM" },
];

const UrgentRequest = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "searching" | "results">("form");
  const [service, setService] = useState("");
  const [details, setDetails] = useState("");
  const [invitedIds, setInvitedIds] = useState<number[]>([]);

  const filteredWorkers = service
    ? mockAvailableWorkers.filter((w) => w.service === service)
    : mockAvailableWorkers;

  const handleSearch = () => {
    if (!service) {
      toast.error("Selecione o tipo de serviço.");
      return;
    }
    setStep("searching");
    setTimeout(() => setStep("results"), 2200);
  };

  const handleInvite = (workerId: number, workerName: string) => {
    setInvitedIds((prev) => [...prev, workerId]);
    toast.success(`Convite enviado para ${workerName}! 🚀`, {
      description: "Taxa de R$ 3 por convite urgente.",
    });
  };

  const handleInviteAll = () => {
    const newIds = filteredWorkers.map((w) => w.id);
    setInvitedIds(newIds);
    toast.success(`${filteredWorkers.length} convites enviados! 🚀`, {
      description: `Taxa total: R$ ${filteredWorkers.length * 3}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-destructive/95 backdrop-blur-md border-b border-destructive-foreground/10">
        <div className="container flex items-center justify-between h-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-destructive-foreground/80 hover:text-destructive-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-2 text-destructive-foreground">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Modo Urgente</span>
          </div>
          <div className="w-14" />
        </div>
      </header>

      <main className="container py-8 max-w-lg mx-auto space-y-6">
        {/* Step 1: Form */}
        {step === "form" && (
          <>
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Zap className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Preciso de alguém <span className="text-destructive">AGORA</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Encontre trabalhadores disponíveis neste momento na sua região.
              </p>
            </div>

            <Card className="border-destructive/20">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Que tipo de profissional? *</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ex: Garçom, Cozinheiro..." />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Detalhes rápidos (opcional)</Label>
                  <Textarea
                    placeholder="Ex: Preciso de 2 garçons para evento hoje à noite..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <Clock className="h-5 w-5 text-destructive shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Convites urgentes custam <strong className="text-foreground">R$ 3 cada</strong>.
                    Trabalhadores recebem notificação instantânea.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              size="lg"
              className="w-full text-base py-6 font-bold shadow-lg"
              onClick={handleSearch}
            >
              <Zap className="mr-2 h-5 w-5" />
              Buscar disponíveis AGORA
            </Button>
          </>
        )}

        {/* Step 2: Searching animation */}
        {step === "searching" && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
                <Zap className="h-12 w-12 text-destructive" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-destructive/30 animate-ping" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-foreground">Buscando trabalhadores...</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Notificando profissionais na sua região
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "results" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {filteredWorkers.length} disponíveis agora
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  Na sua região • {service}
                </p>
              </div>
              <Badge variant="destructive" className="animate-pulse">
                🔴 AO VIVO
              </Badge>
            </div>

            {/* Invite all */}
            {filteredWorkers.length > 1 && invitedIds.length < filteredWorkers.length && (
              <Button
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
                onClick={handleInviteAll}
              >
                <Users className="mr-2 h-4 w-4" />
                Convidar todos • R$ {filteredWorkers.length * 3}
              </Button>
            )}

            {/* Worker list */}
            <div className="space-y-3">
              {filteredWorkers.map((worker) => {
                const invited = invitedIds.includes(worker.id);
                return (
                  <Card key={worker.id} className={`border-border transition-all ${invited ? "opacity-70" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm shrink-0">
                          {worker.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">{worker.service}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Star className="h-3 w-3 text-primary fill-primary" />
                              {worker.rating}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {worker.distance}
                            </span>
                          </div>
                        </div>
                        {invited ? (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-xs font-medium">Enviado</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleInvite(worker.id, worker.name)}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            R$ 3
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredWorkers.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <p className="text-muted-foreground text-sm">
                  Nenhum trabalhador disponível agora para "{service}".
                </p>
                <Button variant="outline" onClick={() => setStep("form")}>
                  Tentar outro serviço
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UrgentRequest;
