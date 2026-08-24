import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Logo } from "./Logo";

const footerGroups = [
  {
    title: "Plataforma",
    links: [
      { label: "Cadastrar-se Grátis", href: "/auth" },
      { label: "Entrar na Conta", href: "/auth" },
      { label: "Radar SOS Turbo", href: "/urgente" },
    ],
  },
  {
    title: "Contratantes & PMEs",
    links: [
      { label: "Publicar Vaga / Diária", href: "/criar-vaga" },
      { label: "Painel de Gestão", href: "/painel" },
      { label: "Recibos & Conformidade RPA", href: "/termos" },
    ],
  },
  {
    title: "Prestadores & Autônomos",
    links: [
      { label: "Painel do Profissional", href: "/painel" },
      { label: "Agenda & Disponibilidade", href: "/disponibilidade" },
      { label: "Garantia Pix Anti-Calote", href: "/termos" },
    ],
  },
];

export const Footer = () => {
  const router = useRouter();

  return (
    <View className="border-t border-border bg-background px-4 py-12">
      <View className="gap-10">
        <View className="gap-4">
          <Logo />
          <Text className="text-sm leading-relaxed text-muted-foreground">
            A infraestrutura digital de contratação rápida para pintores, piscineiros, garçons,
            eletricistas, diaristas e dezenas de especialidades. Conectando pessoas e negócios em
            todo o Brasil.
          </Text>
        </View>

        {footerGroups.map((group) => (
          <View key={group.title}>
            <Text className="text-sm font-bold text-foreground">{group.title}</Text>
            <View className="mt-4 gap-3">
              {group.links.map((link) => (
                <Pressable key={link.label} onPress={() => router.push(link.href as any)}>
                  <Text className="text-sm text-muted-foreground">{link.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View className="my-8 h-px bg-border" />

      <View className="gap-4">
        <Text className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Trampô Tecnologia. Todos os direitos reservados. Brasil 🇧🇷
        </Text>
        <Pressable onPress={() => router.push("/termos")}>
          <Text className="text-xs text-muted-foreground">
            Termos de Uso & Autonomia (Art. 442-B CLT)
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push("/termos")}>
          <Text className="text-xs text-muted-foreground">Privacidade & Garantia Escrow</Text>
        </Pressable>
      </View>
    </View>
  );
};
