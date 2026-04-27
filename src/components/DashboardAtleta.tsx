import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Heart,
  Bike,
  Waves,
  Dumbbell,
  Trophy,
  AlertTriangle,
  Zap,
  Moon,
  Brain,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: AlertTriangle,
    title: "Avaliação de Risco semanal",
    desc: "Nota 0-100 calculada com volume, subjetivo, dor, recuperação e consistência.",
  },
  {
    icon: Activity,
    title: "Check-in subjetivo diário",
    desc: "Energia, sono, estresse e dor (escala EVA) — o corpo do atleta sob radar.",
  },
  {
    icon: TrendingUp,
    title: "Recordes pessoais (PR)",
    desc: "5K, 10K, 21K e 42K cronometrados, com pace e data de cada conquista.",
  },
  {
    icon: Bike,
    title: "Multimodalidade integrada",
    desc: "Corrida, bike, natação, musculação e treino — tudo no mesmo lugar.",
  },
  {
    icon: Heart,
    title: "Distribuição de zonas Z1-Z5",
    desc: "Intensidade de cada semana por frequência cardíaca e esforço percebido.",
  },
  {
    icon: Trophy,
    title: "Jornada CareFit conectada",
    desc: "12 semanas com tema, datas, resultado esperado e observações da equipe.",
  },
];

