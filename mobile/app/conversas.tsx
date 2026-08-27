import { useRouter } from "expo-router";
import { MessageSquare } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Card, CardContent } from "../src/components/ui/Card";
import { ScreenHeader } from "../src/components/ui/ScreenHeader";
import { EmptyState } from "../src/components/ui/Tabs";
import { useAuth } from "../src/hooks/useAuth";
import { api } from "../src/lib/api";

/** Porte de src/pages/Conversations.tsx. */
export default function Conversas() {
  const router = useRouter();
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await api
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });

      setConversations(data || []);
    })();
  }, [profile]);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Conversas" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
        {conversations.length === 0 ? (
          <EmptyState
            title="Nenhuma conversa ainda"
            description="Ao entrar em contato com um profissional, a conversa aparece aqui."
            icon={<MessageSquare size={24} color="#e85d04" />}
          />
        ) : (
          conversations.map((conversation) => (
            <Pressable
              key={conversation.id}
              onPress={() => router.push(`/chat/${conversation.id}`)}
            >
              <Card>
                <CardContent className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Text className="text-sm font-bold text-primary">
                      {(conversation.name || "Trampô")
                        .split(" ")
                        .slice(0, 2)
                        .map((part: string) => part[0])
                        .join("")}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                      {conversation.name || "Conversa"}
                    </Text>
                    <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                      {conversation.category || ""}
                    </Text>
                    <Text className="mt-1 text-xs text-muted-foreground" numberOfLines={1}>
                      {conversation.preview || "Toque para abrir a conversa"}
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
