import { motion } from "framer-motion";
import { Sparkles, Trophy, Heart, MapPin, Flag, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const marcos = [
  {
    icon: Sparkles,
    color: "bg-secondary",
    fase: "Início",
    titulo: "O primeiro 5K",
    descricao: "Tempo: 20:08 · 28/05/2024 · O ponto de partida que mostrou que era possível.",
  },
  {
    icon: Heart,
    color: "bg-earth",
    fase: "Construção",
    titulo: "Meia maratona conquistada",
    descricao: "21km em 1h49 · 26/05/2024 · A primeira grande distância — corpo e mente em sintonia.",
  },
  {
    icon: MapPin,
    color: "bg-primary",
    fase: "Expansão",
    titulo: "Multimodalidade",
    descricao: "Corrida + bike + natação + força. Em 2024: 909km de corrida e 900km de bike.",
  },
  {
    icon: Trophy,
    color: "bg-secondary",
    fase: "2026",
    titulo: "1.280 km · 197 atividades",
    descricao: "O ano da consistência. Volume mensal crescente, pace estável, recovery cuidado.",
  },
  {
    icon: Star,
    color: "bg-earth",
    fase: "Em andamento",
    titulo: "12 semanas para Lima 21K",
    descricao: "Maratona de Lima · 24/05/2026 · Jornada CareFit em curso, semana 16 de risco controlado.",
  },
  {
    icon: Flag,
    color: "bg-primary",
    fase: "Próximo capítulo",
    titulo: "A primeira maratona",
    descricao: "42K à vista. Cada km até aqui foi degrau. A linha de chegada é só o começo.",
  },
];

const MapaMentalJornada = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  return (
    <section className="relative py-24 md:py-32 bg-warm overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-montserrat font-semibold tracking-[0.3em] text-secondary uppercase mb-4">
            Case Real · Jornada CareFit
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary mb-6 leading-tight">
            A jornada de{" "}
            <span className="text-secondary italic">Ana Júlia Fernandes.</span>
          </h2>
          <p className="text-lg md:text-xl text-primary/70 font-poppins leading-relaxed">
            Cada atleta tem uma história única. Mapeamos provas, marcos,
            conquistas e aprendizados — vivos, pessoais, intransferíveis.
          </p>
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
            <Award className="w-4 h-4 text-secondary" />
            <span className="text-xs font-montserrat font-semibold text-primary uppercase tracking-wider">
              Ana Júlia Fernandes
            </span>
          </div>
        </div>

        {/* Timeline dos marcos */}
        <div className="relative max-w-4xl mx-auto">
          {/* Linha vertical */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-secondary via-earth to-primary" />

          <div className="space-y-8 md:space-y-12">
            {marcos.map((m, i) => {
              const Icon = m.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-12 md:items-center"
                >
                  {/* Card */}
                  <div className={`bg-white rounded-2xl p-5 md:p-6 shadow-md border border-primary/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    isLeft ? "md:text-right md:col-start-1" : "md:text-left md:col-start-2"
                  }`}>
                    <div className="text-[10px] font-montserrat font-bold tracking-[0.2em] text-secondary uppercase mb-1">
                      {m.fase}
                    </div>
                    <h3 className="text-lg md:text-xl font-montserrat font-bold text-primary mb-2">
                      {m.titulo}
                    </h3>
                    <p className="text-sm text-primary/70 font-poppins leading-relaxed">
                      {m.descricao}
                    </p>
                  </div>

                  {/* Nó na linha */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2">
                    <div
                      className={`w-12 md:w-14 h-12 md:h-14 ${m.color} rounded-full flex items-center justify-center shadow-lg border-4 border-warm`}
                    >
                      <Icon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl p-8 md:p-10 text-white text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-3">
              E a sua jornada — qual é?
            </h3>
            <p className="text-white/80 font-poppins mb-6 text-sm md:text-base">
              Construímos o seu mapa mental junto com você. Cada conquista,
              registrada. Cada lição, visível.
            </p>
            <Button
              onClick={handleWhatsApp}
              className="bg-earth hover:bg-earth/90 text-primary font-montserrat font-semibold"
            >
              Começar minha jornada
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MapaMentalJornada;
