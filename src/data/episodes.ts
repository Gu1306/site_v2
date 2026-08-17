// Fonte única dos episódios do CareFit Cast.
// Consumida pela página /carefit-cast e pelo índice de conteúdo em /comunidade.
// Para adicionar um episódio novo, cole um objeto no TOPO do array.

export type Episode = {
  youtubeId: string;
  spotifyUrl?: string;
  title: string;
  guest: string;
  description: string;
};

export const episodes: Episode[] = [
  {
    youtubeId: "v9DUmlZFRkE",
    title: "EP 12 — A prova começa antes da largada: Paulo Galvão e o 4º lugar geral nos 110 km da La Mission",
    guest: "Paulo Galvão",
    description:
      "Gravado durante a última sessão de preparação antes dos 110 km da La Mission, este episódio acompanha Paulo Galvão entre botinha de recovery, fotobiomodulação, mentalização do percurso e banheira de gelo. Ele fala sobre rotina, sono, desconforto, estratégia e a batalha mental de uma prova longa — e sobre a diferença entre buscar colocação e fazer a sua melhor prova. Um episódio sobre chegar inteiro, confiar no processo e reconhecer a rede de apoio por trás de cada linha de chegada.",
  },
  {
    youtubeId: "mj84l_XH-A4",
    title: "EP 11 — Porto Alegre vs. Rio: Qual é a Melhor Maratona do Brasil?",
    guest: "Lívia Dias, Gustavo Garbelline (For One) e Paulo Galvão (Corre Galva)",
    description:
      "Bate-papo de peso sobre as duas maratonas mais emblemáticas do Brasil: a Internacional de Porto Alegre e a Maratona do Rio, ambas recém-realizadas. Lívia Dias relembra sua primeira meia maratona em Porto Alegre, enquanto Gustavo Garbelline e Paulo Galvão — que correram as duas provas — comparam percursos, energia, organização e emoção. Treinamento, mentalidade e as histórias por trás de cada prova.",
  },
  {
    youtubeId: "ASQJVCNmqJ0",
    spotifyUrl: "https://open.spotify.com/episode/4hGBdijnPhBEP5ThjXTMmw",
    title: "EP 10 — Série Assessorias de RP – Rangel Racing Team",
    guest: "Coach Rangel",
    description:
      "De soldado a maratonista sub-3: a história de quem escolheu ser o condutor da própria vida. Helenilton Rangel, fundador da Rangel Racing Team, compartilha sua trajetória desde a infância no interior da Bahia, passando por 30 anos de vida militar, até a fundação de uma das assessorias mais respeitadas de Ribeirão Preto. Com 48 maratonas no currículo, sendo 41 abaixo de 3 horas, incluindo Boston e Nova York.",
  },
  {
    youtubeId: "0NLCzuD8ops",
    title: "EP 09 — Série Assessorias de RP – Assessoria Cássio Lucca",
    guest: "Cássio Lucca",
    description:
      "Uma história inspiradora de resiliência e transformação. Cássio Lucca, fundador da Assessoria Cássio Lucca, compartilha sua trajetória desde os campos de futebol até a criação de sua assessoria em Ribeirão Preto, sua visão sobre o exercício como ferramenta de transformação e como sua equipe respeita a história de cada aluno.",
  },
  {
    youtubeId: "3WPQLAiSl1w",
    title: "EP 08 — Série Assessorias de RP – Triple Assessoria com Murilo Bredariol",
    guest: "Murilo Bredariol",
    description:
      "Uma conversa profunda sobre triathlon, ciência do treinamento e construção de performance. Murilo Bredariol, fundador da Triple Assessoria, compartilha sua jornada desde a natação até a criação de uma das assessorias mais respeitadas de Ribeirão Preto.",
  },
  {
    youtubeId: "OpRJlI_ZMgA",
    title: "EP 07 — Série Assessorias de RP – EBTT Team",
    guest: "Ronaldo Pereira, Miguel Junio e Lilian Vidal",
    description:
      "Uma conversa sobre triathlon, treinamento, mentalidade e a construção de performance no esporte de endurance.",
  },
  {
    youtubeId: "_r-g3onMDpk",
    title: "EP 06 — Correr por tempo vs correr para terminar",
    guest: "Livia Dias, Rafael Paiva e Gustavo Garbelline",
    description:
      "Uma reflexão profunda sobre propósito na corrida e o equilíbrio entre performance e prazer no esporte.",
  },
  {
    youtubeId: "nFXn32dLPcs",
    title: "EP 05 — Série Assessorias de RP – Fun Sports com Eduardo Visentini",
    guest: "Eduardo Visentini",
    description:
      "A história da criação da Fun Sports e a filosofia de treinamento que já impactou mais de mil corredores em Ribeirão Preto.",
  },
  {
    youtubeId: "3VLhoyIVGYs",
    title: "EP 04 — Jornada Propósito – Como 3 profissionais transformam corredores em 12 semanas",
    guest: "Time CareFit — Lívia Dias, Guilherme Coelho, Artur Angelotti e Gustavo Rosa",
    description:
      "Um episódio especial explicando como nutrição, fortalecimento e fisioterapia integrados transformam a jornada de corredores.",
  },
  {
    youtubeId: "tyI3dm4QJJc",
    title: "EP 03 — Da aversão ao esporte às 3 maratonas em 1 ano – Juliana Vinha",
    guest: "Juliana Vinha",
    description:
      "A incrível transformação de Juliana Vinha, que passou de evitar educação física na escola a completar três maratonas em menos de um ano.",
  },
  {
    youtubeId: "y7Ok9CbQlxg",
    title: "EP 02 — Da luta contra o câncer à ultramaratona – Leonardo Rosa",
    guest: "Leonardo Rosa",
    description:
      "Uma das histórias mais impactantes do CareFit Cast. Leonardo Rosa compartilha sua jornada do diagnóstico de câncer aos 26 anos até conquistas épicas nas ultramaratonas.",
  },
  {
    youtubeId: "o745w19TQeo",
    title: "EP 01 — Paulo Galvão – Da infância em Bonfim Paulista ao top 6 da La Mission Brasil 100km",
    guest: "Paulo Galvão",
    description:
      "Uma jornada inspiradora de superação, disciplina e força mental que levou Paulo Galvão a se tornar um dos grandes nomes do trail running nacional.",
  },
];

export const CHANNEL_URL = "https://www.youtube.com/@CAREFITRUNBASE";

export const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
export const ytEmbed = (id: string) => `https://www.youtube.com/embed/${id}?rel=0`;
export const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
