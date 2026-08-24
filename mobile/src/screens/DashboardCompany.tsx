import { useRouter } from "expo-router";
import {
  Briefcase,
  CheckCircle,
  Clock,
  CreditCard,
  Heart,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
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
import { escrowStatusLabel, showcaseEscrows, showcaseWorkers } from "../lib/demoData";

/** Porte de src/pages/DashboardCompany.tsx. */
export const DashboardCompany = () => {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState("freelancers");
  const [jobs, setJobs] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(["u-1", "u-2", "u-4"]);

  useEffect(() => {
    if (!profile) return;

    (async () => {
      // Vagas da empresa (se ela ja existir no banco local)
      const { data: company } = await api
        .from("companies")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      if (company?.id) {
        const { data: jobsData } = await api
          .from("jobs")
          .select("*")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false });
        setJobs(jobsData || []);
      }

      // Dados reais tem precedencia; senao cai no seed de demonstracao
      const { data: freelancerData } = await api.from("freelancers").select("*,users(name,email)");
      setFreelancers(
        freelancerData?.length
          ? freelancerData
          : showcaseWorkers.map((w) => ({
              id: w.id,
              user_id: w.user_id,
              category: w.category,
              users: { name: w.name, email: `${w.user_id}@trampo.com` },
              rating: w.rating,
              completed: w.completed,
              location: w.location,
            })),
      );

      const { data: escrowData } = await api
        .from("escrow")
        .select("*,users(name)")
        .order("created_at", { ascending: false });
      setEscrows(escrowData?.length ? escrowData : showcaseEscrows);
    })();
  }, [profile]);

  const toggleFavorite = (userId: string, name: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(userId)) {
        toast.info(`${name} removido da sua equipe.`);
        return prev.filter((id) => id !== userId);
      }
      toast.success(`⭐ ${name} adicionado à sua Equipe Favorita!`, {
        description: "Você pode chamá-lo com 1 clique para novas diárias.",
      });
      return [...prev, userId];
    });
  };

  const releaseEscrow = (escrowId: string) => {
    setEscrows((prev) =>
      prev.map((e) => (e.id === escrowId ? { ...e, status: "released" } : e)),
    );
    api.from("escrow").update({ status: "released" }).eq("id", escrowId);
    toast.success("Pagamento liberado com sucesso! ✅", {
      description: "O valor foi repassado instantaneamente via Pix para o profissional.",
    });
  };

  const filteredFreelancers = freelancers.filter((f) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (f.users?.name || "").toLowerCase().includes(term) ||
      (f.category || "").toLowerCase().includes(term);

    if (categoryFilter === "all") return matchesSearch;
    const category = SERVICE_CATEGORIES.find((c) => c.id === categoryFilter);
    if (!category) return matchesSearch;

    const matchesCategory = category.subservices.some(
      (sub) =>
        f.category?.toLowerCase().includes(sub.toLowerCase()) ||
        sub.toLowerCase().includes((f.category || "").toLowerCase()),
    );
    return matchesSearch && matchesCategory;
  });

  const favoriteFreelancers = freelancers.filter((f) => favoriteIds.includes(f.user_id));

  const tabItems = [
    { value: "freelancers", label: `Explorar (${freelancers.length})`, Icon: Users },
    { value: "equipe", label: `Favoritos (${favoriteFreelancers.length})`, Icon: Heart },
    { value: "vagas", label: `Vagas (${jobs.length})`, Icon: Briefcase },
    { value: "escrow", label: `Custódia (${escrows.length})`, Icon: ShieldCheck },
    { value: "pagamentos", label: "Recibos (RPA)", Icon: CreditCard },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Top bar */}
      <View style={{ paddingTop: insets.top }} className="bg-secondary">
        <View className="h-14 flex-row items-center justify-between px-4">
          <Text className="font-bold text-secondary-foreground">Painel Contratante & Empresa</Text>
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
        {/* Saudação */}
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">
              Olá, {profile?.name || "Contratante"} 👋
            </Text>
            <Badge className="bg-primary/10" variant="outline">
              Membro Fundador VIP
            </Badge>
            <Text className="mt-0.5 text-xs text-muted-foreground">
              Gestão de Diárias, Reformas, Piscinas, Eventos e Força de Trabalho
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <Button variant="outline" size="sm" onPress={() => router.push("/conversas")}>
              Conversas
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30"
              onPress={() => router.push("/urgente")}
              icon={<Zap size={14} color="#dc2626" />}
            >
              Radar SOS Turbo
            </Button>
            <Button
              size="sm"
              onPress={() => router.push("/criar-vaga")}
              icon={<Plus size={14} color="#ffffff" />}
            >
              Criar Vaga
            </Button>
          </View>
        </View>

        {/* Widget VIP & ROI */}
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="gap-4 p-5">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Sparkles size={16} color="#e85d04" />
                <Text className="flex-1 text-sm font-bold text-foreground">
                  Período VIP Ativo: Acesso Completo Liberado
                </Text>
              </View>
              <Text className="text-xs leading-relaxed text-muted-foreground">
                Contrate pintores, piscineiros, garçons e diaristas sem intermediários e com recibo
                digital automático.
              </Text>
            </View>

            <View className="flex-row items-center justify-around rounded-2xl border border-border bg-background/90 p-3">
              <View className="items-center px-2">
                <View className="flex-row items-center gap-1">
                  <Clock size={16} color="#e85d04" />
                  <Text className="text-base font-bold text-primary">~18h</Text>
                </View>
                <Text className="text-[10px] text-muted-foreground">Tempo Poupado</Text>
              </View>
              <View className="h-7 w-px bg-border" />
              <View className="items-center px-2">
                <View className="flex-row items-center gap-1">
                  <TrendingUp size={16} color="#059669" />
                  <Text className="text-base font-bold text-emerald-600">R$ 3.400+</Text>
                </View>
                <Text className="text-[10px] text-muted-foreground">Volume Transacionado</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Tabs items={tabItems} value={tab} onChange={setTab} />

        {/* Aba: Explorar */}
        {tab === "freelancers" ? (
          <View className="gap-4">
            <View className="gap-3">
              <View className="flex-row items-center gap-2 rounded-2xl border border-input bg-background px-3.5">
                <Search size={16} color="#78716c" />
                <View className="flex-1">
                  <Input
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholder="Buscar por nome ou especialidade"
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

            {filteredFreelancers.length === 0 ? (
              <EmptyState title="Nenhum profissional encontrado com esse filtro." />
            ) : (
              <View className="gap-3">
                {filteredFreelancers.map((f) => {
                  const isFav = favoriteIds.includes(f.user_id);
                  return (
                    <Card key={f.id}>
                      <CardContent className="flex-row items-center justify-between gap-3">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-1.5">
                            <Text className="flex-1 text-sm font-bold text-foreground" numberOfLines={1}>
                              {f.users?.name || "Profissional"}
                            </Text>
                            <ShieldCheck size={16} color="#e85d04" />
                          </View>
                          <Text className="mt-0.5 text-xs font-medium text-muted-foreground" numberOfLines={1}>
                            {f.category || "Serviços Gerais"}
                          </Text>
                          <View className="mt-2 flex-row items-center gap-2.5">
                            <View className="flex-row items-center gap-1">
                              <Star size={12} color="#f59e0b" fill="#f59e0b" />
                              <Text className="text-[11px] font-semibold text-foreground">
                                {f.rating || "4.9"}
                              </Text>
                            </View>
                            <Text className="text-[11px] text-muted-foreground">•</Text>
                            <Text className="text-[11px] font-medium text-emerald-600">Disponível</Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-2">
                          <Pressable
                            onPress={() => toggleFavorite(f.user_id, f.users?.name || "Profissional")}
                            className={`rounded-lg p-2 ${isFav ? "bg-primary/10" : ""}`}
                          >
                            <Heart
                              size={16}
                              color={isFav ? "#e85d04" : "#78716c"}
                              fill={isFav ? "#e85d04" : "transparent"}
                            />
                          </Pressable>
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => router.push("/conversas")}
                            icon={<MessageSquare size={13} color="#1c1917" />}
                          >
                            Chat
                          </Button>
                        </View>
                      </CardContent>
                    </Card>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        {/* Aba: Equipe favorita */}
        {tab === "equipe" ? (
          <View className="gap-3">
            <Text className="text-xs text-muted-foreground">
              Seus prestadores de confiança favoritos. Chame com 1 clique quando precisar.
            </Text>
            {favoriteFreelancers.length === 0 ? (
              <EmptyState
                title="Sua equipe favorita está vazia"
                description='Navegue na aba "Explorar" e toque no coração dos profissionais de sua preferência.'
                icon={<Heart size={24} color="#e85d04" />}
              />
            ) : (
              favoriteFreelancers.map((f) => (
                <Card key={f.id}>
                  <CardContent className="flex-row items-center justify-between">
                    <View className="flex-1 gap-1">
                      <Text className="text-sm font-bold text-foreground">
                        {f.users?.name || "Profissional"}
                      </Text>
                      <Text className="text-xs text-muted-foreground">{f.category || "Geral"}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Pressable
                        onPress={() => toggleFavorite(f.user_id, f.users?.name || "Profissional")}
                        className="rounded-lg p-2"
                      >
                        <Heart size={16} color="#e85d04" fill="#e85d04" />
                      </Pressable>
                      <Button
                        size="sm"
                        onPress={() =>
                          toast.success(`Convite prioritário enviado para ${f.users?.name}! 🚀`, {
                            description: "O prestador receberá notificação imediata.",
                          })
                        }
                      >
                        Convidar
                      </Button>
                    </View>
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
              <View className="gap-3">
                <EmptyState
                  title="Nenhuma vaga aberta no momento."
                  icon={<Briefcase size={24} color="#e85d04" />}
                />
                <Button
                  size="sm"
                  onPress={() => router.push("/criar-vaga")}
                  icon={<Plus size={14} color="#ffffff" />}
                >
                  Publicar Primeira Vaga
                </Button>
              </View>
            ) : (
              jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">
                        {job.title || "Sem título"}
                      </Text>
                      <Text className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(job.date).toLocaleDateString("pt-BR")} • Diária: R${" "}
                        {job.price || "150,00"}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {job.urgent ? <Badge className="bg-destructive">Urgente</Badge> : null}
                      <Badge variant="secondary">{job.status}</Badge>
                    </View>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        ) : null}

        {/* Aba: Custódia (escrow) */}
        {tab === "escrow" ? (
          <View className="gap-3">
            <View className="flex-row items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <ShieldCheck size={24} color="#059669" />
              <View className="flex-1">
                <Text className="text-sm font-bold text-emerald-900">Garantia Escrow Antifraude</Text>
                <Text className="mt-0.5 text-xs text-emerald-700">
                  Os valores ficam retidos com segurança e só são repassados ao profissional após a
                  conclusão confirmada da diária.
                </Text>
              </View>
            </View>

            {escrows.map((escrow) => {
              const status = escrowStatusLabel(escrow.status);
              return (
                <Card key={escrow.id}>
                  <CardContent className="gap-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-bold text-foreground">
                        R$ {escrow.amount},00
                      </Text>
                      <View className={`rounded-full px-2.5 py-1 ${status.box}`}>
                        <Text className={`text-[10px] font-bold ${status.text}`}>{status.label}</Text>
                      </View>
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      Profissional:{" "}
                      <Text className="font-bold text-foreground">
                        {escrow.users?.name || "Prestador"}
                      </Text>{" "}
                      • {escrow.service || "Serviço Autônomo"}
                    </Text>
                    {escrow.status === "held" ? (
                      <Button
                        size="sm"
                        className="bg-emerald-600"
                        onPress={() => releaseEscrow(escrow.id)}
                        icon={<CheckCircle size={14} color="#ffffff" />}
                      >
                        Liberar Pagamento Pix
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </View>
        ) : null}

        {/* Aba: Recibos */}
        {tab === "pagamentos" ? (
          <View className="gap-3">
            {escrows.map((escrow) => (
              <Card key={escrow.id}>
                <CardContent className="gap-3">
                  <Text className="text-sm font-bold text-foreground">
                    Recibo de Prestação Autônoma (RPA)
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {escrow.users?.name || "Prestador"} • R$ {escrow.amount},00 •{" "}
                    {new Date(escrow.created_at).toLocaleDateString("pt-BR")}
                  </Text>
                  <Text className="text-[11px] leading-relaxed text-muted-foreground">
                    Prestação de Serviços Autônomos Eventuais (Art. 442-B da CLT — Sem Vínculo
                    Empregatício).
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() =>
                      toast.success("Recibo gerado!", {
                        description: "Disponível para download e envio à contabilidade.",
                      })
                    }
                  >
                    Gerar Recibo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};
