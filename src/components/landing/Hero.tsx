import { ArrowRight, CircleCheck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const trustItems = ["Grátis para começar", "Sem burocracia", "Avaliações reais"];

const stats = [
  { value: "2.400+", label: "profissionais ativos" },
  { value: "850+", label: "trabalhos por mês" },
  { value: "4.9", label: "avaliação média" },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative overflow-hidden pt-24 lg:pt-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(232,93,4,0.1),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            São João del Rei e região
          </span>

          <h1 className="mt-8 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            O trabalho certo,{" "}
            <span className="text-primary">perto de você</span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Encontre ou publique trabalhos rápidos na sua cidade. Simples,
            seguro e sem burocracia — direto com quem faz.
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 text-base"
              onClick={() => navigate("/auth")}
            >
              Quero trabalhar
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border bg-white/70 px-8 text-base shadow-sm backdrop-blur"
              onClick={() => navigate("/auth")}
            >
              Preciso contratar
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CircleCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-3xl border border-border/70 bg-white/70 p-8 text-center shadow-sm backdrop-blur"
            >
              <p className="text-4xl font-bold tracking-tight text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
