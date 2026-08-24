import { useRouter } from "expo-router";
import {
  ArrowRight,
  Building2,
  CheckSquare,
  HardHat,
  ShieldAlert,
  Sparkles,
  Square,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Logo } from "../src/components/landing/Logo";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { Card, CardContent } from "../src/components/ui/Card";
import { Field, Input } from "../src/components/ui/Input";
import { toast } from "../src/components/ui/Toast";
import { useAuth, type DemoRole } from "../src/hooks/useAuth";
import { api } from "../src/lib/api";

/** Porte de src/pages/Auth.tsx. */
export default function Auth() {
  const router = useRouter();
  const { loginAsDemo } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [userType, setUserType] = useState<"empresa" | "freelancer">("freelancer");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");

  const quickAccess: {
    role: DemoRole;
    title: string;
    subtitle: string;
    Icon: typeof Building2;
    tint: string;
    color: string;
  }[] = [
    {
      role: "empresa",
      title: "Empresa / Contratante",
      subtitle: "Publicar vagas, contratar e pagar",
      Icon: Building2,
      tint: "bg-orange-500/10",
      color: "#ea580c",
    },
    {
      role: "freelancer",
      title: "Trabalhador Autônomo",
      subtitle: "Candidaturas, agenda de diárias e chat",
      Icon: HardHat,
      tint: "bg-blue-500/10",
      color: "#2563eb",
    },
    {
      role: "admin",
      title: "Administrador Geral",
      subtitle: "Métricas, faturamento, cidades e usuários",
      Icon: ShieldAlert,
      tint: "bg-emerald-500/10",
      color: "#059669",
    },
  ];

  const handleQuickLogin = (role: DemoRole) => {
    loginAsDemo(role);
    const roleLabels: Record<DemoRole, string> = {
      empresa: "Empresa / Contratante (Hotel Fazenda Solar)",
      freelancer: "Profissional Autônomo (Carlos Silva)",
      admin: "Painel do Administrador Geral",
    };
    toast.success(`Acesso rápido liberado! Entrando como ${roleLabels[role]} 🎉`);
    router.replace("/painel");
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error("Preencha email e senha.");
      return;
    }
    setLoading(true);
    const { error } = await api.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Login realizado com sucesso!");
    router.replace("/painel");
  };

  const handleSignup = async () => {
    if (!agreeTerms) {
      toast.error("Por favor, leia e aceite os Termos de Uso e Autonomia.");
      return;
    }
    if (!signupName || !signupEmail || signupPassword.length < 6) {
      toast.error("Preencha nome, email e uma senha de ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const { error } = await api.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { name: signupName, user_type: userType } },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Conta criada com sucesso! Bem-vindo(a), ${signupName}!`, {
      description: "60 Dias Grátis de Membro Fundador VIP ativados.",
    });
    router.replace("/painel");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          {/* Banner de lançamento VIP */}
          <View className="flex-row items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 p-3">
            <Sparkles size={16} color="#e85d04" />
            <Text className="flex-1 text-xs font-medium text-primary">
              <Text className="font-bold">Lançamento SJDR:</Text> Cadastre-se hoje e ganhe{" "}
              <Text className="font-bold">60 Dias Grátis de Membro Fundador VIP</Text>.
            </Text>
          </View>

          <View className="items-center gap-2">
            <Logo size={40} />
            <Text className="text-center text-sm text-muted-foreground">
              Trabalho rápido e seguro em São João del-Rei e região
            </Text>
          </View>

          {/* Acesso rápido de teste */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Zap size={16} color="#e85d04" />
                  <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                    Acesso Rápido de Teste
                  </Text>
                </View>
                <Badge variant="outline">1 Clique</Badge>
              </View>
              <Text className="text-xs text-muted-foreground">
                Entre imediatamente sem formulários para testar os recursos de cada perfil:
              </Text>

              <View className="gap-2 pt-1">
                {quickAccess.map(({ role, title, subtitle, Icon, tint, color }) => (
                  <Pressable
                    key={role}
                    onPress={() => handleQuickLogin(role)}
                    className="flex-row items-center justify-between rounded-xl border border-border bg-background p-2.5 active:bg-primary/10"
                  >
                    <View className="flex-1 flex-row items-center gap-2.5">
                      <View className={`rounded-lg p-2 ${tint}`}>
                        <Icon size={16} color={color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-foreground">{title}</Text>
                        <Text className="text-[11px] text-muted-foreground">{subtitle}</Text>
                      </View>
                    </View>
                    <ArrowRight size={14} color="#78716c" />
                  </Pressable>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Login / Cadastro */}
          <Card>
            <CardContent className="pt-6">
              <View className="mb-4 flex-row rounded-xl bg-muted p-1">
                {(["login", "signup"] as const).map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => setTab(value)}
                    className={`flex-1 rounded-lg py-2 ${tab === value ? "bg-background" : ""}`}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        tab === value ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {value === "login" ? "Entrar" : "Cadastrar"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {tab === "login" ? (
                <View className="gap-4">
                  <Field label="Email">
                    <Input
                      value={loginEmail}
                      onChangeText={setLoginEmail}
                      placeholder="seuemail@exemplo.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </Field>
                  <Field label="Senha">
                    <Input
                      value={loginPassword}
                      onChangeText={setLoginPassword}
                      placeholder="Sua senha"
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </Field>
                  <Button onPress={handleLogin} loading={loading}>
                    Entrar no Painel
                  </Button>
                </View>
              ) : (
                <View className="gap-4">
                  <Field label="Nome completo ou Razão Social">
                    <Input
                      value={signupName}
                      onChangeText={setSignupName}
                      placeholder="Ex: João Silva ou Restaurante Mineiro"
                      autoCapitalize="words"
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      value={signupEmail}
                      onChangeText={setSignupEmail}
                      placeholder="seuemail@exemplo.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </Field>
                  <Field label="Senha">
                    <Input
                      value={signupPassword}
                      onChangeText={setSignupPassword}
                      placeholder="Mínimo 6 caracteres"
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </Field>

                  <Field label="Eu sou:">
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <Button
                          variant={userType === "freelancer" ? "default" : "outline"}
                          size="sm"
                          onPress={() => setUserType("freelancer")}
                        >
                          Trabalhador Autônomo
                        </Button>
                      </View>
                      <View className="flex-1">
                        <Button
                          variant={userType === "empresa" ? "default" : "outline"}
                          size="sm"
                          onPress={() => setUserType("empresa")}
                        >
                          Empresa / Contratante
                        </Button>
                      </View>
                    </View>
                  </Field>

                  {/* Aceite dos termos */}
                  <Pressable
                    onPress={() => setAgreeTerms(!agreeTerms)}
                    className="flex-row items-start gap-2.5 rounded-xl border border-border bg-muted/40 p-3"
                  >
                    <View className="mt-0.5">
                      {agreeTerms ? (
                        <CheckSquare size={16} color="#e85d04" />
                      ) : (
                        <Square size={16} color="#78716c" />
                      )}
                    </View>
                    <Text className="flex-1 text-xs leading-snug text-muted-foreground">
                      Declaro que li e concordo com os{" "}
                      <Text
                        className="font-medium text-primary underline"
                        onPress={() => router.push("/termos")}
                      >
                        Termos de Uso, Mediação Tecnológica e Declaração de Autonomia
                      </Text>{" "}
                      (reconhecendo a inexistência de vínculo empregatício sob o Art. 442-B da CLT).
                    </Text>
                  </Pressable>

                  <Button onPress={handleSignup} loading={loading}>
                    Criar Conta com 60 Dias Grátis
                  </Button>
                </View>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
