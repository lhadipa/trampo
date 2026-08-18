import { ArrowRight, Check, Crown, Sparkles, Star, Zap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "founder",
    name: "Membro Fundador",
    audience: "Lançamento São João del-Rei e Região",
    description:
      "Aproveite 60 dias de acesso VIP completo sem pagar nada. Crie sua equipe favorita e teste na prática.",
    price: "Grátis",
    period: "por 60 dias",
    featured: true,
    badge: "Oferta de Lançamento",
    icon: Sparkles,
    features: [
      "60 dias de acesso VIP 100% liberado",
      "Vagas e chamados ilimitados",
      "Recurso 'Minha Equipe Favorita'",
      "Chat direto e avaliações",
      "Garantia de pagamento seguro via Escrow",
    ],
    cta: "Garantir 60 Dias VIP",
  },
  {
    id: "pro",
    name: "Pro Negócio",
    audience: "Bares, Restaurantes, Hotéis e Lojas",
    description:
      "A proteção contínua para sua operação. Menos de R$ 1,35/dia para nunca mais ficar desfalcado.",
    price: "R$ 39,90",
    period: "/mês pós-teste",
    featured: false,
    badge: "Seguro Operacional",
    icon: Crown,
    features: [
      "Vagas prioritárias ilimitadas",
      "Acesso completo ao banco de autônomos",
      "Emissão de Recibos Digitais (RPA) para contabilidade",
      "Selo de Empresa Verificada",
      "Desconto exclusivo no Radar Turbo",
    ],
    cta: "Conhecer Plano Pro",
  },
  {
    id: "freelancer",
    name: "Autônomo & Freelancer",
    audience: "Universitários UFSJ e Prestadores",
    description:
      "Trabalhe com liberdade de horários, receba pagamentos seguros no Pix e construa sua reputação.",
    price: "Grátis",
    period: "para sempre",
    featured: false,
    badge: "100% Gratuito",
    icon: Star,
    features: [
      "Candidaturas sem custo",
      "Pagamento protegido via Pix (Anti-Calote)",
      "Histórico e avaliações no perfil",
      "Autonomia total de agenda e aceites",
      "Opção de Selo Ouro/Verificado avulso",
    ],
    cta: "Cadastrar como Profissional",
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="bg-white/50 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Planos & Modelos
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Comece grátis por 60 dias,{" "}
            <span className="text-primary">cresça com segurança</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Sem taxas escondidas e com proteção total contra burocracias. Experimente por 2 meses
            sem compromisso.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-md ${
                plan.featured ? "border-primary ring-2 ring-primary/20" : "border-border/70"
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-xs font-bold shadow-sm ${
                  plan.featured ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    plan.featured
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <plan.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {plan.audience}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground min-h-[40px]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-6 space-y-3 text-sm flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground text-xs leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col justify-end">
                <Button
                  size="lg"
                  variant={plan.featured ? "default" : "outline"}
                  className="w-full rounded-full font-semibold shadow-sm"
                  onClick={() => navigate("/auth")}
                >
                  {plan.cta}
                  {plan.featured && (
                    <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Microtransactions Highlight Box */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-border/80 bg-background/60 p-6 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Precisa de alguém para AGORA?</p>
                <p className="text-xs text-muted-foreground">
                  Dispare o <strong>Radar Turbo</strong> no WhatsApp para os profissionais mais próximos a partir de <strong>R$ 7,90</strong>.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 rounded-full shrink-0"
              onClick={() => navigate("/urgente")}
            >
              Testar Modo Urgente
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
