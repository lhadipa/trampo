import { Text, View } from "react-native";

type Variant = "default" | "secondary" | "outline";

const styles: Record<Variant, { box: string; text: string }> = {
  default: { box: "bg-primary", text: "text-primary-foreground" },
  secondary: { box: "bg-muted", text: "text-muted-foreground" },
  outline: { box: "border border-primary/30 bg-background", text: "text-primary" },
};

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) => (
  <View className={`self-start rounded-full px-2.5 py-1 ${styles[variant].box} ${className}`}>
    <Text className={`text-[10px] font-bold ${styles[variant].text}`}>{children}</Text>
  </View>
);
