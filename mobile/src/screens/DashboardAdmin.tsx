import { useRouter } from "expo-router";
import {
  Activity,
  Briefcase,
  CreditCard,
  DollarSign,
  LogOut,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { EmptyState, Tabs } from "../components/ui/Tabs";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

/** Porte de src/pages/DashboardAdmin.tsx. */
export const DashboardAdmin = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState("usuarios");
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: usersData } = await api.from("users").select("*");
      setUsers(usersData || []);

      const { data: jobsData } = await api.from("jobs").select("*,companies(name)");
      setJobs(jobsData || []);

      const { data: paymentsData } = await api.from("payments").select("*");
      setPayments(paymentsData || []);
    })();
  }, []);

  const kpis = [
    {
      label: "GMV Transacionado",
      value: "R$ 428.500",
      hint: "+38% vs. mês anterior",
      hintClass: "text-emerald-600",
      Icon: DollarSign,
      color: "#059669",
    },
    {
      label: "Receita Líquida (Take-rate)",
      value: "R$ 51.420",
      hint: "Take-rate médio: 12.0%",
      hintClass: "text-muted-foreground",
      Icon: TrendingUp,
      color: "#e85d04",
    },
    {
      label: "Base de Usuários",
      value: "3.420",
      hint: users.length > 0 ? `${users.length} cadastrados reais` : "Profissionais & Contratantes",
      hintClass: "text-muted-foreground",
      Icon: Users,
      color: "#2563eb",
    },
    {
      label: "Liquidez & Conclusão",
      value: "98.4%",
      hint: "Tempo médio de match: < 4.8 min",
      hintClass: "text-emerald-600",
      Icon: Activity,
      color: "#9333ea",
    },
  ];

  const tabItems = [
    { value: "usuarios", label: `Usuários (${users.length})`, Icon: Users },
    { value: "vagas", label: `Vagas (${jobs.length})`, Icon: Briefcase },
    { value: "pagamentos", label: `Pagamentos (${payments.length})`, Icon: CreditCard },
  ];

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top }} className="bg-secondary">
        <View className="h-14 flex-row items-center justify-between px-4">
          <Text className="font-bold text-secondary-foreground">Administrador Geral</Text>
          <Pressable
            onPress={async () => {
              await signOut();
              router.replace("/");
            }}
            className="flex-row items-center gap-1"
          >
            <LogOut size={16} color="#ffffff" />
            <Text className="text-sm text-secondary-foreground/70">Sair</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 24 }}>
        {/* Cabeçalho executivo */}
        <View className="gap-2">
          <View className="flex-row items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1">
            <Sparkles size={13} color="#e85d04" />
            <Text className="text-xs font-semibold uppercase tracking-wider text-primary">
              Visão Geral de Desempenho
            </Text>
          </View>
          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Métricas de Escala & Controle Nacional 🇧🇷
          </Text>
          <Text className="text-sm text-muted-foreground">
            Monitoramento de GMV, liquidez de mercado, retenção e expansão geográfica.
          </Text>
          <View className="self-start rounded-full bg-emerald-500/10 px-3 py-1.5">
            <Text className="text-xs font-bold text-emerald-600">Sistema 100% Operacional</Text>
          </View>
        </View>

        {/* KPIs */}
        <View className="flex-row flex-wrap gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="flex-1 basis-[45%] rounded-2xl">
              <CardContent className="gap-2 p-5">
                <View className="flex-row items-start justify-between gap-2">
                  <Text className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </Text>
                  <kpi.Icon size={16} color={kpi.color} />
                </View>
                <Text className="text-2xl font-extrabold tracking-tight text-foreground">
                  {kpi.value}
                </Text>
                <Text className={`text-[11px] font-semibold ${kpi.hintClass}`}>{kpi.hint}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        <Tabs items={tabItems} value={tab} onChange={setTab} />

        {/* Aba: Usuários */}
        {tab === "usuarios" ? (
          <View className="gap-3">
            {users.length === 0 ? (
              <EmptyState
                title="Nenhum usuário cadastrado ainda"
                description="Cadastre-se pelo app ou pela web para ver os registros reais da API local aqui."
                icon={<Users size={24} color="#e85d04" />}
              />
            ) : (
              users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="flex-row items-center justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">{user.name}</Text>
                      <Text className="text-xs text-muted-foreground">{user.email}</Text>
                    </View>
                    <Badge variant="secondary">{user.type}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        ) : null}

        {/* Aba: Vagas */}
        {tab === "vagas" ? (
          <View className="gap-3">
            {jobs.length === 0 ? (
              <EmptyState
                title="Nenhuma vaga publicada ainda"
                icon={<Briefcase size={24} color="#e85d04" />}
              />
            ) : (
              jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="gap-1">
                    <Text className="text-sm font-bold text-foreground">{job.title}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {job.companies?.name || "Contratante"} • R$ {job.price} • {job.status}
                    </Text>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        ) : null}

        {/* Aba: Pagamentos */}
        {tab === "pagamentos" ? (
          <View className="gap-3">
            {payments.length === 0 ? (
              <EmptyState
                title="Nenhum pagamento registrado"
                icon={<CreditCard size={24} color="#e85d04" />}
              />
            ) : (
              payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">R$ {payment.amount}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {payment.service || "Serviço"}
                      </Text>
                    </View>
                    <Badge variant="secondary">{payment.status}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};
