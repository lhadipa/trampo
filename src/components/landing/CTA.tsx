import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:pb-32 lg:pt-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/5 px-6 py-16 text-center sm:px-12 lg:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(232,93,4,0.12),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Pronto para dar o primeiro passo?
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Cadastre-se gratuitamente e comece hoje. Do outro lado, tem
              alguém esperando por você.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-12 rounded-full px-8 text-base"
                onClick={() => navigate("/auth")}
              >
                Criar conta gratuita
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border bg-white/70 px-8 text-base shadow-sm backdrop-blur"
                onClick={() => navigate("/auth")}
              >
                Explorar vagas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
