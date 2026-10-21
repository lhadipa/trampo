import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Menu } from "lucide-react-native";
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
      className="border-b border-border/60 bg-background"
    >
      <View className="h-14 flex-row items-center justify-between px-4">
        <Logo size={34} />
        <View className="flex-row items-center gap-3">
          <Button size="sm" className="h-9 rounded-md px-3.5" onPress={() => router.push(user ? "/painel" : "/auth")}>
            Painel
          </Button>
          <Pressable
            className="h-9 w-8 items-center justify-center"
            onPress={() => router.push(user ? "/painel" : "/auth")}
            accessibilityRole="button"
            accessibilityLabel="Abrir menu"
          >
            <Menu size={21} color="#78716c" strokeWidth={1.8} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
