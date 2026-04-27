import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CareFitLogo from "@/components/CareFitLogo";
import { CheckCircle2, Users, Heart, Trophy, Target, Zap } from "lucide-react";

// Dados das 12 semanas
const semanas = [{
  numero: 1,
  titulo: "Largada",
  descricao: "Começa o ciclo: propósito claro, avaliação inicial e plano. Você sai do \"vou tentar\" para o \"eu tenho um caminho\"."
}, {
  numero: 2,
  titulo: "Ritmo",
  descricao: "Ajustamos a rotina e o básico bem feito. Constância vira treino invisível: você entra no ritmo certo para evoluir sem quebrar."
}, {
  numero: 3,
  titulo: "Fôlego",
  descricao: "Construção aeróbica e controle de esforço. Você aprende a respirar a jornada: menos ansiedade, mais presença e consistência semana após semana."
}, {
  numero: 4,
  titulo: "Base Forte ⭐",
  descricao: "Fortalecimento específico do corredor. O corpo ganha estrutura: estabilidade, técnica e força para sustentar volume e intensidade com menos risco.",
  destaque: true
}, {
  numero: 5,
  titulo: "Subida",
  descricao: "O treino exige mais e o cuidado também. Entram progressões, ajustes finos e recovery estratégico para subir sem sobrecarga."
}, {
  numero: 6,
  titulo: "Meio da Jornada 🟤",
  descricao: "Checkpoint do ciclo: revisamos métricas, dores, evolução e mental. Você enxerga o quanto já construiu e renova o compromisso.",
  ritual: true
}, {
  numero: 7,
  titulo: "Aceleração",
  descricao: "Hora de ganhar velocidade com controle. Potência, pliometria e estímulos certos: você corre mais forte sem perder eficiência."
}, {
  numero: 8,
  titulo: "Sentido",
  descricao: "Reforço do \"porquê\" (StoryBrand): você é o herói, a corrida é o caminho. Alinhamos mente, disciplina e identidade de corredor."
}, {
  numero: 9,
  titulo: "Transformação 🪨 ⭐",
  descricao: "O novo atleta aparece. Desafio simbólico e evolução real: mais confiança, mais autonomia e menos medo do próximo passo.",
  ritual: true,
  destaque: true
}, {
  numero: 10,
  titulo: "Ápice",
  descricao: "Pico de performance do ciclo. Você colhe a consistência: melhores treinos, mais maturidade corporal e mental, com suporte completo do time."
}, {
  numero: 11,
  titulo: "Polimento",
  descricao: "Tiramos excessos, mantemos qualidade. Refinamos detalhes: sono, mobilidade, nutrição e recuperação para chegar leve, pronto e inteiro."
}, {
  numero: 12,
  titulo: "Linha de Chegada 🎉",
  descricao: "Semana de entrega e celebração. Você finaliza forte, reconhece a jornada e registra a conquista: seu resultado vira história e próximo ciclo.",
  ritual: true
}];

// Rituais simbólicos
const rituais = [{
  icone: Trophy,
  titulo: "Pirâmide da Performance",
  semana: 6,
  descricao: "Objeto simbólico de evolução",
  cor: "from-yellow-500 to-orange-600"
}, {
  icone: Target,
  titulo: "Quebra de Pedra",
  semana: 9,
  descricao: "Desafio simbólico de superação de limites pessoais",
  cor: "from-gray-500 to-gray-700"
}, {
  icone: Users,
  titulo: "Mural dos Corredores",
  semana: 12,
  descricao: "Nome eternizado e kit conquista",
  cor: "from-green-500 to-emerald-600"
}];

// Benefícios inclusos
const beneficios = ["4 avaliações físicas completas", "12 planilhas semanais de fortalecimento específicos para você", "12 sessões de recovery personalizadas", "Plano de nutrição individualizado com 3 consultas", "3 experiências guiadas para foco mental e resiliência"];

// Para quem é
const publicoAlvo = ["Quem está começando a correr com segurança", "Quem já corre mas sofre com lesões", "Quem quer evoluir para 10K, 21K ou 42K", "Quem busca performance com consciência"];

