import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, Check, Zap, Building2, Crown, TrendingUp, Rocket, BadgeCheck, Wallet } from "lucide-react";

const plans = [
  {
    name: "Básico",
    icon: Zap,
    price: "R$ 39",
    period: "/mês",
    description: "Pra quem contrata de vez em quando.",
    features: [
      "Até 5 vagas por mês",
      "Acesso a candidatos da região",
      "Perfil da empresa",
      "Suporte por e-mail",
    ],
    taxLabel: "10% por trabalho fechado",
    highlight: false,
    cta: "Começar agora",
  },
  {
    name: "Profissional",
    icon: Building2,
    price: "R$ 89",
    period: "/mês",
    description: "Pra empresas que contratam com frequência.",
    features: [
      "Vagas ilimitadas",
      "Destaque no app",
      "Acesso aos melhores trabalhadores",
      "Selo de empresa verificada",
      "Painel de gestão",
      "Suporte prioritário",
    ],
    taxLabel: "10% por trabalho fechado",
    highlight: true,
    cta: "Assinar agora",
  },
  {
    name: "Premium",
    icon: Crown,
    price: "R$ 149",
    period: "/mês",
    description: "Pra operações que precisam de escala e prioridade.",
    features: [
      "Tudo do Profissional",
      "Prioridade nas respostas",
      "Perfil verificado premium",
      "Suporte rápido dedicado",
      "Relatórios avançados",
      "Contratação em lote",
    ],
    taxLabel: "10% por trabalho fechado",
    highlight: false,
    cta: "Falar com vendas",
  },
];

const revenueStreams = [
  {
    icon: TrendingUp,
    title: "Taxa por Serviço",
    subtitle: "10% por trabalho fechado",
    example: "Empresa paga R$120 → App ganha R$12",
    detail: "1.200 trabalhos/mês × R$120 = R$14.400/mês",
  },
  {
    icon: Rocket,
    title: "Boost de Vagas",
    subtitle: "Destaque pago no feed",
    example: "Destaque: R$10 · Topo do feed: R$20",
    detail: "Quanto mais vagas, mais boosts vendidos",
  },
  {
    icon: BadgeCheck,
    title: "Verificação Premium",
    subtitle: "Selo verificado pro trabalhador",
    example: "R$9,90/mês por perfil verificado",
    detail: "Aumenta confiança e taxa de contratação",
  },
  {
    icon: Wallet,
    title: "Taxa de Saque",
    subtitle: "Saque imediato pelo app",
    example: "R$3 a R$5 por saque instantâneo",
    detail: "Modelo usado por Uber, iFood e 99",
  },
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
            Escolha o plano ideal pro seu{" "}
            <span className="text-gradient">negócio</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Assinatura mensal + taxa só quando o trabalho é feito. Sem surpresas.
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

                <div className="rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-sm text-accent font-medium">
                  + {plan.taxLabel}
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

        {/* Revenue Streams */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Como o TrampoJá ganha ⚡
            </h3>
            <p className="text-muted-foreground">
              4 fontes de receita que escalam junto com a plataforma.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueStreams.map((stream) => (
              <Card
                key={stream.title}
                className="border-border hover:border-primary/30 transition-colors group"
              >
                <CardContent className="pt-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <stream.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-sm block">{stream.title}</span>
                    <span className="text-primary text-xs font-semibold">{stream.subtitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stream.example}</p>
                  <p className="text-xs text-muted-foreground/70 italic">{stream.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Projection callout */}
        <div className="max-w-3xl mx-auto mt-16">
          <Card className="border-primary/20 bg-secondary text-secondary-foreground">
            <CardContent className="py-8 px-6 sm:px-10">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">R$ 14.400</p>
                  <p className="text-sm text-secondary-foreground/60 mt-1">Taxa por serviço/mês</p>
                  <p className="text-xs text-secondary-foreground/40">1.200 trabalhos × R$120</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">R$ 8.900</p>
                  <p className="text-sm text-secondary-foreground/60 mt-1">Assinaturas/mês</p>
                  <p className="text-xs text-secondary-foreground/40">100 empresas × R$89</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">R$ 23.300+</p>
                  <p className="text-sm text-secondary-foreground/60 mt-1">Receita total estimada</p>
                  <p className="text-xs text-secondary-foreground/40">Sem contar boosts e saques</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
