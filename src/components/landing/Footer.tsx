import { useNavigate } from "react-router-dom";

import Logo from "./Logo";

const footerGroups = [
  {
    title: "Plataforma",
    links: [
      { label: "Cadastrar-se", href: "/auth" },
      { label: "Entrar", href: "/auth" },
    ],
  },
  {
    title: "Empresas",
    links: [
      { label: "Publicar vaga", href: "/criar-vaga" },
      { label: "Painel", href: "/painel" },
    ],
  },
  {
    title: "Trabalhadores",
    links: [
      { label: "Painel", href: "/painel" },
      { label: "Disponibilidade", href: "/disponibilidade" },
    ],
  },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-sm space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Conecte-se a trabalhos rápidos e próximos de você. O Trampô une
              contratantes e trabalhadores locais de forma simples, segura e
              sem burocracia.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => navigate(link.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-8 h-px bg-border" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Trampô. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span>Termos de uso</span>
            <span>Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
