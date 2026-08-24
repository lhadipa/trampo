import { CalendarDays, MapPin } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "../src/components/ui/Button";
import { Card, CardContent } from "../src/components/ui/Card";
import { Field, Input } from "../src/components/ui/Input";
import { ScreenHeader } from "../src/components/ui/ScreenHeader";
import { toast } from "../src/components/ui/Toast";

/** Porte de src/pages/Availability.tsx. */
const weekdays = [
  { id: "seg", label: "Segunda" },
  { id: "ter", label: "Terça" },
  { id: "qua", label: "Quarta" },
  { id: "qui", label: "Quinta" },
  { id: "sex", label: "Sexta" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
];

const shifts = [
  { id: "manha", label: "Manhã (06h–12h)" },
  { id: "tarde", label: "Tarde (12h–18h)" },
  { id: "noite", label: "Noite (18h–00h)" },
];

const radiusOptions = ["5 km", "10 km", "25 km", "50 km", "Toda a região"];

export default function Disponibilidade() {
  const [activeDays, setActiveDays] = useState<string[]>(["seg", "ter", "qua", "qui", "sex"]);
  const [activeShifts, setActiveShifts] = useState<string[]>(["manha", "tarde"]);
  const [radius, setRadius] = useState("25 km");
  const [baseAddress, setBaseAddress] = useState("Centro / São João del-Rei - MG");

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) =>
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Agenda & Raio de Atendimento" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 20 }}>
        <View className="gap-2">
          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Quando e onde você atende
          </Text>
          <Text className="text-sm text-muted-foreground">
            Só recebe chamados que cabem na sua agenda. Você pode mudar isso quando quiser.
          </Text>
        </View>

        <Card>
          <CardContent className="gap-4">
            <View className="flex-row items-center gap-2">
              <CalendarDays size={18} color="#e85d04" />
              <Text className="text-sm font-bold text-foreground">Dias da semana</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {weekdays.map((day) => {
                const active = activeDays.includes(day.id);
                return (
                  <Pressable
                    key={day.id}
                    onPress={() => toggle(activeDays, setActiveDays, day.id)}
                    className={`rounded-full px-3.5 py-2 ${active ? "bg-primary" : "bg-muted"}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        active ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {day.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="gap-4">
            <Text className="text-sm font-bold text-foreground">Turnos disponíveis</Text>
            <View className="gap-2">
              {shifts.map((shift) => {
                const active = activeShifts.includes(shift.id);
                return (
                  <Pressable
                    key={shift.id}
                    onPress={() => toggle(activeShifts, setActiveShifts, shift.id)}
                    className={`flex-row items-center justify-between rounded-2xl border p-3.5 ${
                      active ? "border-primary/40 bg-primary/5" : "border-border"
                    }`}
                  >
                    <Text className="text-sm font-medium text-foreground">{shift.label}</Text>
                    <View
                      className={`h-5 w-5 rounded-md border ${
                        active ? "border-primary bg-primary" : "border-border"
                      }`}
                    />
                  </Pressable>
                );
              })}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="gap-4">
            <View className="flex-row items-center gap-2">
              <MapPin size={18} color="#e85d04" />
              <Text className="text-sm font-bold text-foreground">Raio de atendimento</Text>
            </View>

            <Field label="Endereço base">
              <Input value={baseAddress} onChangeText={setBaseAddress} />
            </Field>

            <View className="flex-row flex-wrap gap-2">
              {radiusOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setRadius(option)}
                  className={`rounded-full px-3.5 py-2 ${
                    radius === option ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      radius === option ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </CardContent>
        </Card>

        <Button
          size="lg"
          onPress={() =>
            toast.success("Agenda atualizada!", {
              description: `${activeDays.length} dias, ${activeShifts.length} turnos, raio de ${radius}.`,
            })
          }
        >
          Salvar Disponibilidade
        </Button>
      </ScrollView>
    </View>
  );
}
