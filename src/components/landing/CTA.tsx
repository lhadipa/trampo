import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:pb-32 lg:pt-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-6 py-16 text-center sm:px-12 lg:py-20 shadow-xs">
          <div className="relative mx-auto max-w-3xl">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-4">
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
                className="h-13 rounded-lg px-8 text-base font-bold"
                onClick={() => navigate("/auth")}
              >
                Garantir 60 Dias Grátis VIP
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 rounded-lg border-border bg-white px-8 text-base font-semibold hover:bg-muted"
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
