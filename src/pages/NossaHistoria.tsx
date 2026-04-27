import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Home, Lightbulb, Handshake, Dumbbell, PersonStanding, Target, Eye, Bird, Scale, Microscope, Brain, RefreshCw, Check, X, MessageCircle } from "lucide-react";

// Team member photos
import gustavoFoto from "@/assets/gustavo_foto.jpg";
import liviaFoto from "@/assets/livia_foto.jpg";
import guilhermeFoto from "@/assets/guilherme_foto.jpg";
import arthurFoto from "@/assets/arthur_foto.jpg";

// Timeline Item Component
interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "primary" | "accent";
  position: "left" | "right";
  delay: number;
}

const TimelineItem = ({ year, title, description, icon, variant, position, delay }: TimelineItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const colorClasses = variant === "primary" 
    ? "bg-primary text-white border-primary" 
    : "bg-earth text-white border-earth";

  const yearColorClass = variant === "primary" ? "text-primary" : "text-earth";

  return (
    <div 
      ref={itemRef}
      className={`relative flex items-start lg:items-center transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden flex items-start w-full">
        {/* Icon Circle */}
        <div 
          className={`relative z-10 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${colorClasses} flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
        >
          {icon}
        </div>
        
        {/* Content Card */}
        <div 
          className="ml-6 sm:ml-8 flex-1 bg-background rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-border/50"
        >
          <span className={`text-xl sm:text-2xl font-bold ${yearColorClass} font-poppins`}>
            {year}
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-2 mb-3 font-poppins">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground font-poppins leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 w-full items-center">
        {/* Left Side */}
        <div className={`${position === "left" ? "text-right pr-12" : ""}`}>
          {position === "left" && (
            <div 
              className="bg-background rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-border/50 inline-block max-w-lg ml-auto"
            >
              <span className={`text-2xl font-bold ${yearColorClass} font-poppins`}>
                {year}
              </span>
              <h3 className="text-xl font-semibold text-foreground mt-2 mb-3 font-poppins">
                {title}
              </h3>
              <p className="text-base text-muted-foreground font-poppins leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Center Icon */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 z-10 w-14 h-14 lg:w-16 lg:h-16 rounded-full ${colorClasses} flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
        >
          {icon}
        </div>

        {/* Right Side */}
        <div className={`${position === "right" ? "pl-12" : ""}`}>
          {position === "right" && (
            <div 
              className="bg-background rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-border/50 inline-block max-w-lg"
            >
              <span className={`text-2xl font-bold ${yearColorClass} font-poppins`}>
                {year}
              </span>
              <h3 className="text-xl font-semibold text-foreground mt-2 mb-3 font-poppins">
                {title}
              </h3>
              <p className="text-base text-muted-foreground font-poppins leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Team Card Component
interface TeamCardProps {
  photo: string;
  initials: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  delay: number;
}

const TeamCard = ({ photo, initials, name, title, specialty, bio, delay }: TeamCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={`group relative bg-background rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 cursor-pointer border-t-4 border-earth ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Photo Container */}
      <div className="relative w-full aspect-square overflow-hidden">
        <img 
          src={photo} 
          alt={`Foto de ${name}`}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
        />
        
        {/* Initials Badge */}
        <div className="absolute top-4 left-4 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl font-poppins">
            {initials}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground font-poppins mb-1">
          {name}
        </h3>
        <p className="text-sm text-primary font-poppins mb-2">
          {title}
        </p>
        <span className="inline-block text-xs font-semibold text-earth bg-earth/10 px-3 py-1 rounded-full mb-3 font-poppins">
          {specialty}
        </span>
        <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
          {bio}
        </p>
      </div>
    </div>
  );
};

// Value Card Component
interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: "primary" | "accent";
  delay: number;
  large?: boolean;
}

const ValueCard = ({ icon, title, description, variant, delay, large = false }: ValueCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const iconColorClass = variant === "primary" ? "text-primary" : "text-earth";
  const borderColorClass = variant === "primary" ? "border-l-primary" : "border-t-earth";

  return (
    <div 
      ref={cardRef}
      className={`group bg-background rounded-xl ${large ? 'p-6 sm:p-8 border-l-4' : 'p-5 sm:p-6 border-t-4'} ${borderColorClass} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer hover:bg-earth/5 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className={`${iconColorClass} mb-4 transition-all duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className={`${large ? 'text-xl sm:text-2xl' : 'text-lg'} font-semibold text-foreground font-poppins mb-3`}>
        {title}
      </h3>
      <p className={`${large ? 'text-base' : 'text-sm'} text-muted-foreground font-poppins leading-relaxed`}>
        {description}
      </p>
    </div>
  );
};

// Comparison Row Component (Desktop)
interface ComparisonRowProps {
  aspect: string;
  generic: string;
  carefit: string;
  delay: number;
}

const ComparisonRow = ({ aspect, generic, carefit, delay }: ComparisonRowProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <tr 
      ref={rowRef}
      className={`border-b border-border/50 transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <td className="bg-muted/30 text-foreground font-medium p-4 font-poppins">
        {aspect}
      </td>
      <td className="bg-muted/50 text-center p-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground font-poppins">
          <X className="w-4 h-4 text-red-400" />
          <span>{generic}</span>
        </div>
      </td>
      <td className="bg-primary/90 text-center p-4">
        <div className="flex items-center justify-center gap-2 text-white font-poppins">
          <Check className="w-4 h-4 text-earth" />
          <span>{carefit}</span>
        </div>
      </td>
    </tr>
  );
};

// Mobile Comparison Card Component
interface MobileComparisonCardProps {
  aspect: string;
  generic: string;
  carefit: string;
  delay: number;
}

const MobileComparisonCard = ({ aspect, generic, carefit, delay }: MobileComparisonCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={`bg-background rounded-xl overflow-hidden shadow-md transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-muted/50 px-4 py-3 font-semibold text-foreground font-poppins">
        {aspect}
      </div>
      <div className="grid grid-cols-2">
        <div className="bg-muted/30 p-4 text-center border-r border-border/50">
          <p className="text-xs text-muted-foreground mb-1 font-poppins">Clínica Genérica</p>
          <div className="flex items-center justify-center gap-1 text-muted-foreground font-poppins text-sm">
            <X className="w-3 h-3 text-red-400" />
            <span>{generic}</span>
          </div>
        </div>
        <div className="bg-primary/90 p-4 text-center">
          <p className="text-xs text-white/70 mb-1 font-poppins">CareFit Run Base</p>
          <div className="flex items-center justify-center gap-1 text-white font-poppins text-sm">
            <Check className="w-3 h-3 text-earth" />
            <span>{carefit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NossaHistoria = () => {
  useEffect(() => {
    // Set page meta tags
    document.title = "Nossa História & Valores | CareFit Run Base - HUB do Corredor";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Conheça a história da CareFit Run Base, nossa missão, visão e os valores que guiam nosso cuidado especializado com corredores.");
    }
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <nav 
        aria-label="Breadcrumb" 
        className="fixed top-20 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </li>
            <li>
              <span className="text-foreground font-medium">Nossa História</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section - 100vh */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent"
          aria-hidden="true"
        />
        
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-black/45"
          aria-hidden="true"
        />
        
        {/* Decorative elements */}
        <div 
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-earth rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
          <div className="animate-fade-in">
            {/* Desktop: Left-aligned | Mobile/Tablet: Centered */}
            <div className="lg:max-w-2xl lg:text-left text-center">
              {/* Headline */}
              <h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-montserrat"
              >
                Por que esperar a dor chegar?
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 font-poppins leading-relaxed">
                A CareFit Run Base nasceu de uma pergunta simples. Gustavo, maratonista apaixonado, 
                percebeu que corredores sofrem com cuidado fragmentado, lesões evitáveis e falta de 
                especialização. <span className="text-earth font-semibold">Existe um caminho melhor.</span>
              </p>

              {/* Description */}
              <p className="text-base sm:text-lg text-white/80 mb-10 font-poppins max-w-xl lg:max-w-none mx-auto lg:mx-0">
                Somos especialistas em corrida cuidando de corredores. 
                <br className="hidden sm:block" />
                <span className="text-gold font-medium">Prevenção</span>, não reação. 
                <span className="text-gold font-medium"> Integração</span>, não isolamento. 
                <span className="text-gold font-medium"> Transformação</span>, não apenas tratamento.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-montserrat font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={scrollToNextSection}
                >
                  Descubra Nossa Solução
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToNextSection}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors cursor-pointer group"
          aria-label="Rolar para próxima seção"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-poppins opacity-70 group-hover:opacity-100 transition-opacity">
              Role para descobrir
            </span>
            <ChevronDown className="w-8 h-8 animate-bounce" />
          </div>
        </button>
      </section>

      {/* SEÇÃO 2: TIMELINE - Origem + Solução */}
      <section 
        className="py-20 lg:py-28 bg-muted/30"
        aria-labelledby="timeline-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 
              id="timeline-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 font-poppins"
            >
              Nossa Evolução
            </h2>
            <p className="text-lg text-muted-foreground font-poppins max-w-2xl mx-auto">
              Marcos importantes na construção da CareFit Run Base
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line - Desktop */}
            <div 
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-earth to-primary transform -translate-x-1/2"
              aria-hidden="true"
            />
            
            {/* Vertical Line - Mobile/Tablet */}
            <div 
              className="lg:hidden absolute left-6 sm:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-earth to-primary"
              aria-hidden="true"
            />

            {/* Timeline Items */}
            <div className="space-y-12 lg:space-y-16">
              {/* Marco 1 - 2022 */}
              <TimelineItem
                year="2022"
                title="O Despertar"
                description="Gustavo percebe que o cuidado com o corredor é fragmentado. Das longas distâncias e dores veio a pergunta que mudaria tudo: 'Por que esperar a dor chegar?'"
                icon={<Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
                variant="primary"
                position="left"
                delay={0}
              />

              {/* Marco 2 - 2023 */}
              <TimelineItem
                year="2023"
                title="Os Primeiros Passos"
                description="Nasce a CareFit Recovery. Gustavo e Lívia (fisioterapeuta especializada em corrida) unem ciência e propósito para transformar o recovery em parceiro da performance. Cuidar antes de precisar tratar."
                icon={<Handshake className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
                variant="accent"
                position="right"
                delay={100}
              />

              {/* Marco 3 - 2024 */}
              <TimelineItem
                year="2024"
                title="Crescimento e Validação"
                description="Chegam Guilherme (fortalecimento) e Arthur (nutrição), completando o time. Força, nutrição e fisioterapia integradas tornam a CareFit referência em prevenção e performance."
                icon={<Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
                variant="primary"
                position="left"
                delay={200}
              />

              {/* Marco 4 - 2025 */}
              <TimelineItem
                year="2025"
                title="O Hub do Corredor"
                description="Surge a CareFit Run Base, um espaço 100% preparado para a jornada do atleta. O sonho se torna real: um centro de transformação que une ciência, cuidado e propósito."
                icon={<PersonStanding className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
                variant="accent"
                position="right"
                delay={300}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* SEÇÃO 3: EQUIPE ESPECIALIZADA */}
      <section 
        className="py-20 lg:py-28 bg-background"
        aria-labelledby="team-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 
              id="team-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 font-poppins"
            >
              Especialistas em Corrida Cuidando de Corredores
            </h2>
            <p className="text-lg text-muted-foreground font-poppins max-w-2xl mx-auto">
              Conheça o time que transforma a jornada de cada corredor
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Gustavo Rosa */}
            <TeamCard
              photo={gustavoFoto}
              initials="GR"
              name="Gustavo Rosa"
              title="Fundador e Head Coach"
              specialty="Transformação de Corredores"
              bio="Com mais de 20 Ultramaratonas e Maratonas. Criador da metodologia CareFit e especialista em transformação de corredores. Vive na pele cada desafio que o corredor enfrenta."
              delay={0}
            />

            {/* Lívia Dias */}
            <TeamCard
              photo={liviaFoto}
              initials="LD"
              name="Lívia Dias"
              title="Fisioterapeuta Esportiva & Agente de Performance"
              specialty="Prevenção e Recovery"
              bio="Especialista em prevenção de lesões e recovery. Corredora apaixonada que une ciência e sensibilidade no cuidado de cada atleta. Seu conhecimento em fisiologia transforma vidas."
              delay={100}
            />

            {/* Guilherme Coelho */}
            <TeamCard
              photo={guilhermeFoto}
              initials="GC"
              name="Guilherme Coelho"
              title="Educador Físico"
              specialty="Fortalecimento Funcional"
              bio="Corredor e especialista em fortalecimento funcional para corredores. Focado em construir a base que sustenta cada quilômetro da jornada. Economia de energia e potência em cada treino."
              delay={200}
            />

            {/* Arthur Angelotti */}
            <TeamCard
              photo={arthurFoto}
              initials="AA"
              name="Arthur Angelotti"
              title="Nutricionista Esportivo"
              specialty="Nutrição para Performance"
              bio="Maratonista e especialista em nutrição para performance. Desenvolve estratégias alimentares que transformam treinos em conquistas. Combustível certo para cada jornada."
              delay={300}
            />
          </div>
        </div>
      </section>
      
      {/* SEÇÃO 4: VALORES & FILOSOFIA ✅ COMPLETA */}
      <section 
        className="py-20 lg:py-28 bg-gradient-to-b from-muted/50 to-background"
        aria-labelledby="values-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 
              id="values-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 font-poppins"
            >
              Valores & Filosofia
            </h2>
            <p className="text-lg text-muted-foreground font-poppins max-w-2xl mx-auto">
              Os princípios que guiam cada passo da nossa jornada
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left Column: Mission & Vision */}
            <div className="space-y-8">
              {/* Mission */}
              <ValueCard
                icon={<Target className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />}
                title="Nossa Missão"
                description="Transformar a relação dos corredores com o cuidado, provando que prevenção é a estratégia mais inteligente para uma performance duradoura e consciente."
                variant="primary"
                delay={0}
                large
              />

              {/* Vision */}
              <ValueCard
                icon={<Eye className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />}
                title="Nossa Visão"
                description="Ser a base fundamental que fortalece cada corredor para realizar seus sonhos, entendendo que cuidar não é parar, mas sim a forma mais inteligente de seguir em frente."
                variant="primary"
                delay={100}
                large
              />
            </div>

            {/* Right Column: 6 Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Value 1 */}
              <ValueCard
                icon={<Bird className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
                title="Toda jornada importa"
                description="Cada pessoa tem uma história, um ritmo, uma distância e um motivo. Não comparamos jornadas — celebramos cada passo dado com consciência."
                variant="accent"
                delay={0}
              />

              {/* Value 2 */}
              <ValueCard
                icon={<Scale className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
                title="O cuidado vem antes da dor"
                description="Acreditamos que prevenir é cuidar com amor e ciência. Performance é consequência de constância, não de pressa."
                variant="accent"
                delay={100}
              />

              {/* Value 3 */}
              <ValueCard
                icon={<Handshake className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
                title="Respeito e parceria"
                description="A relação treinador–atleta é sagrada. Nós somos a base de suporte — corpo, mente e nutrição — para que o atleta realize seu sonho com seu treinador."
                variant="accent"
                delay={200}
              />

              {/* Value 4 */}
              <ValueCard
                icon={<Microscope className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
                title="Ciência com propósito"
                description="Tudo o que fazemos é embasado em fisiologia, movimento e estudo, mas guiado por propósito e empatia. Cuidar é ciência com alma."
                variant="accent"
                delay={300}
              />

              {/* Value 5 */}
              <ValueCard
                icon={<Brain className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
                title="Transformação individual"
                description="Cada jornada é única e profundamente pessoal. O que transforma um, pode não tocar o outro — e está tudo bem. Respeitamos a singularidade de cada trajetória."
                variant="accent"
                delay={400}
              />

              {/* Value 6 */}
              <ValueCard
                icon={<RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
                title="Constância acima da perfeição"
                description="Nem todos os ciclos serão perfeitos, e isso é humano. O progresso acontece quando fazemos o possível — com consciência e amor ao processo."
                variant="accent"
                delay={500}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* SEÇÃO 5: DIFERENCIAL ✅ COMPLETA */}
      <section 
        className="py-20 lg:py-28 bg-background"
        aria-labelledby="diferencial-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 
              id="diferencial-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 font-poppins"
            >
              Por Que Somos Diferentes
            </h2>
            <p className="text-lg text-muted-foreground font-poppins max-w-2xl mx-auto">
              Conheça o que nos diferencia de clínicas genéricas
            </p>
          </div>

          {/* Comparison Table - Desktop */}
          <div className="hidden md:block overflow-hidden rounded-2xl shadow-xl">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-muted/50 text-foreground font-semibold text-left p-4 font-poppins w-1/3">
                    Aspecto
                  </th>
                  <th className="bg-muted text-muted-foreground font-semibold text-center p-4 font-poppins w-1/3">
                    Clínica Genérica
                  </th>
                  <th className="bg-primary text-white font-semibold text-center p-4 font-poppins w-1/3">
                    CareFit Run Base
                  </th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  aspect="Foco"
                  generic="Qualquer pessoa"
                  carefit="Só corredores"
                  delay={0}
                />
                <ComparisonRow
                  aspect="Especialização"
                  generic="Generalista"
                  carefit="100% corrida"
                  delay={50}
                />
                <ComparisonRow
                  aspect="Equipe"
                  generic="Profissionais"
                  carefit="Corredores que vivem isso"
                  delay={100}
                />
                <ComparisonRow
                  aspect="Abordagem"
                  generic="Reativa (trata lesão)"
                  carefit="Preventiva (evita lesão)"
                  delay={150}
                />
                <ComparisonRow
                  aspect="Integração"
                  generic="Isolada"
                  carefit="Integrada (4 pilares)"
                  delay={200}
                />
                <ComparisonRow
                  aspect="Propósito"
                  generic="Lucro"
                  carefit="Transformação"
                  delay={250}
                />
              </tbody>
            </table>
          </div>

          {/* Comparison Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {[
              { aspect: "Foco", generic: "Qualquer pessoa", carefit: "Só corredores" },
              { aspect: "Especialização", generic: "Generalista", carefit: "100% corrida" },
              { aspect: "Equipe", generic: "Profissionais", carefit: "Corredores que vivem isso" },
              { aspect: "Abordagem", generic: "Reativa (trata lesão)", carefit: "Preventiva (evita lesão)" },
              { aspect: "Integração", generic: "Isolada", carefit: "Integrada (4 pilares)" },
              { aspect: "Propósito", generic: "Lucro", carefit: "Transformação" },
            ].map((item, index) => (
              <MobileComparisonCard
                key={item.aspect}
                aspect={item.aspect}
                generic={item.generic}
                carefit={item.carefit}
                delay={index * 50}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: CTA FINAL ✅ COMPLETA */}
      <section 
        className="py-16 lg:py-24 bg-gradient-to-r from-primary via-primary/90 to-earth"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 font-poppins"
          >
            Você não precisa correr sozinho
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-10 font-poppins max-w-3xl mx-auto leading-relaxed">
            Cada passo importa. Cada história é única. Você tem uma equipe de especialistas em corrida 
            pronta para construir a base que falta. Sua jornada de transformação começa aqui.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-earth hover:text-white px-8 py-6 text-lg font-poppins font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}
            >
              Descubra Sua Solução Ideal
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent px-8 py-6 text-lg font-poppins font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Fale com um Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* PÁGINA COMPLETA ✅ PRONTA PARA PRODUÇÃO */}
    </main>
  );
};

export default NossaHistoria;
