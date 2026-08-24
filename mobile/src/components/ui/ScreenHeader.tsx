import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Cabecalho das telas internas. No web a volta e' o botao do navegador; no
 * mobile ela precisa ser explicita, entao toda subpagina ganha esta barra.
 */
export const ScreenHeader = ({ title }: { title: string }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="border-b border-border/60 bg-background"
    >
      <View className="h-14 flex-row items-center gap-3 px-4">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          hitSlop={10}
          className="rounded-lg p-1"
        >
          <ArrowLeft size={22} color="#1c1917" />
        </Pressable>
        <Text className="flex-1 text-base font-bold text-foreground" numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};
