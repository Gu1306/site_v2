/**
 * Conteúdo das landing pages de anúncio (rotas /lp/:slug).
 * Textos de sintoma/causa/FAQ vêm das páginas SEO existentes do site; nada aqui
 * promete cura. Preço: R$ 230 e a 2ª sessão é cortesia (confirmado no site em 12/10/2026).
 */

export type Foto = "fisio" | "recovery" | "corrida";

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
  /** Bloco "Você se reconhece?" */
  reconhece: { titulo: string; itens: string[] };
  /** Bloco "Como a gente cuida" (3 a 4 itens curtos). */
  cuidado: { titulo: string; itens: { t: string; d: string }[] };
  faq: { q: string; a: string }[];
  /** Mensagem inicial do WhatsApp (sem a etiqueta de origem, que é acrescentada). */
  zap: string;
  /** Depoimentos AUTORIZADOS. Vazio = bloco não aparece. Preencher só com autorização. */
  depoimentos?: { texto: string; autor: string }[];
}

const FAQ_COMUM = [
  {
    q: "O que acontece na primeira sessão?",
    a: "Você faz uma avaliação completa do seu caso e sai com um direcionamento claro do que fazer. Quem faz a primeira sessão ganha a segunda de cortesia.",
  },
  {
    q: "Como eu agendo?",
    a: "Escolha o profissional e o horário no calendário, ou chame no WhatsApp. Leva poucos minutos.",
  },
];

