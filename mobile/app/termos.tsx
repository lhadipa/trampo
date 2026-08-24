import { CheckCircle2, Scale, ShieldCheck } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

import { Card, CardContent } from "../src/components/ui/Card";
import { ScreenHeader } from "../src/components/ui/ScreenHeader";

/** Porte de src/pages/Terms.tsx. */
const autonomyPoints = [
  {
    title: "Inexistência de Subordinação Jurídica:",
    body: "O Trampô não exerce poder diretivo, disciplinar ou de fiscalização sobre os horários, rotinas ou execução dos serviços prestados. O profissional possui total autonomia para aceitar, recusar ou negociar demandas.",
  },
  {
    title: "Ausência de Habitualidade:",
    body: "Cada diária é contratada de forma eventual e independente, sem garantia ou obrigação de continuidade entre as partes.",
  },
  {
    title: "Autonomia de Preço e Agenda:",
    body: "O prestador define sua disponibilidade, seu raio de atendimento e negocia livremente o valor de cada serviço.",
  },
];

const sections = [
  {
    title: "2. Pagamento Protegido (Escrow)",
    body: "O valor acordado é retido em custódia pela plataforma antes do início do serviço e repassado ao prestador via Pix após a confirmação de conclusão. Esse mecanismo protege o contratante contra serviço não executado e o prestador contra inadimplência.",
  },
  {
    title: "3. Recibo de Prestação Autônoma (RPA)",
    body: "A cada serviço concluído, a plataforma disponibiliza um recibo digital para fins contábeis, documentando a natureza autônoma e eventual da prestação.",
  },
  {
    title: "4. Responsabilidades das Partes",
    body: "O contratante é responsável por fornecer condições adequadas de trabalho e as informações corretas sobre o serviço. O prestador é responsável pela qualidade técnica e pelo cumprimento do combinado. A plataforma atua exclusivamente como intermediadora tecnológica.",
  },
  {
    title: "5. Foro de Eleição",
    body: "Fica eleito o foro da comarca de São João del-Rei / MG para dirimir quaisquer controvérsias oriundas destes Termos.",
  },
];

export default function Termos() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Termos de Uso" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 20 }}>
        <View className="gap-3">
          <View className="flex-row items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1">
            <ShieldCheck size={14} color="#e85d04" />
            <Text className="text-xs font-semibold text-primary">Marco Jurídico e Termos de Uso</Text>
          </View>
          <Text className="text-3xl font-bold tracking-tight text-foreground">
            Termos de Uso, Mediação Tecnológica e Declaração de Autonomia
          </Text>
          <Text className="text-base leading-relaxed text-muted-foreground">
            Por favor, leia atentamente as disposições abaixo. Ao utilizar a plataforma você concorda
            expressa e integralmente com as condições aqui estabelecidas.
          </Text>
        </View>

        {/* Isenção trabalhista */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="gap-3 pt-6">
            <View className="flex-row items-center gap-2">
              <Scale size={20} color="#e85d04" />
              <Text className="flex-1 text-base font-bold text-primary">
                1. Natureza Jurídica da Plataforma e Ausência de Vínculo Empregatício
              </Text>
            </View>
            <Text className="text-sm leading-relaxed text-foreground/90">
              O Trampô é exclusivamente uma plataforma de tecnologia destinada à aproximação e
              intermediação de negócios entre Tomadores de Serviços (Empresas / Pessoas Físicas) e
              Prestadores de Serviços Autônomos / MEI, nos termos do Art. 442-B da CLT.
            </Text>

            <View className="gap-2 pt-1">
              {autonomyPoints.map((point) => (
                <View key={point.title} className="flex-row items-start gap-2">
                  <View className="mt-0.5">
                    <CheckCircle2 size={16} color="#e85d04" />
                  </View>
                  <Text className="flex-1 text-xs leading-relaxed text-muted-foreground">
                    <Text className="font-bold text-foreground">{point.title}</Text> {point.body}
                  </Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {sections.map((section) => (
          <Card key={section.title}>
            <CardContent className="gap-2">
              <Text className="text-lg font-bold text-foreground">{section.title}</Text>
              <Text className="text-sm leading-relaxed text-muted-foreground">{section.body}</Text>
            </CardContent>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
