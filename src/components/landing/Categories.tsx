import { UtensilsCrossed, PartyPopper, SprayCan, Scissors, Wrench } from "lucide-react";

const categories = [
  {
    icon: UtensilsCrossed,
    title: "Restaurantes & Bares",
    description: "Garçons, cozinheiros, auxiliares, baristas e atendentes para o dia a dia ou eventos especiais.",
    jobs: "120+ vagas",
  },
  {
    icon: PartyPopper,
    title: "Eventos & Casamentos",
    description: "Staff completo para casamentos, formaturas, festas e festivais da região.",
    jobs: "85+ vagas",
  },
  {
    icon: SprayCan,
    title: "Limpeza & Diaristas",
    description: "Faxineiras, diaristas, limpeza pós-obra e serviços de higienização.",
    jobs: "150+ vagas",
  },
  {
    icon: Scissors,
    title: "Beleza",
    description: "Cabeleireiros, manicures, maquiadores e profissionais de estética.",
    jobs: "70+ vagas",
  },
  {
    icon: Wrench,
    title: "Manutenção & Reparos",
    description: "Eletricistas, encanadores, pintores, montadores e pequenos reparos em geral.",
    jobs: "95+ vagas",
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Categorias
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-foreground">
            Trabalho pra todo tipo de habilidade
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            De restaurantes a salões de beleza, encontre oportunidades na sua região.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="group p-6 rounded-xl bg-card shadow-card border border-border hover:border-primary/30 hover:shadow-warm transition-all duration-300 cursor-pointer animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <cat.icon className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{cat.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{cat.description}</p>
              <span className="text-xs font-semibold text-primary">{cat.jobs}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
