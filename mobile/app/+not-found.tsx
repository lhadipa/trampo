import { useRouter } from "expo-router";
import { Compass } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "../src/components/ui/Button";

/** Porte de src/pages/NotFound.tsx. */
export default function NotFound() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-8">
      <View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
        <Compass size={32} color="#e85d04" />
      </View>
      <Text className="text-2xl font-extrabold text-foreground">Página não encontrada</Text>
      <Text className="text-center text-sm text-muted-foreground">
        O endereço que você tentou abrir não existe neste app.
      </Text>
      <Button className="rounded-full" onPress={() => router.replace("/")}>
        Voltar para o início
      </Button>
    </View>
  );
}
