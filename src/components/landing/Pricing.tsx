import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  Eye,
  Heart,
  Users,
  Building2,
  Shield,
  Star,
  CalendarCheck,
  MessageSquare,
  Lock,
} from "lucide-react";

const plans = [
  {
    name: "Avulso",
    icon: Eye,
    price: "R$ 0",
    period: "grátis pra começar",
    description: "Pague só quando usar. Sem mensalidade.",
    features: [
      "Ver contato: R$ 5–10",
      "Convidar favorito: R$ 3",
      "Perfil da empresa",
      "Ideal pra quem contrata pouco",
    ],
    highlight: false,
    cta: "Começar grátis",
  },
  {
    name: "Básico",
    icon: Building2,
    price: "R$ 39",
    period: "/mês",
    description: "Pra quem contrata com frequência.",
    features: [
      "20 convites inclusos/mês",
      "Ver contatos inclusos",
      "Equipe favorita",
      "Selo de empresa verificada",
      "Histórico e avaliações",
      "Suporte por e-mail",
    ],
    highlight: true,
    cta: "Assinar agora",
  },
  {
    name: "Profissional",
    icon: Users,
    price: "R$ 79",
    period: "/mês",
    description: "Pra operações com alto volume.",
    features: [
      "Convites ilimitados",
      "Contatos ilimitados",
      "Destaque nas vagas",
      "Equipe favorita ilimitada",
      "Relatórios e painel",
      "Suporte prioritário",
    ],
    highlight: false,
    cta: "Falar com vendas",
  },
];

const retentionFeatures = [
  {
    icon: Star,
    title: "Histórico e Avaliações",
    description: "Cada trabalho gera avaliação. Empresas veem quem é confiável. Fora do app, perde tudo.",
  },
  {
    icon: CalendarCheck,
    title: "Disponibilidade em tempo real",
    description: "Veja quem está livre naquele dia. Sem ligações, sem espera.",
  },
  {
    icon: Shield,
    title: "Segurança contra calote",
    description: "Pagamentos registrados, contratos claros. Proteção pra quem contrata e pra quem trabalha.",
  },
  {
    icon: MessageSquare,
    title: "Chat interno primeiro",
    description: "Telefone só aparece após pagamento ou contratação confirmada. Protege ambos os lados.",
  },
];

const revenueItems = [
  { label: "Liberar contato", value: "R$ 5–10", detail: "por contato" },
  { label: "Convite para favorito", value: "R$ 2–3", detail: "por convite" },
  { label: "Destaque de vaga", value: "R$ 8", detail: "por vaga" },
  { label: "Plano empresarial", value: "R$ 39–79", detail: "por mês" },
];

const Pricing = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">
            Planos & Preços
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            O app que vira sua{" "}
            <span className="text-gradient">agenda de equipe</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Trabalhadores usam grátis. Empresas pagam por uso ou assinam um plano.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-primary shadow-warm ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="gradient-hero text-secondary-foreground text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    Mais popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      plan.highlight ? "gradient-hero" : "bg-muted"
                    }`}
                  >
                    <plan.icon
                      className={`h-4 w-4 ${
                        plan.highlight ? "text-secondary-foreground" : "text-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.highlight ? "hero" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* How the app retains users */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Por que empresas ficam no app 🔒
            </h3>
            <p className="text-muted-foreground">
              Benefícios que só existem dentro da plataforma.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {retentionFeatures.map((feat) => (
              <Card key={feat.title} className="border-border hover:border-primary/30 transition-colors group">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground text-sm block">{feat.title}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Revenue summary */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-secondary text-secondary-foreground">
            <CardContent className="py-8 px-6 sm:px-10">
              <h3 className="text-center text-lg font-bold mb-6 text-secondary-foreground">
                Como o TrampoJá ganha ⚡
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {revenueItems.map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-2xl font-bold text-primary">{item.value}</p>
                    <p className="text-sm text-secondary-foreground/70 mt-1">{item.label}</p>
                    <p className="text-xs text-secondary-foreground/40">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
