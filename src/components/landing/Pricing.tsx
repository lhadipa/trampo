import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, Check, Zap, Building2, Crown } from "lucide-react";

const plans = [
  {
    name: "Grátis",
    icon: Zap,
    price: "R$ 0",
    period: "",
    description: "Pra quem tá começando e quer testar a plataforma.",
    features: [
      "Publicar até 2 vagas por mês",
      "Acesso a candidatos básicos",
      "Perfil simples da empresa",
      "Suporte por e-mail",
    ],
    taxPerJob: "10% por trabalho concluído",
    highlight: false,
    cta: "Começar grátis",
  },
  {
    name: "Profissional",
    icon: Building2,
    price: "R$ 79",
    period: "/mês",
    description: "Pra empresas que contratam com frequência.",
    features: [
      "Vagas ilimitadas",
      "Candidatos destacados e verificados",
      "Perfil premium da empresa",
      "Selo de empresa verificada",
      "Suporte prioritário",
      "Painel de gestão de equipe",
    ],
    taxPerJob: "5% por trabalho concluído",
    highlight: true,
    cta: "Assinar agora",
  },
  {
    name: "Empresarial",
    icon: Crown,
    price: "R$ 199",
    period: "/mês",
    description: "Pra operações que precisam de escala.",
    features: [
      "Tudo do Profissional",
      "API de integração",
      "Múltiplos usuários admin",
      "Relatórios avançados",
      "Gerente de conta dedicado",
      "Contratação em lote",
    ],
    taxPerJob: "3% por trabalho concluído",
    highlight: false,
    cta: "Falar com vendas",
  },
];

const extras = [
  {
    title: "Destaque de Vaga",
    price: "R$ 15",
    description: "Sua vaga aparece no topo por 7 dias.",
  },
  {
    title: "Urgente 🔥",
    price: "R$ 25",
    description: "Notificação push para todos os trabalhadores da categoria.",
  },
  {
    title: "Recrutamento Express",
    price: "R$ 49",
    description: "A gente faz a triagem e te manda os 3 melhores candidatos em 2h.",
  },
  {
    title: "Verificação Premium",
    price: "R$ 9,90",
    description: "Selo de verificado no perfil do trabalhador (mensal).",
  },
];

const Pricing = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
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
                  <span className="gradient-hero text-secondary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                    Mais popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    plan.highlight ? "gradient-hero" : "bg-muted"
                  }`}>
                    <plan.icon className={`h-4 w-4 ${plan.highlight ? "text-secondary-foreground" : "text-foreground"}`} />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  )}
                </div>

                <div className="rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-sm text-accent font-medium">
                  + {plan.taxPerJob}
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

        {/* Extras */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Ganhos adicionais ⚡
            </h3>
            <p className="text-muted-foreground">
              Serviços avulsos que empresas e trabalhadores podem comprar a qualquer momento.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extras.map((extra) => (
              <Card key={extra.title} className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-sm">{extra.title}</span>
                    <span className="text-primary font-bold text-sm">{extra.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{extra.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
