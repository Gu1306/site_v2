/**
 * Conteúdo das landing pages de anúncio (rotas /lp/:slug).
 * Textos de sintoma/causa/FAQ vêm das páginas SEO existentes do site; nada aqui
 * promete cura.
 *
 * Duas ofertas (Gustavo, 08/11/2026):
 * - DOR que limita a corrida → avaliação completa com fisioterapeuta, R$ 180
 *   (é a "Avaliação de reabilitação" do /planos; sessão de tratamento R$ 130).
 * - RECOVERY → Sessão Dupla R$ 230 com retorno incluído.
 */

import { ORIENTACOES, type ServicoCarefit } from "@/lib/ofertasCarefit";
import { TESTIMONIALS } from "@/lib/depoimentosCarefit";

export type Foto = "fisio" | "recovery" | "corrida";

export interface Oferta {
  servico: ServicoCarefit;
  resultados: string[];
  /** Destaque no topo, ex.: "Avaliação completa R$ 180". */
  destaque: string;
  /** Complemento do destaque, ex.: "com fisioterapeuta". */
  complemento: string;
  botao: string;
  botaoCurto: string;
  passosTitulo: string;
  passos: { t: string; d: string }[];
  /** Frase do bloco final. */
  fim: string;
  /** Perguntas que valem para todas as páginas desta oferta. */
  faq: { q: string; a: string }[];
}

const COMO_AGENDAR = {
  q: "Como eu agendo?",
  a: "Escolha o fisioterapeuta e o horário no calendário. Depois, siga as instruções de pagamento e confirme com a equipe pelo WhatsApp.",
};

export const OFERTA_AVALIACAO: Oferta = {
  servico: "reabilitacao",
  resultados: ["Uma explicação do que foi observado na avaliação.", "Orientações iniciais sobre o que ajustar na sua rotina de treino.", "Uma proposta de tratamento, com os próximos passos para o seu caso."],
  destaque: "Avaliação completa R$ 180",
  complemento: "80 minutos com fisioterapeuta",
  botao: "Agendar minha avaliação",
  botaoCurto: "Agendar avaliação",
  passosTitulo: "Como é a sua avaliação",
  passos: [
    {
      t: "Sua história · 30 minutos",
      d: "Uma conversa sobre sua rotina de treino, provas, dores e histórico de lesões, organizada em um mapa mental.",
    },
    { t: "Avaliação física · 50 minutos", d: "O fisioterapeuta avalia seu caso e reúne as informações para orientar uma proposta de tratamento." },
    { t: "Proposta de tratamento", d: "Você sai com o plano do seu caso: o que fazer agora e quantas sessões fazem sentido." },
  ],
  fim: "Avaliação completa com fisioterapeuta: R$ 180.",
  faq: [
    {
      q: "O que acontece na avaliação?",
      a: "Um fisioterapeuta avalia o seu caso por completo, e você sai com uma proposta de tratamento e com o que ajustar no treino.",
    },
    {
      q: "E depois da avaliação?",
      a: "Se fizer sentido tratar, as sessões de fisioterapia custam R$ 130 cada. Você decide depois de ver a proposta.",
    },
    COMO_AGENDAR,
    ...ORIENTACOES.filter((item) => item.q !== "Como confirmo meu horário?"),
  ],
};

export const OFERTA_RECOVERY: Oferta = {
  servico: "dupla",
  resultados: ["Uma avaliação que considera seu histórico e sua rotina de treino.", "Cuidado personalizado e orientação dos próximos passos.", "Retorno de 1h em até 15 dias, incluído nos R$ 230."],
  destaque: "Sessão Dupla R$ 230",
  complemento: "80 min + retorno de 1h incluído",
  botao: "Agendar minha 1ª sessão",
  botaoCurto: "Agendar 1ª sessão",
  passosTitulo: "Como é a sua primeira sessão",
  passos: [
    { t: "Avaliação completa", d: "A gente entende como você está: treino, cansaço, histórico e o que o corpo sustenta hoje." },
    { t: "Direcionamento claro", d: "Você sai sabendo o que ajustar em treino, força e recuperação." },
    { t: "Retorno incluído", d: "Em até 15 dias, um segundo encontro de 1h para acompanhar sua resposta e ajustar os próximos passos." },
  ],
  fim: "Dois encontros por R$ 230. Retorno de 1h incluído em até 15 dias.",
  faq: [
    {
      q: "O que acontece na primeira sessão?",
      a: "A primeira sessão tem 80 minutos, com avaliação e cuidado personalizado. O retorno de 1h acontece em até 15 dias e está incluído nos R$ 230.",
    },
    COMO_AGENDAR,
    ...ORIENTACOES.filter((item) => item.q !== "Como confirmo meu horário?"),
  ],
};

