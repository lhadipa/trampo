import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Wifi,
  MapPin,
  MousePointerClick,
  Award,
  TrendingUp,
  Crown,
  ShieldOff,
} from "lucide-react";

const companyBenefits = [
  {
    icon: Zap,
    title: "Ache em 30 segundos",
    description: "Busca rápida por trabalhadores disponíveis agora na sua região.",
  },
  {
    icon: Wifi,
    title: "Veja quem está online",
    description: "Status em tempo real. Sem ligação, sem espera.",
  },
  {
    icon: MapPin,
    title: "Veja quem está perto",
    description: "Profissionais filtrados por distância. Prioridade pra quem tá perto de você.",
  },
  {
    icon: MousePointerClick,
    title: "Contrate rápido",
    description: "Convide, combine e feche o serviço em poucos toques.",
  },
];

const workerBenefits = [
  {
    icon: Award,
    title: "Selo TOP Freelancer",
    description: "Avaliações altas desbloqueiam o selo que te destaca das centenas de outros profissionais.",
  },
  {
    icon: TrendingUp,
    title: "Destaque nas buscas",
    description: "Quem tem mais reputação aparece primeiro quando empresas procuram.",
  },
  {
    icon: Crown,
    title: "Prioridade nas vagas",
    description: "Freelancers com histórico no app recebem convites antes dos demais.",
  },
  {
    icon: ShieldOff,
    title: "Fora do app = sem reputação",
    description: "Trabalho fora da plataforma não gera avaliação, selo ou destaque. Sua reputação vive aqui.",
  },
];

const ValueProps = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">
            Por que usar o Trampô
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Vantagens que só existem{" "}
            <span className="text-gradient">dentro do app</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Company side */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <Zap className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Para empresas
              </h3>
            </div>
            <div className="grid gap-4">
              {companyBenefits.map((item, i) => (
                <Card
                  key={item.title}
                  className="border-border hover:border-primary/30 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <CardContent className="flex items-start gap-4 py-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Worker side */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <Award className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Para trabalhadores
              </h3>
            </div>
            <div className="grid gap-4">
              {workerBenefits.map((item, i) => (
                <Card
                  key={item.title}
                  className="border-border hover:border-primary/30 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <CardContent className="flex items-start gap-4 py-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
