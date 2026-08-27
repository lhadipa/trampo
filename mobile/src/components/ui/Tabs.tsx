import { ScrollView, Text, View } from "react-native";
import { Pressable } from "react-native";

export interface TabItem {
  value: string;
  label: string;
  Icon?: any;
  iconColor?: string;
}

/**
 * Equivalente das Tabs do shadcn. No web sao 4-5 colunas fixas; num telefone isso
 * espremeria os rotulos, entao a lista rola horizontalmente mantendo os mesmos itens.
 */
export const Tabs = ({
  items,
  value,
  onChange,
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <View className="border-b border-border bg-transparent">
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-5">
        {items.map((item) => {
          const active = item.value === value;
          return (
            <Pressable
              key={item.value}
              onPress={() => onChange(item.value)}
              className={`flex-row items-center gap-1.5 border-b-2 px-1 py-2.5 ${
                active ? "border-primary" : "border-transparent"
              }`}
            >
              {item.Icon ? (
                <item.Icon size={15} color={item.iconColor ?? (active ? "#1c1917" : "#78716c")} />
              ) : null}
              <Text
                className={`text-xs font-semibold ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  </View>
);

export const EmptyState = ({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) => (
  <View className="items-center gap-3 rounded-xl border border-dashed border-border py-12">
    {icon ? (
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">{icon}</View>
    ) : null}
    <Text className="text-base font-bold text-foreground">{title}</Text>
    {description ? (
      <Text className="max-w-xs text-center text-xs text-muted-foreground">{description}</Text>
    ) : null}
  </View>
);
