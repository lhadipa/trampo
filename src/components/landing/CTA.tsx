import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:pb-32 lg:pt-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-background px-6 py-16 text-center sm:px-12 lg:py-20 shadow-xs">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,rgba(232,93,4,0.15),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Faça Parte da Revolução do Trabalho
            </div>
            <h2 className="text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Pronto para contratar ou faturar sem burocracia?
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de contratantes, residências, condomínios, estabelecimentos e prestadores de todo o Brasil com <strong>60 dias de Membro VIP 100% gratuitos</strong>.
            </p>
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-13 rounded-full px-8 text-base font-bold shadow-md shadow-primary/20"
                onClick={() => navigate("/auth")}
              >
                Garantir 60 Dias Grátis VIP
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 rounded-full border-border bg-white/80 px-8 text-base font-semibold shadow-xs backdrop-blur hover:bg-muted"
                onClick={() => navigate("/auth")}
              >
                Quero Trabalhar como Autônomo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
