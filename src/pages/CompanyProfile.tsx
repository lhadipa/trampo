import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Briefcase,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const company = {
  name: "Restaurante Sabor Mineiro",
  logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop",
  location: "São João del-Rei",
  verified: true,
  responsible: "Carlos Almeida",
  cnpj: "12.345.678/0001-90",
  cnpjMasked: "**.345.678/****-**",
  email: "contato@sabormineiro.com",
  phone: "(32) 99999-0000",
  phoneMasked: "(32) *****-0000",
  businessTypes: ["Restaurante", "Eventos"],
  rating: 4.9,
  jobsPosted: 54,
  jobsCompleted: 48,
  memberSince: "Mar 2024",
  lastActive: "Hoje",
  paymentHistory: "Em dia",
};

const safetyChecks = [
  {
    icon: ShieldCheck,
    label: "CNPJ verificado",
    status: "ok" as const,
    detail: "Documento validado na Receita Federal",
  },
  {
    icon: FileText,
    label: "Termos aceitos",
    status: "ok" as const,
    detail: "Concordou com os termos de uso e política de privacidade",
  },
  {
    icon: CheckCircle2,
    label: "Histórico positivo",
    status: "ok" as const,
    detail: "Nenhuma denúncia registrada",
  },
  {
    icon: Clock,
    label: "Pagamentos em dia",
    status: "ok" as const,
    detail: "Nenhum pagamento pendente ou atrasado",
  },
];

const CompanyProfile = () => {
  const navigate = useNavigate();

  const handleReport = () => {
    toast.info("Denúncia registrada", {
      description: "Nossa equipe vai analisar e tomar as medidas necessárias.",
    });
  };

  const handlePublishJob = () => {
    toast.success("Redireccionando para publicar vaga...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary-foreground/10 text-secondary-foreground/70 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="container py-8 max-w-lg mx-auto space-y-6">
        {/* Company header */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              <Avatar className="w-24 h-24 rounded-xl ring-4 ring-primary/20">
                <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary rounded-xl">
                  {company.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
                </div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {company.location}
                </p>
                {company.verified && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Empresa verificada
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company info */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Informações da empresa
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Responsável
                </span>
                <span className="font-medium text-foreground">{company.responsible}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CNPJ/CPF
                </span>
                <span className="font-medium text-foreground font-mono text-xs">
                  {company.cnpjMasked}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <span className="font-medium text-foreground">{company.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </span>
                <span className="font-medium text-foreground">{company.phoneMasked}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business type */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Tipo de negócio
            </h2>
            <div className="flex flex-wrap gap-2">
              {company.businessTypes.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Histórico no app
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 fill-primary" />
                  {company.rating}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Avaliação média</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{company.jobsPosted}</p>
                <p className="text-xs text-muted-foreground mt-1">Vagas publicadas</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{company.jobsCompleted}</p>
                <p className="text-xs text-muted-foreground mt-1">Trabalhos concluídos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground text-sm">{company.memberSince}</p>
                <p className="text-xs text-muted-foreground mt-1">Membro desde</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety & Verification */}
        <Card className="border-border border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Segurança e verificação
            </h2>
            <div className="space-y-3">
              {safetyChecks.map((check) => (
                <div key={check.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <check.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report */}
        <Card className="border-border border-destructive/20">
          <CardContent className="pt-6">
            <button
              onClick={handleReport}
              className="flex items-center gap-3 w-full text-left"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Denunciar empresa</p>
                <p className="text-xs text-muted-foreground">
                  Fraude, golpe, assédio ou comportamento inadequado
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Action button */}
        <div className="sticky bottom-6">
          <Button
            variant="hero"
            size="lg"
            className="w-full text-base py-6 shadow-warm"
            onClick={handlePublishJob}
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Publicar nova vaga
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfile;