export interface LpConfig {
  slug: string;
  /** Rótulo que vai junto do clique (analytics) e da mensagem de WhatsApp. */
  tag: string;
  seoTitulo: string;
  seoDescricao: string;
  /** Linha pequena acima do título. */
  selo: string;
  titulo: string;
  subtitulo: string;
  foto: Foto;
  oferta: Oferta;
  /** Bloco "Você se reconhece?" */
  reconhece: { titulo: string; itens: string[] };
  /** Bloco "Como a gente cuida" (3 a 4 itens curtos). */
  cuidado: { titulo: string; itens: { t: string; d: string }[] };
  /** Perguntas desta página; as da oferta entram depois, automaticamente. */
  faq: { q: string; a: string }[];
  /** Mensagem inicial do WhatsApp (sem a etiqueta de origem, que é acrescentada). */
  zap: string;
  /** Depoimentos AUTORIZADOS. Vazio = bloco não aparece. Preencher só com autorização. */
  depoimentos?: { texto: string; autor: string }[];
}

export const LPS: LpConfig[] = [
  {
    slug: "fisioterapia-ribeirao-preto",
    tag: "fisioterapia",
    seoTitulo: "Fisioterapia esportiva em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Fisioterapia esportiva em Ribeirão Preto. Avaliação individual com fisioterapeuta por R$ 180. Agende seu horário.",
    selo: "Atendimento presencial · Ribeirão Preto",
    titulo: "Fisioterapia esportiva em Ribeirão Preto",
    subtitulo: "Dor ou lesão está limitando sua corrida ou outro esporte? Faça uma avaliação individual e entenda os próximos passos para o seu caso.",
    foto: "fisio",
    oferta: OFERTA_AVALIACAO,
    depoimentos: TESTIMONIALS.filter((t) => t.ig === "eutalitakriunas" || t.ig === "edutorciano").map((t) => ({ texto: t.quote, autor: t.name })),
    reconhece: {
      titulo: "Isso acontece com você?",
      itens: [
        "Você reduziu ou interrompeu treinos por causa da dor",
        "A dor volta quando você retoma a corrida ou o esporte",
        "Quer entender o caso antes de decidir por um tratamento",
      ],
    },
    cuidado: {
      titulo: "O primeiro passo é entender o seu caso",
      itens: [
        { t: "Conversa sobre seu histórico", d: "Rotina de treino, provas, sintomas e o que mudou desde o início da dor." },
        { t: "Avaliação física", d: "O fisioterapeuta avalia seu caso e reúne informações para orientar a conduta." },
        { t: "Próximos passos", d: "Você recebe uma proposta de tratamento adequada ao que foi observado." },
      ],
    },
    faq: [
      {
        q: "A avaliação já inclui tratamento?",
        a: "A avaliação é o primeiro encontro: conversa, avaliação física e proposta para o seu caso. Se houver indicação, cada sessão de tratamento custa R$ 130. Você decide depois de conhecer a proposta.",
      },
      { q: "Preciso chegar com diagnóstico ou exame?", a: "Não é necessário ter um diagnóstico definido para agendar. Se você já tiver exames ou relatórios relacionados ao caso, pode levá-los para a conversa." },
    ],
    zap: "Oi! Estou com dor que está atrapalhando a corrida e quero agendar uma avaliação de fisioterapia na CareFit.",
  },
  {
    slug: "canelite",
    tag: "canelite",
    seoTitulo: "Canelite: tratamento em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor na canela ao correr? Avaliação completa com fisioterapeuta em Ribeirão Preto por R$ 180.",
    selo: "Canelite · Fisioterapia para corredores",
    titulo: "Dor na canela ao correr? Entenda a causa e volte a treinar",
    subtitulo: "A canelite costuma estar ligada a carga, força e pisada. Na avaliação com fisioterapeuta a gente entende o seu caso e monta o plano.",
    foto: "corrida",
    oferta: OFERTA_AVALIACAO,
    depoimentos: TESTIMONIALS.filter((t) => t.ig === "eutalitakriunas" || t.ig === "edutorciano").map((t) => ({ texto: t.quote, autor: t.name })),
    reconhece: {
      titulo: "Você sente isso?",
      itens: [
        "Dor na parte interna da canela durante ou depois da corrida",
        "Sensibilidade ao toque na região da tíbia",
        "Dor que melhora com repouso e piora quando você volta a treinar",
      ],
    },
    cuidado: {
      titulo: "Como a gente cuida da canelite",
      itens: [
        { t: "Terapia manual", d: "Reduz a tensão e a dor na região." },
        { t: "Exercícios terapêuticos", d: "Fortalecimento do tibial posterior, da panturrilha e do tornozelo." },
        { t: "Correção biomecânica", d: "Ajustes na mecânica da corrida para diminuir o impacto repetido." },
        { t: "Controle de carga", d: "Volume e intensidade de treino ajustados com critério." },
      ],
    },
    faq: [
      {
        q: "Posso continuar correndo com canelite?",
        a: "Em alguns casos é possível manter parte do treino com menos impacto e ajustes de volume. A avaliação ajuda a definir a progressão segura.",
      },
      {
        q: "Canelite pode virar fratura por estresse?",
        a: "Sim. Quando a sobrecarga continua sem tratamento adequado, pode evoluir para fratura por estresse da tíbia. Por isso vale avaliar cedo.",
      },
    ],
    zap: "Oi! Estou com dor na canela e quero agendar uma avaliação de fisioterapia na CareFit.",
  },
  {
    slug: "fascite-plantar",
    tag: "fascite-plantar",
    seoTitulo: "Fascite plantar: tratamento em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor no calcanhar ou na sola do pé? Avaliação completa com fisioterapeuta em Ribeirão Preto por R$ 180.",
    selo: "Fascite plantar · Fisioterapia para corredores",
    titulo: "Dor no calcanhar ao correr? Descubra a causa e volte a treinar",
    subtitulo: "Na avaliação com fisioterapeuta a gente olha pé, panturrilha e carga de treino para montar o plano do seu caso.",
    foto: "fisio",
    oferta: OFERTA_AVALIACAO,
    depoimentos: TESTIMONIALS.filter((t) => t.ig === "eutalitakriunas" || t.ig === "edutorciano").map((t) => ({ texto: t.quote, autor: t.name })),
    reconhece: {
      titulo: "Você sente isso?",
      itens: [
        "Dor no calcanhar, principalmente nos primeiros passos da manhã",
        "Dor que piora depois de ficar muito tempo em pé ou após correr",
        "Sensação de rigidez na planta do pé",
      ],
    },
    cuidado: {
      titulo: "Como a gente cuida da fascite plantar",
      itens: [
        { t: "Terapia manual", d: "Liberação da fáscia plantar, da panturrilha e da musculatura do pé." },
        { t: "Alongamento", d: "Foco na fáscia plantar e na cadeia posterior." },
        { t: "Fortalecimento", d: "Músculos do pé e da panturrilha para sustentar o arco plantar." },
        { t: "Controle de carga", d: "Volume de treino e orientação sobre calçado e superfície." },
      ],
    },
    faq: [
      {
        q: "Posso correr com fascite plantar?",
        a: "Em alguns casos é possível manter parte do treino com menos impacto e controle de carga. A avaliação ajuda a definir a progressão segura.",
      },
      {
        q: "Palmilha ajuda na fascite plantar?",
        a: "Pode ajudar no suporte do arco e na distribuição de carga, mas precisa ser avaliada para o seu caso.",
      },
    ],
    zap: "Oi! Estou com dor no calcanhar e quero agendar uma avaliação de fisioterapia na CareFit.",
  },
  {
    slug: "dor-no-joelho",
    tag: "dor-no-joelho",
    seoTitulo: "Dor no joelho ao correr: fisioterapia em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor no joelho na corrida? Avaliação completa com fisioterapeuta em Ribeirão Preto por R$ 180.",
    selo: "Joelho do corredor · Fisioterapia esportiva",
    titulo: "Dor no joelho ao correr? Veja se continua, ajusta ou investiga",
    subtitulo: "Muitas vezes é sobrecarga ou desequilíbrio muscular. A avaliação com fisioterapeuta mostra o que está pesando no seu joelho e o que ajustar.",
    foto: "corrida",
    oferta: OFERTA_AVALIACAO,
    depoimentos: TESTIMONIALS.filter((t) => t.ig === "eutalitakriunas" || t.ig === "edutorciano").map((t) => ({ texto: t.quote, autor: t.name })),
    reconhece: {
      titulo: "Você sente isso?",
      itens: [
        "Dor na frente do joelho, ao redor da patela",
        "Dor ao subir ou descer escadas",
        "Dor durante ou depois da corrida, principalmente em subidas",
      ],
    },
    cuidado: {
      titulo: "Como a gente cuida do joelho",
      itens: [
        { t: "Fortalecimento", d: "Quadríceps e glúteos para dar mais estabilidade ao joelho." },
        { t: "Terapia manual", d: "Mobilização da patela e liberação de tecidos moles." },
        { t: "Correção biomecânica", d: "Ajuste da mecânica de corrida para aliviar a articulação." },
        { t: "Controle de carga", d: "Volume e intensidade com critérios claros para cada fase." },
      ],
    },
    faq: [
      {
        q: "Posso correr com dor no joelho?",
        a: "Em alguns casos é possível manter parte do treino com ajustes de volume e intensidade. A avaliação ajuda a determinar a progressão segura.",
      },
      {
        q: "Dor no joelho na corrida é grave?",
        a: "Nem sempre. Muitas vezes vem de sobrecarga ou desequilíbrios musculares, mas deve ser avaliada para não piorar.",
      },
    ],
    zap: "Oi! Estou com dor no joelho ao correr e quero agendar uma avaliação de fisioterapia na CareFit.",
  },
  {
    slug: "tendinite-aquiles",
    tag: "aquiles",
    seoTitulo: "Dor no tendão de Aquiles: fisioterapia em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor no tendão de Aquiles ao correr? Avaliação completa com fisioterapeuta em Ribeirão Preto por R$ 180.",
    selo: "Tendão de Aquiles · Fisioterapia para corredores",
    titulo: "Dor no tendão de Aquiles? Ajuste a carga e volte a correr com segurança",
    subtitulo: "Na avaliação com fisioterapeuta a gente olha carga, força da panturrilha e mobilidade para montar o plano do seu caso.",
    foto: "fisio",
    oferta: OFERTA_AVALIACAO,
    depoimentos: TESTIMONIALS.filter((t) => t.ig === "eutalitakriunas" || t.ig === "edutorciano").map((t) => ({ texto: t.quote, autor: t.name })),
    reconhece: {
      titulo: "Você sente isso?",
      itens: [
        "Dor e rigidez na parte de trás do tornozelo",
        "Dor que piora no início do treino e pode melhorar durante",
        "Espessamento ou inchaço no tendão",
      ],
    },
    cuidado: {
      titulo: "Como a gente cuida do Aquiles",
      itens: [
        { t: "Exercícios excêntricos", d: "Protocolo de fortalecimento da panturrilha para o tendão." },
        { t: "Terapia manual", d: "Liberação miofascial no tendão e na musculatura próxima." },
        { t: "Controle de carga", d: "Volume e intensidade ajustados para o tendão se adaptar." },
        { t: "Fortalecimento funcional", d: "Integrado ao gesto da corrida para evitar que a dor volte." },
      ],
    },
    faq: [
      {
        q: "Posso correr com tendinite do Aquiles?",
        a: "Em alguns casos é possível manter parte do treino com menos impacto e ajustes de volume. A avaliação ajuda a determinar a progressão segura.",
      },
      {
        q: "Tendinite do Aquiles pode virar ruptura?",
        a: "Se a sobrecarga continuar sem tratamento adequado, a tendinopatia pode evoluir para ruptura parcial ou total. Vale avaliar cedo.",
      },
    ],
    zap: "Oi! Estou com dor no tendão de Aquiles e quero agendar uma avaliação de fisioterapia na CareFit.",
  },
  {
    slug: "recovery",
    tag: "recovery",
    seoTitulo: "Recovery esportivo em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Recovery esportivo em Ribeirão Preto para quem treina. Sessão dupla por R$ 230, com retorno de 1h incluído. Agende online.",
    selo: "Atendimento presencial · Ribeirão Preto",
    titulo: "Recovery esportivo para a sua rotina de treino",
    subtitulo: "Depois do longão, de uma semana intensa ou de uma prova, faça uma sessão personalizada e tenha um retorno para acompanhar sua resposta.",
    foto: "recovery",
    oferta: OFERTA_RECOVERY,
    reconhece: {
      titulo: "Para quem é",
      itens: [
        "Você acabou de fazer um longão ou uma prova",
        "Sua semana de treino está mais intensa que o habitual",
        "Quer conversar com um fisioterapeuta sobre sua recuperação",
      ],
    },
    cuidado: {
      titulo: "O que acontece na Sessão Dupla",
      itens: [
        { t: "Entender o momento", d: "Conversa sobre treino, histórico e como você está se sentindo." },
        { t: "Cuidado personalizado", d: "A sessão é conduzida de acordo com o que faz sentido para o seu caso." },
        { t: "Retorno incluído", d: "Um segundo encontro de 1h em até 15 dias para acompanhar sua resposta e orientar os próximos passos." },
      ],
    },
    faq: [
      {
        q: "O que significa Sessão Dupla?",
        a: "São 80 minutos no primeiro encontro e um retorno de 1h em até 15 dias. Os dois encontros estão incluídos no valor de R$ 230.",
      },
      { q: "Preciso estar lesionado para fazer recovery?", a: "Não. A sessão começa com uma conversa sobre seu treino e seu momento. O fisioterapeuta avalia o que faz sentido para você." },
    ],
    zap: "Oi! Quero agendar minha primeira sessão de recovery na CareFit.",
  },
];

export const LP_POR_SLUG: Record<string, LpConfig> = Object.fromEntries(LPS.map((l) => [l.slug, l]));
