import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Briefcase, Camera, ArrowLeft, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const worker = {
  name: "João Silva",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  location: "São João del-Rei",
  rating: 4.8,
  jobsDone: 32,
  services: ["Garçom", "Atendente", "Eventos"],
  experience:
    "Trabalhei como garçom em restaurantes e eventos por mais de 3 anos. Experiência com atendimento ao público e organização de eventos.",
  portfolio: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=300&h=300&fit=crop",
  ],
};

const WorkerProfile = () => {
  const navigate = useNavigate();

  const handleHire = () => {
    toast.success("Convite enviado ao trabalhador!", {
      description: "Você será notificado quando ele aceitar.",
    });
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
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary-foreground/10 text-secondary-foreground/70 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary-foreground/10 text-secondary-foreground/70 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-lg mx-auto space-y-6">
        {/* Profile header */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                <AvatarImage src={worker.photo} alt={worker.name} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {worker.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-foreground">{worker.name}</h1>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {worker.location}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Star className="h-3.5 w-3.5 fill-primary" />
                    {worker.rating}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    {worker.jobsDone} trabalhos
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Serviços oferecidos
            </h2>
            <div className="flex flex-wrap gap-2">
              {worker.services.map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Experiência
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {worker.experience}
            </p>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
              <Camera className="h-4 w-4" />
              Fotos de trabalhos
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {worker.portfolio.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Trabalho ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hire button */}
        <div className="sticky bottom-6">
          <Button
            variant="hero"
            size="lg"
            className="w-full text-base py-6 shadow-warm"
            onClick={handleHire}
          >
            Contratar João
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WorkerProfile;
