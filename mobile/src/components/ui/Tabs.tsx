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
  <View className="rounded-2xl bg-muted/60 p-1">
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-1">
        {items.map((item) => {
          const active = item.value === value;
          return (
            <Pressable
              key={item.value}
              onPress={() => onChange(item.value)}
              className={`flex-row items-center gap-1.5 rounded-xl px-3.5 py-2.5 ${
                active ? "bg-background" : ""
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
  <View className="items-center gap-3 rounded-3xl border border-dashed border-border py-12">
    {icon ? (
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">{icon}</View>
    ) : null}
    <Text className="text-base font-bold text-foreground">{title}</Text>
    {description ? (
      <Text className="max-w-xs text-center text-xs text-muted-foreground">{description}</Text>
    ) : null}
  </View>
);
