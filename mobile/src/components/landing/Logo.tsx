import { Image, View } from "react-native";

/** Logo oficial compartilhado com a aplicação web. */
export const Logo = ({ size = 36 }: { size?: number }) => (
  <View className="flex-row items-center">
    <Image source={require("../../assets/logo.png")} style={{ width: size * 2.75, height: size }} resizeMode="contain" accessibilityLabel="Trampô" />
  </View>
);
