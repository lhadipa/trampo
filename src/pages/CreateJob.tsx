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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

const CreateJob = () => {
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [boost, setBoost] = useState(false);
  const [description, setDescription] = useState("");

  const handlePublish = () => {
    if (!service || !date || !time) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (urgent) {
      toast.success("Vaga urgente publicada! 🚨", {
        description: "Trabalhadores disponíveis serão notificados imediatamente.",
      });
    } else {
      toast.success("Vaga publicada com sucesso!", {
        description: "Trabalhadores da região vão ver sua vaga.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center h-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
      </header>

      <main className="container py-8 max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Criar vaga</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publique uma vaga e encontre trabalhadores na região.
          </p>
        </div>

        {/* Service type */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-medium">
                Tipo de serviço *
              </Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
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
              <Label className="text-sm font-medium">Descrição (opcional)</Label>
              <Textarea
                placeholder="Detalhes sobre o trabalho, local, requisitos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                      onSelect={setDate}
                      disabled={(d) => d < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Horário *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Vaga urgente 🚨</p>
                  <p className="text-xs text-muted-foreground">
                    Notifica trabalhadores imediatamente
                  </p>
                </div>
              </div>
              <Switch checked={urgent} onCheckedChange={setUrgent} />
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Destacar vaga • R$ 8</p>
                  <p className="text-xs text-muted-foreground">
                    Aparece no topo do feed
                  </p>
                </div>
              </div>
              <Switch checked={boost} onCheckedChange={setBoost} />
            </div>
          </CardContent>
        </Card>

        {/* Cost summary */}
        {(urgent || boost) && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Custo adicional:</span>
                <span className="font-bold text-foreground">
                  R$ {(urgent ? 5 : 0) + (boost ? 8 : 0)}
                </span>
              </div>
              {urgent && (
                <p className="text-xs text-muted-foreground mt-1">Urgente: +R$ 5</p>
              )}
              {boost && (
                <p className="text-xs text-muted-foreground mt-1">Destaque: +R$ 8</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Publish */}
        <div className="sticky bottom-4">
          <Button
            variant="hero"
            size="lg"
            className="w-full text-base py-6 shadow-warm"
            onClick={handlePublish}
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Publicar vaga
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
