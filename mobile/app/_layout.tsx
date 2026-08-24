import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Toaster } from "../src/components/ui/Toast";
import { AuthProvider } from "../src/hooks/useAuth";
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "hsl(60 11% 98%)" },
              animation: "slide_from_right",
            }}
          />
          <Toaster />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
