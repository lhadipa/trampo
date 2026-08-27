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
  CalendarIcon,
  Clock,
  AlertTriangle,
  Briefcase,
  Rocket,
  ShieldCheck,
  DollarSign,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ALL_SERVICE_TYPES, BRAZILIAN_REGIONS_PRESET, SERVICE_CATEGORIES } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CreateJob = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [region, setRegion] = useState("São João del-Rei e Campo das Vertentes / MG");
  const [customLocation, setCustomLocation] = useState("");
  const [price, setPrice] = useState("150");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("08:00");
  const [urgent, setUrgent] = useState(false);
  const [boost, setBoost] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const finalServiceName = customService.trim() || service;
  const finalLocation = customLocation.trim() || region;

  const handlePublish = async () => {
    if (!finalServiceName || !date || !time || !price) {
      toast.error("Por favor, preencha o tipo de serviço, data, horário e valor.");
      return;
    }

    setLoading(true);

    try {
      if (profile) {
        // Obter empresa do perfil ou criar
        let { data: comp } = await supabase
          .from("companies")
          .select("id")
          .eq("user_id", profile.id)
          .single();

        if (!comp) {
          const { data: newComp } = await supabase
            .from("companies")
            .insert({ user_id: profile.id, name: profile.name || "Contratante" })
            .select("id")
            .single();
          comp = newComp;
        }

        if (comp) {
          const scheduledDate = new Date(date);
          const [hours, minutes] = time.split(":").map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            scheduledDate.setHours(hours, minutes, 0, 0);
          }

          const { error: jobError } = await supabase.from("jobs").insert({
            company_id: comp.id,
            title: `${finalServiceName} - ${finalLocation}`,
            description: description || `Contratação de ${finalServiceName} para diária/turno. Pagamento garantido via Escrow.`,
            date: scheduledDate.toISOString(),
            price: parseFloat(price) || 150,
            urgent: urgent,
            boost: boost,
            status: "open",
          });

          if (jobError) throw jobError;
        }
      }

      toast.success(
        urgent ? "Vaga Urgente Publicada com Sucesso! 🚨" : "Vaga Publicada com Sucesso! 🎉",
        {
          description: `Profissionais de "${finalServiceName}" em ${finalLocation} já podem se candidatar.`,
        }
      );

      navigate("/painel");
    } catch {
      // Antes isto exibia "Publicada com sucesso": a vaga nao era gravada e o
      // usuario so descobria ao nao encontra-la na lista.
      toast.error("Não foi possível publicar a vaga", {
        description: "A conexão com o servidor falhou. Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
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
            Contratação Sob Demanda
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Publicar Vaga ou Diária
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Encontre pintores, limpadores de piscina, garçons, eletricistas, diaristas e dezenas de especialistas.
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
              <Label className="text-sm font-semibold">Região / Cidade de Atendimento</Label>
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
                placeholder="Endereço / Bairro específico (Ex: Bairro Matosinhos, Centro, etc.)"
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <Label htmlFor="price" className="text-sm font-semibold">
                  Valor da Diária (R$) *
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
              </div>
            </div>

            {/* Aviso de Pagamento Protegido */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>
                <strong>Garantia Escrow:</strong> O valor só é repassado ao profissional após a conclusão do trabalho com validação de ambas as partes.
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
                  <AlertTriangle className="h-5 w-5 text-destructive" />
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
                  <Rocket className="h-5 w-5 text-primary" />
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
            {loading ? "Publicando..." : "Publicar Vaga com Pagamento Protegido"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
