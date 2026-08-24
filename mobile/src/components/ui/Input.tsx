import { Text, TextInput, View } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words";
  multiline?: boolean;
  className?: string;
}

export const Input = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline,
  className = "",
}: InputProps) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#a8a29e"
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize={autoCapitalize}
    multiline={multiline}
    className={`rounded-xl border border-input bg-background px-3.5 text-sm text-foreground ${
      multiline ? "min-h-[88px] py-3" : "h-11"
    } ${className}`}
    style={multiline ? { textAlignVertical: "top" } : undefined}
  />
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-sm font-semibold text-foreground">{children}</Text>
);

export const Field = ({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) => (
  <View className="gap-2">
    <Label>{label}</Label>
    {children}
  </View>
);
