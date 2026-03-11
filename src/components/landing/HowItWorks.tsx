import { UserPlus, Search, HandshakeIcon, Banknote } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crie seu perfil",
    description: "Cadastre-se em 2 minutos com suas habilidades e disponibilidade.",
  },
  {
    icon: Search,
    step: "02",
    title: "Encontre oportunidades",
    description: "Veja vagas perto de você em tempo real, filtradas por categoria.",
  },
  {
    icon: HandshakeIcon,
    step: "03",
    title: "Conecte-se",
    description: "Match instantâneo. Sem burocracia, sem enrolação.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Receba rápido",
    description: "Pagamento direto e seguro ao final do trabalho.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-foreground">
            Simples, rápido e sem burocracia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center animate-fade-up" style={{ animationDelay: `${i * 0.12}s` }}>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-primary/20" />
              )}
              <div className="w-16 h-16 mx-auto rounded-full gradient-hero flex items-center justify-center mb-4 shadow-warm">
                <step.icon className="h-7 w-7 text-secondary-foreground" />
              </div>
              <span className="text-xs font-bold text-primary">{step.step}</span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
