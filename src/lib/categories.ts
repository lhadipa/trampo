export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  badge: string;
  avgDailyRate: string;
  subservices: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "reformas-manutencao",
    name: "Reformas & Manutenção",
    description: "Pintores, eletricistas, encanadores, pedreiros e maridos de aluguel para reparos rápidos.",
    iconName: "Paintbrush",
    badge: "Alta Demanda",
    avgDailyRate: "R$ 150 - R$ 280",
    subservices: [
      "Pintor Residencial / Comercial",
      "Eletricista",
      "Encanador / Bombeiro Hidráulico",
      "Pedreiro / Ajudante de Obra",
      "Montador de Móveis",
      "Marido de Aluguel / Pequenos Reparos",
      "Instalador de Ar-Condicionado",
      "Gesseiro / Drywall",
      "Chaveiro",
    ],
  },
  {
    id: "piscinas-conservacao",
    name: "Piscinas & Conservação",
    description: "Tratamento de piscinas, diaristas, faxinas pós-obra e jardinagem.",
    iconName: "Waves",
    badge: "Recorrente",
    avgDailyRate: "R$ 120 - R$ 220",
    subservices: [
      "Limpador de Piscina / Piscineiro",
      "Faxineira / Diarista Residencial",
      "Limpeza Pós-Obra / Comercial",
      "Jardineiro / Poda e Manutenção",
      "Higienização de Estofados / Colchões",
      "Passadeira de Roupas",
    ],
  },
  {
    id: "gastronomia-hospitalidade",
    name: "Gastronomia & Bares",
    description: "Garçons, cozinheiros, barmen e auxiliares para restaurantes, bares e pousadas.",
    iconName: "Utensils",
    badge: "Fins de Semana & Noturno",
    avgDailyRate: "R$ 100 - R$ 180",
    subservices: [
      "Garçom / Garçonete",
      "Cozinheiro(a)",
      "Auxiliar de Cozinha",
      "Barman / Bartender",
      "Churrasqueiro Profissional",
      "Sushiman / Pizzaiolo",
      "Atendente de Salão / Balcão",
      "Copeiro(a)",
    ],
  },
  {
    id: "eventos-producao",
    name: "Eventos & Festas",
    description: "Equipe de apoio, seguranças, recepcionistas, DJs e montagem para eventos.",
    iconName: "PartyPopper",
    badge: "Finais de Semana",
    avgDailyRate: "R$ 130 - R$ 250",
    subservices: [
      "Segurança de Eventos",
      "Recepcionista / Hostess",
      "DJ / Sonorização",
      "Apoio de Montagem e Carregamento",
      "Fotógrafo de Eventos",
      "Monitor / Recreador Infantil",
    ],
  },
  {
    id: "beleza-bem-estar",
    name: "Beleza & Bem-Estar",
    description: "Profissionais autônomos para salões, barbearias ou atendimento domiciliar.",
    iconName: "Scissors",
    badge: "Atendimento Rápido",
    avgDailyRate: "R$ 90 - R$ 200",
    subservices: [
      "Manicure & Pedicure",
      "Cabeleireiro(a) / Escovista",
      "Barbeiro",
      "Designer de Sobrancelhas / Cílios",
      "Maquiadora Profissional",
      "Massoterapeuta",
    ],
  },
  {
    id: "logistica-comercio",
    name: "Comércio, Carga & Apoio",
    description: "Reforço para estoques, entregas rápidas, reposição e balcão em datas sazonais.",
    iconName: "Truck",
    badge: "Sob Demanda",
    avgDailyRate: "R$ 90 - R$ 160",
    subservices: [
      "Entregador / Motoboy",
      "Repositor de Mercadorias",
      "Ajudante de Carga e Mudanças",
      "Atendente de Loja / Balcão",
      "Operador de Caixa Extra",
      "Pet Sitter / Cuidador de Pets",
      "Cuidador(a) de Idosos / Acompanhante",
    ],
  },
];

// Lista linear completa para selects e pesquisas rápidas
export const ALL_SERVICE_TYPES: string[] = Array.from(
  new Set(SERVICE_CATEGORIES.flatMap((c) => c.subservices))
).sort();

export const BRAZILIAN_REGIONS_PRESET = [
  "São João del-Rei e Campo das Vertentes / MG",
  "Belo Horizonte e Região Metropolitana / MG",
  "Juiz de Fora e Zona da Mata / MG",
  "Tiradentes e Região Histórica / MG",
  "Divinópolis e Centro-Oeste / MG",
  "Campinas e Interior / SP",
  "São Paulo Capital / SP",
  "Ribeirão Preto / SP",
  "Curitiba e Região / PR",
  "Goiânia e Região / GO",
  "Todo o Brasil (Expansão Nacional)",
];
