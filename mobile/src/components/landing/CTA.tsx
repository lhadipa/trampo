import { useRouter } from "expo-router";
import { ArrowRight, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";

export const CTA = () => {
  const router = useRouter();

  return (
    <View className="px-4 py-16">
      <View className="items-center overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/5 px-6 py-14">
        <View className="mb-4 flex-row items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
          <Sparkles size={13} color="#e85d04" />
          <Text className="text-xs font-semibold uppercase tracking-wider text-primary">
            Faça Parte da Revolução do Trabalho
          </Text>
        </View>
        <Text className="text-center text-3xl font-extrabold tracking-tight text-foreground">
          Pronto para contratar ou faturar sem burocracia?
        </Text>
        <Text className="mt-4 text-center text-base leading-relaxed text-muted-foreground">
          Junte-se a milhares de contratantes, residências, condomínios, estabelecimentos e
          prestadores de todo o Brasil com{" "}
          <Text className="font-bold text-foreground">60 dias de Membro VIP 100% gratuitos</Text>.
        </Text>
        <View className="mt-8 w-full gap-3.5">
          <Button
            size="lg"
            className="rounded-full"
            onPress={() => router.push("/auth")}
            iconRight={<ArrowRight size={18} color="#ffffff" />}
          >
            Garantir 60 Dias Grátis VIP
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full"
            onPress={() => router.push("/auth")}
          >
            Quero Trabalhar como Autônomo
          </Button>
        </View>
      </View>
    </View>
  );
};
