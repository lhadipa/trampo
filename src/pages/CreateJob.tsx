import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CalendarBlank,
  Clock,
  Warning,
  Briefcase,
  RocketLaunch,
  Info,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ALL_SERVICE_TYPES, BRAZILIAN_REGIONS_PRESET, SERVICE_CATEGORIES } from "@/lib/categories";
import { publishJobMock } from "@/lib/pilotMockService";
import { formatBRL, getMatchOfferPrice, type MatchOffer } from "@/lib/pilotPricing";

const CreateJob = () => {
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [region, setRegion] = useState("São João del-Rei e Campo das Vertentes / MG");
  const [customLocation, setCustomLocation] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("São João del-Rei");
  const [stateCode, setStateCode] = useState("MG");
  const [postalStatus, setPostalStatus] = useState<"idle" | "loading" | "found" | "not-found" | "error">("idle");
  const [price, setPrice] = useState("150");
  const [paymentType, setPaymentType] = useState<"service" | "hourly">("service");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("08:00");
  const [urgent, setUrgent] = useState(false);
  const [boost, setBoost] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [planId, setPlanId] = useState<"avulso" | "pro">("avulso");
  const [matchOffer, setMatchOffer] = useState<MatchOffer>("single");
  const [originStatus, setOriginStatus] = useState<"idle" | "requesting" | "ready" | "denied">("idle");

  const finalServiceName = customService.trim() || service;
  const addressParts = [street, streetNumber, neighborhood, city, stateCode].filter(Boolean);
  const finalLocation = addressParts.length >= 3 ? addressParts.join(", ") : customLocation.trim() || region;
  const amount = Number(price);
  const needsLocation = /garç|panflet/i.test(finalServiceName);
  const requestOrigin = () => {
    if (!navigator.geolocation) return setOriginStatus("denied");
    setOriginStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      () => setOriginStatus("ready"),
      () => setOriginStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };
  const lookupPostalCode = async () => {
    const digits = postalCode.replace(/\D/g, "");
    if (digits.length !== 8) { setPostalStatus("not-found"); return toast.error("Digite um CEP com 8 números."); }
    setPostalStatus("loading");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) throw new Error("postal-service");
      const data = await response.json() as { erro?: boolean; cep?: string; logradouro?: string; complemento?: string; bairro?: string; localidade?: string; uf?: string };
      if (data.erro) { setPostalStatus("not-found"); return toast.error("CEP não encontrado. Preencha o endereço manualmente."); }
      setPostalCode(data.cep || postalCode);
      setStreet(data.logradouro || "");
      setAddressComplement(data.complemento || "");
      setNeighborhood(data.bairro || "");
      setCity(data.localidade || "");
      setStateCode(data.uf || "");
      setRegion(`${data.localidade || city} / ${data.uf || stateCode}`);
      setCustomLocation([data.logradouro, data.bairro].filter(Boolean).join(", "));
      setPostalStatus("found");
      toast.success("Endereço encontrado. Confira e informe o número.");
    } catch {
      setPostalStatus("error");
      toast.error("Não foi possível consultar o CEP. Você pode preencher o endereço manualmente.");
    }
  };

  const handlePublish = async () => {
    if (!finalServiceName || !date || !time || !price || !Number.isFinite(amount) || amount <= 0 || !street.trim() || !streetNumber.trim() || !neighborhood.trim() || !city.trim() || !stateCode.trim()) {
      toast.error("Preencha serviço, data, horário, valor e o endereço completo do trabalho.");
      return;
    }

    setLoading(true);
    const scheduledDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    scheduledDate.setHours(hours, minutes, 0, 0);
    const result = publishJobMock({
      contractorId: "mock-contractor-1",
      categoryId: service === "Panfletista" || service.includes("Porta a Porta") ? "promocao-vendas" : "servicos-gerais",
      title: finalServiceName,
      roleLabel: finalServiceName,
      mode: Number(quantity) > 1 ? "team" : "individual",
      location: finalLocation,
      neighborhood,
      startsAt: scheduledDate.toISOString(),
      endsAt: new Date(scheduledDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      quantity: Math.max(1, Number(quantity)),
      dailyRate: amount,
      note: [description, addressComplement && `Complemento: ${addressComplement}`].filter(Boolean).join("\n"),
      planId,
      priorityMock: urgent || boost,
    });
    setLoading(false);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    navigate("/painel");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center h-14 max-w-2xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
      </header>

      <main className="container py-8 max-w-2xl mx-auto px-4 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            Piloto local · demonstração
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Publicar Vaga ou Diária
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publique uma diária para panfletistas, vendedores porta a porta e outros profissionais da região.
          </p>
        </div>

        {/* Tipo de Serviço */}
        <Card className="border-border shadow-xs">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tipo de Serviço ou Função *</Label>
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
                      <div className="px-2 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/60 rounded">
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
                Ou digite uma função personalizada se preferir:
              </Label>
              <Input
                placeholder="Ex: Pintor para fachadas, Limpador de Piscina semanal, etc."
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            {/* Localização */}
            <div className="space-y-2 pt-2">
              <Label htmlFor="postal-code" className="text-sm font-semibold">CEP do local do trabalho *</Label>
              <div className="flex gap-2"><Input id="postal-code" inputMode="numeric" maxLength={9} placeholder="Ex: 36300-000" value={postalCode} onChange={(event) => setPostalCode(event.target.value.replace(/[^\d-]/g, ""))} onBlur={() => postalCode && lookupPostalCode()} /><Button type="button" variant="outline" onClick={lookupPostalCode} disabled={postalStatus === "loading"}>{postalStatus === "loading" ? "Buscando…" : "Buscar CEP"}</Button></div>
              {postalStatus === "found" && <p className="text-xs font-medium text-emerald-700">Endereço preenchido pelo CEP. Confira os dados abaixo.</p>}
              {(postalStatus === "not-found" || postalStatus === "error") && <p className="text-xs text-muted-foreground">Busca indisponível ou sem resultado; preencha os campos manualmente.</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
              <div className="space-y-2"><Label htmlFor="street">Rua / Avenida *</Label><Input id="street" placeholder="Logradouro" value={street} onChange={(event) => setStreet(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="street-number">Número *</Label><Input id="street-number" placeholder="123" value={streetNumber} onChange={(event) => setStreetNumber(event.target.value)} /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="neighborhood">Bairro *</Label><Input id="neighborhood" value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="address-complement">Complemento</Label><Input id="address-complement" placeholder="Sala, bloco ou referência" value={addressComplement} onChange={(event) => setAddressComplement(event.target.value)} /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
              <div className="space-y-2"><Label htmlFor="city">Cidade *</Label><Input id="city" value={city} onChange={(event) => setCity(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="state-code">UF *</Label><Input id="state-code" maxLength={2} value={stateCode} onChange={(event) => setStateCode(event.target.value.toUpperCase())} /></div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-sm font-semibold">Região de Atendimento</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Selecione a região..." />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_REGIONS_PRESET.map((r) => (
                    <SelectItem key={r} value={r} className="text-sm">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Input
                placeholder="Referência adicional do local"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2 pt-2">
              <Label className="text-sm font-semibold">Descrição do Trabalho e Requisitos</Label>
              <Textarea
                placeholder="Ex: Pintura interna de 2 cômodos, material por nossa conta; ou atendimento em salão no sábado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none text-sm"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data, Horário e Valor */}
        <Card className="border-border shadow-xs">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Data */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Data do Serviço *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarBlank weight="regular" className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Horário */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-semibold">
                  Horário de Início *
                </Label>
                <div className="relative">
                  <Clock weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10 h-11 text-sm"
                  />
                </div>
              </div>

              {/* Valor da Diária */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Como a empresa pretende pagar? *</Label>
                <Select value={paymentType} onValueChange={(value: "service" | "hourly") => setPaymentType(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Por serviço — valor fechado</SelectItem>
                    <SelectItem value="hourly">Por hora — valor da hora</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="price" className="text-sm font-semibold">
                  {paymentType === "service" ? "Valor total do serviço (R$) *" : "Valor por hora (R$) *"}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10 h-11 text-sm font-bold"
                    placeholder="150"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Escolha um valor alinhado ao mercado. Valores abaixo do aprovado pela comunidade podem ser bloqueados.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="quantity">Quantidade de profissionais</Label><Input id="quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div>
              <div className="space-y-2"><Label>Como quer encontrar profissionais?</Label><Select value={matchOffer} onValueChange={(value: MatchOffer) => { setMatchOffer(value); setPlanId(value === "monthly" ? "pro" : "avulso"); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="single">Uma única vez · R$ 5,00</SelectItem><SelectItem value="weekend">Plano Fim de Semana · R$ 19,90</SelectItem><SelectItem value="monthly">Plano Mensal · R$ 59,90</SelectItem></SelectContent></Select></div>
            </div>
            {matchOffer === "single" && <p className="text-sm text-muted-foreground">Se nenhum profissional adequado for encontrado, o valor de R$ 5,00 é devolvido integralmente. No MVP, pagamento e devolução são simulados.</p>}
            {matchOffer === "weekend" && <p className="text-sm text-muted-foreground">Válido de sexta-feira às 18h até segunda-feira às 6h. Cobrança simulada no MVP.</p>}
            {needsLocation && <div className="rounded-xl border p-4"><p className="font-semibold">Geolocalização para {finalServiceName}</p><p className="mt-1 text-sm text-muted-foreground">Usamos a origem e o check-in para estimar o deslocamento: 3 km incluídos e R$ 1,50 por km excedente.</p><Button type="button" variant="outline" className="mt-3" onClick={requestOrigin} disabled={originStatus === "requesting"}>{originStatus === "requesting" ? "Solicitando…" : originStatus === "ready" ? "Localização autorizada" : "Ativar geolocalização"}</Button>{originStatus === "denied" && <p className="mt-2 text-sm text-destructive">Localização indisponível. Você pode continuar, mas o adicional de deslocamento não será calculado.</p>}</div>}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
              <Info weight="regular" className="h-5 w-5 shrink-0 text-primary" />
              <span>
                <strong>Resumo demonstrativo:</strong> diária {formatBRL(amount)} × {Math.max(1, Number(quantity))} profissional(is). Oferta para encontrar profissionais: {formatBRL(getMatchOfferPrice(matchOffer))}. {matchOffer === "single" ? "Reembolso integral se não houver profissional adequado. " : ""}Nenhuma cobrança será realizada.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Opções de Urgência & Destaque */}
        <Card className="border-border shadow-xs">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Warning weight="regular" className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Vaga urgente (SOS) 🚨</p>
                  <p className="text-xs text-muted-foreground">
                    Dispara notificação push prioritária para prestadores de plantão
                  </p>
                </div>
              </div>
              <Switch checked={urgent} onCheckedChange={setUrgent} />
            </div>

            <div className="h-px bg-border/60" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <RocketLaunch weight="regular" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Destacar vaga no feed • R$ 8</p>
                  <p className="text-xs text-muted-foreground">
                    Aparece com selo dourado no topo do feed de candidatos
                  </p>
                </div>
              </div>
              <Switch checked={boost} onCheckedChange={setBoost} />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Publicação */}
        <div className="sticky bottom-4">
          <Button
            size="lg"
            className="w-full text-base py-6 font-bold shadow-lg shadow-primary/20 hover:shadow-xl rounded-2xl transition-all"
            onClick={handlePublish}
            disabled={loading}
          >
            <Briefcase className="mr-2 h-5 w-5" />
            {loading ? "Publicando..." : planId === "pro" ? "Publicar demonstração sem taxa por diária" : "Continuar para confirmação simulada"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
