import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { DashboardAdmin } from "../src/screens/DashboardAdmin";
import { DashboardCompany } from "../src/screens/DashboardCompany";
import { DashboardFreelancer } from "../src/screens/DashboardFreelancer";
import { useAuth } from "../src/hooks/useAuth";

/** Porte de src/pages/Dashboard.tsx — mesma regra de roteamento por papel. */
export default function Painel() {
  const { profile, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background">
        <ActivityIndicator color="#e85d04" />
        <Text className="text-muted-foreground">Carregando...</Text>
      </View>
    );
  }

  if (!profile) return <Redirect href="/auth" />;
  if (isAdmin) return <DashboardAdmin />;
  if (profile.type === "empresa") return <DashboardCompany />;
  return <DashboardFreelancer />;
}
