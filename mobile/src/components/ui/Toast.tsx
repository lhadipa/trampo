import { CircleCheck, CircleX, Info } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Substituto do `sonner` da web: mesma chamada `toast.success(msg, { description })`,
 * para que as telas portadas nao precisem mudar.
 */

type ToastKind = "success" | "error" | "info";
type ToastPayload = { kind: ToastKind; message: string; description?: string };

let emit: ((payload: ToastPayload) => void) | null = null;

const push = (kind: ToastKind) => (message: string, options?: { description?: string }) =>
  emit?.({ kind, message, description: options?.description });

export const toast = {
  success: push("success"),
  error: push("error"),
  info: push("info"),
};

const palette: Record<ToastKind, { border: string; Icon: typeof CircleCheck; color: string }> = {
  success: { border: "border-emerald-500/40", Icon: CircleCheck, color: "#059669" },
  error: { border: "border-destructive/40", Icon: CircleX, color: "#dc2626" },
  info: { border: "border-primary/40", Icon: Info, color: "#e85d04" },
};

export const Toaster = () => {
  const [current, setCurrent] = useState<ToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    emit = (payload) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setCurrent(payload);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      hideTimer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(
          ({ finished }) => finished && setCurrent(null),
        );
      }, 3200);
    };
    return () => {
      emit = null;
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [opacity]);

  if (!current) return null;
  const { border, Icon, color } = palette[current.kind];

  return (
    <Animated.View
      pointerEvents="none"
      style={{ opacity, top: insets.top + 8 }}
      className="absolute left-4 right-4 z-50"
    >
      <View className={`flex-row items-start gap-2.5 rounded-2xl border ${border} bg-card p-3.5 shadow-lg`}>
        <Icon size={18} color={color} />
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground">{current.message}</Text>
          {current.description ? (
            <Text className="mt-0.5 text-xs text-muted-foreground">{current.description}</Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
};