// Como funciona
const comoFunciona = ["Atendimento semanal (presencial ou híbrido)", "Fisioterapeuta exclusivo (Agente Pessoal de Performance)", "Treinos, nutrição e recovery ajustados toda semana", "Rituais que marcam sua evolução"];
const Jornada = () => {
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      {/* Seção Hero */}
      <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10" />
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-8">
            <CareFitLogo />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6 animate-fade-in">
            JORNADA PROPÓSITO
          </h1>
          
          <div className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-4">PLANO DE 12 SEMANAS 100% CUSTOMIZADO PARA VOCÊ</div>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-6 max-w-3xl mx-auto">
            Toda <span className="font-bold text-primary">JORNADA</span> precisa de uma base. Aqui, ela começa com propósito.
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Uma transformação estruturada que vai além do físico. Cada semana é um passo na construção da sua melhor versão como corredor.
          </p>
          
          <Button size="lg" className="hover-scale bg-gradient-to-r from-primary to-accent text-white px-8 py-4 text-lg" onClick={() => window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank")}>
            Quero começar minha jornada
          </Button>
        </div>
      </section>

      {/* Seção O que é */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              O que é a Jornada?
            </h2>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A Jornada Propósito é um programa completo e personalizado de 12 semanas, acompanhado de perto por fisioterapeutas, educadores físicos e nutricionistas especializados no universo da corrida. Nosso foco é preparar corpo e mente antes da dor, com prevenção, fortalecimento e recuperação integrados.
            </p>
            
            <p className="text-lg text-muted-foreground mb-6">
              Durante essa jornada, você terá acesso a:
            </p>
            
            <div className="grid gap-4 mb-8">
              {beneficios.map((beneficio, index) => <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-muted-foreground">{beneficio}</span>
                </div>)}
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tudo isso estruturado com checkpoints, marcos simbólicos e acompanhamento constante, para que sua evolução seja concreta, visível e celebrada.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Para quem é */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Para quem é?
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {publicoAlvo.map((item, index) => <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg text-muted-foreground">{item}</span>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Seção Como funciona */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Como funciona?
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {comoFunciona.map((item, index) => <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-accent flex-shrink-0" />
                    <span className="text-lg text-muted-foreground">{item}</span>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Seção As 12 Semanas */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              As 12 Semanas
            </h2>
            <p className="text-lg text-muted-foreground">
              Sua jornada de transformação, semana a semana
            </p>
          </div>
          
          <div className="relative">
            {/* Linha temporal */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary to-accent h-full opacity-30 hidden md:block" />
            
            <div className="space-y-8">
              {semanas.map((semana, index) => <div key={semana.numero} className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-col md:justify-center`}>
                  {/* Conteúdo */}
                  <div className="flex-1 max-w-lg">
                    <Card className={`
                      ${semana.ritual ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30" : "bg-card/50 border-border/50"}
                      backdrop-blur-sm hover-scale transition-all duration-300
                    `}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={semana.destaque || semana.ritual ? "default" : "secondary"} className="text-sm">
                            Semana {semana.numero}
                          </Badge>
                          {semana.ritual && <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-accent/10">
                              Ritual
                            </Badge>}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {semana.titulo}
                        </h3>
                        <p className="text-muted-foreground">
                          {semana.descricao}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Número da semana (centro) */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {semana.numero}
                  </div>
                  
                  {/* Espaço em branco para o outro lado */}
                  <div className="flex-1 max-w-lg hidden md:block" />
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Seção Rituais Simbólicos */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Rituais Simbólicos
            </h2>
            <p className="text-lg text-muted-foreground">
              Marcos especiais que celebram sua evolução
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {rituais.map((ritual, index) => <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover-scale transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${ritual.cor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <ritual.icone className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {ritual.titulo}
                  </h3>
                  
                  <Badge variant="outline" className="mb-4">
                    Semana {ritual.semana}
                  </Badge>
                  
                  <p className="text-muted-foreground">
                    {ritual.descricao}
                  </p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Seção CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            📲 Pronto para viver sua jornada?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Agende sua avaliação inicial agora mesmo.
          </p>
          
          <Button size="lg" className="hover-scale bg-gradient-to-r from-primary to-accent text-white px-8 py-4 text-lg" onClick={() => window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank")}>
            Falar no WhatsApp
          </Button>
        </div>
      </section>
    </div>;
};
export default Jornada;