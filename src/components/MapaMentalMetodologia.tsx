import { useState } from "react";
import { Heart, Zap, Target, Users, User, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Pilar = {
  id: string;
  icon: typeof Heart;
  title: string;
  tagline: string;
  desc: string;
  bullets: string[];
  href: string;
  color: string;
  ring: string;
};

const pilares: Pilar[] = [
  {
    id: "recovery",
    icon: Heart,
    title: "Recovery",
    tagline: "Recuperação ativa de elite",
    desc: "Imersão fria, ofuro quente, compressão pneumática e liberação miofascial. Protocolos científicos para reduzir DOMS e acelerar adaptação.",
    bullets: ["Crioterapia 10-15°C", "Botas de compressão", "Liberação miofascial guiada"],
    href: "/recovery-corredores-ribeirao-preto",
    color: "from-secondary to-earth",
    ring: "ring-secondary/40",
  },
  {
    id: "fortalecimento",
    icon: Zap,
    title: "Fortalecimento",
    tagline: "Força funcional para correr mais",
    desc: "Avaliação presencial, testes a cada 30 dias, planilhas semanais. Força específica que protege e impulsiona cada passada.",
    bullets: ["Avaliação biomecânica", "Planilhas semanais via app", "Reteste mensal"],
    href: "/fortalecimento-para-corredores-ribeirao-preto",
    color: "from-earth to-secondary",
    ring: "ring-earth/40",
  },
  {
    id: "nutricao",
    icon: Target,
    title: "Nutrição",
    tagline: "Estratégia que conversa com o treino",
    desc: "Plano nutricional integrado ao ciclo de treinos e provas. Bioimpedância em cada consulta e ajuste contínuo de rendimento.",
    bullets: ["Bioimpedância recorrente", "Periodização nutricional", "Estratégia de prova"],
    href: "/nutricao-para-corredores-ribeirao-preto",
    color: "from-primary to-primary-glow",
    ring: "ring-primary/40",
  },
  {
    id: "mente",
    icon: Users,
    title: "Mente",
    tagline: "Foco, consistência e propósito",
    desc: "Treinamento mental para sustentar a rotina, atravessar a parede dos 30km e correr com presença, não com pressão.",
    bullets: ["Rotinas de foco", "Gestão de carga mental", "Propósito de prova"],
    href: "/ice-mind-experience",
    color: "from-primary-glow to-secondary",
    ring: "ring-primary-glow/40",
  },
];

// 4 posições fixas em torno do círculo (ângulos em graus)
const ANGLES = [-90, 0, 90, 180];

const MapaMentalMetodologia = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string>("recovery");

  const radius = 210;
  const activePilar = pilares.find((p) => p.id === (hovered ?? active)) ?? pilares[0];
  const isPaused = hovered !== null;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-primary via-primary to-[hsl(var(--primary)/0.92)]">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--warm)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] rounded-full bg-earth/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-montserrat font-semibold tracking-[0.3em] text-earth uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Sistema CareFit
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-warm mb-6 leading-[1.05]">
            A performance vem da{" "}
            <span className="italic font-light text-earth">integração</span>
            <br />
            ao redor do atleta.
          </h2>
          <p className="text-lg md:text-xl text-warm/70 font-poppins leading-relaxed">
            No centro está <strong className="text-warm font-semibold">você</strong>.
            Quatro pilares orbitam em sintonia — não como serviços isolados,
            mas como um sistema integrado de alto nível.
          </p>
        </div>

        {/* Layout: Diagrama + Painel */}
        <div className="grid lg:grid-cols-[1fr,420px] gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* === DIAGRAMA ORBITAL === */}
          <div className="relative w-full aspect-square max-w-[640px] mx-auto">
            {/* Anéis concêntricos */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1, 0.78, 0.55, 0.32].map((scale, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.12, ease: "easeOut" }}
                  className="absolute rounded-full border border-warm/10"
                  style={{ width: "100%", height: "100%" }}
                />
              ))}
            </div>

            {/* Anel rotativo decorativo */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: isPaused ? 0 : 360 }}
              transition={{
                duration: 80,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="absolute w-[88%] h-[88%] rounded-full border border-dashed border-warm/15" />
            </motion.div>

            {/* === ÓRBITA DOS PILARES (rotação contínua, desacelera no hover) === */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: isPaused ? 240 : 60,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Linhas conectando ao centro */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="-320 -320 640 640"
              >
                {pilares.map((p, i) => {
                  const rad = (ANGLES[i] * Math.PI) / 180;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;
                  const isHover = hovered === p.id;
                  return (
                    <motion.line
                      key={p.id}
                      x1={0}
                      y1={0}
                      x2={x}
                      y2={y}
                      stroke={
                        isHover
                          ? "hsl(var(--earth))"
                          : "hsl(var(--warm) / 0.18)"
                      }
                      strokeWidth={isHover ? 1.5 : 0.8}
                      strokeDasharray={isHover ? "0" : "3 5"}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.08 }}
                    />
                  );
                })}
              </svg>

              {/* Pilares posicionados */}
              {pilares.map((p, idx) => {
                const angle = ANGLES[idx];
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const isHover = hovered === p.id;
                const Icon = p.icon;

                return (
                  <div
                    key={p.id}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    {/* Contra-rotação para manter pilar "em pé" */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: isPaused ? 240 : 60,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <motion.button
                        type="button"
                        onMouseEnter={() => {
                          setHovered(p.id);
                          setActive(p.id);
                        }}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => navigate(p.href)}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: 0.7 + idx * 0.1,
                          type: "spring",
                          stiffness: 120,
                        }}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-earth focus-visible:ring-offset-4 focus-visible:ring-offset-primary rounded-full"
                        aria-label={`Pilar ${p.title} — clique para conhecer`}
                      >
                        {/* Glow no hover */}
                        <AnimatePresence>
                          {isHover && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1.6 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={{ duration: 0.4 }}
                              className={`absolute inset-0 rounded-full bg-gradient-to-br ${p.color} blur-2xl -z-10`}
                            />
                          )}
                        </AnimatePresence>

                        <div
                          className={`relative w-[110px] h-[110px] md:w-[128px] md:h-[128px] rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 border-[3px] px-2 ${
                            isHover
                              ? `bg-gradient-to-br ${p.color} border-warm`
                              : "bg-warm/95 backdrop-blur-sm border-warm/30 group-hover:border-earth/50"
                          }`}
                        >
                          <Icon
                            className={`w-7 h-7 md:w-9 md:h-9 mb-1 transition-colors duration-300 ${
                              isHover ? "text-warm" : "text-primary"
                            }`}
                            strokeWidth={1.8}
                          />
                          <span
                            className={`text-[9px] md:text-[10px] font-montserrat font-bold tracking-[0.08em] uppercase leading-tight text-center transition-colors duration-300 ${
                              isHover ? "text-warm" : "text-primary"
                            }`}
                          >
                            {p.title}
                          </span>

                          {/* Indicador de clique */}
                          <AnimatePresence>
                            {isHover && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-1 -right-1 w-7 h-7 bg-warm rounded-full flex items-center justify-center shadow-lg"
                              >
                                <ArrowUpRight className="w-4 h-4 text-primary" strokeWidth={2.5} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.button>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

            {/* === PULSE RINGS no centro === */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-earth/30"
                  initial={{ width: 0, height: 0, opacity: 0.5 }}
                  animate={{
                    width: [0, 280],
                    height: [0, 280],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 1.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* === CENTRO: ATLETA — cada elemento centralizado independentemente === */}
            {/* Halo pulsante grande */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-earth/50 rounded-full blur-[80px] z-30 pointer-events-none"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "280px", height: "280px" }}
            />

            {/* Anel externo pontilhado girando ao contrário */}
            <motion.div
              className="absolute top-1/2 left-1/2 rounded-full border-2 border-dashed border-earth/40 z-30 pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{
                width: "240px",
                height: "240px",
                marginLeft: "-120px",
                marginTop: "-120px",
              }}
            />

            {/* Anel interno destacado */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-earth/60 z-30 pointer-events-none"
              style={{ width: "215px", height: "215px" }}
            />

            {/* Avatar central */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
              className="absolute top-1/2 left-1/2 z-40 pointer-events-none w-52 h-52 md:w-60 md:h-60 bg-gradient-to-br from-warm via-warm to-earth/40 rounded-full flex flex-col items-center justify-center shadow-[0_20px_80px_-10px_hsl(var(--earth)/0.6)] border-[6px] border-warm overflow-hidden"
              style={{
                marginLeft: "-7.5rem",
                marginTop: "-7.5rem",
              }}
            >
              {/* Inner radial light */}
              <div
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, hsl(var(--earth) / 0.6), transparent 65%)",
                }}
              />
              {/* Brilho topo */}
              <div
                className="absolute top-0 left-0 right-0 h-1/2 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center top, hsl(var(--warm)), transparent 70%)",
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/15 backdrop-blur-sm flex items-center justify-center mb-2.5 border-2 border-primary/25 shadow-inner">
                  <User
                    className="w-14 h-14 md:w-16 md:h-16 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-xs md:text-sm font-montserrat font-bold text-primary tracking-[0.35em] uppercase">
                  Você
                </span>
                <span className="text-[10px] md:text-[11px] font-poppins text-primary/60 tracking-[0.25em] uppercase mt-1">
                  Atleta
                </span>
              </div>
            </motion.div>
          </div>

          {/* === PAINEL LATERAL === */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePilar.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-warm/95 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-warm/30 relative overflow-hidden cursor-pointer group"
              onClick={() => navigate(activePilar.href)}
            >
              {/* Glow accent */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${activePilar.color} rounded-full blur-3xl opacity-20`} />

              <div className="relative">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${activePilar.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}
                >
                  <activePilar.icon className="w-8 h-8 text-warm" strokeWidth={2} />
                </div>

                <span className="text-[10px] font-montserrat font-semibold tracking-[0.3em] text-secondary uppercase">
                  {activePilar.tagline}
                </span>
                <h3 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mt-2 mb-4 leading-tight">
                  {activePilar.title}
                </h3>
                <p className="text-base text-primary/75 font-poppins leading-relaxed mb-6">
                  {activePilar.desc}
                </p>

                {/* Bullets */}
                <ul className="space-y-2.5 mb-8">
                  {activePilar.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-primary/80 font-poppins"
                    >
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${activePilar.color} flex-shrink-0`} />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-primary/10">
                  <span className="text-xs font-montserrat font-semibold tracking-[0.2em] text-primary/60 uppercase">
                    Conhecer pilar
                  </span>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:bg-secondary transition-colors duration-300 group-hover:scale-110 transform">
                    <ArrowUpRight className="w-5 h-5 text-warm" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hint */}
        <div className="text-center mt-14">
          <p className="text-sm text-warm/50 font-poppins italic tracking-wide">
            Passe o mouse sobre cada pilar para explorar · clique para conhecer em profundidade
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapaMentalMetodologia;
