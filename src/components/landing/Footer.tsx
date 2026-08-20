import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const footerGroups = [
  {
    title: "Plataforma",
    links: [
      { label: "Cadastrar-se Grátis", href: "/auth" },
      { label: "Entrar na Conta", href: "/auth" },
      { label: "Radar SOS Turbo", href: "/urgente" },
    ],
  },
  {
    title: "Contratantes & PMEs",
    links: [
      { label: "Publicar Vaga / Diária", href: "/criar-vaga" },
      { label: "Painel de Gestão", href: "/painel" },
      { label: "Recibos & Conformidade RPA", href: "/termos" },
    ],
  },
  {
    title: "Prestadores & Autônomos",
    links: [
      { label: "Painel do Profissional", href: "/painel" },
      { label: "Agenda & Disponibilidade", href: "/disponibilidade" },
      { label: "Garantia Pix Anti-Calote", href: "/termos" },
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
              A infraestrutura digital de contratação rápida para pintores, piscineiros, garçons, eletricistas, diaristas e dezenas de especialidades. Conectando pessoas e negócios em todo o Brasil.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-foreground">
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

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Trampô Tecnologia. Todos os direitos reservados. Brasil 🇧🇷
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/termos")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Termos de Uso & Autonomia (Art. 442-B CLT)
            </button>
            <button
              onClick={() => navigate("/termos")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacidade & Garantia Escrow
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
