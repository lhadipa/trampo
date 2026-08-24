import { useRouter } from "expo-router";
import { Plus, Sparkles, Zap } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "../src/components/ui/Button";
import { Card, CardContent } from "../src/components/ui/Card";
import { Field, Input } from "../src/components/ui/Input";
import { ScreenHeader } from "../src/components/ui/ScreenHeader";
import { toast } from "../src/components/ui/Toast";
import { useAuth } from "../src/hooks/useAuth";
import { api } from "../src/lib/api";
import { ALL_SERVICE_TYPES, BRAZILIAN_REGIONS_PRESET } from "../src/lib/categories";

/** Porte de src/pages/CreateJob.tsx. */
export default function CriarVaga() {
  const router = useRouter();
  const { profile } = useAuth();

  const [service, setService] = useState("");
  const [region, setRegion] = useState(BRAZILIAN_REGIONS_PRESET[0]);
  const [customLocation, setCustomLocation] = useState("");
  const [price, setPrice] = useState("150");
  const [time, setTime] = useState("08:00");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [boost, setBoost] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!service || !price) {
      toast.error("Por favor, preencha o tipo de serviço, horário e valor.");
      return;
    }
    setLoading(true);

    // Garante uma empresa para o contratante antes de publicar a vaga
    let companyId: string | null = null;
    if (profile?.id) {
      const { data: company } = await api
        .from("companies")
        .select("*")
        .eq("user_id", profile.id)
        .single();
      companyId = company?.id ?? null;

      if (!companyId) {
        const { data: created } = await api
          .from("companies")
          .insert({ user_id: profile.id, name: profile.name || "Minha Empresa / Residência" })
          .select()
          .single();
        companyId = created?.id ?? null;
      }
    }

    if (companyId) {
      await api.from("jobs").insert({
        company_id: companyId,
        title: service,
        description,
        date: new Date().toISOString(),
        price: Number(price) || 150,
        location: customLocation || region,
        category: service,
        urgent,
        boost,
      });
    }

    setLoading(false);
    toast.success("Vaga publicada com sucesso! 🚀", {
      description: urgent
        ? "Disparo urgente enviado aos profissionais disponíveis na região."
        : "Os profissionais da região já podem se candidatar.",
    });
    router.replace("/painel");
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Criar Vaga / Diária" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2">
            <Text className="text-2xl font-extrabold tracking-tight text-foreground">
              Publicar uma nova diária
            </Text>
            <Text className="text-sm text-muted-foreground">
              Descreva o serviço e receba candidaturas de profissionais verificados da região.
            </Text>
          </View>

          <Card>
            <CardContent className="gap-5">
              <Field label="Tipo de Serviço ou Função *">
                <Input
                  value={service}
                  onChangeText={setService}
                  placeholder="Ex: Pintor para fachadas, Limpador de Piscina..."
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
                            service === option ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </Field>

              <Field label="Região / Cidade de Atendimento">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {BRAZILIAN_REGIONS_PRESET.map((option) => (
                      <Pressable
                        key={option}
                        onPress={() => setRegion(option)}
                        className={`rounded-full px-3 py-1.5 ${
                          region === option ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            region === option ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </Field>

              <Field label="Endereço / Bairro específico">
                <Input
                  value={customLocation}
                  onChangeText={setCustomLocation}
                  placeholder="Ex: Bairro Matosinhos, Centro..."
                />
              </Field>

              <Field label="Descrição do Trabalho e Requisitos">
                <Input
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Ex: Pintura interna de 2 cômodos, material por nossa conta..."
                  multiline
                />
              </Field>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="Horário *">
                    <Input value={time} onChangeText={setTime} placeholder="08:00" />
                  </Field>
                </View>
                <View className="flex-1">
                  <Field label="Valor da diária (R$) *">
                    <Input
                      value={price}
                      onChangeText={setPrice}
                      placeholder="150"
                      keyboardType="numeric"
                    />
                  </Field>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Impulsionamentos */}
          <Card>
            <CardContent className="gap-3">
              <Pressable
                onPress={() => setUrgent(!urgent)}
                className={`flex-row items-center gap-3 rounded-2xl border p-3.5 ${
                  urgent ? "border-destructive/40 bg-destructive/5" : "border-border"
                }`}
              >
                <Zap size={20} color="#dc2626" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground">Marcar como Urgente</Text>
                  <Text className="text-xs text-muted-foreground">
                    Dispara notificação imediata aos profissionais de plantão.
                  </Text>
                </View>
                <View
                  className={`h-5 w-5 rounded-md border ${
                    urgent ? "border-destructive bg-destructive" : "border-border"
                  }`}
                />
              </Pressable>

              <Pressable
                onPress={() => setBoost(!boost)}
                className={`flex-row items-center gap-3 rounded-2xl border p-3.5 ${
                  boost ? "border-primary/40 bg-primary/5" : "border-border"
                }`}
              >
                <Sparkles size={20} color="#e85d04" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground">Impulsionar vaga</Text>
                  <Text className="text-xs text-muted-foreground">
                    Sua vaga aparece no topo da lista por 48h.
                  </Text>
                </View>
                <View
                  className={`h-5 w-5 rounded-md border ${
                    boost ? "border-primary bg-primary" : "border-border"
                  }`}
                />
              </Pressable>
            </CardContent>
          </Card>

          <Button
            size="lg"
            onPress={submit}
            loading={loading}
            icon={<Plus size={18} color="#ffffff" />}
          >
            Publicar Vaga
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
