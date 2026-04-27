import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Snowflake, Users, CheckCircle, AlertTriangle, Target, Heart, Zap, ArrowRight, Instagram, MessageCircle, HelpCircle, Calendar, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import nataliaFoto from "@/assets/natalia_foto.jpg";
import gustavoFoto from "@/assets/gustavo_foto.jpg";
import { CountdownTimer } from "@/components/CountdownTimer";
const IceMindExperience = () => {
  const agendamentoLink = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2npLe6qCUpbwJTGStwst0pzCITxu_FuSzFO5QwrZ7_iP4JlY5pVfxbZ-prFUTT_moZve7sqC00?gv=true";

  // Data do evento: 15 de Março de 2026 às 08:15
  const eventDate = new Date("2026-03-15T08:15:00");

  // Carrega o script do Instagram para embeds
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    };
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C5F6F] via-[#1e4a58] to-[#163842] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#E8933D] rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-[#E8933D]/20 text-[#E8933D] rounded-full text-sm font-semibold uppercase tracking-wider">
                Ice Mind Experience
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Onde a Mente Encontra Seu Limite - <span className="text-[#E8933D]">e o Ultrapassa.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Uma jornada de 2 horas que une a ciência da psicologia e a resiliência do ultramaratonista 
              para destravar seu verdadeiro potencial mental. Porque a evolução nunca para.
            </p>
            
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">Você já sentiu que sua mente é o seu maior limitador? Que o estresse te controla? Que você tem potencial mas não consegue acessá-lo? Você não está sozinho - e existe um caminho. Um caminho de volta para o controle, para a presença e para a sua melhor versão.

          </p>
            
            <CountdownTimer targetDate={eventDate} />
            
            {/* Event Info Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8">
              <div className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#E8933D]" />
                  <span className="text-white text-sm md:text-base font-medium">15 de Março de 2026</span>
                </div>
                <span className="text-white/70 text-xs md:text-sm">Domingo! Venha começar um domingo diferente</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#E8933D]" />
                <span className="text-white text-sm md:text-base font-medium">08:15 às 10:30 (2h15 de Imersão)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-[#E8933D]" />
                <span className="text-white text-sm md:text-base font-medium">Máximo 10 Participantes</span>
              </div>
            </div>
            
            <Button size="lg" className="bg-[#E8933D] hover:bg-[#d4832f] text-white text-sm md:text-lg px-6 md:px-10 py-5 md:py-6 rounded-full font-bold shadow-lg shadow-[#E8933D]/30 transition-all hover:scale-105" asChild>
              <a href="#agendamento" onClick={e => {
              e.preventDefault();
              document.getElementById("agendamento")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            }}>GARANTIR MINHA VAGA POR R$349<ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </a>
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:flex">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Seção: Relatos Pessoais do Instagram */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#3D3D3D] mb-4">
              Quem Já Viveu, <span className="text-[#E8933D]">Recomenda.</span>
            </h2>
            <p className="text-xl text-[#3D3D3D]/70">
              Relatos reais de quem passou pela experiência Ice Mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Instagram Embed 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <blockquote className="instagram-media w-full" data-instgrm-permalink="https://www.instagram.com/reel/DEaTTV8xfED/" data-instgrm-version="14" style={{
              background: '#FFF',
              border: 0,
              borderRadius: '16px',
              margin: 0,
              maxWidth: '100%',
              minWidth: '280px',
              padding: 0,
              width: '100%'
            }}>
                <a href="https://www.instagram.com/reel/DEaTTV8xfED/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-8 text-[#2C5F6F] hover:text-[#E8933D] transition-colors">
                  <Instagram className="w-8 h-8 mr-2" />
                  Ver no Instagram
                </a>
              </blockquote>
            </div>

            {/* Instagram Embed 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <blockquote className="instagram-media w-full" data-instgrm-permalink="https://www.instagram.com/reel/DGaiAB1xgt4/" data-instgrm-version="14" style={{
              background: '#FFF',
              border: 0,
              borderRadius: '16px',
              margin: 0,
              maxWidth: '100%',
              minWidth: '280px',
              padding: 0,
              width: '100%'
            }}>
                <a href="https://www.instagram.com/reel/DGaiAB1xgt4/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-8 text-[#2C5F6F] hover:text-[#E8933D] transition-colors">
                  <Instagram className="w-8 h-8 mr-2" />
                  Ver no Instagram
                </a>
              </blockquote>
            </div>

            {/* Instagram Embed 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <blockquote className="instagram-media w-full" data-instgrm-permalink="https://www.instagram.com/reel/DCehwwgRx_I/" data-instgrm-version="14" style={{
              background: '#FFF',
              border: 0,
              borderRadius: '16px',
              margin: 0,
              maxWidth: '100%',
              minWidth: '280px',
              padding: 0,
              width: '100%'
            }}>
                <a href="https://www.instagram.com/reel/DCehwwgRx_I/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-8 text-[#2C5F6F] hover:text-[#E8933D] transition-colors">
                  <Instagram className="w-8 h-8 mr-2" />
                  Ver no Instagram
                </a>
              </blockquote>
            </div>
          </div>

        </div>
      </section>

      {/* Section 2: Os Guias */}
      <section className="py-20 md:py-32 bg-[#2C5F6F]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Você Não Está Sozinho. <span className="text-[#E8933D]">Você Tem Guias.</span>
            </h2>
            <p className="text-xl text-white/70">
              A Ciência Encontra a Experiência. Natalia e Gustavo trazem o conhecimento completo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Natalia Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 mx-auto ring-4 ring-[#E8933D]/20">
                <img src={nataliaFoto} alt="Natalia Garcia" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D3D3D] mb-2 text-center">Natalia Garcia</h3>
              <p className="text-[#E8933D] font-semibold text-center mb-2">PSICÓLOGA | A CIÊNCIA DA MENTE</p>
              <p className="text-sm text-gray-500 text-center mb-4">CRP 06/155025 | Especialista em TCC</p>
              <p className="text-[#3D3D3D]/80 text-center leading-relaxed mb-4">
                Natalia traz o "porquê". Ela vai te dar o mapa da sua mente, mostrando como seus pensamentos 
                e crenças moldam sua realidade, especialmente sob pressão. A ciência por trás da transformação.
              </p>
              <a href="https://www.instagram.com/psico.nataliagarcia/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-[#E8933D] hover:text-[#d4832f] transition-colors font-semibold">
                <Instagram className="w-5 h-5" />
                @psico.nataliagarcia
              </a>
            </div>
            
            {/* Gustavo Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 mx-auto ring-4 ring-[#2C5F6F]/20">
                <img src={gustavoFoto} alt="Gustavo Rosa" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D3D3D] mb-2 text-center">Gustavo Rosa</h3>
              <p className="text-[#E8933D] font-semibold text-center mb-2">ULTRAMARATONISTA | A PRÁTICA DA RESILIÊNCIA</p>
              <p className="text-sm text-gray-500 text-center mb-4">130km | 20+ Ultramaratonas | Fundador CareFit</p>
              <p className="text-[#3D3D3D]/80 text-center leading-relaxed mb-4">
                Gustavo traz o "como". Ele viveu na pele o poder do gelo e da respiração para superar limites 
                que pareciam impossíveis. A experiência que valida a ciência.
              </p>
              <a href="https://www.instagram.com/gustavorosa/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-[#2C5F6F] hover:text-[#1e4a58] transition-colors font-semibold">
                <Instagram className="w-5 h-5" />
                @gustavorosa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: O Plano - Timeline Visual */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#3D3D3D] mb-4">
              Seu Plano de <span className="text-[#E8933D]">Transformação Mental.</span>
            </h2>
            <p className="text-xl text-[#3D3D3D]/70">
              120 minutos que vão reconfigurar sua resposta ao estresse e ao desafio.
            </p>
          </div>
          
          {/* Timeline Container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Line - Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#2C5F6F] via-[#E8933D] to-[#2C5F6F] transform -translate-y-1/2 rounded-full" />
            
            {/* Timeline Line - Mobile */}
            <div className="md:hidden absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2C5F6F] via-[#E8933D] to-[#2C5F6F] rounded-full" />
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
              {/* Step 1 */}
              <div className="relative pl-20 md:pl-0">
                {/* Mobile Circle */}
                <div className="md:hidden absolute left-4 top-0 w-8 h-8 bg-[#2C5F6F] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                
                {/* Desktop Circle */}
                <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-8 w-16 h-16 bg-[#2C5F6F] rounded-full border-4 border-white shadow-xl items-center justify-center z-10">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                
                {/* Desktop Time Badge */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -top-20">
                  <span className="bg-[#E8933D] text-white text-xs font-bold px-3 py-1 rounded-full">
                    45 MIN
                  </span>
                </div>
                
                <div className="bg-gradient-to-br from-[#2C5F6F] to-[#1e4a58] rounded-2xl p-6 md:pt-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="md:hidden flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-[#E8933D] text-white text-xs font-bold px-3 py-1 rounded-full">45 MIN</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    A MENTE SOBRE<br className="hidden md:block" /> A MATÉRIA
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Natalia e Gustavo integram ciência e experiência para te ensinar sobre o modelo mental da TCC, 
                    crenças limitantes e como a respiração é sua ferramenta de controle.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">TCC</span>
                    <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">Respiração</span>
                    <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">Crenças</span>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative pl-20 md:pl-0">
                {/* Mobile Circle */}
                <div className="md:hidden absolute left-4 top-0 w-8 h-8 bg-[#E8933D] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                
                {/* Desktop Circle */}
                <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-8 w-16 h-16 bg-[#E8933D] rounded-full border-4 border-white shadow-xl items-center justify-center z-10">
                  <Snowflake className="w-7 h-7 text-white" />
                </div>
                
                {/* Desktop Time Badge */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -top-20">
                  <span className="bg-[#2C5F6F] text-white text-xs font-bold px-3 py-1 rounded-full">
                    45 MIN
                  </span>
                </div>
                
                <div className="bg-gradient-to-br from-[#E8933D] to-[#d4832f] rounded-2xl p-6 md:pt-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="md:hidden flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Snowflake className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-[#2C5F6F] text-white text-xs font-bold px-3 py-1 rounded-full">45 MIN</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    A PRÁTICA DA<br className="hidden md:block" /> RESILIÊNCIA
                  </h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Guiado por Gustavo e ancorado por Natalia, você aplicará as técnicas de respiração e mentalidade 
                    para navegar a experiência da imersão em gelo.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-white/20 text-white/90 text-xs px-3 py-1 rounded-full">Imersão</span>
                    <span className="bg-white/20 text-white/90 text-xs px-3 py-1 rounded-full">Gelo</span>
                    <span className="bg-white/20 text-white/90 text-xs px-3 py-1 rounded-full">Superação</span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative pl-20 md:pl-0">
                {/* Mobile Circle */}
                <div className="md:hidden absolute left-4 top-0 w-8 h-8 bg-[#2C5F6F] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                
                {/* Desktop Circle */}
                <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-8 w-16 h-16 bg-[#2C5F6F] rounded-full border-4 border-white shadow-xl items-center justify-center z-10">
                  <Users className="w-7 h-7 text-white" />
                </div>
                
                {/* Desktop Time Badge */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -top-20">
                  <span className="bg-[#E8933D] text-white text-xs font-bold px-3 py-1 rounded-full">
                    30 MIN
                  </span>
                </div>
                
                <div className="bg-gradient-to-br from-[#2C5F6F] to-[#1e4a58] rounded-2xl p-6 md:pt-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="md:hidden flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-[#E8933D] text-white text-xs font-bold px-3 py-1 rounded-full">30 MIN</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    DA SUPERAÇÃO<br className="hidden md:block" /> À VIDA REAL
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Em uma discussão em grupo, você vai conectar os pontos entre a experiência no gelo e os desafios 
                    da sua vida. A superação se torna uma ferramenta prática.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">Grupo</span>
                    <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">Integração</span>
                    <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">Prática</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Total Time */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-6 py-3">
              <span className="text-[#3D3D3D]/60 text-sm">Tempo total:</span>
              <span className="text-[#2C5F6F] font-bold text-lg">2 HORAS DE TRANSFORMAÇÃO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Fracasso Evitado */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#3D3D3D] mb-8">
              O Que Acontece Se Você <span className="text-red-500">Não Agir?</span>
            </h2>
            
            <p className="text-xl text-[#3D3D3D]/70 leading-relaxed mb-8">
              Você continua vivendo com estresse crônico que se acumula dia após dia. 
              Sua mente continua controlando você, em vez de você controlar sua mente. 
              Você sabe que é capaz de mais, mas não consegue acessar esse potencial. 
              A ansiedade, o medo e as crenças limitantes continuam ditando suas decisões e suas reações.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-[#3D3D3D]/60">
              <span className="px-4 py-2 bg-white rounded-full shadow">Estresse acumulado</span>
              <span className="px-4 py-2 bg-white rounded-full shadow">Potencial não acessado</span>
              <span className="px-4 py-2 bg-white rounded-full shadow">Ansiedade constante</span>
              <span className="px-4 py-2 bg-white rounded-full shadow">Crenças limitantes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Sucesso Alcançado */}
      <section className="py-20 md:py-32 bg-[#2C5F6F]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              O Que Você Vai <span className="text-[#E8933D]">Ganhar</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E8933D] rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">RESILIÊNCIA MENTAL</h3>
              <p className="text-white/70">
                Você aprende a transformar desconforto em força. Cada desafio se torna uma oportunidade de crescimento.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E8933D] rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">CONTROLE DO ESTRESSE</h3>
              <p className="text-white/70">
                Seu sistema nervoso é treinado para se acalmar sob pressão. O estresse deixa de ser seu inimigo.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E8933D] rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">FOCO E CLAREZA</h3>
              <p className="text-white/70">
                Você alcança um estado de presença absoluta. Suas decisões vêm de um lugar de força, não de medo.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E8933D] rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">COMUNIDADE DE SUPERADORES</h3>
              <p className="text-white/70">
                Você se conecta com pessoas que entendem a jornada. Juntos, vocês são mais fortes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Para Quem É */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#3D3D3D] mb-4">
                Você Está Pronto Para <span className="text-[#E8933D]">Ir Além?</span>
              </h2>
              <p className="text-xl text-[#3D3D3D]/70">Esta experiência é para você que é...</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {["Atleta buscando o próximo nível de performance mental.", "Profissional que vive sob alta pressão e quer dominar o estresse.", "Pessoa curiosa em busca de autoconhecimento e superação de limites.", "Corredor que sabe que a mente é tão importante quanto o corpo.", "Alguém que quer sair da zona de conforto de forma guiada e segura.", "Quem busca ferramentas práticas para lidar com ansiedade e pressão."].map((item, index) => <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-[#E8933D] flex-shrink-0 mt-0.5" />
                  <p className="text-[#3D3D3D]">{item}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-[#2C5F6F]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8933D]/20 rounded-full mb-6">
                <HelpCircle className="w-8 h-8 text-[#E8933D]" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Perguntas <span className="text-[#E8933D]">Frequentes</span>
              </h2>
              <p className="text-xl text-white/70">
                Tire suas dúvidas sobre a experiência
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-white/20 border-b">
                  <AccordionTrigger className="text-white text-left hover:no-underline hover:text-[#E8933D] transition-colors py-5">
                    <span className="text-lg font-semibold">Preciso ter alguma experiência prévia com imersão no gelo?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-base pb-5">
                    Não precisa. A experiência é guiada do começo ao fim, com orientação de respiração, preparação mental e acompanhamento dentro e fora do gelo. Você vai fazer no seu ritmo, com segurança e suporte total da equipe.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-white/20 border-b">
                  <AccordionTrigger className="text-white text-left hover:no-underline hover:text-[#E8933D] transition-colors py-5">
                    <span className="text-lg font-semibold">E se eu não aguentar o frio?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-base pb-5">
                    Tudo bem — e isso faz parte do processo. Aqui, o objetivo não é "provar resistência" nem "aguentar 2 minutos a 2°C". O foco é viver, de forma voluntária e segura, um desconforto controlado para observar como corpo e mente reagem (respiração, ansiedade, pensamentos, impulsos) e aprender estratégias para levar essa autorregulação para o dia a dia. Você pode sair quando quiser, e ainda assim a experiência continua completa.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-white/20 border-b">
                  <AccordionTrigger className="text-white text-left hover:no-underline hover:text-[#E8933D] transition-colors py-5">
                    <span className="text-lg font-semibold">O que eu preciso levar no dia?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-base pb-5">
                    Só uma troca de roupa seca. O restante a gente cuida: toalhas, estrutura, chás e um café da manhã especial para todos os participantes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-white/20 border-b">
                  <AccordionTrigger className="text-white text-left hover:no-underline hover:text-[#E8933D] transition-colors py-5">
                    <span className="text-lg font-semibold">Qual é a política de cancelamento/reembolso?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-base pb-5">
                    Como é um evento pequeno e exclusivo (até 10 participantes), conseguimos cancelar e reembolsar integralmente pedidos feitos com até 3 dias de antecedência. Com menos de 3 dias, não temos tempo hábil para repor a vaga — nesse caso, fazemos reembolso de 25% do valor.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-white/20 border-b-0">
                  <AccordionTrigger className="text-white text-left hover:no-underline hover:text-[#E8933D] transition-colors py-5">
                    <span className="text-lg font-semibold">Existem contraindicações médicas?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-base pb-5">
                    A imersão é segura para a grande maioria das pessoas quando feita com orientação, mas existem, sim, situações em que é preciso avaliação prévia. Se você tem hipertensão não controlada, histórico de arritmia, doença cardíaca, desmaios, epilepsia, gestação ou qualquer condição relevante, fale com a gente antes para alinharmos a melhor forma de participar com segurança.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="text-center mt-10">
              <p className="text-white/70 mb-4">Ainda tem dúvidas?</p>
              <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 rounded-full font-semibold shadow-lg transition-all hover:scale-105" asChild>
                <a href="https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1!%20Quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Ice%20Mind%20Experience" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Fale Conosco pelo WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Agendamento com Calendário Integrado */}
      <section id="agendamento" className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#3D3D3D] mb-4">
                Agende Sua <span className="text-[#E8933D]">Imersão</span>
              </h2>
              <p className="text-xl text-[#3D3D3D]/70">
                Escolha a data e horário que melhor se encaixa na sua agenda.
              </p>
            </div>
            
            {/* Event Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4 border-l-4 border-[#E8933D]">
                <div className="w-12 h-12 bg-[#E8933D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#E8933D]" />
                </div>
                <div>
                  <p className="text-sm text-[#3D3D3D]/60 font-medium">Data do Evento</p>
                  <p className="text-lg font-bold text-[#3D3D3D]">15 de Março de 2026</p>
                  <p className="text-sm text-[#E8933D] font-medium">Domingo! Venha começar um domingo diferente</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4 border-l-4 border-[#2C5F6F]">
                <div className="w-12 h-12 bg-[#2C5F6F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#2C5F6F]" />
                </div>
                <div>
                  <p className="text-sm text-[#3D3D3D]/60 font-medium">Duração</p>
                  <p className="text-lg font-bold text-[#3D3D3D]">2 Horas de Imersão</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4 border-l-4 border-[#E8933D]">
                <div className="w-12 h-12 bg-[#E8933D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#E8933D]" />
                </div>
                <div>
                  <p className="text-sm text-[#3D3D3D]/60 font-medium">Vagas Limitadas</p>
                  <p className="text-lg font-bold text-[#3D3D3D]">Máximo 10 Pessoas</p>
                </div>
              </div>
            </div>
            
            {/* Google Calendar Iframe */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <iframe src={agendamentoLink} style={{
              border: 0
            }} width="100%" height="600" frameBorder="0" title="Agendamento Ice Mind Experience" />
            </div>
          </div>
        </div>
      </section>


      {/* Footer Section */}
      <section className="py-8 bg-[#1e4a58]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-white/60 text-sm">
              Ice Mind Experience é uma experiência da{" "}
              <span className="text-[#E8933D] font-semibold">CareFit RunBase</span>.
            </p>
            <p className="text-white/40 text-xs mt-1">
              A evolução nunca para.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/40 text-xs">
            <a href="https://www.instagram.com/carefitrunbase/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#E8933D] transition-colors">
              <Instagram className="w-3 h-3" />
              @carefitrunbase
            </a>
            
            <a href="mailto:gustavo@coutorosa.com" className="hover:text-[#E8933D] transition-colors">
              gustavo@coutorosa.com
            </a>
            
            <a href="https://www.google.com/maps/search/?api=1&query=Av.+%C3%81urea+Aparecida+Bragheto+Machado,+241,+City+Ribeir%C3%A3o,+Ribeir%C3%A3o+Preto+-+SP" target="_blank" rel="noopener noreferrer" className="hover:text-[#E8933D] transition-colors text-center">
              Av. Áurea Aparecida Bragheto Machado, 241 - Ribeirão Preto, SP
            </a>
          </div>
        </div>
      </section>
    </div>;
};
export default IceMindExperience;
