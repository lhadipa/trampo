import { ArrowRight, MapPin, Star, Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { Card, CardContent } from "../src/components/ui/Card";
import { Field, Input } from "../src/components/ui/Input";
import { ScreenHeader } from "../src/components/ui/ScreenHeader";
import { toast } from "../src/components/ui/Toast";
import { ALL_SERVICE_TYPES } from "../src/lib/categories";
import { api } from "../src/lib/api";

type Profissional = { id: string; name: string; category: string };

/** Porte de src/pages/UrgentRequest.tsx (Radar SOS Turbo). */
export default function Urgente() {
  const [step, setStep] = useState<"form" | "searching" | "results">("form");
  const [service, setService] = useState("");
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("Centro / São João del-Rei - MG");
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [workers, setWorkers] = useState<Profissional[]>([]);

  // Profissionais reais cadastrados, filtrados pela especialidade informada.
  useEffect(() => {
    (async () => {
      const { data } = await api.from("freelancers").select("*,users(name,email)");
      const lista: Profissional[] = (data || []).map((f: any) => ({
        id: f.id,
        name: f.users?.name || "Profissional",
        category: f.category || "Serviços gerais",
      }));
      const busca = service.trim().toLowerCase();
      setWorkers(
        busca
          ? lista.filter(
              (p) => p.category.toLowerCase().includes(busca) || busca.includes(p.category.toLowerCase()),
            )
          : lista,
      );
    })();
  }, [service, step]);

  // A busca e' simulada, igual ao web: mostra o estado de "procurando" antes dos resultados.
  useEffect(() => {
    if (step !== "searching") return;
    const timer = setTimeout(() => setStep("results"), 1800);
    return () => clearTimeout(timer);
  }, [step]);

  const startSearch = () => {
    if (!service) {
      toast.error("Por favor, selecione ou digite a especialidade desejada.");
      return;
    }
    setStep("searching");
  };

  const invite = (worker: Profissional) => {
    if (invitedIds.includes(worker.id)) return;
    setInvitedIds((prev) => [...prev, worker.id]);
    toast.success(`Disparo SOS enviado para ${worker.name}! 🚀`, {
      description: "O profissional recebe a notificação em tempo real.",
    });
  };

  const inviteAll = () => {
    setInvitedIds(workers.map((w) => w.id));
    toast.success(`${workers.length} profissionais notificados em tempo real! 🚨`, {
      description: "Quem estiver disponível responde em minutos.",
    });
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Radar SOS Turbo" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 20 }}>
        <View className="gap-2">
          <View className="flex-row items-center gap-1.5 self-start rounded-full bg-destructive/10 px-3 py-1">
            <Zap size={13} color="#dc2626" />
            <Text className="text-xs font-semibold uppercase tracking-wider text-destructive">
              Chamado Urgente
            </Text>
          </View>
          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Precisa de alguém agora?
          </Text>
          <Text className="text-sm text-muted-foreground">
            Dispare um alerta para todos os profissionais de plantão na sua região.
          </Text>
        </View>

        {step === "form" ? (
          <>
            <Card>
              <CardContent className="gap-5">
                <Field label="Especialidade desejada *">
                  <Input
                    value={service}
                    onChangeText={setService}
                    placeholder="Ex: Pintor para retoque urgente, Piscineiro para hoje..."
                  />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
                    <View className="flex-row gap-2">
                      {ALL_SERVICE_TYPES.slice(0, 14).map((option) => (
                        <Pressable
                          key={option}
                          onPress={() => setService(option)}
                          className={`rounded-full px-3 py-1.5 ${
                            service === option ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              service === option
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </Field>

                <Field label="Endereço do atendimento">
                  <Input value={address} onChangeText={setAddress} />
                </Field>

                <Field label="Detalhes do chamado">
                  <Input
                    value={details}
                    onChangeText={setDetails}
                    placeholder="Ex: Preciso de pintor para terminar 2 paredes hoje..."
                    multiline
                  />
                </Field>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="bg-destructive"
              onPress={startSearch}
              icon={<Zap size={18} color="#ffffff" />}
            >
              Disparar Radar SOS
            </Button>
          </>
        ) : null}

        {step === "searching" ? (
          <Card>
            <CardContent className="items-center gap-4 py-14">
              <ActivityIndicator size="large" color="#e85d04" />
              <Text className="text-xl font-bold text-foreground">
                Localizando profissionais de plantão...
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                Buscando quem está disponível agora perto de {address}.
              </Text>
            </CardContent>
          </Card>
        ) : null}

        {step === "results" ? (
          <>
            <View className="flex-row items-center justify-between gap-2">
              <Text className="flex-1 text-xl font-bold text-foreground">
                {workers.length} profissionais de plantão
              </Text>
              <Button size="sm" onPress={inviteAll}>
                Chamar todos
              </Button>
            </View>

            {workers.length === 0 ? (
              <Card>
                <CardContent>
                  <Text className="py-6 text-center text-sm text-muted-foreground">
                    Nenhum profissional cadastrado nessa especialidade ainda.
                  </Text>
                </CardContent>
              </Card>
            ) : null}

            {workers.map((worker) => {
              const invited = invitedIds.includes(worker.id);
              return (
                <Card key={worker.id}>
                  <CardContent className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                      <Text className="text-sm font-bold text-secondary-foreground">
                        {worker.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                        {worker.name}
                      </Text>
                      <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                        {worker.category}
                      </Text>
                      <View className="mt-1 flex-row items-center gap-2.5">
                      </View>
                    </View>

                    {invited ? (
                      <Badge variant="secondary">Chamado ✓</Badge>
                    ) : (
                      <Button
                        size="sm"
                        onPress={() => invite(worker)}
                        iconRight={<ArrowRight size={13} color="#ffffff" />}
                      >
                        Chamar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
