import { BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Card, CardContent } from "../src/components/ui/Card";
import { ScreenHeader } from "../src/components/ui/ScreenHeader";
import { EmptyState, Tabs } from "../src/components/ui/Tabs";
import { useAuth } from "../src/hooks/useAuth";
import { api } from "../src/lib/api";
import { getContractState } from "../src/lib/contractState";

/** Porte de src/pages/Contracts.tsx. */
const ContractCard = ({ contract }: { contract: any }) => {
  const state = getContractState(contract.status);
  const protectedPayment = ["FUNDS_SECURED", "RELEASED"].includes(contract.status);

  return (
    <Card>
      <CardContent className="gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="font-bold text-foreground">
              {contract.jobs?.title || contract.description || "Trampo contratado"}
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              {contract.jobs?.companies?.name || "Empresa parceira"}
            </Text>
          </View>
          <View className={`rounded-full border px-2.5 py-1 ${state.tone}`}>
            <Text className="text-[10px] font-bold">{state.label}</Text>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-row items-center gap-1.5">
            <CalendarDays size={13} color="#78716c" />
            <Text className="text-xs text-muted-foreground">
              {new Date(contract.start_at).toLocaleDateString("pt-BR")}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Clock3 size={13} color="#78716c" />
            <Text className="text-xs text-muted-foreground">
              {new Date(contract.start_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between border-t border-border pt-3">
          <Text className="font-extrabold text-emerald-600">
            R$ {Number(contract.amount).toFixed(2).replace(".", ",")}
          </Text>
          {protectedPayment ? (
            <View className="flex-row items-center gap-1">
              <ShieldCheck size={13} color="#047857" />
              <Text className="text-[11px] text-emerald-700">Pagamento protegido</Text>
            </View>
          ) : null}
        </View>
      </CardContent>
    </Card>
  );
};

export default function MeusTrampos() {
  const { profile } = useAuth();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("proximos");

  useEffect(() => {
    (async () => {
      const { data, error } = await api
        .from("contracts")
        .select("*,jobs(title,companies(name))")
        .order("start_at", { ascending: true });
      setContracts(!error && data ? data : []);
      setLoading(false);
    })();
  }, [profile]);

  const active = contracts.filter(
    (c) => !["COMPLETED", "RELEASED", "CANCELLED"].includes(c.status),
  );
  const upcoming = active.filter((c) => c.status !== "IN_PROGRESS");
  const inProgress = active.filter((c) => c.status === "IN_PROGRESS");
  const completed = contracts.filter((c) => ["COMPLETED", "RELEASED"].includes(c.status));

  const visible = tab === "proximos" ? upcoming : tab === "andamento" ? inProgress : completed;
  const emptyText =
    tab === "proximos"
      ? "Você ainda não tem trabalhos agendados."
      : tab === "andamento"
        ? "Nenhum trabalho em andamento."
        : "Seus trabalhos concluídos aparecerão aqui.";

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Meus Trampos" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 20 }}>
        <View className="rounded-2xl bg-primary/10 p-4">
          <View className="flex-row items-center gap-2">
            <BriefcaseBusiness size={16} color="#e85d04" />
            <Text className="text-sm font-bold text-foreground">Seu próximo trampo</Text>
          </View>
          <Text className="mt-1 text-xs text-muted-foreground">
            Agenda, pagamento protegido e execução em um só lugar.
          </Text>
        </View>

        <Tabs
          items={[
            { value: "proximos", label: "Próximos" },
            { value: "andamento", label: "Em andamento" },
            { value: "concluidos", label: "Concluídos" },
          ]}
          value={tab}
          onChange={setTab}
        />

        {loading ? (
          <Text className="py-12 text-center text-sm text-muted-foreground">
            Carregando seus trampos...
          </Text>
        ) : visible.length === 0 ? (
          <EmptyState title={emptyText} icon={<CheckCircle2 size={24} color="#e85d04" />} />
        ) : (
          <View className="gap-3">
            {visible.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
