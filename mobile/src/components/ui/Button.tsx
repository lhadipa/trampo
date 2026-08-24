import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Variant = "default" | "outline" | "ghost" | "secondary" | "hero";
type Size = "sm" | "default" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const containerByVariant: Record<Variant, string> = {
  default: "bg-primary active:opacity-90",
  hero: "bg-primary active:opacity-90",
  secondary: "bg-secondary active:opacity-90",
  outline: "border border-border bg-white active:bg-muted",
  ghost: "active:bg-muted",
};

const textByVariant: Record<Variant, string> = {
  default: "text-primary-foreground",
  hero: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  outline: "text-foreground",
  ghost: "text-muted-foreground",
};

const containerBySize: Record<Size, string> = {
  sm: "h-9 px-3.5",
  default: "h-11 px-5",
  lg: "h-13 px-8",
};

const textBySize: Record<Size, string> = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
};

export const Button = ({
  children,
  onPress,
  variant = "default",
  size = "default",
  disabled,
  loading,
  className = "",
  textClassName = "",
  icon,
  iconRight,
}: ButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    accessibilityRole="button"
    className={`flex-row items-center justify-center gap-2 rounded-xl ${containerByVariant[variant]} ${containerBySize[size]} ${
      disabled || loading ? "opacity-60" : ""
    } ${className}`}
  >
    {loading ? (
      <ActivityIndicator size="small" color={variant === "outline" || variant === "ghost" ? "#78716c" : "#ffffff"} />
    ) : (
      <>
        {icon ? <View>{icon}</View> : null}
        <Text className={`font-bold ${textByVariant[variant]} ${textBySize[size]} ${textClassName}`}>
          {children}
        </Text>
        {iconRight ? <View>{iconRight}</View> : null}
      </>
    )}
  </Pressable>
);
