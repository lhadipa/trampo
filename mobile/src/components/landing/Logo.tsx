import { Text, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

/** Porte do logo SVG da web (src/components/landing/Logo.tsx). */
export const Logo = ({ size = 36 }: { size?: number }) => (
  <View className="flex-row items-center gap-2.5">
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Rect x="1" y="1" width="34" height="34" rx="11" fill="#E85D04" />
      <Circle cx="18" cy="18" r="7" fill="#FFFFFF" fillOpacity={0.96} />
      <Circle cx="18" cy="17" r="2.2" fill="#E85D04" />
    </Svg>
    <View className="flex-row items-start">
      <Text className="text-xl font-bold tracking-tight text-foreground">Tramp</Text>
      <View>
        <View className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
        <Text className="text-xl font-bold tracking-tight text-primary">ô</Text>
      </View>
    </View>
  </View>
);
