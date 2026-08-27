import { useRouter } from "expo-router";
import { ArrowRight, CircleCheck, Globe, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";

const trustItems = [
  "Pagamento 100% Garantido via Pix (Escrow)",
  "Profissionais Avaliados e Verificados",
  "Sem Burocracia e Sem Vínculo CLT",
  "Cobertura Nacional em Expansão",
];

const trendingServices = [
  "🎨 Pintor",
  "🏊 Limpador de Piscina",
  "⚡ Eletricista",
  "🍽️ Garçom",
  "🧹 Diarista",
  "🔧 Montador de Móveis",
  "✂️ Manicure / Barbeiro",
  "📦 Entregador",
];

const stats = [
  { value: "40+", label: "categorias de serviços" },
  { value: "R$ 0", label: "mensalidade para começar" },
  { value: "100%", label: "proteção financeira (Escrow)" },
];

export const Hero = () => {
  const router = useRouter();

  return (
    <View className="px-4 pb-16 pt-8">
      <View className="items-center">
        {/* Tag de Expansão Nacional e Polo */}
        <View className="flex-row items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5">
          <View className="h-2 w-2 rounded-full bg-emerald-500" />
          <Globe size={14} color="#e85d04" />
          <Text className="text-xs font-semibold text-primary">Polo São João del-Rei & Região</Text>
        </View>

        {/* Título Principal */}
        <Text className="mt-6 text-center text-4xl font-extrabold tracking-tight text-foreground">
          O profissional ou serviço certo,
        </Text>
        <Text className="text-center text-4xl font-extrabold tracking-tight text-primary">
          na hora que você precisa.
        </Text>

        {/* Descrição Multi-Setor */}
        <Text className="mt-5 text-center text-base leading-relaxed text-muted-foreground">
          De <Text className="font-bold text-foreground">pintores</Text> e{" "}
          <Text className="font-bold text-foreground">limpadores de piscina</Text> a{" "}
          <Text className="font-bold text-foreground">eletricistas</Text>,{" "}
          <Text className="font-bold text-foreground">garçons</Text> e{" "}
          <Text className="font-bold text-foreground">diaristas</Text>. Conectamos quem precisa de
          ajuda rápida a profissionais autônomos verificados, com{" "}
          <Text className="font-bold text-foreground">pagamento seguro via Pix</Text> e{" "}
          <Text className="font-bold text-foreground">recibo digital automático</Text>.
        </Text>

        {/* Tags de Serviços em Alta */}
        <Text className="mt-6 self-start text-xs font-semibold text-muted-foreground">
          Serviços em alta:
        </Text>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {trendingServices.map((service) => (
            <View
              key={service}
              className="rounded-lg border border-border bg-background px-2.5 py-1"
            >
              <Text className="text-xs font-medium text-foreground">{service}</Text>
            </View>
          ))}
        </View>

        {/* Botões de Ação CTA */}
        <View className="mt-8 w-full gap-3.5">
          <Button
            size="lg"
            className="rounded-full"
            onPress={() => router.push("/auth")}
            icon={<Sparkles size={18} color="#ffffff" />}
          >
            Preciso de um Profissional
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full"
            onPress={() => router.push("/auth")}
            iconRight={<ArrowRight size={18} color="#1c1917" />}
          >
            Quero Trabalhar e Receber no Pix
          </Button>
        </View>

        {/* Trust Items */}
        <View className="mt-8 w-full gap-2.5">
          {trustItems.map((item) => (
            <View key={item} className="flex-row items-center gap-1.5">
              <CircleCheck size={16} color="#059669" />
              <Text className="text-sm font-medium text-muted-foreground">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Métricas de Tração & Projeção */}
      <View className="mt-12 flex-row flex-wrap gap-4">
        {stats.map((stat) => (
          <View
            key={stat.label}
            className="flex-1 basis-[45%] items-center justify-center gap-1 rounded-3xl border border-border bg-white p-5"
          >
            <Text className="text-3xl font-extrabold tracking-tight text-primary">{stat.value}</Text>
            <Text className="text-center text-xs font-medium text-muted-foreground">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
