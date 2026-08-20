import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paintbrush,
  Waves,
  Utensils,
  PartyPopper,
  Scissors,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICE_CATEGORIES } from "@/lib/categories";

const iconMap: Record<string, any> = {
  Paintbrush,
  Waves,
  Utensils,
  PartyPopper,
  Scissors,
  Truck,
};

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState<string>(SERVICE_CATEGORIES[0].id);

  const activeCategory =
    SERVICE_CATEGORIES.find((c) => c.id === selectedCatId) || SERVICE_CATEGORIES[0];
  const ActiveIcon = iconMap[activeCategory.iconName] || Paintbrush;

  return (
    <section id="categorias" className="py-20 lg:py-28 bg-slate-50/50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Ecossistema Multi-Serviços
          </div>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Encontre especialistas para qualquer necessidade
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            De residências e condomínios a bares, obras e eventos. Uma plataforma única com prestadores avaliados e diárias transparentes.
          </p>
        </div>

        {/* Grade de Categorias Principais */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((category) => {
            const IconComponent = iconMap[category.iconName] || Paintbrush;
            const isSelected = category.id === selectedCatId;

            return (
              <div
                key={category.id}
                onClick={() => setSelectedCatId(category.id)}
                className={`group cursor-pointer flex flex-col justify-between rounded-3xl border p-6 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-white shadow-md ring-2 ring-primary/20 -translate-y-1"
                    : "border-border/70 bg-white hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      }`}
                    >
                      <IconComponent className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                      {category.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Média diária: <strong className="text-foreground">{category.avgDailyRate}</strong>
                  </span>
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Ver serviços <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detalhes da Categoria Selecionada */}
        <div className="mt-10 rounded-3xl border border-primary/20 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ActiveIcon className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">
                  Especialidades em {activeCategory.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Profissionais prontos para atender você com garantia de serviço e Pix protegido.
                </p>
              </div>
            </div>
            <Button
              className="rounded-full shadow-sm"
              onClick={() => navigate("/auth")}
            >
              Chamar Profissional Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeCategory.subservices.map((sub) => (
              <div
                key={sub}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium text-foreground">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
