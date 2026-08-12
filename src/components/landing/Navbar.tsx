import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

import Logo from "./Logo";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const navLinks = [
    { label: "Categorias", href: "#categorias" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Planos", href: "#planos" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
            onClick={() => navigate(user ? "/painel" : "/auth")}
          >
            {user ? "Meu Painel" : "Entrar"}
          </Button>
          <Button size="sm" onClick={() => navigate(user ? "/painel" : "/auth")}>
            {user ? "Painel" : "Cadastrar-se"}
          </Button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden ml-1 text-muted-foreground hover:text-foreground"
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background p-4 space-y-3 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-1 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(user ? "/painel" : "/auth")}
            >
              {user ? "Meu Painel" : "Entrar"}
            </Button>
            <Button className="w-full" onClick={() => navigate(user ? "/painel" : "/auth")}>
              {user ? "Painel" : "Cadastrar-se"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
