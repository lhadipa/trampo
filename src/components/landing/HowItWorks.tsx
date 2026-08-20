import { ShieldCheck, UserPlus, Zap, FileCheck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Publique ou Peça SOS",
    subtitle: "Em menos de 2 minutos",
    description:
      "Descreva o serviço (seja pintura, piscina, garçom, faxina ou elétrica) ou dispare o radar urgente para profissionais disponíveis agora.",
  },
  {
    icon: ShieldCheck,
    title: "2. Pagamento Protegido (Escrow)",
    subtitle: "Segurança total bilateral",
    description:
      "O valor da diária fica reservado em custódia segura. O prestador trabalha com a certeza do recebimento e o contratante só libera após o serviço concluído.",
  },
  {
    icon: FileCheck,
    title: "3. Check-in & Recibo Digital",
    subtitle: "Zero risco de vínculo CLT",
    description:
      "Comprovação de horário no local e emissão automática de Recibo de Prestação Autônoma (RPA) pronto para contabilidade e proteção jurídica.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bg-white/70 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Arquitetura Operacional
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Como o Trampô funciona na prática
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Eliminamos intermediários caros, o risco de calotes e a burocracia trabalhista através de tecnologia sob demanda.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center rounded-3xl border border-border/80 bg-white p-8 text-center shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
            >
              <span className="absolute -top-3.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
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
