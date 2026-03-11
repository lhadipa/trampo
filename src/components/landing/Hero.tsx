import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="São João del Rei vista aérea"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <Zap className="h-4 w-4" />
            Plataforma #1 de trabalho rápido na sua região
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-secondary-foreground animate-fade-up">
            Conecte-se ao{" "}
            <span className="text-gradient">trabalho certo</span>{" "}
            em São João del Rei
          </h1>

          <p className="text-lg sm:text-xl text-secondary-foreground/80 max-w-lg animate-fade-up" style={{ animationDelay: "0.15s" }}>
            Restaurantes, eventos, comércio e serviços precisam de gente rápido.
            Trabalhadores precisam de renda rápida. A gente conecta os dois.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              Quero trabalhar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
              Preciso contratar
            </Button>
          </div>

          <div className="flex items-center gap-6 text-secondary-foreground/60 text-sm animate-fade-up" style={{ animationDelay: "0.45s" }}>
            <span className="flex items-center gap-1">✓ Gratuito pra começar</span>
            <span className="flex items-center gap-1">✓ Pagamento rápido</span>
            <span className="flex items-center gap-1">✓ 100% local</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
