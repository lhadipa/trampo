import { useRouter } from "expo-router";
import {
  Briefcase,
  History,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { EmptyState, Tabs } from "../components/ui/Tabs";
import { toast } from "../components/ui/Toast";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { SERVICE_CATEGORIES } from "../lib/categories";
import { escrowStatusLabel } from "../lib/escrow";

/** Porte de src/pages/DashboardFreelancer.tsx. */
export const DashboardFreelancer = () => {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState("vagas");
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [checkedInJobIds, setCheckedInJobIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data: jobsData } = await api
        .from("jobs")
        .select("*,companies(name)")
        .order("created_at", { ascending: false });
      setJobs(jobsData || []);

      const { data: escrowData } = await api
        .from("escrow")
        .select("*,users(name)")
        .order("created_at", { ascending: false });
      setEscrows(escrowData || []);
    })();
  }, [profile]);

  const applyToJob = (job: any) => {
    if (appliedJobIds.includes(job.id)) return;
    setAppliedJobIds((prev) => [...prev, job.id]);
    setApplications((prev) => [...prev, { ...job, status: "pending" }]);
    toast.success("Candidatura enviada com sucesso! 🚀", {
      description: "O contratante será notificado e pode abrir o chat com você.",
    });
  };

  const checkIn = (job: any) => {
    if (checkedInJobIds.includes(job.id)) return;
    setCheckedInJobIds((prev) => [...prev, job.id]);
    toast.success(`Check-in confirmado para "${job.title}"!`, {
      description: "Horário registrado. O contratante foi notificado.",
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (job.title || "").toLowerCase().includes(term) ||
      (job.companies?.name || "").toLowerCase().includes(term);

    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && job.category === categoryFilter;
  });

  const balance = profile?.balance ?? 380;

  const tabItems = [
    { value: "vagas", label: `Oportunidades (${filteredJobs.length})`, Icon: Briefcase },
    { value: "historico", label: `Minhas Diárias (${applications.length})`, Icon: History },
    { value: "escrow", label: "Custódia Segura", Icon: ShieldCheck },
    { value: "saldo", label: "Saque Pix", Icon: Wallet },
  ];

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top }} className="bg-secondary">
        <View className="h-14 flex-row items-center justify-between px-4">
          <Text className="font-bold text-secondary-foreground">Painel do Profissional</Text>
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
        {/* Saudação & carteira */}
        <View className="gap-4">
          <View className="gap-1.5">
            <Text className="text-2xl font-bold text-foreground">
              Olá, {profile?.name || "Profissional"} 👋
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground">
              Diárias em Pintura, Piscinas, Elétrica, Gastronomia, Limpeza e Eventos
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onPress={() => router.push("/conversas")}
              icon={<MessageSquare size={14} color="#1c1917" />}
            >
              Chat
            </Button>
            <View className="flex-row items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5">
              <Wallet size={16} color="#059669" />
              <Text className="text-sm font-bold text-foreground">R$ {balance.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Banner anti-calote */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="gap-3">
            <View className="flex-row items-start gap-2.5">
              <ShieldCheck size={20} color="#059669" />
              <Text className="flex-1 text-xs leading-relaxed text-foreground">
                <Text className="font-bold">Garantia Anti-Calote:</Text> O valor do serviço já fica
                bloqueado na conta da plataforma antes de você iniciar e é transferido para sua chave
                Pix assim que concluir.
              </Text>
            </View>
            <Button variant="outline" size="sm" onPress={() => router.push("/disponibilidade")}>
              Definir Minha Agenda & Raio
            </Button>
          </CardContent>
        </Card>

        <Tabs items={tabItems} value={tab} onChange={setTab} />

        {/* Aba: Oportunidades */}
        {tab === "vagas" ? (
          <View className="gap-4">
            <View className="gap-3">
              <View className="flex-row items-center gap-2 rounded-2xl border border-input bg-background px-3.5">
                <Search size={16} color="#78716c" />
                <View className="flex-1">
                  <Input
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholder="Buscar vaga ou contratante"
                    className="border-0 px-0"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {[{ id: "all", name: "Todas as Áreas" }, ...SERVICE_CATEGORIES].map((cat) => (
                    <Pressable
                      key={cat.id}
                      onPress={() => setCategoryFilter(cat.id)}
                      className={`rounded-full px-3 py-1.5 ${
                        categoryFilter === cat.id ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          categoryFilter === cat.id
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            {filteredJobs.length === 0 ? (
              <EmptyState
                title="Nenhuma oportunidade encontrada"
                description="Ajuste a busca ou o filtro de área para ver mais diárias."
                icon={<Briefcase size={24} color="#e85d04" />}
              />
            ) : (
              filteredJobs.map((job) => {
                const applied = appliedJobIds.includes(job.id);
                const checkedIn = checkedInJobIds.includes(job.id);

                return (
                  <Card key={job.id}>
                    <CardContent className="gap-3 p-5">
                      <View className="flex-row items-start justify-between gap-2">
                        <Text className="flex-1 text-base font-bold text-foreground">
                          {job.title}
                        </Text>
                        {job.urgent ? <Badge className="bg-destructive">Urgente</Badge> : null}
                      </View>

                      <Text className="text-xs font-medium text-muted-foreground">
                        {job.companies?.name || "Contratante"}
                      </Text>

                      {job.description ? (
                        <Text className="text-xs leading-relaxed text-muted-foreground">
                          {job.description}
                        </Text>
                      ) : null}

                      <View className="flex-row flex-wrap items-center gap-3">
                        <View className="flex-row items-center gap-1">
                          <MapPin size={13} color="#78716c" />
                          <Text className="text-[11px] text-muted-foreground">
                            {job.location || "São João del-Rei / MG"}
                          </Text>
                        </View>
                        <Text className="text-[11px] text-muted-foreground">
                          {new Date(job.date).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between border-t border-border/50 pt-3">
                        <View>
                          <Text className="text-[10px] text-muted-foreground">Diária</Text>
                          <Text className="text-lg font-extrabold text-primary">
                            R$ {job.price},00
                          </Text>
                        </View>

                        <View className="flex-row gap-2">
                          {applied ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() => checkIn(job)}
                              disabled={checkedIn}
                            >
                              {checkedIn ? "Check-in feito ✓" : "Fazer Check-in"}
                            </Button>
                          ) : (
                            <Button size="sm" onPress={() => applyToJob(job)}>
                              Candidatar-se
                            </Button>
                          )}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </View>
        ) : null}

        {/* Aba: Minhas diárias */}
        {tab === "historico" ? (
          <View className="gap-3">
            {applications.length === 0 ? (
              <EmptyState
                title="Você ainda não se candidatou a nenhuma diária"
                description="Na aba Oportunidades, toque em Candidatar-se para começar."
                icon={<History size={24} color="#e85d04" />}
              />
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="gap-2">
                    <View className="flex-row items-center justify-between gap-2">
                      <Text className="flex-1 text-sm font-bold text-foreground">{app.title}</Text>
                      <Badge variant="secondary">Aguardando resposta</Badge>
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {app.companies?.name} • R$ {app.price},00 •{" "}
                      {new Date(app.date).toLocaleDateString("pt-BR")}
                    </Text>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        ) : null}

        {/* Aba: Custódia */}
        {tab === "escrow" ? (
          <View className="gap-3">
            <View className="flex-row items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <ShieldCheck size={24} color="#059669" />
              <View className="flex-1">
                <Text className="text-sm font-bold text-emerald-900">
                  Seu dinheiro já está reservado
                </Text>
                <Text className="mt-0.5 text-xs text-emerald-700">
                  Estes valores estão bloqueados pela plataforma e são liberados assim que o serviço
                  for confirmado.
                </Text>
              </View>
            </View>

            {escrows.map((escrow) => {
              const status = escrowStatusLabel(escrow.status);
              return (
                <Card key={escrow.id}>
                  <CardContent className="gap-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-bold text-foreground">
                        R$ {escrow.amount},00
                      </Text>
                      <View className={`rounded-full px-2.5 py-1 ${status.box}`}>
                        <Text className={`text-[10px] font-bold ${status.text}`}>{status.label}</Text>
                      </View>
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {escrow.service || "Serviço Autônomo"}
                    </Text>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        ) : null}

        {/* Aba: Saque Pix */}
        {tab === "saldo" ? (
          <View className="gap-4">
            <Card className="border-primary/25 bg-primary/5">
              <CardContent className="items-center gap-2 p-6">
                <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Saldo disponível
                </Text>
                <Text className="text-4xl font-extrabold text-foreground">
                  R$ {balance.toFixed(2)}
                </Text>
                <Text className="text-center text-xs text-muted-foreground">
                  Transferência via Pix em até 30 minutos, sem taxa para o profissional.
                </Text>
                <Button
                  className="mt-2 w-full rounded-full"
                  onPress={() =>
                    toast.success("Solicitação de Saque Pix Recebida! ⚡", {
                      description: "O valor cai na sua chave Pix em até 30 minutos.",
                    })
                  }
                  icon={<Zap size={16} color="#ffffff" />}
                >
                  Sacar via Pix
                </Button>
              </CardContent>
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};
