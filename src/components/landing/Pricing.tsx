import { ArrowRight, Check, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "free",
    name: "Grátis",
    description:
      "Para quem está começando. Publique vagas e candidate-se sem pagar nada.",
    price: "Grátis",
    period: "",
    featured: false,
    icon: Sparkles,
    features: [
      "Até 3 vagas abertas ao mesmo tempo",
      "Até 5 candidaturas ativas",
      "Chat com candidatos e contratantes",
      "Avaliações e reputação",
    ],
    cta: "Começar grátis",
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "Para quem precisa de mais volume. Mais vagas abertas e mais candidaturas ativas.",
    price: "R$ 19,90",
    period: "/mês",
    featured: true,
    icon: Crown,
    features: [
      "Até 15 vagas abertas ao mesmo tempo",
      "Até 20 candidaturas ativas",
      "Chat com candidatos e contratantes",
      "Avaliações e reputação",
    ],
    cta: "Assinar o Pro",
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="bg-white/50 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Planos
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Simples para começar,{" "}
            <span className="text-primary">com espaço para crescer</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Comece grátis e assine o Pro quando precisar de mais vagas abertas
            ou mais candidaturas ativas.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-sm ${
                plan.featured ? "border-primary/30" : "border-border/70"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                  Mais popular
                </span>
              )}

              <div className="flex items-center gap-2">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    plan.featured
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <plan.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <p className="mt-6 text-4xl font-bold tracking-tight">
                {plan.price}
                {plan.period && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-1 flex-col justify-end">
                <Button
                  size="lg"
                  variant={plan.featured ? "default" : "outline"}
                  className="w-full rounded-full"
                  onClick={() => navigate("/auth")}
                >
                  {plan.cta}
                  {plan.featured && (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
