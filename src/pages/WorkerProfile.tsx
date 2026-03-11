import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Briefcase,
  Camera,
  ArrowLeft,
  Heart,
  Share2,
  Lock,
  MessageSquare,
  Send,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

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
  availability: "Disponível",
  lastActive: "Hoje",
};

const WorkerProfile = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);

  const handleUnlockContact = () => {
    toast.success("Contato liberado!", {
      description: "O telefone do trabalhador está disponível agora.",
    });
    setContactUnlocked(true);
  };

  const handleSendInvite = () => {
    toast.success("Convite enviado!", {
      description: `${worker.name} receberá seu convite no app.`,
    });
  };

  const handleChat = () => {
    toast.info("Chat aberto", {
      description: `Converse com ${worker.name} antes de contratar.`,
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removido dos favoritos" : "Adicionado à sua equipe favorita!",
      {
        description: isFavorite
          ? undefined
          : "Você pode convidá-lo novamente quando precisar.",
      }
    );
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
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-secondary-foreground/10 text-secondary-foreground/70"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`} />
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
              <div className="space-y-1.5">
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
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                  {worker.availability}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact - locked/unlocked */}
        <Card className={`border-border ${!contactUnlocked ? "border-primary/20 bg-primary/5" : ""}`}>
          <CardContent className="pt-6">
            {contactUnlocked ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Telefone liberado</p>
                    <p className="text-lg font-bold text-foreground">(32) 99999-1234</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Contato bloqueado</p>
                    <p className="text-xs text-muted-foreground">
                      Libere o contato por R$ 5–10
                    </p>
                  </div>
                </div>
                <Button variant="hero" size="sm" onClick={handleUnlockContact}>
                  <Lock className="mr-1 h-3 w-3" />
                  Liberar R$ 5
                </Button>
              </div>
            )}
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

        {/* Action buttons - sticky */}
        <div className="sticky bottom-4 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 py-6"
              onClick={handleChat}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="flex-1 py-6 shadow-warm"
              onClick={handleSendInvite}
            >
              <Send className="mr-2 h-5 w-5" />
              Convidar • R$ 3
            </Button>
          </div>
          {isFavorite && (
            <p className="text-center text-xs text-muted-foreground">
              ♥ Na sua equipe favorita — convide novamente a qualquer momento
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkerProfile;
