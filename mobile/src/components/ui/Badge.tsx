import { Text, View } from "react-native";

type Variant = "default" | "secondary" | "outline" | "destructive";

const styles: Record<Variant, { box: string; text: string }> = {
  default: { box: "", text: "text-primary" },
  secondary: { box: "", text: "text-muted-foreground" },
  outline: { box: "border-b border-primary/30", text: "text-primary" },
  destructive: { box: "", text: "text-destructive" },
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
  <View className={`self-start ${styles[variant].box} ${className}`}>
    <Text className={`text-[10px] font-semibold ${styles[variant].text}`}>{children}</Text>
  </View>
);
