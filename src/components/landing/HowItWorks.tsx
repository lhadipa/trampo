import { MessageCircle, ShieldCheck, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Crie sua conta grátis",
    description:
      "Seja para trabalhar ou contratar, o cadastro é simples e leva menos de 2 minutos.",
  },
  {
    icon: MessageCircle,
    title: "Combine sem burocracia",
    description:
      "Candidata-se ou receba candidaturas, converse e alinhe horário e valor com tranquilidade.",
  },
  {
    icon: ShieldCheck,
    title: "Trabalho feito, confiança construída",
    description:
      "Conclua, avalie e construa uma boa reputação na sua região a cada trampo.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bg-white/50 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Simples do começo ao fim
          </h2>
          <p className="mt-4 text-muted-foreground">
            Três passos, sem complicação. Qualquer pessoa consegue.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center rounded-3xl border border-border/70 bg-white p-8 text-center shadow-sm"
            >
              <span className="absolute -top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground shadow-sm">
                Passo {index + 1}
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
