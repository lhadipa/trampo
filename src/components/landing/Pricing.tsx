import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, Check, Eye, Heart, Building2 } from "lucide-react";

const revenueCards = [
  {
    icon: Eye,
    title: "Liberação de Contato",
    description: "Empresas pagam para visualizar o contato do trabalhador.",
    price: "R$ 5 – R$ 10",
    tag: "Principal",
  },
  {
    icon: Heart,
    title: "Convite para Favoritos",
    description: "Convide trabalhadores que já trabalharam com você.",
    price: "R$ 3 por convite",
    tag: "Recorrência",
  },
  {
    icon: Building2,
    title: "Plano Empresarial",
    description: "Empresas frequentes podem assinar e ter mais vantagens.",
    price: "R$ 39/mês",
    tag: "Assinatura",
  },
];

const Pricing = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">
            Modelo de Monetização
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Simples, sem fricção, feito pra{" "}
            <span className="text-gradient">escalar</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Funciona em qualquer cidade. Sem depender do trabalho acontecer.
          </p>
        </div>

        {/* Revenue Cards */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {revenueCards.map((card) => (
            <Card
              key={card.title}
              className="relative flex flex-col border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <card.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {card.tag}
                  </span>
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-3xl font-bold text-foreground">{card.price}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="lg">
                  Saiba mais
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
