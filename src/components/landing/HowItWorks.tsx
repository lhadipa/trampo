import { BadgeCheck, CircleDollarSign, Search, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Publique a oportunidade",
    subtitle: "Conte o local, horário e valor",
    description:
      "Escolha a categoria e explique a diária. Tudo fica identificado como simulação neste piloto.",
  },
  {
    icon: Search,
    title: "2. Compare profissionais",
    subtitle: "Veja interesse e disponibilidade",
    description:
      "Consulte perfis, especialidades e avaliações demonstrativas para escolher quem combina com a necessidade.",
  },
  {
    icon: CircleDollarSign,
    title: "3. Confirme a seleção",
    subtitle: "Taxa avulsa de R$ 7,90",
    description:
      "Somente o profissional selecionado confirma a reserva da diária. A cobrança exibida é simulada e não movimenta dinheiro.",
  },
  {
    icon: BadgeCheck,
    title: "4. Registre a conclusão",
    subtitle: "Check-in e recibo demonstrativos",
    description:
      "As partes acompanham o combinado e geram um comprovante de demonstração, sem custódia ou pagamento pela plataforma.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bg-white/70 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Fluxo do piloto
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Como o Trampô funciona na prática
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Um caminho simples para conectar contratantes e profissionais locais, com expectativas claras em cada etapa.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center rounded-3xl border border-border/80 bg-white p-8 text-center shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                Passo {index + 1}
              </span>
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                <step.icon className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">{step.title}</h3>
              <span className="text-xs font-semibold text-primary mt-1">{step.subtitle}</span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