export const LPS: LpConfig[] = [
  {
    slug: "fisioterapia-ribeirao-preto",
    tag: "fisioterapia",
    seoTitulo: "Fisioterapia esportiva em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Fisioterapia para quem corre e treina em Ribeirão Preto. 1ª sessão R$ 230 e a 2ª de cortesia. Agende online.",
    selo: "Fisioterapia esportiva · Ribeirão Preto",
    titulo: "Fisioterapia para quem corre e treina, em Ribeirão Preto",
    subtitulo: "Avaliação completa do seu caso e um plano claro do que fazer. Escolha o dia e o horário e agende em minutos.",
    foto: "fisio",
    reconhece: {
      titulo: "Isso acontece com você?",
      itens: [
        "Uma dor que aparece no treino e não passa sozinha",
        "Uma lesão que sempre volta no mesmo ponto",
        "Vontade de se cuidar antes de a dor tirar você da corrida",
      ],
    },
    cuidado: {
      titulo: "Como a gente cuida",
      itens: [
        { t: "Avaliação do corredor", d: "Dor, histórico, carga de treino e o que o seu corpo sustenta hoje." },
        { t: "Fisioterapia esportiva", d: "Terapia manual e exercícios terapêuticos para o seu caso." },
        { t: "Fortalecimento e recovery", d: "Força e recuperação no mesmo lugar, para voltar e se manter treinando." },
      ],
    },
    faq: [
      {
        q: "Preciso estar lesionado para ir?",
        a: "Não. A CareFit trabalha tanto com dor e reabilitação quanto com prevenção, fortalecimento e recovery.",
      },
      ...FAQ_COMUM,
    ],
    zap: "Oi! Quero agendar minha primeira sessão de fisioterapia na CareFit.",
  },
  {
    slug: "canelite",
    tag: "canelite",
    seoTitulo: "Canelite: tratamento em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor na canela ao correr? Avaliação completa e plano individual. 1ª sessão R$ 230 e a 2ª de cortesia.",
    selo: "Canelite · Fisioterapia para corredores",
    titulo: "Dor na canela ao correr? Entenda a causa e volte a treinar",
    subtitulo: "A canelite costuma estar ligada a carga, força e pisada. Na primeira sessão a gente avalia o seu caso e monta o plano.",
    foto: "corrida",
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
      ...FAQ_COMUM,
    ],
    zap: "Oi! Estou com dor na canela e quero agendar minha primeira sessão na CareFit.",
  },
  {
    slug: "fascite-plantar",
    tag: "fascite-plantar",
    seoTitulo: "Fascite plantar: tratamento em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor no calcanhar ou na sola do pé? Avaliação completa e plano individual. 1ª sessão R$ 230 e a 2ª de cortesia.",
    selo: "Fascite plantar · Fisioterapia para corredores",
    titulo: "Dor no calcanhar ao correr? Descubra a causa e volte a treinar",
    subtitulo: "Na primeira sessão a gente avalia pé, panturrilha e carga de treino para montar o plano do seu caso.",
    foto: "fisio",
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
      ...FAQ_COMUM,
    ],
    zap: "Oi! Estou com dor no calcanhar e quero agendar minha primeira sessão na CareFit.",
  },
  {
    slug: "dor-no-joelho",
    tag: "dor-no-joelho",
    seoTitulo: "Dor no joelho ao correr: fisioterapia em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor no joelho na corrida? Avaliação completa e plano individual. 1ª sessão R$ 230 e a 2ª de cortesia.",
    selo: "Joelho do corredor · Fisioterapia esportiva",
    titulo: "Dor no joelho ao correr? Veja se continua, ajusta ou investiga",
    subtitulo: "Muitas vezes é sobrecarga ou desequilíbrio muscular. A avaliação mostra o que está pesando no seu joelho e o que ajustar.",
    foto: "corrida",
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
      ...FAQ_COMUM,
    ],
    zap: "Oi! Estou com dor no joelho ao correr e quero agendar minha primeira sessão na CareFit.",
  },
  {
    slug: "tendinite-aquiles",
    tag: "aquiles",
    seoTitulo: "Dor no tendão de Aquiles: fisioterapia em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Dor no tendão de Aquiles ao correr? Avaliação completa e plano individual. 1ª sessão R$ 230 e a 2ª de cortesia.",
    selo: "Tendão de Aquiles · Fisioterapia para corredores",
    titulo: "Dor no tendão de Aquiles? Ajuste a carga e volte a correr com segurança",
    subtitulo: "Na primeira sessão a gente avalia carga, força da panturrilha e mobilidade para montar o plano do seu caso.",
    foto: "fisio",
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
      ...FAQ_COMUM,
    ],
    zap: "Oi! Estou com dor no tendão de Aquiles e quero agendar minha primeira sessão na CareFit.",
  },
  {
    slug: "recovery",
    tag: "recovery",
    seoTitulo: "Recovery esportivo em Ribeirão Preto | CareFit Run Base",
    seoDescricao: "Recovery para quem treina forte, em Ribeirão Preto. 1ª sessão R$ 230 e a 2ª de cortesia. Agende online.",
    selo: "Recovery · Ribeirão Preto",
    titulo: "Recupere melhor depois do treino forte, do longão e da prova",
    subtitulo: "Recovery com protocolo, num espaço feito para isso. Na primeira sessão a gente avalia como você está e o que faz sentido para o seu ciclo.",
    foto: "recovery",
    reconhece: {
      titulo: "Para quem é",
      itens: [
        "Quem acabou de fazer um longão ou uma prova",
        "Quem está numa semana pesada de treino e quer recuperar melhor",
        "Quem quer manter a rotina sem acumular cansaço e dor",
      ],
    },
    cuidado: {
      titulo: "Como funciona",
      itens: [
        { t: "Avaliação", d: "Como o seu corpo está hoje e o que o seu treino está pedindo." },
        { t: "Recovery", d: "Protocolo de recuperação na própria sessão." },
        { t: "Direcionamento", d: "O que fazer daqui para frente para recuperar entre os treinos." },
      ],
    },
    faq: [
      {
        q: "Recovery é só para quem está lesionado?",
        a: "Não. É uma ferramenta de recuperação para quem treina, e pode ser uma porta de entrada leve para cuidar do corpo na rotina.",
      },
      ...FAQ_COMUM,
    ],
    zap: "Oi! Quero agendar minha primeira sessão de recovery na CareFit.",
  },
];

export const LP_POR_SLUG: Record<string, LpConfig> = Object.fromEntries(LPS.map((l) => [l.slug, l]));