const DashboardAtleta = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  // Score de Risco — círculo SVG (37/100 = risco médio)
  const score = 37;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="relative py-24 md:py-32 bg-primary overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-earth/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto text-white">
          <span className="inline-block text-xs font-montserrat font-semibold tracking-[0.3em] text-earth uppercase mb-4">
            CareFit Athlete Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6 leading-tight">
            A jornada do atleta,{" "}
            <span className="text-earth italic">medida em ciência.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-poppins leading-relaxed">
            Cada métrica importa. Cada check-in conta. Nosso dashboard
            centraliza risco, recovery, performance e jornada — para correr
            com clareza absoluta.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Mockup fiel ao real */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-warm to-white rounded-3xl shadow-2xl p-5 md:p-7 border border-white/30">
              {/* Browser bar */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-primary/10">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <div className="w-2.5 h-2.5 rounded-full bg-earth" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                <div className="ml-3 flex-1 bg-warm rounded-md px-3 py-1 text-[10px] font-poppins text-primary/40 truncate">
                  carefit-athlete-dashboard.onrender.com
                </div>
              </div>

              {/* Athlete header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] font-montserrat font-semibold tracking-wider uppercase text-primary/40">
                    Atleta
                  </div>
                  <div className="text-xl md:text-2xl font-montserrat font-bold text-primary">
                    Ana Júlia Fernandes
                  </div>
                  <div className="text-xs text-primary/60 font-poppins mt-0.5">
                    1.280 km · 197 atividades
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-montserrat font-bold shadow-lg">
                  AJ
                </div>
              </div>

              {/* Score de Risco + Stats da semana */}
              <div className="grid grid-cols-[auto,1fr] gap-5 mb-5">
                {/* Score circular */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/5 flex flex-col items-center justify-center w-[160px]">
                  <div className="text-[9px] font-montserrat font-semibold tracking-wider uppercase text-primary/40 mb-2">
                    Risco Semana 16
                  </div>
                  <div className="relative w-[130px] h-[130px]">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                      <circle
                        cx="65"
                        cy="65"
                        r={radius}
                        stroke="hsl(var(--primary) / 0.08)"
                        strokeWidth="10"
                        fill="none"
                      />
                      <motion.circle
                        cx="65"
                        cy="65"
                        r={radius}
                        stroke="hsl(var(--secondary))"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: offset }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl font-montserrat font-bold text-primary leading-none">
                        {score}
                      </div>
                      <div className="text-[9px] font-montserrat text-primary/50 mt-1">
                        / 100
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-montserrat font-bold text-secondary uppercase tracking-wider">
                    Risco Médio
                  </div>
                </div>

                {/* Stats da semana */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "KM Corrida", value: "49.1", color: "from-primary to-primary-glow" },
                    { label: "Pace médio", value: "5:11", color: "from-secondary to-earth" },
                    { label: "Horas treino", value: "12.6h", color: "from-earth to-secondary" },
                    { label: "Atividades", value: "11", color: "from-primary to-secondary" },
                  ].map((m, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-primary/5">
                      <div className="text-[9px] font-montserrat font-semibold tracking-wider uppercase text-primary/40 mb-1">
                        {m.label}
                      </div>
                      <div className={`text-lg font-montserrat font-bold bg-gradient-to-br ${m.color} bg-clip-text text-transparent`}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-in subjetivo */}
              <div className="bg-white rounded-xl p-4 mb-5 shadow-sm border border-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-montserrat font-semibold text-primary">
                    Check-in subjetivo · 09/04
                  </div>
                  <div className="text-[10px] font-poppins text-secondary font-semibold">
                    Score 63/100
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Zap, label: "Energia", val: "3/4", color: "text-earth" },
                    { icon: Moon, label: "Sono", val: "4/4", color: "text-primary" },
                    { icon: Brain, label: "Estresse", val: "2/4", color: "text-secondary" },
                    { icon: Stethoscope, label: "Dor EVA", val: "7/10", color: "text-secondary" },
                  ].map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div key={i} className="bg-warm rounded-lg p-2 text-center">
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${c.color}`} />
                        <div className="text-[8px] font-montserrat font-semibold text-primary/50 uppercase tracking-wider">
                          {c.label}
                        </div>
                        <div className="text-xs font-montserrat font-bold text-primary">
                          {c.val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modalidades + Zonas */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/5">
                  <div className="text-xs font-montserrat font-semibold text-primary mb-3">
                    Modalidades · Abril
                  </div>
                  <div className="space-y-2">
                    {[
                      { icon: Activity, name: "Corrida", val: "115km", pct: 75 },
                      { icon: Bike, name: "Bike", val: "401km", pct: 100 },
                      { icon: Waves, name: "Natação", val: "4.0h", pct: 35 },
                      { icon: Dumbbell, name: "Força", val: "4.7h", pct: 40 },
                    ].map((m, i) => {
                      const Icon = m.icon;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <Icon className="w-3 h-3 text-primary/60 flex-shrink-0" />
                          <div className="text-[10px] font-montserrat font-semibold text-primary w-12">
                            {m.name}
                          </div>
                          <div className="flex-1 h-1.5 bg-warm rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${m.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                              className="h-full bg-gradient-to-r from-secondary to-earth rounded-full"
                            />
                          </div>
                          <div className="text-[9px] font-poppins text-primary/60 w-10 text-right">
                            {m.val}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/5">
                  <div className="text-xs font-montserrat font-semibold text-primary mb-3">
                    Intensidade Z1-Z5
                  </div>
                  <div className="flex items-end gap-1.5 h-20 mb-2">
                    {[
                      { z: "Z1", pct: 0, color: "bg-primary/15" },
                      { z: "Z2", pct: 0, color: "bg-primary/30" },
                      { z: "Z3", pct: 59, color: "bg-secondary" },
                      { z: "Z4", pct: 41, color: "bg-earth" },
                      { z: "Z5", pct: 0, color: "bg-primary/30" },
                    ].map((b, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full h-full flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${Math.max(b.pct, 4)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.5 + i * 0.08 }}
                            className={`w-full ${b.color} rounded-t-md`}
                          />
                        </div>
                        <div className="text-[8px] font-montserrat font-bold text-primary/50">
                          {b.z}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[9px] font-poppins text-primary/50 text-center">
                    Limiar 59% · VO2Max 41%
                  </div>
                </div>
              </div>

              {/* Recordes pessoais */}
              <div className="bg-gradient-to-br from-primary to-primary-glow rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-earth" />
                  <div className="text-xs font-montserrat font-semibold text-white">
                    Recordes Pessoais
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { dist: "5K", time: "20:08", pace: "4:03/km" },
                    { dist: "10K", time: "46:03", pace: "4:35/km" },
                    { dist: "21K", time: "1h49", pace: "5:10/km" },
                  ].map((r, i) => (
                    <div key={i} className="text-center">
                      <div className="text-[10px] font-montserrat font-bold text-earth tracking-wider">
                        {r.dist}
                      </div>
                      <div className="text-base font-montserrat font-bold text-white mt-0.5">
                        {r.time}
                      </div>
                      <div className="text-[9px] font-poppins text-white/60">
                        {r.pace}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-white"
          >
            <div className="space-y-5 mb-10">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
                      <Icon className="w-5 h-5 text-earth" />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-white text-base mb-1">
                        {f.title}
                      </div>
                      <div className="text-sm text-white/70 font-poppins leading-relaxed">
                        {f.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="bg-earth hover:bg-earth/90 text-primary font-montserrat font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl"
            >
              Quero meu Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DashboardAtleta;
