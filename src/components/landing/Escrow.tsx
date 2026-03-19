import { ShieldCheck, Lock, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Lock,
    step: "1",
    title: "Cliente paga antes",
    description: "A empresa deposita o valor do serviço antes do trabalho começar.",
  },
  {
    icon: ShieldCheck,
    step: "2",
    title: "Dinheiro fica preso no app",
    description: "O valor fica retido com segurança na plataforma. Ninguém mexe.",
  },
  {
    icon: CheckCircle,
    step: "3",
    title: "Só libera depois do serviço",
    description: "Após a empresa confirmar que o trabalho foi feito, o freelancer recebe.",
  },
];

const Escrow = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">
            Pagamento seguro
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Garantia <span className="text-gradient">Escrow</span> no Trampô
          </h2>
          <p className="text-muted-foreground text-lg">
            Seu dinheiro protegido do início ao fim. Sem risco pra ninguém.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="relative text-center animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-8 left-[60%] w-[80%] items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-primary/30" />
                </div>
              )}
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary">Passo {step.step}</span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-6 py-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              100% seguro — protegido pela plataforma Trampô
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Escrow;
