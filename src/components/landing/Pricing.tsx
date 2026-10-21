import { ArrowRight, Check, Crown, BriefcaseBusiness, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "avulso",
    name: "Contratante Avulso",
    audience: "Para contratar quando precisar",
    description:
      "Publique oportunidades sem mensalidade e acompanhe o valor da plataforma antes de confirmar.",
    price: "12%",
    period: "por diária concluída",
    featured: true,
    badge: "Sem mensalidade",
    icon: BriefcaseBusiness,
    features: [
      "Publicação de oportunidades",
      "Comparação de profissionais interessados",
      "Favoritos para próximas diárias",
      "Valor discriminado no resumo",
      "Fluxo financeiro simulado no piloto",
    ],
    cta: "Testar contratação avulsa",
  },
  {
    id: "pro",
    name: "Contratante Pro",
    audience: "Bares, Hotéis, Obras, Condomínios e Lojas",
    description:
      "Para operações recorrentes que querem organizar equipe e publicar sem taxa por diária.",
    price: "R$ 59,90",
    period: "/mês após 14 dias grátis",
    featured: false,
    badge: "14 dias grátis",
    icon: Crown,
    features: [
      "Publicações sem taxa por diária",
      "Minha Equipe de profissionais favoritos",
      "Histórico e recibos demonstrativos",
      "Comparação de profissionais interessados",
      "Cancelamento simulado a qualquer momento",
    ],
    cta: "Conhecer Plano Pro",
  },
  {
    id: "freelancer",
    name: "Profissional",
    audience: "Panfletistas, vendedores e outros autônomos",
    description:
      "Encontre oportunidades sem assinatura. A taxa aparece somente após você ser selecionado.",
    price: "R$ 7,90",
    period: "por seleção confirmada",
    featured: false,
    badge: "Sem assinatura",
    icon: Star,
    features: [
      "Cadastro e demonstração de interesse grátis",
      "Taxa somente depois da seleção",
      "Disponibilidade e perfil profissional",
      "Check-in e recibo demonstrativos",
      "Nenhuma cobrança real nesta versão",
    ],
    cta: "Cadastrar como Profissional",
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="bg-slate-50/70 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Valores do piloto
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Escolha como quer contratar,{" "}
            <span className="text-primary">sem taxas escondidas</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base">
            Todos os valores e pagamentos exibidos são simulações para validar a experiência do produto.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-xs transition-all hover:shadow-md ${
                plan.featured ? "border-primary ring-2 ring-primary/20 scale-102 lg:-translate-y-1" : "border-border/70"
              }`}
            >
              {plan.badge && (
                <span
                  className={`mb-5 text-xs font-bold uppercase tracking-wide ${
                    plan.featured
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <plan.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.audience}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed min-h-[40px]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm font-medium text-muted-foreground">{plan.period}</span>
              </div>

              <div className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                variant={plan.featured ? "default" : "outline"}
                className="mt-8 w-full rounded-lg font-bold text-sm shadow-none"
                onClick={() => navigate("/auth")}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
