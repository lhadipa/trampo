/**
 * Seeds de demonstracao copiados dos dashboards web, para a apresentacao mostrar
 * as mesmas telas cheias mesmo com o banco local vazio. Quando a API local
 * devolve dados reais, eles tem precedencia (mesma regra do app web).
 */

export const showcaseWorkers = [
  {
    id: "demo-1",
    user_id: "u-1",
    name: "Carlos Eduardo Pinturas",
    category: "Pintor Residencial / Comercial",
    rating: 4.9,
    completed: 38,
    location: "São João del-Rei / MG",
  },
  {
    id: "demo-2",
    user_id: "u-2",
    name: "Rodrigo Piscinas & Manutenção",
    category: "Limpador de Piscina / Piscineiro",
    rating: 5.0,
    completed: 52,
    location: "Tiradentes / MG",
  },
  {
    id: "demo-3",
    user_id: "u-3",
    name: "Marcos Vinicius Elétrica",
    category: "Eletricista",
    rating: 4.8,
    completed: 44,
    location: "São João del-Rei / MG",
  },
  {
    id: "demo-4",
    user_id: "u-4",
    name: "Lucas Silveira Eventos",
    category: "Garçom / Garçonete",
    rating: 4.9,
    completed: 61,
    location: "São João del-Rei / MG",
  },
  {
    id: "demo-5",
    user_id: "u-5",
    name: "Mariana Costa Diárias",
    category: "Faxineira / Diarista Residencial",
    rating: 5.0,
    completed: 77,
    location: "São João del-Rei / MG",
  },
  {
    id: "demo-6",
    user_id: "u-6",
    name: "Felipe Montador Rápido",
    category: "Montador de Móveis",
    rating: 4.7,
    completed: 29,
    location: "Santa Cruz de Minas / MG",
  },
  {
    id: "demo-7",
    user_id: "u-7",
    name: "Juliana Mendes Gastronomia",
    category: "Cozinheiro(a)",
    rating: 4.9,
    completed: 43,
    location: "São João del-Rei / MG",
  },
  {
    id: "demo-8",
    user_id: "u-8",
    name: "Bruno Bombeiro Hidráulico",
    category: "Encanador / Bombeiro Hidráulico",
    rating: 4.9,
    completed: 40,
    location: "São João del-Rei / MG",
  },
];

export const showcaseJobs = [
  {
    id: "job-1",
    title: "Pintor para Sala Comercial e Fachada",
    companies: { name: "Imobiliária & Consultórios Vertentes" },
    date: new Date().toISOString(),
    price: 220,
    urgent: true,
    category: "reformas-manutencao",
    description:
      "Aplicação de 2 demãos de tinta látex em sala de 40m². Tinta e rolos inclusos pelo contratante.",
    location: "Centro / São João del-Rei",
  },
  {
    id: "job-2",
    title: "Limpador de Piscina e Tratamento Químico",
    companies: { name: "Pousada Vila das Águas" },
    date: new Date(Date.now() + 86400000).toISOString(),
    price: 160,
    urgent: false,
    category: "piscinas-conservacao",
    description: "Aspiração de fundo, decantação e controle de pH e cloro para o fim de semana.",
    location: "Tiradentes / MG",
  },
  {
    id: "job-3",
    title: "Eletricista para Instalação de Painel",
    companies: { name: "Empório & Restaurante Mineiro" },
    date: new Date().toISOString(),
    price: 250,
    urgent: true,
    category: "reformas-manutencao",
    description:
      "Substituição de disjuntores e instalação de 4 novas tomadas industriais para cozinha.",
    location: "São João del-Rei / MG",
  },
  {
    id: "job-4",
    title: "Garçom / Atendente de Salão (Noturno)",
    companies: { name: "Cervejaria Artesanal del-Rei" },
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    price: 150,
    urgent: false,
    category: "gastronomia-hospitalidade",
    description: "Turno das 18h às 00h. Atendimento de mesas e pedidos pelo tablet. Refeição inclusa.",
    location: "Bairro Matosinhos / SJDR",
  },
  {
    id: "job-5",
    title: "Diarista / Faxina Residencial Completa",
    companies: { name: "Residencial Parque das Flores" },
    date: new Date(Date.now() + 86400000).toISOString(),
    price: 170,
    urgent: false,
    category: "piscinas-conservacao",
    description: "Apartamento de 3 quartos, limpeza detalhada de vidros, pisos e cozinha.",
    location: "São João del-Rei / MG",
  },
];

export const showcaseEscrows = [
  {
    id: "esc-1",
    amount: 180,
    status: "held",
    created_at: new Date().toISOString(),
    users: { name: "Carlos Eduardo Pinturas" },
    service: "Pintura Residencial e Retoque de Fachada",
  },
  {
    id: "esc-2",
    amount: 140,
    status: "released",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    users: { name: "Rodrigo Piscinas & Manutenção" },
    service: "Tratamento de Água e Aspiração de Piscina",
  },
];

export const escrowStatusLabel = (status: string) => {
  if (status === "held")
    return { label: "Retido em Custódia 🔒", box: "bg-amber-500/10", text: "text-amber-600" };
  if (status === "released")
    return { label: "Liberado ✅", box: "bg-emerald-500/10", text: "text-emerald-600" };
  if (status === "refunded")
    return { label: "Reembolsado", box: "bg-destructive/10", text: "text-destructive" };
  return { label: status, box: "bg-muted", text: "text-muted-foreground" };
};
