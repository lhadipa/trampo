import { useEffect, useState, type FormEvent } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Categories from "@/components/landing/Categories";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  const [preReservationOpen, setPreReservationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setPreReservationOpen(true);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <Pricing />
        <CTA />
      </main>
      <Footer />

      <Dialog open={preReservationOpen} onOpenChange={setPreReservationOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <DialogHeader className="pr-6 text-left">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">Lista antecipada</p>
                <DialogTitle className="text-2xl">Garanta sua pré-reserva</DialogTitle>
                <DialogDescription className="pt-1">
                  Entre na white list do Trampô e receba prioridade quando abrirmos novas oportunidades na sua região.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="waitlist-name" className="text-sm font-semibold">Nome</label>
                  <Input id="waitlist-name" name="name" placeholder="Como podemos chamar você?" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="waitlist-email" className="text-sm font-semibold">E-mail</label>
                  <Input id="waitlist-email" name="email" type="email" placeholder="voce@email.com" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="waitlist-profile" className="text-sm font-semibold">Você quer</label>
                  <select
                    id="waitlist-profile"
                    name="profile"
                    defaultValue=""
                    required
                    className="flex h-10 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="" disabled>Selecione uma opção</option>
                    <option value="contractor">Contratar profissionais</option>
                    <option value="professional">Encontrar trabalhos</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="mt-6 gap-2 sm:gap-2">
                <Button type="submit" className="w-full">Entrar na white list</Button>
              </DialogFooter>
              <p className="mt-3 text-center text-xs text-muted-foreground">Sem cobrança. Seus dados serão usados apenas para avisar sobre o lançamento.</p>
            </form>
          ) : (
            <div className="py-4 text-center">
              <DialogHeader>
                <DialogTitle>Pré-reserva confirmada</DialogTitle>
                <DialogDescription className="pt-2">
                  Obrigado pelo interesse! Avisaremos você assim que o Trampô estiver disponível para o seu perfil.
                </DialogDescription>
              </DialogHeader>
              <Button className="mt-6" onClick={() => setPreReservationOpen(false)}>Continuar navegando</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
