/** Ofertas e agendas públicas verificadas em 11/11/2026. */
export const OFERTAS = {
  dupla: {
    nome: "Primeira Sessão Dupla", valor: "R$ 230", duracao: "80 min + retorno de 1h",
    resumo: "Avaliação e cuidado personalizado no primeiro encontro, com retorno incluído em até 15 dias.",
    pagina: "/conheca-a-carefit",
    agendas: { Igor: "https://calendar.app.google/ZCfVQVRJ2ixyQ6Xj6", Lais: "https://calendar.app.google/8r6VBjsgfK1WiBWY8" },
  },
  reabilitacao: {
    nome: "Avaliação de reabilitação", valor: "R$ 180", duracao: "80 min com fisioterapeuta",
    resumo: "Conversa sobre seu histórico, avaliação física e proposta de tratamento para o seu caso.",
    pagina: "/lp/fisioterapia-ribeirao-preto",
    agendas: { Igor: "https://calendar.app.google/Av1wz7zCBixHRvpJ9", Lais: "https://calendar.app.google/V6csYAUdvWsTQRKS7" },
  },
} as const;
export type ServicoCarefit = keyof typeof OFERTAS;
export function servicoCarefit(valor: string | null): ServicoCarefit | null {
  return valor === "dupla" || valor === "reabilitacao" ? valor : null;
}
export const agendamentoCarefit = (servico: ServicoCarefit) => `/primeira-sessao?servico=${servico}`;
export function whatsappOferta(servico: ServicoCarefit) {
  const oferta = OFERTAS[servico];
  return `https://api.whatsapp.com/send?phone=5516996008849&text=${encodeURIComponent(`Oi! Quero agendar ${oferta.nome} na CareFit (${oferta.valor}). Pode me ajudar?`)}`;
}
export const ORIENTACOES = [
  { q: "Como confirmo meu horário?", a: "Escolha o profissional, reserve um horário no Google Agenda e siga as instruções de pagamento. A sessão só é confirmada após o pagamento e o ok da equipe pelo WhatsApp." },
  { q: "O que preciso levar?", a: "Venha com roupa confortável. Para a avaliação de reabilitação, traga também o tênis que você usa nos treinos. Se tiver exames anteriores, fale com a equipe sobre o que levar." },
  { q: "Posso reagendar?", a: "Reagendamentos e cancelamentos devem ser feitos com pelo menos 24 horas de antecedência. Fora desse prazo, a sessão é cobrada integralmente." },
];
