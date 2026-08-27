import { ArrowRight, Check, Crown, BriefcaseBusiness, Star, Zap, ShieldCheck, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    icon: BriefcaseBusiness,
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

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="bg-slate-50/70 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Planos & Monetização
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Comece grátis por 60 dias,{" "}
            <span className="text-primary">cresça com segurança</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base">
            Modelo transparente sem taxas ocultas, com proteção total contra calotes e sem burocracia trabalhista.
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
