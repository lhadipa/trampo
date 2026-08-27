import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Faixa avisando que o build e' de demonstracao e que os pagamentos sao
 * simulados. Controlada por EXPO_PUBLIC_ENV=demo (definida nos perfis do
 * eas.json), entao some sozinha em um build de producao real.
 */
export default function DemoBanner() {
  // O banner fica acima do Stack, entao respeita a status bar por conta propria.
  const insets = useSafeAreaInsets();
  if (process.env.EXPO_PUBLIC_ENV !== "demo") return null;

  return (
    <View className="bg-amber-500 px-3 pb-1.5" style={{ paddingTop: insets.top + 6 }}>
      <Text className="text-center text-[11px] font-medium text-amber-950">
        Demonstração — pagamentos simulados, nenhum valor real é cobrado.
      </Text>
    </View>
  );
}
