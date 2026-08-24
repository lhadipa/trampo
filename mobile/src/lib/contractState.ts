export const CONTRACT_STATES = {
  AWAITING_ACCEPTANCE: { label: "Aguardando aceite", tone: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  AWAITING_PAYMENT: { label: "Aguardando pagamento", tone: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  FUNDS_SECURED: { label: "Pagamento protegido", tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  SCHEDULED: { label: "Agendado", tone: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  IN_PROGRESS: { label: "Em andamento", tone: "bg-violet-500/10 text-violet-700 border-violet-500/20" },
  AWAITING_COMPLETION_CONFIRMATION: { label: "Aguardando confirmação", tone: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  COMPLETED: { label: "Concluído", tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  RELEASED: { label: "Pagamento liberado", tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  CANCELLED: { label: "Cancelado", tone: "bg-slate-500/10 text-slate-700 border-slate-500/20" },
  DISPUTED: { label: "Em disputa", tone: "bg-red-500/10 text-red-700 border-red-500/20" },
} as const;
export const getContractState = (state?: string) => CONTRACT_STATES[state as keyof typeof CONTRACT_STATES] ?? { label: state || "Em análise", tone: "bg-muted text-muted-foreground" };
