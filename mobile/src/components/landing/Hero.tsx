import { useRouter } from "expo-router";
import { ArrowRight, CircleCheck, Globe } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";

const trustItems = [
  "Pagamento 100% Garantido via Pix (Escrow)",
  "Profissionais Avaliados e Verificados",
  "Sem Burocracia e Sem Vínculo CLT",
  "Cobertura Nacional em Expansão",
];

const trendingServices = [
  "Pintor",
  "Limpador de Piscina",
  "Eletricista",
  "Garçom",
  "Diarista",
  "Montador de Móveis",
  "Manicure / Barbeiro",
  "Entregador",
];

const stats = [
  { value: "40+", label: "categorias de serviços" },
  { value: "R$ 0", label: "mensalidade para começar" },
  { value: "100%", label: "proteção financeira (Escrow)" },
];

export const Hero = () => {
  const router = useRouter();

  return (
    <View className="px-4 pb-16 pt-5">
      <View className="items-center">
        {/* Localização e expansão, no mesmo tratamento leve da landing web */}
        <View className="w-full flex-row items-start justify-center gap-2 px-1">
          <Globe size={15} color="#e85d04" />
          <Text className="flex-1 text-center text-xs font-medium leading-4 text-primary">
            Polo São João del-Rei & Região • Expansão para todo o Brasil
          </Text>
        </View>

        {/* Título Principal */}
        <Text className="mt-6 text-center text-4xl font-extrabold leading-10 tracking-tight text-foreground">
          O profissional ou serviço certo, <Text className="text-primary">na hora que você precisa.</Text>
        </Text>

        {/* Descrição Multi-Setor */}
        <Text className="mt-5 text-center text-base leading-6 text-muted-foreground">
          De pintores e limpadores de piscina a eletricistas, garçons e diaristas. Conectamos quem precisa de ajuda rápida a profissionais autônomos verificados, com pagamento seguro via Pix e recibo digital automático.
        </Text>

        {/* Tags de Serviços em Alta */}
        <View className="mt-5 flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Text className="text-xs font-semibold text-muted-foreground">Serviços em alta:</Text>
          {trendingServices.map((service) => (
            <Text
              key={service}
              className="text-xs font-medium text-foreground/75"
            >
              {service}  •
            </Text>
          ))}
        </View>

        {/* Botões de Ação CTA */}
        <View className="mt-8 w-full gap-3">
          <Button
            size="lg"
            className="h-11 rounded-lg px-4"
            onPress={() => router.push("/auth")}
          >
            Preciso de um Profissional
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 rounded-lg px-4"
            onPress={() => router.push("/auth")}
            iconRight={<ArrowRight size={18} color="#1c1917" />}
          >
            Quero Trabalhar e Receber no Pix
          </Button>
        </View>

        {/* Trust Items */}
        <View className="mt-8 w-full items-center gap-2.5">
          {trustItems.map((item) => (
            <View key={item} className="flex-row items-center gap-1.5">
              <CircleCheck size={16} color="#059669" />
              <Text className="text-xs font-medium text-muted-foreground">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Métricas de Tração & Projeção */}
      <View className="mt-12 flex-row flex-wrap gap-4">
        {stats.map((stat) => (
          <View
            key={stat.label}
            className="flex-1 basis-[45%] items-center justify-center gap-1 rounded-xl border border-border bg-white p-5"
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
