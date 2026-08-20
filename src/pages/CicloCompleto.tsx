import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, MessageCircle, Link2, Compass, BarChart3, Check, Pyramid, Mountain, Trophy, Quote, Footprints, Shield, TrendingUp, Heart, ClipboardList, Map, Settings, Award, ArrowRight, CheckCircle, AlertCircle, XCircle, Target } from "lucide-react";

// Importar fotos da equipe
import gustavoFoto from "@/assets/gustavo_foto.jpg";
import liviaFoto from "@/assets/livia_foto.jpg";
import guilhermeFoto from "@/assets/guilherme_foto.jpg";
import Footer from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Hook para detectar quando elemento entra no viewport
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// SEÇÃO 2: PROMESSA + DIFERENCIAL
const Section2Diferenciais = () => {
  const { ref, isInView } = useInView(0.2);

  const diferenciais = [
    {
      icon: Shield,
      title: "Proteção do Seu Legado",
      description: "Você investiu meses, dedicação, sacrifício. Uma lesão séria tira tudo. Nós cuidamos de você integralmente para que você chegue 100% e deixe seu legado.",
      color: "#e67e22",
    },
    {
      icon: Heart,
      title: "Equipe Interdisciplinar",
      description: "Você não estará sozinho. Você estará com fisioterapeuta, educador físico e especialista em mentalidade — todos conversando, alinhados, trabalhando para você. E quando você já tem nutricionista, a gente conversa com ela também.",
      color: "#1a7a7a",
    },
    {
      icon: ClipboardList,
      title: "Cuidado Integral",
      description: "Não é apenas treino. É prevenção, recuperação, nutrição, mentalidade. Tudo integrado. Você não corre o risco de chegar lesionado ou medicado.",
      color: "#1a7a7a",
    },
    {
      icon: Trophy,
      title: "Legado Duradouro",
      description: "Você não apenas completa seu projeto. Você constrói uma base sólida para continuar correndo, evoluindo e deixando seu legado pessoal.",
      color: "#e67e22",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Por Que o Ciclo Completo é Diferente
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70">
            Integração que transforma
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diferenciais.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className={`
                  bg-white rounded-lg p-8 shadow-md
                  transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:shadow-xl hover:bg-gray-50
                  ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  borderTop: `3px solid ${item.color}`,
                  transitionDelay: isInView ? `${index * 100}ms` : '0ms',
                }}
              >
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <IconComponent className="w-7 h-7" style={{ color: item.color }} />
                </div>

                {/* Title */}
                <h3 
                  className="text-lg font-semibold text-[#1a1a1a] mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#1a1a1a]/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// NOVA SEÇÃO: O RISCO DE NÃO TER PROTEÇÃO
const SectionRiscos = () => {
  const { ref, isInView } = useInView(0.2);

  const riscos = [
    {
      icon: "🚫",
      title: "Lesão Séria",
      description: "Você treinou meses. Uma lesão séria tira tudo. Você perde seu projeto, suas férias, seu investimento.",
    },
    {
      icon: "💊",
      title: "Correndo Medicado",
      description: "Você chega na prova, mas não é você. Você corre medicado, sem performance, sem alegria. Seu legado fica comprometido.",
    },
    {
      icon: "🏖️",
      title: "Férias Perdidas",
      description: "Você e sua família tiraram férias para viajar, correr e te acompanhar. Uma lesão tira tudo. Você perde o momento que planejaram juntos.",
    },
    {
      icon: "❌",
      title: "Legado Incompleto",
      description: "Você não completa seu projeto. Você não deixa sua marca. Você fica com a sensação de 'e se eu tivesse cuidado melhor?'",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-10 md:py-20"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-[32px] font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            O Risco de Não Ter Proteção
          </h2>
          <p className="text-sm md:text-base text-white/70">
            Grandes projetos sem cuidado integral
          </p>
        </div>

        {/* Risk Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {riscos.map((risco, index) => (
            <div
              key={risco.title}
              className={`
                rounded-lg p-8 shadow-md
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:shadow-xl
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{
                borderTop: "3px solid #d32f2f",
                backgroundColor: "#fff3e0",
                transitionDelay: isInView ? `${index * 100}ms` : '0ms',
              }}
            >
              {/* Icon */}
              <div className="text-3xl mb-4">
                {risco.icon}
              </div>

              {/* Title */}
              <h3 
                className="text-lg font-semibold text-[#1a1a1a] mb-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {risco.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#1a1a1a]/70 leading-relaxed">
                {risco.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 3: O QUE VOCÊ RECEBE
const Section3OQueRecebe = () => {
  const { ref, isInView } = useInView(0.2);

  const duranteCiclo = [
    "Atendimento semanal (presencial ou híbrido)",
    "Fisioterapeuta exclusivo (Agente Pessoal de Performance)",
    "4 avaliações físicas completas",
    "12 planilhas semanais de fortalecimento customizadas",
    "12 sessões de recovery personalizadas",
    "Plano de nutrição individualizado com 3 consultas",
    "3 experiências guiadas para foco mental e resiliência",
    "Rituais simbólicos que marcam evolução",
  ];

  const depoisCiclo = [
    "Corpo mais forte e resiliente",
    "Confiança para correr sem medo de lesão",
    "Autonomia para continuar evoluindo",
    "Comunidade de corredores transformados",
    "Acesso a próximos ciclos com desconto",
    "Seu nome no Mural dos Corredores (eternizado)",
    "Identidade de corredor consolidada",
    "Propósito claro na corrida",
  ];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Seu Investimento Inclui
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70">
            Tudo que você precisa para se transformar
          </p>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Durante o Ciclo */}
          <div 
            className={`
              bg-gradient-to-br from-[#1a7a7a]/5 to-transparent rounded-2xl p-6 md:p-10
              transition-all duration-700
              ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
            `}
            style={{ transitionDelay: '100ms' }}
          >
            <h3 
              className="text-lg md:text-xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="w-10 h-10 rounded-full bg-[#1a7a7a] flex items-center justify-center">
                <span className="text-white text-sm font-bold">12</span>
              </span>
              Durante as 12 Semanas
            </h3>

            <ul className="space-y-3">
              {duranteCiclo.map((item, index) => (
                <li 
                  key={index}
                  className={`
                    flex items-start gap-3 text-sm md:text-base text-[#1a1a1a]/80
                    transition-all duration-500
                    ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                  `}
                  style={{ transitionDelay: isInView ? `${200 + index * 50}ms` : '0ms' }}
                >
                  <Check className="w-5 h-5 text-[#1a7a7a] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Depois do Ciclo */}
          <div 
            className={`
              bg-gradient-to-br from-[#e67e22]/5 to-transparent rounded-2xl p-6 md:p-10
              transition-all duration-700
              ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
            `}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 
              className="text-lg md:text-xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="w-10 h-10 rounded-full bg-[#e67e22] flex items-center justify-center">
                <span className="text-white text-sm">∞</span>
              </span>
              Depois das 12 Semanas
            </h3>

            <ul className="space-y-3">
              {depoisCiclo.map((item, index) => (
                <li 
                  key={index}
                  className={`
                    flex items-start gap-3 text-sm md:text-base text-[#1a1a1a]/80
                    transition-all duration-500
                    ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                  `}
                  style={{ transitionDelay: isInView ? `${300 + index * 50}ms` : '0ms' }}
                >
                  <Check className="w-5 h-5 text-[#e67e22] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 4: AS 12 SEMANAS INTERATIVAS
const Section4Semanas = () => {
  const { ref, isInView } = useInView(0.1);
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  const semanas = [
    {
      numero: 1,
      nome: "Largada",
      isRitual: false,
      descricao: "O início da sua transformação. Avaliação completa, definição de metas e preparação do corpo para o que vem pela frente.",
      atividades: "Avaliação física completa, análise de pisada, definição do plano personalizado",
      especialista: "Gustavo (Ultramaratonista e Fundador)",
      resultado: "Baseline definido, metas claras, corpo preparado para evoluir",
    },
    {
      numero: 2,
      nome: "Ritmo",
      isRitual: false,
      descricao: "Encontrando seu ritmo ideal. Ajustes finos na técnica e início do fortalecimento específico.",
      atividades: "Treino de cadência, fortalecimento de core, primeira sessão de recovery",
      especialista: "Guilherme (Preparador Físico)",
      resultado: "Ritmo mais eficiente, menos desperdício de energia",
    },
    {
      numero: 3,
      nome: "Fôlego",
      isRitual: false,
      descricao: "Expandindo sua capacidade respiratória e resistência. Foco em eficiência cardiorrespiratória.",
      atividades: "Treinos intervalados, técnicas de respiração, nutrição para performance",
      especialista: "Lívia (Fisioterapeuta)",
      resultado: "Maior resistência, recuperação mais rápida entre esforços",
    },
    {
      numero: 4,
      nome: "Base Forte",
      isRitual: false,
      emoji: "⭐",
      descricao: "Construindo a fundação sólida. Fortalecimento intensivo dos grupos musculares essenciais para corrida.",
      atividades: "Fortalecimento de glúteos, quadríceps e posteriores, avaliação de progresso",
      especialista: "Guilherme (Preparador Físico)",
      resultado: "Base muscular sólida, menor risco de lesões",
    },
    {
      numero: 5,
      nome: "Subida",
      isRitual: false,
      descricao: "Elevando o nível. Desafios progressivos que testam sua nova capacidade física e mental.",
      atividades: "Treinos em terreno variado, fortalecimento avançado, sessão de mentalidade",
      especialista: "Arthur (Mentalidade)",
      resultado: "Confiança crescente, superação de limites anteriores",
    },
    {
      numero: 6,
      nome: "Meio da Jornada",
      isRitual: true,
      emoji: "🟤",
      descricao: "Checkpoint simbólico. Celebração do progresso e reconstrução da sua base de performance.",
      atividades: "RITUAL: Pirâmide da Performance, avaliação intermediária, ajuste de plano",
      especialista: "Equipe Completa",
      resultado: "Reconhecimento do progresso, motivação renovada",
    },
    {
      numero: 7,
      nome: "Aceleração",
      isRitual: false,
      descricao: "Aumentando a intensidade. Seu corpo está pronto para desafios maiores.",
      atividades: "Treinos de velocidade, recovery intensivo, ajuste nutricional",
      especialista: "Gustavo (Ultramaratonista e Fundador)",
      resultado: "Velocidade aumentada, técnica aprimorada",
    },
    {
      numero: 8,
      nome: "Sentido",
      isRitual: false,
      descricao: "Conectando corpo e propósito. Por que você corre? Essa semana traz clareza.",
      atividades: "Sessão de propósito, treino consciente, nutrição para recuperação",
      especialista: "Arthur (Mentalidade)",
      resultado: "Propósito claro, motivação intrínseca",
    },
    {
      numero: 9,
      nome: "Transformação",
      isRitual: true,
      emoji: "🪨 ⭐",
      descricao: "O momento de superação máxima. Você quebra suas barreiras e se torna um novo atleta.",
      atividades: "RITUAL: Quebra de Pedra, desafio físico simbólico, avaliação de transformação",
      especialista: "Equipe Completa",
      resultado: "Novo patamar de performance, identidade de atleta consolidada",
    },
    {
      numero: 10,
      nome: "Ápice",
      isRitual: false,
      descricao: "Seu melhor momento. Consolidação de toda a evolução das semanas anteriores.",
      atividades: "Treino de pico, recovery completo, preparação para finalização",
      especialista: "Guilherme (Preparador Físico)",
      resultado: "Performance máxima, corpo no auge",
    },
    {
      numero: 11,
      nome: "Polimento",
      isRitual: false,
      descricao: "Refinando os detalhes. Ajustes finais para garantir que você cruze a linha de chegada no seu melhor.",
      atividades: "Tapering, ajustes técnicos, preparação mental final",
      especialista: "Gustavo (Ultramaratonista e Fundador)",
      resultado: "Detalhes refinados, pronto para a conquista",
    },
    {
      numero: 12,
      nome: "Linha de Chegada",
      isRitual: true,
      emoji: "🎉",
      descricao: "A celebração da sua transformação. Seu nome é eternizado no Mural dos Corredores.",
      atividades: "RITUAL: Mural dos Corredores, entrega do Kit Conquista, celebração em comunidade",
      especialista: "Equipe Completa",
      resultado: "Transformação completa, legado eternizado, comunidade para sempre",
    },
  ];

  const toggleWeek = (numero: number) => {
    setOpenWeek(openWeek === numero ? null : numero);
  };

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Sua Jornada de Transformação, Semana a Semana
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70">
            Clique em cada semana para explorar
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line (desktop only) */}
          <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1a7a7a] via-[#e67e22] to-[#1a7a7a]" />

          {/* Week Cards */}
          <div className="space-y-2">
            {semanas.map((semana, index) => {
              const isOpen = openWeek === semana.numero;
              const cardColor = semana.isRitual ? "#e67e22" : "#1a7a7a";

              return (
                <div
                  key={semana.numero}
                  className={`
                    transition-all duration-500 ease-out
                    ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ transitionDelay: isInView ? `${index * 50}ms` : '0ms' }}
                >
                  {/* Card Header (always visible) */}
                  <button
                    onClick={() => toggleWeek(semana.numero)}
                    className={`
                      w-full flex items-center gap-4 p-4 lg:p-5 rounded-lg
                      transition-all duration-300 cursor-pointer
                      hover:shadow-lg hover:-translate-y-0.5
                      ${isOpen ? 'shadow-lg' : 'shadow-md'}
                    `}
                    style={{ 
                      backgroundColor: cardColor,
                    }}
                  >
                    {/* Week Number */}
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {semana.numero}
                      </span>
                    </div>

                    {/* Week Name */}
                    <div className="flex-1 text-left">
                      <span className="text-white font-semibold text-base lg:text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {semana.nome}
                        {semana.emoji && <span className="ml-2">{semana.emoji}</span>}
                      </span>
                      {semana.isRitual && (
                        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
                          RITUAL
                        </span>
                      )}
                    </div>

                    {/* Chevron */}
                    <ChevronDown 
                      className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expanded Content */}
                  <div 
                    className={`
                      overflow-hidden transition-all duration-300 ease-out
                      ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="p-5 bg-gray-50 rounded-b-lg border-x border-b border-gray-200 mt-1">
                      {/* Description */}
                      <p className="text-[#1a1a1a]/80 text-sm mb-4 leading-relaxed">
                        {semana.descricao}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            O que você vai fazer:
                          </p>
                          <p className="text-[#1a1a1a]/70">{semana.atividades}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Especialista líder:
                          </p>
                          <p className="text-[#1a1a1a]/70">{semana.especialista}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Resultado esperado:
                          </p>
                          <p style={{ color: cardColor }}>{semana.resultado}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 5: RITUAIS SIMBÓLICOS
const Section5Rituais = () => {
  const { ref, isInView } = useInView(0.2);

  const rituais = [
    {
      icon: Pyramid,
      titulo: "Pirâmide da Performance",
      semana: "Semana 6 - Meio da Jornada",
      descricao: "Você reconstrói sua base. Objeto simbólico que marca o checkpoint: você já construiu metade do caminho.",
      significado: "Estrutura. Base sólida. Evolução visível.",
      cor: "#1a7a7a",
    },
    {
      icon: Mountain,
      titulo: "Quebra de Pedra",
      semana: "Semana 9 - Transformação",
      descricao: "Você supera seus limites pessoais. Desafio simbólico que marca o novo atleta que você se tornou.",
      significado: "Superação. Transformação. Novo eu.",
      cor: "#e67e22",
    },
    {
      icon: Trophy,
      titulo: "Mural dos Corredores",
      semana: "Semana 12 - Linha de Chegada",
      descricao: "Seu nome é eternizado. Kit Conquista que marca o fim de um ciclo e o início de outro.",
      significado: "Celebração. Comunidade. Legado.",
      cor: "#1a7a7a",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Rituais que Marcam Sua Evolução
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70">
            Marcos especiais que celebram sua transformação
          </p>
        </div>

        {/* Ritual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rituais.map((ritual, index) => {
            const IconComponent = ritual.icon;
            return (
              <div
                key={ritual.titulo}
                className={`
                  bg-white rounded-xl p-8 shadow-md
                  transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:shadow-xl
                  ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  borderTop: `4px solid ${ritual.cor}`,
                  transitionDelay: isInView ? `${index * 150}ms` : '0ms',
                }}
              >
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${ritual.cor}15` }}
                >
                  <IconComponent className="w-8 h-8" style={{ color: ritual.cor }} />
                </div>

                {/* Semana Badge */}
                <p 
                  className="text-xs font-medium mb-3 uppercase tracking-wide"
                  style={{ color: ritual.cor }}
                >
                  {ritual.semana}
                </p>

                {/* Title */}
                <h3 
                  className="text-xl font-semibold text-[#1a1a1a] mb-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {ritual.titulo}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#1a1a1a]/70 leading-relaxed mb-6">
                  {ritual.descricao}
                </p>

                {/* Significado */}
                <div 
                  className="pt-4 border-t border-gray-100"
                >
                  <p 
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: ritual.cor, fontFamily: "'Poppins', sans-serif" }}
                  >
                    Significado
                  </p>
                  <p className="text-sm text-[#1a1a1a]/80 italic">
                    {ritual.significado}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 6: DEPOIMENTOS DE QUEM VIVEU A TRANSFORMAÇÃO
const Section6Depoimentos = () => {
  const { ref, isInView } = useInView(0.2);

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-primary text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-bold mb-4">
            Depoimentos de quem viveu a transformação
          </h2>
        </div>

        {/* Depoimentos Grid com Vídeos */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Thais */}
          <div 
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: isInView ? '0ms' : '0ms' }}
          >
            <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/62WMUc35hbo"
                title="Thais - Desafio Disney Wine & Dine"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h4 className="text-xl font-montserrat font-bold text-earth mb-2">Thais Vignini</h4>
            <p className="text-lg font-montserrat font-semibold mb-3">Desafio Disney Wine & Dine</p>
            <p className="text-white/80 font-poppins text-sm leading-relaxed">
              A jornada de Thais Vignini rumo ao desafio Disney Wine & Dine, superando limites com o suporte da CAREFIT.
            </p>
          </div>

          {/* Talita */}
          <div 
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: isInView ? '150ms' : '0ms' }}
          >
            <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/lbfcs-QlmDE"
                title="Talita - Meia Maratona de Lisboa 2025"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h4 className="text-xl font-montserrat font-bold text-earth mb-2">Talita Kriunas</h4>
            <p className="text-lg font-montserrat font-semibold mb-3">Meia Maratona de Lisboa 2025</p>
            <p className="text-white/80 font-poppins text-sm leading-relaxed">
              Talita Kriunas conquistou as ruas de Lisboa na Meia Maratona 2025, uma jornada de preparação e superação.
            </p>
          </div>

          {/* Léo Andrade */}
          <div 
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: isInView ? '300ms' : '0ms' }}
          >
            <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/XF8N96nULVg"
                title="Léo Andrade - Meia Maratona do Rio 2025"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h4 className="text-xl font-montserrat font-bold text-earth mb-2">Léo Andrade</h4>
            <p className="text-lg font-montserrat font-semibold mb-3">Meia Maratona do Rio 2025</p>
            <p className="text-white/80 font-poppins text-sm leading-relaxed">
              Léo compartilha sua experiência na Meia Maratona do Rio 2025, transformando desafios em conquistas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 7: PARA QUEM É
const Section7ParaQuem = () => {
  const { ref, isInView } = useInView(0.2);

  const perfis = [
    {
      icon: Target,
      titulo: "Você Tem um Grande Projeto",
      descricao: "Maratona, ultramaratona, prova importante, meta pessoal ambiciosa. Você investiu meses. Você merece proteção completa para chegar 100% e deixar seu legado.",
      cor: "#e67e22",
    },
    {
      icon: Heart,
      titulo: "Você Quer Curtir a Jornada",
      descricao: "Não é apenas chegar. É aproveitar cada passo, cada treino, cada momento. Cuidado integral garante que você curta sem dor, sem medo, sem lesão.",
      cor: "#1a7a7a",
    },
    {
      icon: Shield,
      titulo: "Você Não Quer Perder Tudo",
      descricao: "Você investiu tempo, esforço, dedicação. Uma lesão séria tira tudo. Você merece uma equipe que cuida de você integralmente.",
      cor: "#1a7a7a",
    },
    {
      icon: Trophy,
      titulo: "Você Busca Legado",
      descricao: "Não é apenas uma prova. É uma realização pessoal que marca sua vida. Você merece chegar completo, saudável, pronto para deixar sua marca.",
      cor: "#e67e22",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Para Quem é o Ciclo Completo?
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70">
            Qualquer corredor pode se transformar
          </p>
        </div>

        {/* Perfis Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perfis.map((perfil, index) => {
            const IconComponent = perfil.icon;
            return (
              <div
                key={perfil.titulo}
                className={`
                  bg-white rounded-xl p-8 shadow-md
                  transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:shadow-xl hover:bg-gray-50
                  ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  borderTop: `3px solid ${perfil.cor}`,
                  transitionDelay: isInView ? `${index * 100}ms` : '0ms',
                }}
              >
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${perfil.cor}15` }}
                >
                  <IconComponent className="w-7 h-7" style={{ color: perfil.cor }} />
                </div>

                {/* Title */}
                <h3 
                  className="text-lg font-semibold text-[#1a1a1a] mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {perfil.titulo}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#1a1a1a]/70 leading-relaxed">
                  {perfil.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 8: COMO FUNCIONA
const Section8ComoFunciona = () => {
  const { ref, isInView } = useInView(0.2);

  const passos = [
    {
      numero: 1,
      icon: ClipboardList,
      titulo: "Avaliação Inicial",
      descricao: "Você faz uma avaliação completa com a equipe. Entendemos seu corpo, sua história, suas limitações e sonhos.",
      tempo: "1 sessão",
      cor: "#1a7a7a",
    },
    {
      numero: 2,
      icon: Map,
      titulo: "Plano Personalizado",
      descricao: "A equipe cria seu plano de 12 semanas. Treino, nutrição, recovery e mentalidade — tudo integrado para VOCÊ.",
      tempo: "Pronto em 3 dias",
      cor: "#e67e22",
    },
    {
      numero: 3,
      icon: Settings,
      titulo: "Execução + Ajustes",
      descricao: "Você executa a jornada com suporte semanal. Cada semana ajustamos conforme sua evolução.",
      tempo: "12 semanas",
      cor: "#1a7a7a",
    },
    {
      numero: 4,
      icon: Award,
      titulo: "Transformação + Celebração",
      descricao: "Você chega à linha de chegada transformado. Seu nome entra no Mural dos Corredores. Próximo ciclo começa.",
      tempo: "Semana 12",
      cor: "#e67e22",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Como Funciona o Ciclo Completo
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70">
            4 passos simples para sua transformação
          </p>
        </div>

        {/* Contexto Adicional */}
        <div className={`text-center mb-10 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-lg md:text-2xl font-semibold text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Seu Ciclo de Proteção
          </h3>
          <p className="text-sm md:text-base text-[#1a1a1a]/70 max-w-2xl mx-auto">
            Você tem um grande projeto. Aqui está como a gente te protege para que você chegue 100%, curta cada passo e deixe seu legado:
          </p>
        </div>

        {/* Passos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {passos.map((passo, index) => {
            const IconComponent = passo.icon;
            const isLast = index === passos.length - 1;
            
            return (
              <div
                key={passo.numero}
                className={`
                  relative bg-white rounded-xl p-6 shadow-md border border-gray-100
                  transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:shadow-xl
                  ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: isInView ? `${index * 150}ms` : '0ms' }}
              >
                {/* Arrow (desktop, not on last item) */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}

                {/* Número */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: passo.cor }}
                >
                  <span 
                    className="text-white font-bold text-2xl"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {passo.numero}
                  </span>
                </div>

                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${passo.cor}10` }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: passo.cor }} />
                </div>

                {/* Title */}
                <h3 
                  className="text-lg font-semibold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {passo.titulo}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#1a1a1a]/70 leading-relaxed mb-3">
                  {passo.descricao}
                </p>

                {/* Tempo */}
                <p 
                  className="text-xs font-medium"
                  style={{ color: passo.cor }}
                >
                  ⏱ {passo.tempo}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 9: COMPARAÇÃO
const Section9Comparacao = () => {
  const { ref, isInView } = useInView(0.1);

  const comparacaoData = [
    {
      aspecto: "Especialização em Corrida",
      sozinho: "nao",
      clinica: "parcial",
      carefit: "sim",
    },
    {
      aspecto: "Equipe Integrada",
      sozinho: "nao",
      clinica: "nao",
      carefit: "sim",
    },
    {
      aspecto: "Personalização",
      sozinho: "parcial",
      clinica: "parcial",
      carefit: "sim",
    },
    {
      aspecto: "Acompanhamento Semanal",
      sozinho: "nao",
      clinica: "parcial",
      carefit: "sim",
    },
    {
      aspecto: "Prevenção de Lesões",
      sozinho: "parcial",
      clinica: "parcial",
      carefit: "sim",
    },
    {
      aspecto: "Resultados Mensuráveis",
      sozinho: "parcial",
      clinica: "parcial",
      carefit: "sim",
    },
    {
      aspecto: "Comunidade",
      sozinho: "nao",
      clinica: "parcial",
      carefit: "sim",
    },
    {
      aspecto: "Suporte Emocional",
      sozinho: "nao",
      clinica: "nao",
      carefit: "sim",
    },
  ];

  const renderStatus = (status: string, isCareFit = false) => {
    if (status === "sim") {
      return <CheckCircle className="w-5 h-5 mx-auto" style={{ color: isCareFit ? "#e67e22" : "#1a7a7a" }} />;
    } else if (status === "parcial") {
      return <AlertCircle className="w-5 h-5 mx-auto text-amber-500" />;
    } else {
      return <XCircle className="w-5 h-5 mx-auto text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "sim") return "100%";
    if (status === "parcial") return "Parcial";
    return "Não";
  };

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "rgba(26, 122, 122, 0.1)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Por Que o Ciclo Completo é a Melhor Escolha
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70 mb-4">
            Comparação com outras abordagens
          </p>
          <p className="text-xs md:text-sm text-[#1a1a1a]/70 max-w-3xl mx-auto mb-2">
            Você pode treinar sozinho. Você pode ir a uma clínica genérica. Ou você pode ter uma equipe integrada de especialistas em corrida, focada em proteger seu maior investimento pessoal.
          </p>
          <p className="text-base font-semibold text-[#1a1a1a]">
            Veja a diferença:
          </p>
        </div>

        {/* Desktop Table */}
        <div className={`hidden md:block transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-left font-semibold" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f8f8f8" }}>
                    Aspecto
                  </th>
                  <th className="py-4 px-6 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#e0e0e0" }}>
                    Treinar Sozinho
                  </th>
                  <th className="py-4 px-6 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f0f0f0" }}>
                    Clínica Genérica
                  </th>
                  <th className="py-4 px-6 text-center font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#1a7a7a" }}>
                    CAREFIT - Ciclo Completo
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparacaoData.map((row, index) => (
                  <tr key={row.aspecto} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium text-[#1a1a1a]" style={{ backgroundColor: "#f8f8f8" }}>
                      {row.aspecto}
                    </td>
                    <td className="py-4 px-6 text-center" style={{ backgroundColor: "#e0e0e0" }}>
                      <div className="flex flex-col items-center gap-1">
                        {renderStatus(row.sozinho)}
                        <span className="text-xs text-gray-600">{getStatusLabel(row.sozinho)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center" style={{ backgroundColor: "#f0f0f0" }}>
                      <div className="flex flex-col items-center gap-1">
                        {renderStatus(row.clinica)}
                        <span className="text-xs text-gray-600">{getStatusLabel(row.clinica)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-white" style={{ backgroundColor: "#1a7a7a" }}>
                      <div className="flex flex-col items-center gap-1">
                        {renderStatus(row.carefit, true)}
                        <span className="text-xs text-white/90">{getStatusLabel(row.carefit)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {comparacaoData.map((row, index) => (
            <div
              key={row.aspecto}
              className={`
                bg-white rounded-lg shadow-md p-4
                transition-all duration-500
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: isInView ? `${index * 50}ms` : '0ms' }}
            >
              <h3 className="font-semibold text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {row.aspecto}
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-100 rounded p-2">
                  <p className="text-gray-500 mb-1">Sozinho</p>
                  {renderStatus(row.sozinho)}
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500 mb-1">Clínica</p>
                  {renderStatus(row.clinica)}
                </div>
                <div className="rounded p-2 text-white" style={{ backgroundColor: "#1a7a7a" }}>
                  <p className="text-white/80 mb-1">CareFit</p>
                  {renderStatus(row.carefit, true)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 10: INVESTIMENTO
const Section10Investimento = () => {
  const { ref, isInView } = useInView(0.2);

  const beneficios = [
    "Atendimento semanal (12 semanas)",
    "Equipe de 4 especialistas",
    "4 avaliações físicas completas",
    "Plano 100% personalizado",
    "Rituais simbólicos exclusivos",
    "Comunidade de corredores",
    "Acesso vitalício aos materiais",
  ];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24"
      style={{ 
        background: "linear-gradient(135deg, #1a7a7a 0%, #0E3C41 50%, #C8643D 100%)"
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-10 md:mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-[32px] font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Seu Investimento em Proteção
          </h2>
          <p className="text-sm md:text-base text-white/80">
            Proteção integral para seu maior investimento pessoal
          </p>
        </div>

        {/* Investment Card */}
        <div 
          className={`
            bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 lg:p-16
            border border-white/20 shadow-2xl
            transition-all duration-700 delay-200
            hover:shadow-3xl hover:bg-white/15
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {/* Price Section */}
          <div className="text-center mb-8">
            <p className="text-white/70 text-sm mb-2 uppercase tracking-wider">
              Investimento Total
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                R$ 5.400,00
              </span>
            </div>
            <p className="text-white/70 text-sm">
              ou em até <span className="text-white font-semibold">6x de R$ 900,00</span>
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/20 my-8" />

          {/* Benefits Section */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              O Que Está Incluído
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              {beneficios.map((beneficio, index) => (
                <div 
                  key={beneficio}
                  className={`
                    flex items-center gap-3
                    transition-all duration-500
                    ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                  `}
                  style={{ transitionDelay: isInView ? `${300 + index * 80}ms` : '0ms' }}
                >
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: "#d4af37" }} />
                  <span className="text-white/90 text-sm">{beneficio}</span>
                </div>
              ))}
            </div>

            {/* Contexto de Investimento */}
            <div className="mt-8 pt-6 border-t border-white/20 text-center max-w-2xl mx-auto space-y-3">
              <p className="text-white/90 text-sm leading-relaxed">
                Você investiu meses de treino.
              </p>
              <p className="text-white/90 text-sm leading-relaxed">
                Você investiu dedicação e sacrifício.
              </p>
              <p className="text-white/90 text-sm leading-relaxed">
                Você investiu emoção e esperança.
              </p>
              <p className="text-white font-semibold text-base mt-4">
                R$ 5.400 não é um custo. É proteção.
              </p>
              <p className="text-white/80 text-sm leading-relaxed mt-2">
                É a garantia de que você chega 100% preparado. Sem lesão séria. Sem medicação. 
                Sem perder as férias que sua esposa tirou. Sem deixar seu legado incompleto.
              </p>
              <p className="text-[#d4af37] font-semibold text-base mt-4">
                R$ 5.400 é o preço de curtir sua jornada e deixar sua marca.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-10">
            <Button
              size="lg"
              onClick={() => window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank")}
              className="px-10 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ 
                backgroundColor: "white",
                color: "#1a7a7a"
              }}
            >
              Quero Começar Minha Transformação
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 11: DEPOIMENTOS DE EQUIPE
const Section11EquipeDepoimentos = () => {
  const { ref, isInView } = useInView(0.1);

  const equipe = [
    {
      foto: gustavoFoto,
      nome: "Gustavo Rosa",
      titulo: "Ultramaratonista e Fundador",
      citacao: "Cada corredor que passa por esse ciclo se torna parte da nossa história. Vemos a transformação acontecer semana a semana.",
      cor: "#1a7a7a",
    },
    {
      foto: liviaFoto,
      nome: "Lívia Dias",
      titulo: "Fisioterapeuta",
      citacao: "O que mais me move é quando o corredor percebe que cuidado não é fraqueza. É inteligência. É amor pelo esporte que ama.",
      cor: "#e67e22",
    },
    {
      foto: guilhermeFoto,
      nome: "Guilherme Coelho",
      titulo: "Educador Físico",
      citacao: "Fortalecimento não é sobre ficar grande. É sobre construir a base que sustenta cada quilômetro. Vejo isso acontecer toda semana.",
      cor: "#1a7a7a",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            O Que a Equipe Diz
          </h2>
          <p className="text-lg md:text-xl text-[#1a1a1a]/70">
            Profissionais que vivem o que ensinam
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipe.map((membro, index) => (
            <div
              key={membro.nome}
              className={`
                bg-white rounded-lg p-6 shadow-md
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:shadow-xl
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
            >
              {/* Photo */}
              <div className="flex justify-center mb-4">
                <div 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden"
                  style={{ border: `3px solid ${membro.cor}` }}
                >
                  <img 
                    src={membro.foto} 
                    alt={membro.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center mb-4">
                <h3 className="font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {membro.nome}
                </h3>
                <p className="text-xs" style={{ color: membro.cor }}>
                  {membro.titulo}
                </p>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="w-5 h-5 absolute -top-1 -left-1 opacity-20" style={{ color: membro.cor }} />
                <p className="text-sm text-[#1a1a1a]/70 italic leading-relaxed pl-4">
                  "{membro.citacao}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 12: CIÊNCIA POR TRÁS DA JORNADA
const Section12Ciencia = () => {
  const { ref, isInView } = useInView(0.1);

  const statsCards = [
    {
      number: "90%",
      description: "De corredores se lesionam durante preparação",
      reference: "[1] Franke et al., 2019",
      link: "https://pubmed.ncbi.nlm.nih.gov/31213161/",
      borderColor: "#e67e22",
      bgColor: "#fff8f0",
    },
    {
      number: "1 em 7",
      description: "Corredores desenvolvem nova lesão",
      reference: "[1] Franke et al., 2019",
      link: "https://pubmed.ncbi.nlm.nih.gov/31213161/",
      borderColor: "#d32f2f",
      bgColor: "#ffebee",
    },
    {
      number: "40%",
      description: "De maratonistas se lesionam durante ciclo",
      reference: "[2] Toresdahl et al., 2023",
      link: "https://pubmed.ncbi.nlm.nih.gov/36113976/",
      borderColor: "#e67e22",
      bgColor: "#fff8f0",
    },
    {
      number: "31,3%",
      description: "Se lesionam nas 4 últimas semanas",
      reference: "[3] Gajardo-Burgos et al., 2021",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8160869/",
      borderColor: "#d32f2f",
      bgColor: "#ffebee",
    },
  ];

  const referencias = [
    {
      num: "[1]",
      titulo: "Running Themselves Into the Ground? Incidence, Prevalence, and Impact of Injury and Illness in Runners Preparing for a Half or Full Marathon",
      periodico: "Journal of Orthopaedic & Sports Physical Therapy",
      volume: "2019 Jul;49(7):518-528",
      doi: "10.2519/jospt.2019.8473",
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/31213161/",
      doiLink: "https://doi.org/10.2519/jospt.2019.8473",
      achado: "9 em cada 10 corredores relataram lesão ou sintoma de doença durante 16 semanas pré-prova",
    },
    {
      num: "[2]",
      titulo: "Injury incidence during marathon training and racing: A prospective study of 1,075 marathon runners using Strava",
      periodico: "British Journal of Sports Medicine",
      volume: "2023",
      doi: "10.1136/bjsports-2022-105670",
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/36113976/",
      doiLink: "https://doi.org/10.1136/bjsports-2022-105670",
      achado: "40% de incidência de lesão durante ciclo; 16% durante ou imediatamente após maratona",
    },
    {
      num: "[3]",
      titulo: "Injury Incidence and Risk Factors in Trail Runners: A Prospective Cohort Study",
      periodico: "International Journal of Environmental Research and Public Health",
      volume: "2021",
      doi: "10.3390/ijerph18105431",
      pubmed: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8160869/",
      doiLink: "https://doi.org/10.3390/ijerph18105431",
      achado: "31,3% de corredores relataram lesão nas 4 últimas semanas pré-prova",
    },
    {
      num: "[4]",
      titulo: "The Association Between Changes in Weekly Running Distance and Running-Related Injury: Preparing for a Half Marathon",
      periodico: "Journal of Orthopaedic & Sports Physical Therapy",
      volume: "2019 Apr;49(4):230-238",
      doi: "10.2519/jospt.2019.8541",
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/30526231/",
      doiLink: "https://doi.org/10.2519/jospt.2019.8541",
      achado: "Aumentos de 20-60% na quilometragem semanal aumentam risco; diferença observada em 21 dias",
    },
    {
      num: "[5]",
      titulo: "Prospective study on training errors as a risk factor for running-related injuries",
      periodico: "Journal of Orthopaedic & Sports Physical Therapy",
      volume: "2014",
      doi: "10.2519/jospt.2014.5164",
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/25155475/",
      doiLink: "https://doi.org/10.2519/jospt.2014.5164",
      achado: "Progressões agressivas em corredores iniciantes aumentam vulnerabilidade a lesões",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-10 md:py-20"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 md:mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 
            className="text-2xl md:text-[32px] font-semibold mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
          >
            Ciência por Trás da Jornada
          </h2>
          <p className="text-sm md:text-base" style={{ color: "#666666" }}>
            Estudos comprovam: grandes projetos precisam de proteção integral
          </p>
        </div>

        {/* BLOCO 1: O RISCO REAL DE LESÃO */}
        <div className={`mb-10 md:mb-12 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Coluna Esquerda - Texto */}
            <div>
              <h3 
                className="text-lg md:text-2xl font-semibold mb-4"
                style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
              >
                9 em cada 10 corredores se lesionam antes da prova
              </h3>
              
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "#333333" }}>
                Pesquisas científicas mostram que correr para uma maratona ou meia-maratona envolve risco significativo de lesão. Um estudo prospectivo com 161 corredores durante 16 semanas pré-prova revelou dados alarmantes:
              </p>
              
              <ul className="space-y-2 mb-6 text-sm" style={{ color: "#333333" }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#1a7a7a] mt-1">•</span>
                  <span>9 em cada 10 corredores (90%) relataram alguma lesão ou sintoma de doença durante o período de preparação<sup>[1]</sup></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1a7a7a] mt-1">•</span>
                  <span>Em qualquer período de 2 semanas, até 1 em 7 corredores (14,8%) desenvolveu uma nova lesão<sup>[1]</sup></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1a7a7a] mt-1">•</span>
                  <span>40% dos maratonistas desenvolvem lesão durante o ciclo de preparação<sup>[2]</sup></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1a7a7a] mt-1">•</span>
                  <span>31,3% dos corredores relatam lesão nas 4 últimas semanas antes da prova<sup>[3]</sup></span>
                </li>
              </ul>
              
              {/* Citação */}
              <blockquote 
                className="pl-4 py-3 text-sm italic rounded-r-lg"
                style={{ 
                  borderLeft: "3px solid #1a7a7a",
                  backgroundColor: "#f9f9f9",
                  color: "#555555"
                }}
              >
                "Nine out of every 10 runners reported an RRI or illness symptom in the lead-up to a half or full marathon. In any 2-week period, up to 1 in 7 runners reported a new RRI or illness symptom."
                <span className="block mt-2 not-italic text-xs" style={{ color: "#1a7a7a" }}>
                  — Franke et al., 2019<sup>[1]</sup>
                </span>
              </blockquote>
            </div>

            {/* Coluna Direita - 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statsCards.map((card, index) => (
                <a
                  key={card.number}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    block rounded-lg p-6 shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg
                    ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                  `}
                  style={{
                    borderTop: `3px solid ${card.borderColor}`,
                    backgroundColor: card.bgColor,
                    transitionDelay: isInView ? `${(index + 1) * 100}ms` : '0ms',
                  }}
                >
                  <p 
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif", color: card.borderColor }}
                  >
                    {card.number}
                  </p>
                  <p className="text-[13px] mb-3" style={{ color: "#1a1a1a" }}>
                    {card.description}
                  </p>
                  <p className="text-[11px] underline" style={{ color: "#1a7a7a" }}>
                    {card.reference}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCO 2: POR QUE AS LESÕES ACONTECEM */}
        <div className={`mb-10 md:mb-12 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 
            className="text-lg md:text-2xl font-semibold mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
          >
            Mudanças no volume de treino aumentam risco de lesão
          </h3>
          
          <p className="text-sm mb-4 leading-relaxed" style={{ color: "#333333" }}>
            A causa principal de lesões em corredores está relacionada a mudanças inadequadas no volume de treino. Estudos demonstram que aumentos progressivos mal controlados são um fator de risco crítico:
          </p>
          
          <ul className="space-y-2 mb-6 text-sm" style={{ color: "#333333" }}>
            <li className="flex items-start gap-2">
              <span className="text-[#1a7a7a] mt-1">•</span>
              <span>Aumentos de 20-60% na quilometragem semanal aumentam significativamente o risco de lesão<sup>[4]</sup></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1a7a7a] mt-1">•</span>
              <span>A diferença é observada em apenas 21 dias após o aumento inadequado<sup>[4]</sup></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1a7a7a] mt-1">•</span>
              <span>Progressões agressivas em corredores iniciantes aumentam vulnerabilidade a lesões relacionadas à distância<sup>[5]</sup></span>
            </li>
          </ul>
          
          {/* Citação */}
          <blockquote 
            className="pl-4 py-3 text-sm italic rounded-r-lg mb-6"
            style={{ 
              borderLeft: "3px solid #1a7a7a",
              backgroundColor: "#f9f9f9",
              color: "#555555"
            }}
          >
            "More injuries occurred when the distance increased 20–60% (difference observed already with 21 days)."
            <span className="block mt-2 not-italic text-xs" style={{ color: "#1a7a7a" }}>
              — Damsted et al., 2019<sup>[4]</sup>
            </span>
          </blockquote>
          
          <p className="text-sm font-semibold" style={{ color: "#d32f2f" }}>
            O Problema: Muitos corredores treinam sozinhos ou com acompanhamento genérico, sem monitoramento semanal de volume, recuperação e ajustes individualizados.
          </p>
        </div>

        {/* BLOCO 3: COMO O CICLO COMPLETO PROTEGE VOCÊ */}
        <div className={`mb-10 md:mb-12 transition-all duration-700 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 
            className="text-lg md:text-2xl font-semibold mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
          >
            Como o Ciclo Completo Protege Você
          </h3>
          
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#333333" }}>
            O Ciclo Completo implementa práticas baseadas em evidências científicas para minimizar risco de lesão:
          </p>
          
          {/* 3 Subseções */}
          <div className="space-y-6">
            {/* Subseção 1 */}
            <div className="flex gap-3">
              <span className="text-2xl">👁️</span>
              <div>
                <h4 
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
                >
                  1. Monitoramento Semanal (Prevenção)
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#333333" }}>
                  Avaliações físicas contínuas detectam sinais de sobrecarga antes de lesão grave. Ajustes semanais no plano de treino baseados em resposta individual. Controle rigoroso de progressão de volume.
                </p>
              </div>
            </div>
            
            {/* Subseção 2 */}
            <div className="flex gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h4 
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
                >
                  2. Equipe Interdisciplinar (Integração)
                </h4>
                <ul className="text-sm space-y-1.5" style={{ color: "#333333" }}>
                  <li><strong>Fisioterapeuta:</strong> Detecta e trata compensações e desequilíbrios</li>
                  <li><strong>Educador Físico:</strong> Garante progressão segura e periodização adequada</li>
                  <li><strong>Especialista em Mentalidade:</strong> Gerencia fadiga psicológica e stress</li>
                </ul>
              </div>
            </div>
            
            {/* Subseção 3 */}
            <div className="flex gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <h4 
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
                >
                  3. Recovery Estratégico (Recuperação)
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#333333" }}>
                  12 sessões de recovery personalizadas durante as 12 semanas. Técnicas de liberação miofascial, crioterapia, compressão. Protocolos adaptados ao estado de fadiga individual.
                </p>
              </div>
            </div>
          </div>
          
          <p 
            className="text-sm font-semibold mt-6"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#1a7a7a" }}
          >
            Resultado Esperado: Redução significativa de risco de lesão séria, permitindo que você chegue 100% preparado na prova.
          </p>
        </div>

        {/* REFERÊNCIAS CIENTÍFICAS */}
        <div className={`transition-all duration-700 delay-400 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h4 
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#1a1a1a" }}
          >
            Referências Científicas
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {referencias.map((ref, index) => (
              <div 
                key={ref.num}
                className="p-4 rounded-lg bg-white shadow-sm"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span 
                    className="text-sm font-semibold"
                    style={{ fontFamily: "'Poppins', sans-serif", color: "#1a7a7a" }}
                  >
                    {ref.num}
                  </span>
                  <p 
                    className="text-[13px] font-semibold leading-tight"
                    style={{ color: "#1a1a1a" }}
                  >
                    {ref.titulo}
                  </p>
                </div>
                <p className="text-xs mb-2" style={{ color: "#666666" }}>
                  {ref.periodico} • {ref.volume}
                </p>
                <div className="flex flex-wrap gap-3 mb-2">
                  <a 
                    href={ref.pubmed}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] underline hover:opacity-70 transition-opacity"
                    style={{ color: "#1a7a7a" }}
                  >
                    PubMed
                  </a>
                  <a 
                    href={ref.doiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] underline hover:opacity-70 transition-opacity"
                    style={{ color: "#1a7a7a" }}
                  >
                    DOI: {ref.doi}
                  </a>
                </div>
                <p className="text-xs italic" style={{ color: "#333333" }}>
                  {ref.achado}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// SEÇÃO 13: CTA FINAL
const Section13CTAFinal = () => {
  const { ref, isInView } = useInView(0.2);

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  return (
    <section 
      ref={ref}
      className="py-16 md:py-20 lg:py-24"
      style={{ 
        background: "linear-gradient(135deg, #1a7a7a 0%, #0E3C41 40%, #C8643D 100%)"
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* BLOCO 1: Headline + Gancho Emocional */}
        <div 
          className={`
            mb-8 md:mb-12
            transition-all duration-700
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 md:mb-6"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Seu Legado Merece Proteção Completa
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Você investiu meses de treino, dedicação e sacrifício.<br />
            <span className="text-white font-medium">Uma lesão séria pode tirar tudo isso de você.</span>
          </p>
        </div>

        {/* BLOCO 2: Card de Preço */}
        <div 
          className={`
            bg-black/20 backdrop-blur-sm rounded-2xl p-6 md:p-10 max-w-xl mx-auto mb-8 md:mb-12 border border-white/10
            transition-all duration-700 delay-100
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <p 
            className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            R$ 5.400
          </p>
          <p className="text-base md:text-lg text-white mb-6">
            em até 6x de R$ 900
          </p>
          
          <div className="border-t border-white/20 pt-6 space-y-3">
            <p className="text-white font-medium text-base md:text-lg">
              12 semanas de proteção integral
            </p>
            <p className="text-white/70 text-sm md:text-base">
              Equipe de 4 especialistas • Segurança máxima • Legado garantido
            </p>
          </div>
        </div>

        {/* BLOCO 3: Frase de Fechamento */}
        <p 
          className={`
            text-lg md:text-2xl font-semibold text-white italic max-w-2xl mx-auto mb-10 md:mb-12
            transition-all duration-700 delay-150
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          "Você merece curtir cada passo e deixar sua marca."
        </p>

        {/* CTA Buttons */}
        <div 
          className={`
            flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5
            transition-all duration-700 delay-200
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {/* Primary Button */}
          <Button
            size="lg"
            onClick={openWhatsApp}
            className="w-full sm:w-auto px-8 py-6 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: "white",
              color: "#1a7a7a"
            }}
          >
            Agendar Avaliação Inicial
          </Button>

          {/* Secondary Button */}
          <Button
            size="lg"
            variant="outline"
            onClick={openWhatsApp}
            className="w-full sm:w-auto px-8 py-6 text-base md:text-lg font-semibold border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1a7a7a] transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Falar no WhatsApp
          </Button>
        </div>

        {/* Trust Badge */}
        <div 
          className={`
            mt-10 md:mt-12
            transition-all duration-700 delay-300
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Vagas limitadas por ciclo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const CicloCompleto = () => {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "CAREFIT - Ciclo Completo | Transformação em 12 Semanas";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Programa de 12 semanas com equipe integrada de especialistas em corrida. Fisioterapia, fortalecimento, nutrição e mentalidade. Transformação real com resultados mensuráveis.");
    }

    // Add Open Graph tags
    const ogTags = [
      { property: "og:title", content: "CAREFIT - Ciclo Completo | Transformação em 12 Semanas" },
      { property: "og:description", content: "Programa de 12 semanas com equipe integrada de especialistas em corrida. Fisioterapia, fortalecimento, nutrição e mentalidade." },
      { property: "og:type", content: "website" },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  return (
    <main className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary font-medium">
                  Ciclo Completo
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* SEÇÃO 1: HERO SECTION - TRANSFORMACIONAL */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden animate-fade-in"
        style={{ paddingTop: "80px" }}
      >
        {/* Background Gradient with Split Effect */}
        <div className="absolute inset-0">
          {/* Gradient Background */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0E3C41 0%, #1a7a7a 40%, #C8643D 80%, #e67e22 100%)"
            }}
          />
          
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-black/45" />
          
          {/* Subtle Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Programa Exclusivo de 12 Semanas
            </span>
          </div>

          {/* Headline H1 */}
          <h1 
            className="text-[32px] md:text-[48px] font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Grandes Projetos Merecem
            <br />
            Proteção Completa
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-2xl font-semibold mb-6"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#d4af37" }}
          >
            Sua Jornada é Seu Legado
          </p>

          {/* BLOCO 1: Contexto Emocional */}
          <p className="text-sm md:text-base text-white/85 max-w-xl mx-auto mb-6 leading-relaxed animate-fade-in">
            Você treinou meses. Você se dedicou. Você abriu mão de coisas. 
            Você investiu tempo, esforço e emoção em um grande projeto pessoal.
          </p>

          {/* BLOCO 2: Alerta - Card Semi-Transparente */}
          <div 
            className="bg-black/25 backdrop-blur-sm rounded-lg px-5 py-4 md:px-6 md:py-5 max-w-xl mx-auto mb-6 border-l-[3px] animate-fade-in"
            style={{ 
              borderLeftColor: "#e67e22",
              animationDelay: "100ms"
            }}
          >
            <p className="text-white font-semibold text-base md:text-lg mb-2">
              Uma lesão séria tira tudo.
            </p>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Você se frustra por ter lesionado no final do ciclo. Você corre medicado. Você perde o que construiu.
            </p>
          </div>

          {/* BLOCO 3: Solução */}
          <p 
            className="text-sm md:text-base text-white/85 max-w-xl mx-auto mb-8 leading-relaxed animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            Nós cuidamos de você integralmente. Fisioterapia, fortalecimento, nutrição e mentalidade integrados.{" "}
            <strong className="text-[#d4af37] font-semibold">12 semanas de proteção completa.</strong>
          </p>

          {/* BLOCO 4: Frase de Impacto */}
          <p 
            className="text-base md:text-xl font-semibold text-white max-w-md mx-auto mb-10 leading-snug animate-fade-in"
            style={{ 
              fontFamily: "'Poppins', sans-serif",
              animationDelay: "300ms"
            }}
          >
            Você chega 100%. Você curte cada passo. Você deixa seu legado.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={scrollToNextSection}
              className="w-full sm:w-auto px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ 
                background: "linear-gradient(135deg, #1a7a7a 0%, #0E3C41 100%)",
                color: "white"
              }}
            >
              Veja Sua Transformação Possível
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={openWhatsApp}
              className="w-full sm:w-auto px-8 py-6 text-lg font-semibold border-2 border-white/80 text-white bg-transparent hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Fale com um Especialista
            </Button>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={scrollToNextSection}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors cursor-pointer group"
            aria-label="Scroll para próxima seção"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Descubra mais
              </span>
              <ChevronDown className="w-8 h-8 animate-bounce" />
            </div>
          </button>
        </div>
      </section>

      {/* SEÇÃO 2 e 3: PROMESSA + O QUE RECEBE ✅ COMPLETA */}
      
      {/* SEÇÃO 2: PROMESSA + DIFERENCIAL */}
      <Section2Diferenciais />
      
      {/* NOVA SEÇÃO: O RISCO DE NÃO TER PROTEÇÃO */}
      <SectionRiscos />
      
      {/* SEÇÃO 3: O QUE VOCÊ RECEBE */}
      <Section3OQueRecebe />

      {/* SEÇÃO 4 e 5: 12 SEMANAS + RITUAIS ✅ COMPLETA */}
      
      {/* SEÇÃO 4: 12 SEMANAS INTERATIVAS */}
      <Section4Semanas />
      
      {/* SEÇÃO 5: RITUAIS SIMBÓLICOS */}
      <Section5Rituais />

      {/* SEÇÃO 6, 7 e 8: DEPOIMENTOS + PARA QUEM + COMO FUNCIONA ✅ COMPLETA */}
      
      {/* SEÇÃO 6: DEPOIMENTOS + TRANSFORMAÇÃO */}
      <Section6Depoimentos />
      
      {/* SEÇÃO 7: PARA QUEM É */}
      <Section7ParaQuem />
      
      {/* SEÇÃO 8: COMO FUNCIONA */}
      <Section8ComoFunciona />
      
      {/* SEÇÃO 9, 10, 11 e 12: COMPARAÇÃO + INVESTIMENTO + EQUIPE + CTA FINAL ✅ COMPLETA */}
      
      {/* SEÇÃO 9: COMPARAÇÃO */}
      <Section9Comparacao />
      
      {/* SEÇÃO 10: INVESTIMENTO */}
      <Section10Investimento />
      
      {/* SEÇÃO 11: DEPOIMENTOS DE EQUIPE */}
      <Section11EquipeDepoimentos />
      
      {/* SEÇÃO 12: CIÊNCIA POR TRÁS DA JORNADA */}
      <Section12Ciencia />
      
      {/* SEÇÃO 13: CTA FINAL */}
      <Section13CTAFinal />

      <Footer />
    </main>
  );
};

export default CicloCompleto;
