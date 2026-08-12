import { ChefHat, Package, PartyPopper, Sparkles, Users, Utensils } from "lucide-react";

const categories = [
  {
    name: "Garçom",
    description: "Eventos, festas e restaurantes.",
    icon: Utensils,
  },
  {
    name: "Cozinha",
    description: "Auxiliares e apoio em cozinha.",
    icon: ChefHat,
  },
  {
    name: "Atendente",
    description: "Salão, caixa e atendimento ao público.",
    icon: Users,
  },
  {
    name: "Limpeza",
    description: "Limpeza geral e pós-evento.",
    icon: Sparkles,
  },
  {
    name: "Eventos",
    description: "Produção, montagem e apoio.",
    icon: PartyPopper,
  },
  {
    name: "Outros",
    description: "Diversos serviços rápidos.",
    icon: Package,
  },
];

const Categories = () => {
  return (
    <section id="categorias" className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Categorias
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Os serviços mais procurados da região
          </h2>
          <p className="mt-4 text-muted-foreground">
            Escolha sua área e encontre o que combina com você.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group flex flex-col items-start justify-start gap-4 rounded-3xl border border-border/70 bg-white p-7 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <category.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-semibold">{category.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {category.description}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
