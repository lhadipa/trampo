/** Rotulo e cores de cada estado da custodia. */
export const escrowStatusLabel = (status: string) => {
  if (status === "held")
    return { label: "Retido em Custódia 🔒", box: "bg-amber-500/10", text: "text-amber-600" };
  if (status === "released")
    return { label: "Liberado ✅", box: "bg-emerald-500/10", text: "text-emerald-600" };
  if (status === "refunded")
    return { label: "Reembolsado", box: "bg-destructive/10", text: "text-destructive" };
  return { label: status, box: "bg-muted", text: "text-muted-foreground" };
};
