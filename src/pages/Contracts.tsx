import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, Clock3, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  checkInMock,
  completeShiftMock,
  confirmProfessionalFeeMock,
  getProfessionalDashboard,
} from "@/lib/pilotMockService";
import { calculateTravelPricing, formatBRL } from "@/lib/pilotPricing";

const Contracts = () => {
  const [revision, setRevision] = useState(0);
  const [locationState, setLocationState] = useState<"idle" | "requesting" | "ready" | "denied">("idle");
  const [travel, setTravel] = useState<ReturnType<typeof calculateTravelPricing> | null>(null);
  const [pendingLocation, setPendingLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  void revision;
  const dashboard = getProfessionalDashboard();

  const refresh = (message: string) => {
    setRevision((value) => value + 1);
    toast.success(message);
  };

  const assignment = dashboard.assignments[0];
  const job = assignment ? dashboard.jobs.find((item) => item.id === assignment.jobId) : undefined;

  const confirm = () => {
    if (!assignment) return;
    const result = confirmProfessionalFeeMock(assignment.id);
    if (result.success) refresh(result.message);
    else toast.error(result.message);
  };

  const checkIn = () => {
    if (!assignment) return;
    const needsLocation = /garç|panflet/i.test(job?.roleLabel || "");
    if (!needsLocation || !navigator.geolocation) return confirmCheckIn();
    setLocationState("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPendingLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationState("ready");
      },
      () => { setLocationState("denied"); toast.info("Não foi possível obter sua localização. Você pode tentar novamente ou continuar sem o cálculo."); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const confirmCheckIn = (location = pendingLocation) => {
    if (!assignment) return;
    if (location) setTravel(calculateTravelPricing({ latitude: -21.1357, longitude: -44.2613 }, location));
    const result = checkInMock(assignment.id);
    if (result.success) { setPendingLocation(null); refresh("Local confirmado. Check-in marcado na sua agenda."); }
    else toast.error(result.message);
  };

  const mapUrl = pendingLocation
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${pendingLocation.longitude - 0.004}%2C${pendingLocation.latitude - 0.003}%2C${pendingLocation.longitude + 0.004}%2C${pendingLocation.latitude + 0.003}&layer=mapnik&marker=${pendingLocation.latitude}%2C${pendingLocation.longitude}`
    : "";

  const complete = () => {
    if (!assignment) return;
    const result = completeShiftMock(assignment.id);
    if (result.success) refresh(result.message);
    else toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-10 border-b bg-background/95">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/painel" aria-label="Voltar ao painel"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div><p className="font-bold">Meus trabalhos</p><p className="text-[11px] text-muted-foreground">Acompanhe seleção, confirmação e diária</p></div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <p className="pilot-demo-notice">Demonstração: a taxa e o pagamento da diária não são cobrados nesta versão.</p>

        <Tabs defaultValue="selecionado">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl p-1">
            <TabsTrigger value="selecionado">Selecionado</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="selecionado" className="space-y-3">
            {assignment && job ? (
              <Card className="pilot-surface">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="font-bold">{job.title}</p><p className="mt-1 text-sm text-muted-foreground">{job.description}</p></div>
                    <Badge variant="outline">{assignment.status}</Badge>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{new Date(job.startsAt).toLocaleDateString("pt-BR")}</span>
                    <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" />{new Date(job.startsAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{job.location}, {job.neighborhood}</span>
                    <strong>{formatBRL(job.dailyRate)} pela diária</strong>
                  </div>
                  {assignment.status === "awaiting_confirmation" && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="font-bold">Você foi selecionado</p>
                      <p className="mt-1 text-sm text-muted-foreground">Para reservar este trabalho, confirme a taxa avulsa de {formatBRL(assignment.professionalFee)}. Você não paga assinatura.</p>
                      <Button className="mt-4 w-full" onClick={confirm}>Simular confirmação de {formatBRL(assignment.professionalFee)}</Button>
                    </div>
                  )}
                  {assignment.status === "assigned" && <div className="space-y-2"><p className="text-sm text-muted-foreground">Para garçom e panfletista, o check-in pode usar sua localização: 3 km incluídos e R$ 1,50/km excedente.</p><Button className="w-full" onClick={checkIn} disabled={locationState === "requesting"}>{locationState === "requesting" ? "Obtendo localização…" : "Registrar check-in demonstrativo"}</Button></div>}
                  {pendingLocation && <div className="space-y-3 rounded-xl border p-4"><div><p className="font-semibold">Confirme o local do check-in</p><p className="text-sm text-muted-foreground">Confira o marcador no mapa. A coordenada fica somente nesta sessão do MVP.</p></div><iframe title="Mapa do local do check-in" src={mapUrl} className="h-56 w-full rounded-lg border" loading="lazy" /><div className="flex flex-col gap-2 sm:flex-row"><Button className="flex-1" onClick={() => confirmCheckIn()}>Confirmar este local</Button><Button variant="outline" onClick={() => { setPendingLocation(null); setLocationState("idle"); }}>Capturar novamente</Button></div></div>}
                  {assignment.status === "checked_in" && <Button className="w-full" onClick={complete}>Registrar conclusão e gerar recibo</Button>}
                  {travel && <div className="rounded-xl border p-4 text-sm"><p className="font-semibold">Deslocamento estimado</p><p className="mt-1 text-muted-foreground">{travel.distanceKm.toFixed(2).replace(".", ",")} km · {travel.includedKm} km incluídos · adicional {formatBRL(travel.travelFee)}</p></div>}
                  {locationState === "denied" && <div className="space-y-2 rounded-xl border border-dashed p-4"><p className="text-sm text-muted-foreground">Localização não autorizada. Tente novamente ou continue sem cálculo de deslocamento.</p><div className="flex gap-2"><Button size="sm" variant="outline" onClick={checkIn}>Tentar novamente</Button><Button size="sm" onClick={() => confirmCheckIn(null)}>Continuar sem localização</Button></div></div>}
                  {assignment.status === "completed" && <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-5 w-5" />Diária concluída. Recibo demonstrativo disponível.</div>}
                </CardContent>
              </Card>
            ) : <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhuma seleção pendente.</div>}
          </TabsContent>

          <TabsContent value="agenda">{assignment && job && assignment.status !== "awaiting_confirmation" ? <Card className="pilot-surface"><CardContent className="space-y-3 p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{job.title}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(job.startsAt).toLocaleDateString("pt-BR")} · {new Date(job.startsAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · {job.neighborhood}</p></div><Badge variant="outline">{assignment.status === "checked_in" ? "Check-in confirmado" : assignment.status === "completed" ? "Concluído" : "Confirmado"}</Badge></div>{assignment.status === "checked_in" && <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><MapPin className="h-4 w-4" />Presença marcada na agenda</p>}</CardContent></Card> : <Card className="pilot-surface"><CardContent className="p-5 text-sm text-muted-foreground">Confirme o trabalho selecionado para incluí-lo na agenda.</CardContent></Card>}</TabsContent>
          <TabsContent value="historico"><Card className="pilot-surface"><CardContent className="flex items-center gap-2 p-5 text-sm text-muted-foreground"><BadgeCheck className="h-5 w-5 text-primary" />Histórico demonstrativo de presenças e recibos.</CardContent></Card></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Contracts;
