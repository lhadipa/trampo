import { useRouter } from "expo-router";
import {
  ArrowRight,
  CheckCircle2,
  Paintbrush,
  PartyPopper,
  Scissors,
  Sparkles,
  Truck,
  Utensils,
  Waves,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { SERVICE_CATEGORIES } from "../../lib/categories";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const iconMap: Record<string, any> = {
  Paintbrush,
  Waves,
  Utensils,
  PartyPopper,
  Scissors,
  Truck,
};

export const Categories = () => {
  const router = useRouter();
  const [selectedCatId, setSelectedCatId] = useState<string>(SERVICE_CATEGORIES[0].id);

  const activeCategory =
    SERVICE_CATEGORIES.find((c) => c.id === selectedCatId) || SERVICE_CATEGORIES[0];
  const ActiveIcon = iconMap[activeCategory.iconName] || Paintbrush;

  return (
    <View className="bg-slate-50/50 px-4 py-16">
      <View className="items-center">
        <View className="flex-row items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
          <Sparkles size={13} color="#e85d04" />
          <Text className="text-xs font-semibold uppercase tracking-wider text-primary">
            Ecossistema Multi-Serviços
          </Text>
        </View>
        <Text className="mt-3 text-center text-3xl font-bold tracking-tight text-foreground">
          Encontre especialistas para qualquer necessidade
        </Text>
        <Text className="mt-4 text-center text-base leading-relaxed text-muted-foreground">
          De residências e condomínios a bares, obras e eventos. Uma plataforma única com prestadores
          avaliados e diárias transparentes.
        </Text>
      </View>

      {/* Grade de Categorias Principais */}
      <View className="mt-10 gap-4">
        {SERVICE_CATEGORIES.map((category) => {
          const IconComponent = iconMap[category.iconName] || Paintbrush;
          const isSelected = category.id === selectedCatId;

          return (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCatId(category.id)}
              className={`rounded-3xl border bg-white p-6 ${
                isSelected ? "border-primary" : "border-border"
              }`}
            >
              <View className="mb-4 flex-row items-center justify-between">
                <View
                  className={`h-12 w-12 items-center justify-center rounded-2xl ${
                    isSelected ? "bg-primary" : "bg-primary/10"
                  }`}
                >
                  <IconComponent size={24} color={isSelected ? "#ffffff" : "#e85d04"} />
                </View>
                <Badge variant={isSelected ? "default" : "secondary"}>{category.badge}</Badge>
              </View>

              <Text className="text-lg font-bold text-foreground">{category.name}</Text>
              <Text className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </Text>

              <View className="mt-6 flex-row items-center justify-between border-t border-border/50 pt-4">
                <Text className="text-xs font-semibold text-muted-foreground">
                  Média diária:{" "}
                  <Text className="font-bold text-foreground">{category.avgDailyRate}</Text>
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-bold text-primary">Ver serviços</Text>
                  <ArrowRight size={13} color="#e85d04" />
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Detalhes da Categoria Selecionada */}
      <View className="mt-8 rounded-3xl border border-primary/20 bg-white p-6">
        <View className="gap-4 border-b border-border pb-6">
          <View className="flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <ActiveIcon size={28} color="#e85d04" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-foreground">
                Especialidades em {activeCategory.name}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Profissionais prontos para atender você com garantia de serviço e Pix protegido.
              </Text>
            </View>
          </View>
          <Button
            className="rounded-full"
            onPress={() => router.push("/auth")}
            iconRight={<ArrowRight size={16} color="#ffffff" />}
          >
            Chamar Profissional Agora
          </Button>
        </View>

        <View className="mt-6 gap-3">
          {activeCategory.subservices.map((sub) => (
            <View
              key={sub}
              className="flex-row items-center gap-2.5 rounded-xl border border-border/50 bg-slate-50/80 p-3"
            >
              <CheckCircle2 size={16} color="#059669" />
              <Text className="flex-1 text-sm font-medium text-foreground">{sub}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
