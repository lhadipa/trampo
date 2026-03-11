import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, Check, Zap, Building2, Crown, Eye, Rocket, Star } from "lucide-react";

const plans = [
  {
    name: "Avulso",
    icon: Eye,
    price: "R$ 5–10",
    period: "/contato",
    description: "Pague só quando precisar ver um contato.",
    features: [
      "Libere contatos sob demanda",
      "Sem mensalidade",
      "Perfil da empresa",
      "Ideal pra quem contrata pouco",
    ],
    highlight: false,
    cta: "Começar grátis",
  },
  {
    name: "Profissional",
    icon: Building2,
    price: "R$ 39",
    period: "/mês",
    description: "Pra quem contrata com frequência.",
    features: [
      "Contatos inclusos no plano",
      "Vagas ilimitadas",
      "Destaque no app",
      "Selo de empresa verificada",
      "Painel de gestão",
      "Suporte prioritário",
    ],
    highlight: true,
    cta: "Assinar agora",
  },
  {
    name: "Premium",
    icon: Crown,
    price: "R$ 89",
    period: "/mês",
    description: "Pra operações com alto volume de contratação.",
    features: [
      "Tudo do Profissional",
      "Contatos ilimitados",
      "Prioridade nas respostas",
      "Perfil verificado premium",
      "Suporte dedicado",
      "Relatórios avançados",
    ],
    highlight: false,
    cta: "Falar com vendas",
  },
];

const revenueStreams = [
  {
    icon: Eye,
    title: "Contato Pago",
    subtitle: "R$ 5 a R$ 10 por contato",
    description: "Empresa paga para ver o contato do trabalhador. Gera receita imediata, sem depender do trabalho acontecer.",
    tag: "Principal",
  },
  {
    icon: Zap,
    title: "Assinatura Mensal",
    subtitle: "A partir de R$ 39/mês",
    description: "Plano recorrente com contatos inclusos, vagas ilimitadas e destaque. Receita previsível todo mês.",
    tag: "Recorrência",
  },
  {
    icon: Rocket,
    title: "Destaque de Vagas",
    subtitle: "R$ 8 por destaque",
    description: "Empresa paga para a vaga aparecer primeiro no feed. Receita complementar que escala com o volume.",
    tag: "Extra",
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
            Modelo simples, feito pra{" "}
            <span className="text-gradient">escalar</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Pague por contato ou assine um plano mensal. Sem surpresas, sem taxa escondida.
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

        {/* Revenue Streams */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Como o TrampoJá ganha ⚡
            </h3>
            <p className="text-muted-foreground">
              3 fontes de receita com pouca fricção, feitas pra funcionar até em cidades menores.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {revenueStreams.map((stream) => (
              <Card
                key={stream.title}
                className="border-border hover:border-primary/30 transition-colors group"
              >
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <stream.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {stream.tag}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-sm block">{stream.title}</span>
                    <span className="text-primary text-xs font-semibold">{stream.subtitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stream.description}</p>
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
                  <p className="text-3xl font-bold text-primary">R$ 6.000+</p>
                  <p className="text-sm text-secondary-foreground/60 mt-1">Contatos pagos/mês</p>
                  <p className="text-xs text-secondary-foreground/40">800 contatos × R$7,50</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">R$ 3.900+</p>
                  <p className="text-sm text-secondary-foreground/60 mt-1">Assinaturas/mês</p>
                  <p className="text-xs text-secondary-foreground/40">100 empresas × R$39</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">R$ 10.000+</p>
                  <p className="text-sm text-secondary-foreground/60 mt-1">Receita total estimada</p>
                  <p className="text-xs text-secondary-foreground/40">Sem contar destaques de vagas</p>
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
