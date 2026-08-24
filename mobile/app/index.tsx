import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-primary">Trampô</Text>
      <Text className="mt-2 text-sm text-muted-foreground">verificando bundling…</Text>
    </View>
  );
}
