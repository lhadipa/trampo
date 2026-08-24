import { View } from "react-native";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View className={`rounded-3xl border border-border/70 bg-card ${className}`}>{children}</View>
);

export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <View className={`p-4 ${className}`}>{children}</View>;
