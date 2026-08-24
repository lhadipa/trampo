import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Logo } from "./Logo";

export const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="border-b border-border/60 bg-background/95"
    >
      <View className="h-16 flex-row items-center justify-between px-4">
        <Logo size={32} />
        <View className="flex-row items-center gap-2">
          <Button variant="ghost" size="sm" onPress={() => router.push(user ? "/painel" : "/auth")}>
            {user ? "Meu Painel" : "Entrar"}
          </Button>
          <Button size="sm" onPress={() => router.push(user ? "/painel" : "/auth")}>
            {user ? "Painel" : "Cadastrar-se"}
          </Button>
        </View>
      </View>
    </View>
  );
};
