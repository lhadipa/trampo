import { useRouter } from "expo-router";
import { ArrowRight, Check, Crown, Sparkles, Star } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";

const plans = [
  {
    id: "founder",
    name: "Membro Fundador VIP",
    audience: "PMEs, Residências e Pequenos Contratantes",
    description:
      "Aproveite 60 dias de acesso VIP completo sem mensalidade. Crie sua equipe favorita e teste na prática.",
    price: "Grátis",
    period: "por 60 dias",
    featured: true,
    badge: "Oferta de Expansão",
    icon: Sparkles,
    features: [
      "60 dias de acesso VIP 100% liberado",
      "Vagas e chamados ilimitados em qualquer categoria",
      "Recurso 'Minha Equipe Favorita'",
      "Chat direto e avaliações verificadas",
      "Garantia de pagamento seguro via Escrow Pix",
      "Emissão de Recibos Digitais de Prestação Autônoma",
    ],
    cta: "Garantir 60 Dias VIP",
  },
  {
    id: "pro",
    name: "Pro Negócio & Condomínios",
    audience: "Bares, Hotéis, Obras, Condomínios e Lojas",
    description:
      "A proteção contínua para sua operação ou imóvel. Menos de R$ 1,35/dia para nunca mais ficar desfalcado.",
    price: "R$ 39,90",
    period: "/mês pós-teste",
    featured: false,
    badge: "Seguro Operacional",
    icon: Crown,
    features: [
      "Vagas prioritárias ilimitadas",
      "Acesso completo ao banco nacional de autônomos",
      "Emissão ilimitada de Recibos (RPA) para contabilidade",
      "Selo de Empresa / Contratante Verificado",
      "Desconto exclusivo nos disparos do Radar SOS Turbo",
      "Suporte prioritário via WhatsApp",
    ],
    cta: "Conhecer Plano Pro",
  },
  {
    id: "freelancer",
    name: "Autônomo & Prestador",
    audience: "Pintores, Piscineiros, Garçons, Diaristas e Todos os Autônomos",
    description:
      "Trabalhe com liberdade de horários, receba pagamentos seguros no Pix e construa sua reputação.",
    price: "Grátis",
    period: "para sempre",
    featured: false,
    badge: "100% Gratuito",
    icon: Star,
    features: [
      "Candidaturas sem limite e sem custo de moedas",
      "Pagamento 100% protegido via Pix (Anti-Calote)",
      "Histórico de serviços e avaliações no perfil público",
      "Autonomia total de agenda, valores e aceites",
      "Emissão de comprovantes de renda profissional",
    ],
    cta: "Cadastrar como Profissional",
  },
];

export const Pricing = () => {
  const router = useRouter();

  return (
    <View className="bg-slate-50/70 px-4 py-16">
      <View className="items-center">
        <Text className="text-xs font-semibold uppercase tracking-widest text-primary">
          Planos & Monetização
        </Text>
        <Text className="mt-3 text-center text-3xl font-bold tracking-tight text-foreground">
          Comece grátis por 60 dias,{" "}
          <Text className="text-primary">cresça com segurança</Text>
        </Text>
        <Text className="mt-4 text-center text-base leading-relaxed text-muted-foreground">
          Modelo transparente sem taxas ocultas, com proteção total contra calotes e sem burocracia
          trabalhista.
        </Text>
      </View>

      <View className="mt-12 gap-8">
        {plans.map((plan) => (
          <View
            key={plan.id}
            className={`rounded-3xl border bg-white p-8 ${
              plan.featured ? "border-primary" : "border-border"
            }`}
          >
            <View
              className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 ${
                plan.featured ? "bg-primary" : "bg-secondary"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  plan.featured ? "text-primary-foreground" : "text-secondary-foreground"
                }`}
              >
                {plan.badge}
              </Text>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <plan.icon size={24} color="#e85d04" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground">{plan.name}</Text>
                <Text className="text-xs text-muted-foreground">{plan.audience}</Text>
              </View>
            </View>

            <Text className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {plan.description}
            </Text>

            <View className="mt-6 flex-row items-baseline gap-1">
              <Text className="text-4xl font-extrabold tracking-tight text-foreground">
                {plan.price}
              </Text>
              <Text className="text-sm font-medium text-muted-foreground">{plan.period}</Text>
            </View>

            <View className="mt-8 gap-3">
              {plan.features.map((feature) => (
                <View key={feature} className="flex-row items-start gap-2.5">
                  <View className="mt-0.5">
                    <Check size={16} color="#059669" />
                  </View>
                  <Text className="flex-1 text-sm text-foreground/90">{feature}</Text>
                </View>
              ))}
            </View>

            <Button
              size="lg"
              variant={plan.featured ? "default" : "outline"}
              className="mt-8 rounded-full"
              onPress={() => router.push("/auth")}
              iconRight={<ArrowRight size={16} color={plan.featured ? "#ffffff" : "#1c1917"} />}
            >
              {plan.cta}
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};
