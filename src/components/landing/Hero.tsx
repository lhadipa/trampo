import { ArrowRight, CircleCheck, Globe, MapPin, Sparkles, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const trustItems = [
  "Pagamento 100% Garantido via Pix (Escrow)",
  "Profissionais Avaliados e Verificados",
  "Sem Burocracia e Sem Vínculo CLT",
  "Cobertura Nacional em Expansão",
];

const trendingServices = [
  "🎨 Pintor",
  "🏊 Limpador de Piscina",
  "⚡ Eletricista",
  "🍽️ Garçom",
  "🧹 Diarista",
  "🔧 Montador de Móveis",
  "✂️ Manicure / Barbeiro",
  "📦 Entregador",
];

const stats = [
  { value: "40+", label: "categorias de serviços" },
  { value: "R$ 0", label: "mensalidade para começar" },
  { value: "100%", label: "proteção financeira (Escrow)" },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative overflow-hidden pt-20 lg:pt-28 pb-16">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(232,93,4,0.15),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Tag de Expansão Nacional e Polo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Globe className="h-4 w-4" />
            <span>Polo São João del-Rei & Região • Expansão para todo o Brasil</span>
          </div>

          {/* Título Principal de Alto Impacto */}
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            O profissional ou serviço certo,{" "}
            <span className="text-primary bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              na hora que você precisa.
            </span>
          </h1>

          {/* Descrição Multi-Setor */}
          <p className="mt-6 max-w-3xl text-balance text-base sm:text-lg leading-relaxed text-muted-foreground">
            De <strong>pintores</strong> e <strong>limpadores de piscina</strong> a <strong>eletricistas</strong>, <strong>garçons</strong> e <strong>diaristas</strong>. Conectamos quem precisa de ajuda rápida a profissionais autônomos verificados, com <strong>pagamento seguro via Pix</strong> e <strong>recibo digital automático</strong>.
          </p>

          {/* Carrossel de Tags de Serviços em Alta */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Serviços em alta:</span>
            {trendingServices.map((service) => (
              <span
                key={service}
                className="inline-flex items-center rounded-lg border border-border/80 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs hover:border-primary/40 hover:text-primary transition-colors cursor-default"
              >
                {service}
              </span>
            ))}
          </div>

          {/* Botões de Ação CTA */}
          <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              size="lg"
              className="h-13 rounded-full px-8 text-base font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
              onClick={() => navigate("/auth")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Preciso de um Profissional
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 rounded-full border-border bg-white/80 px-8 text-base font-semibold shadow-xs backdrop-blur hover:bg-muted"
              onClick={() => navigate("/auth")}
            >
              Quero Trabalhar e Receber no Pix
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

        {/* Métricas de Tração & Projeção */}
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 rounded-3xl border border-border/80 bg-white/80 p-5 sm:p-6 text-center shadow-xs backdrop-blur transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
