import { ArrowRight, CircleCheck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const trustItems = [
  "Piloto local em São João del-Rei",
  "Perfis e disponibilidade simulados",
  "Valores claros antes de confirmar",
];

const trendingServices = [
  "Panfletista",
  "Vendedor porta a porta",
  "Eletricista",
  "Garçom",
  "Diarista",
  "Montador de Móveis",
  "Manicure / Barbeiro",
  "Entregador",
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative overflow-hidden pt-20 lg:pt-28 pb-16">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="pilot-demo-notice w-full">Demonstração do piloto: perfis, vagas, valores e confirmações são simulados.</p>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary">
            <MapPin className="h-4 w-4" />
            <span>São João del-Rei e região</span>
          </div>

          {/* Título Principal de Alto Impacto */}
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Contrate ajuda local para a próxima diária,{" "}
            <span className="text-primary">
              sem enrolação.
            </span>
          </h1>

          {/* Descrição Multi-Setor */}
          <p className="mt-6 max-w-3xl text-balance text-base sm:text-lg leading-relaxed text-muted-foreground">
            Encontre profissionais de <strong>panfletagem</strong>, <strong>vendas porta a porta</strong>, eventos, manutenção e serviços gerais. Neste piloto, todas as ações financeiras são demonstrações: o pagamento combinado acontece diretamente entre as partes.
          </p>

          {/* Carrossel de Tags de Serviços em Alta */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-3xl text-xs">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Serviços em alta:</span>
            {trendingServices.map((service) => (
              <span
                key={service}
                className="font-medium text-foreground/75 after:content-['•'] after:ml-3 last:after:content-['']"
              >
                {service}
              </span>
            ))}
          </div>

          {/* Botões de Ação CTA */}
          <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              size="lg"
              className="h-13 rounded-lg px-8 text-base font-bold"
              onClick={() => navigate("/auth")}
            >
              Quero contratar
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 rounded-lg border-border bg-white px-8 text-base font-semibold hover:bg-muted"
              onClick={() => navigate("/auth")}
            >
              Quero encontrar trabalho
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust Items */}
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-muted-foreground">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5 font-medium">
                <CircleCheck className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};

export default Hero;
