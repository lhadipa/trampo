import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const periods = ["Indisponível", "Manhã", "Tarde", "Noite", "Dia inteiro"];

const Availability = () => {
  const navigate = useNavigate();
  const [availableToday, setAvailableToday] = useState(false);
  const [lastMinute, setLastMinute] = useState(false);
  const [schedule, setSchedule] = useState<Record<string, string>>(
    Object.fromEntries(days.map((d) => [d, "Indisponível"]))
  );

  const handleSave = () => {
    toast.success("Disponibilidade atualizada!", {
      description: "Empresas podem ver quando você está livre.",
    });
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
          <h1 className="text-2xl font-bold text-foreground">Disponibilidade</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Defina quando você está livre para trabalhar.
          </p>
        </div>

        {/* Quick toggles */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Disponível hoje</p>
                  <p className="text-xs text-muted-foreground">Apareça para empresas agora</p>
                </div>
              </div>
              <Switch checked={availableToday} onCheckedChange={setAvailableToday} />
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Aceito última hora</p>
                  <p className="text-xs text-muted-foreground">Vagas urgentes com taxa extra</p>
                </div>
              </div>
              <Switch checked={lastMinute} onCheckedChange={setLastMinute} />
            </div>
          </CardContent>
        </Card>

        {/* Weekly schedule */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
              <CalendarDays className="h-4 w-4" />
              Agenda da semana
            </h2>
            <div className="space-y-3">
              {days.map((day) => (
                <div key={day} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground w-20 shrink-0">
                    {day}
                  </span>
                  <Select
                    value={schedule[day]}
                    onValueChange={(val) =>
                      setSchedule((prev) => ({ ...prev, [day]: val }))
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((p) => (
                        <SelectItem key={p} value={p}>
                          <span className="flex items-center gap-2">
                            {p === "Indisponível" && <Clock className="h-3 w-3 text-muted-foreground" />}
                            {p}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="sticky bottom-4">
          <Button
            variant="hero"
            size="lg"
            className="w-full text-base py-6 shadow-warm"
            onClick={handleSave}
          >
            Salvar disponibilidade
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Availability;
