import { FileCheck, ShieldCheck, UserPlus } from "lucide-react-native";
import { Text, View } from "react-native";

const steps = [
  {
    icon: UserPlus,
    title: "1. Publique ou Peça SOS",
    subtitle: "Em menos de 2 minutos",
    description:
      "Descreva o serviço (seja pintura, piscina, garçom, faxina ou elétrica) ou dispare o radar urgente para profissionais disponíveis agora.",
  },
  {
    icon: ShieldCheck,
    title: "2. Pagamento Protegido (Escrow)",
    subtitle: "Segurança total bilateral",
    description:
      "O valor da diária fica reservado em custódia segura. O prestador trabalha com a certeza do recebimento e o contratante só libera após o serviço concluído.",
  },
  {
    icon: FileCheck,
    title: "3. Check-in & Recibo Digital",
    subtitle: "Zero risco de vínculo CLT",
    description:
      "Comprovação de horário no local e emissão automática de Recibo de Prestação Autônoma (RPA) pronto para contabilidade e proteção jurídica.",
  },
];

export const HowItWorks = () => (
  <View className="bg-white/70 px-4 py-16">
    <View className="items-center">
      <Text className="text-xs font-semibold uppercase tracking-widest text-primary">
        Arquitetura Operacional
      </Text>
      <Text className="mt-3 text-center text-3xl font-bold tracking-tight text-foreground">
        Como o Trampô funciona na prática
      </Text>
      <Text className="mt-4 text-center text-base leading-relaxed text-muted-foreground">
        Eliminamos intermediários caros, o risco de calotes e a burocracia trabalhista através de
        tecnologia sob demanda.
      </Text>
    </View>

    <View className="mt-12 gap-8">
      {steps.map((step, index) => (
        <View
          key={step.title}
          className="items-center rounded-3xl border border-border bg-white p-8"
        >
          <View className="absolute -top-3.5 rounded-full bg-primary px-3 py-1">
            <Text className="text-xs font-bold text-primary-foreground">Passo {index + 1}</Text>
          </View>
          <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <step.icon size={32} color="#e85d04" />
          </View>
          <Text className="mt-4 text-center text-xl font-bold text-foreground">{step.title}</Text>
          <Text className="mt-1 text-xs font-semibold text-primary">{step.subtitle}</Text>
          <Text className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </Text>
        </View>
      ))}
    </View>
  </View>
);
