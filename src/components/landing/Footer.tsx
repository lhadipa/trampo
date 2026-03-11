import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-secondary border-t border-secondary-foreground/10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Zap className="h-4 w-4 text-secondary-foreground" />
            </div>
            <span className="text-xl font-bold text-secondary-foreground">TrampoJá</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-secondary-foreground/60">
            <a href="#" className="hover:text-primary transition-colors">Como funciona</a>
            <a href="#" className="hover:text-primary transition-colors">Categorias</a>
            <a href="#" className="hover:text-primary transition-colors">Para empresas</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </nav>

          <p className="text-sm text-secondary-foreground/40">
            © 2026 TrampoJá · São João del Rei, MG
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
