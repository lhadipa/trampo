/**
 * Faixa fixa avisando que o ambiente e' de demonstracao e que os pagamentos
 * sao simulados. Aparece apenas quando VITE_DEMO_MODE esta ligado, entao some
 * sozinha quando o app for para producao de verdade.
 */
const DemoBanner = () => {
  if (import.meta.env.VITE_DEMO_MODE !== "true") return null;

  return (
    <div className="sticky top-0 z-[60] bg-amber-500 text-amber-950 text-center text-xs font-medium py-1.5 px-3">
      Ambiente de demonstração — pagamentos e custódia são simulados, nenhum valor real é cobrado.
    </div>
  );
};

export default DemoBanner;
