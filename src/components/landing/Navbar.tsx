import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <Zap className="h-4 w-4 text-secondary-foreground" />
          </div>
          <span className="text-xl font-bold text-secondary-foreground">TrampoJá</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-secondary-foreground/70">
          <a href="#categorias" className="hover:text-primary transition-colors">Categorias</a>
          <a href="#como-funciona" className="hover:text-primary transition-colors">Como funciona</a>
          <a href="#precos" className="hover:text-primary transition-colors">Preços</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-foreground/10">
            Entrar
          </Button>
          <Button variant="hero" size="sm">Cadastre-se</Button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-secondary-foreground">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-secondary border-t border-secondary-foreground/5 p-4 space-y-3 animate-fade-in">
          <a href="#categorias" className="block text-secondary-foreground/70 hover:text-primary py-2">Categorias</a>
          <a href="#como-funciona" className="block text-secondary-foreground/70 hover:text-primary py-2">Como funciona</a>
          <a href="#" className="block text-secondary-foreground/70 hover:text-primary py-2">Para empresas</a>
          <div className="pt-2 space-y-2">
            <Button variant="heroOutline" className="w-full text-secondary-foreground border-secondary-foreground/30">Entrar</Button>
            <Button variant="hero" className="w-full">Cadastre-se</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
