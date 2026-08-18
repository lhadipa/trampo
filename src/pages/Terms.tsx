import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileText, Scale, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center justify-between h-14 max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Trampô" className="w-6 h-6" />
              <span className="font-bold text-secondary-foreground text-sm">Trampô</span>
            </div>
          </div>
          <span className="text-xs text-secondary-foreground/60 hidden sm:inline">
            Atualizado em Agosto/2026 • São João del-Rei/MG
          </span>
        </div>
      </header>

      <main className="container py-10 max-w-4xl mx-auto px-4 space-y-8">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Marco Jurídico e Termos de Uso
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Termos de Uso, Mediação Tecnológica e Declaração de Autonomia
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Por favor, leia atentamente as disposições abaixo. Ao utilizar a plataforma <strong>Trampô</strong>,
            você concorda expressa e integralmente com as condições aqui estabelecidas.
          </p>
        </div>

        {/* Highlight Box - Isenção Trabalhista */}
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-base">
              <Scale className="h-5 w-5" />
              1. Natureza Jurídica da Plataforma e Ausência de Vínculo Empregatício (Anti-CLT)
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              O <strong>Trampô</strong> é exclusivamente uma <strong>plataforma de tecnologia (SaaS)</strong> voltada
              à aproximação e intermediação de negócios entre <strong>Tomadores de Serviços (Empresas/Pessoas Físicas)</strong> e{" "}
              <strong>Prestadores de Serviços Autônomos / MEI</strong>.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Inexistência de Subordinação Jurídica:</strong> O Trampô não exerce poder diretivo, disciplinar ou de fiscalização sobre os horários, rotinas ou execução dos serviços prestados. O profissional possui total autonomia para aceitar, recusar ou negociar demandas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Não-Exclusividade:</strong> Os Prestadores de Serviços cadastrados são livres para prestar serviços concorrentes a qualquer outra empresa ou plataforma simultaneamente.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Enquadramento Legal (Art. 442-B da CLT):</strong> A contratação do autônomo, cumpridas as formalidades legais, com ou sem exclusividade, de forma contínua ou não, afasta a qualidade de empregado prevista no art. 3º da CLT.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 2: Cadastro e Responsabilidade dos Usuários */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            2. Cadastro e Qualificação das Partes
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong>2.1. Do Contratante (Empresa / Tomador):</strong> O Contratante declara que as vagas publicadas representam demandas pontuais, lícitas e eventuais, comprometendo-se a respeitar as condições acordadas e a honrar o pagamento ajustado via custódia ou diretamente ao profissional.
            </p>
            <p>
              <strong>2.2. Do Prestador (Trabalhador Autônomo / MEI):</strong> O Prestador declara possuir capacidade técnica, civil e jurídica para prestar os serviços informados, sendo responsável direto pelo cumprimento do acordado com pontualidade e integridade.
            </p>
          </div>
        </div>

        {/* Section 3: Pagamentos, Custódia e Taxa de Intermediação */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            3. Fluxo Financeiro, Custódia (Escrow) e Taxas
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong>3.1. Retenção em Custódia:</strong> Quando contratado via pagamento na plataforma, o valor acordado permanece temporariamente retido em garantia (*Escrow*), sendo repassado ao Prestador logo após a confirmação de conclusão do serviço pelo Contratante.
            </p>
            <p>
              <strong>3.2. Taxa de Serviço e Tecnologia:</strong> O Trampô poderá cobrar taxas de intermediação tecnológica, mensalidade de software (Planos Pro) ou serviços avulsos de destaque e convite urgente. Tais valores referem-se estritamente ao licenciamento do software e ferramentas digitais.
            </p>
          </div>
        </div>

        {/* Section 4: Cancelamentos e Pontualidade */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            4. Política de Confiabilidade e Não-Comparecimento (No-Show)
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Para preservar a segurança da comunidade de São João del-Rei e região, o Prestador que aceitar uma demanda obriga-se a realizar a confirmação prévia (Check-in). Desistências imotivadas de última hora ou ausência (*No-Show*) acarretarão penalidades na pontuação de reputação ou suspensão temporária da conta na plataforma.
            </p>
          </div>
        </div>

        {/* Section 5: Foro */}
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-foreground">5. Foro de Eleição</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fica eleito o Foro da Comarca de <strong>São João del-Rei, Estado de Minas Gerais</strong>, para dirimir quaisquer dúvidas ou litígios decorrentes da interpretação destes Termos de Uso, com expressa renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Button variant="hero" size="lg" onClick={() => navigate(-1)} className="px-8">
            Compreendi e Concordo
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Terms;
