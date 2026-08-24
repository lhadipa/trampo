import { useLocalSearchParams } from "expo-router";
import { Send, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { Input } from "../../src/components/ui/Input";
import { ScreenHeader } from "../../src/components/ui/ScreenHeader";
import { useAuth } from "../../src/hooks/useAuth";

/** Porte de src/pages/Chat.tsx. */
type Message = { id: string; mine: boolean; content: string; time: string };

const seedMessages: Message[] = [
  {
    id: "m1",
    mine: false,
    content: "Boa tarde! Vi sua vaga de pintura. Consigo passar aí amanhã pela manhã.",
    time: "14:02",
  },
  { id: "m2", mine: true, content: "Perfeito! Que horas você chega?", time: "14:05" },
  {
    id: "m3",
    mine: false,
    content: "Por volta das 8h. Levo rolo e lixa, a tinta fica por sua conta, combinado?",
    time: "14:06",
  },
];

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");

  const send = () => {
    const content = draft.trim();
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${prev.length + 1}`,
        mine: true,
        content,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={`Conversa ${id ? `#${String(id).slice(0, 6)}` : ""}`} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        <View className="flex-row items-center gap-2.5 border-b border-border/60 bg-emerald-500/5 px-4 py-3">
          <ShieldCheck size={18} color="#059669" />
          <Text className="flex-1 text-xs text-muted-foreground">
            Combine tudo pelo chat. O pagamento fica protegido em custódia até a conclusão.
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {messages.map((message) => (
            <View
              key={message.id}
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                message.mine ? "self-end bg-primary" : "self-start bg-muted"
              }`}
            >
              <Text
                className={`text-sm ${message.mine ? "text-primary-foreground" : "text-foreground"}`}
              >
                {message.content}
              </Text>
              <Text
                className={`mt-1 text-[10px] ${
                  message.mine ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {message.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="flex-row items-center gap-2 border-t border-border bg-background p-3">
          <View className="flex-1">
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder={`Mensagem como ${profile?.name?.split(" ")[0] || "você"}...`}
            />
          </View>
          <Pressable
            onPress={send}
            className="h-11 w-11 items-center justify-center rounded-xl bg-primary active:opacity-90"
          >
            <Send size={18} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
