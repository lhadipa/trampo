import { Search, UserCheck, Star, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Encontre trabalhadores confiáveis",
    description: "Veja profissionais disponíveis perto de você, com avaliações e histórico de trabalhos.",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Contrate rapidamente",
    description: "Convide trabalhadores para o serviço e organize sua equipe direto pelo aplicativo.",
  },
  {
    icon: Star,
    step: "03",
    title: "Salve seus favoritos",
    description: "Guarde os melhores profissionais na sua lista para contratar novamente quando precisar.",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "Convide novamente quando quiser",
    description: "Envie convites para sua equipe favorita com apenas um clique.",
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
            Como funciona contratar pelo app
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
