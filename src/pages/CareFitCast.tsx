import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Youtube, Mic, Users, ExternalLink, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-runners.jpg";

// ── Episode data ──────────────────────────────────────────
// To add a new episode just paste the YouTube video ID and fill in the fields.
type Episode = {
  youtubeId: string;
  spotifyUrl?: string;
  title: string;
  guest: string;
  description: string;
};

const episodes: Episode[] = [
  // ↓ O PRIMEIRO da lista é sempre o destaque. Para adicionar um novo episódio,
  //   basta colar um novo objeto aqui no TOPO do array.
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
    spotifyUrl: "",
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

// ── Guest showcase ────────────────────────────────────────
const guests = [
  { name: "Atletas", emoji: "🏃" },
  { name: "Treinadores", emoji: "📋" },
  { name: "Assessores Esportivos", emoji: "🤝" },
  { name: "Fisioterapeutas", emoji: "💆" },
  { name: "Nutricionistas", emoji: "🥗" },
];

// ── Helpers ───────────────────────────────────────────────
const ytThumb = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const ytEmbed = (id: string) =>
  `https://www.youtube.com/embed/${id}?rel=0`;
const ytWatch = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`;

const CHANNEL_URL = "https://www.youtube.com/@CAREFITRUNBASE";

// ── Component ─────────────────────────────────────────────
const CareFitCast = () => {
  const navigate = useNavigate();
  const featured = episodes[0];

  useEffect(() => {
    document.title = "CareFit Cast — Podcast sobre corrida, performance e recovery | CareFit Run Base";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "CareFit Cast: o podcast da CareFit Run Base sobre corrida de rua, performance, recovery e histórias do esporte de endurance. Ouça agora!"
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* ─── 1. HERO ───────────────────────────────────── */}
      <section className="relative py-24 md:py-32 bg-primary text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Mic className="w-10 h-10 text-earth" />
            <h1 className="text-4xl md:text-6xl font-montserrat font-bold">
              CareFit <span className="text-earth">Cast</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-poppins opacity-90 mb-4">
            O podcast da CareFit sobre corrida, performance, recovery e histórias do esporte.
          </p>
          <p className="text-base md:text-lg font-poppins opacity-80 max-w-3xl mx-auto mb-8">
            O CareFit Cast é um espaço de conversa com atletas, treinadores, assessorias esportivas e especialistas do esporte de endurance. Aqui exploramos treinamento, recuperação, mentalidade e as histórias por trás das jornadas no esporte.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => window.open(CHANNEL_URL, "_blank")}
          >
            <Youtube className="w-5 h-5 mr-2" />
            Assistir no YouTube
          </Button>
        </div>
      </section>

      {/* ─── 2. EPISÓDIO MAIS RECENTE ──────────────────── */}
      <section className="py-16 md:py-20 bg-warm">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary text-center mb-12">
            Último <span className="text-secondary">Episódio</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Video embed */}
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={ytEmbed(featured.youtubeId)}
                title={featured.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div>
              <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">
                {featured.title}
              </h3>
              <p className="text-secondary font-semibold mb-4">
                Convidado: {featured.guest}
              </p>
              <p className="text-muted-foreground font-poppins mb-6">
                {featured.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => window.open(ytWatch(featured.youtubeId), "_blank")}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Assistir no YouTube
                </Button>
                {featured.spotifyUrl && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.open(featured.spotifyUrl, "_blank")}
                  >
                    <Music className="w-5 h-5 mr-2" />
                    Ouvir no Spotify
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. LISTA DE EPISÓDIOS ─────────────────────── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary text-center mb-12">
            Todos os <span className="text-earth">Episódios</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {episodes.map((ep) => (
              <Card
                key={ep.youtubeId}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={ytThumb(ep.youtubeId)}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>

                <CardContent className="pt-5 space-y-2">
                  <h3 className="text-lg font-montserrat font-semibold text-primary line-clamp-2">
                    {ep.title}
                  </h3>
                  <p className="text-sm text-secondary font-semibold">
                    {ep.guest}
                  </p>
                  <p className="text-sm text-muted-foreground font-poppins line-clamp-3">
                    {ep.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(ytWatch(ep.youtubeId), "_blank")}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      YouTube
                    </Button>
                    {ep.spotifyUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(ep.spotifyUrl, "_blank")}
                      >
                        <Music className="w-4 h-4 mr-1" />
                        Spotify
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. SOBRE O CAREFIT CAST ──────────────────── */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Mic className="w-12 h-12 text-earth mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">
            Sobre o CareFit <span className="text-earth">Cast</span>
          </h2>
          <p className="text-lg font-poppins opacity-90 leading-relaxed">
            O CareFit Cast nasceu para aprofundar conversas sobre corrida, esporte de endurance, saúde e performance. Em cada episódio recebemos atletas, treinadores, assessorias esportivas e profissionais da saúde para discutir treinamento, prevenção de lesões, nutrição, mentalidade e as histórias que moldam a jornada de cada corredor.
          </p>
        </div>
      </section>

      {/* ─── 5. CONVIDADOS DO PODCAST ─────────────────── */}
      <section className="py-16 md:py-20 bg-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary text-center mb-12">
            Nossos <span className="text-secondary">Convidados</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {guests.map((g) => (
              <Card
                key={g.name}
                className="w-40 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                  <span className="text-4xl">{g.emoji}</span>
                  <p className="font-montserrat font-semibold text-primary text-sm">
                    {g.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. CHAMADA PARA O CANAL ──────────────────── */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-secondary to-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <Youtube className="w-12 h-12 mx-auto mb-6 text-earth" />
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
            Acompanhe o CareFit Cast
          </h2>
          <p className="text-lg font-poppins opacity-90 mb-8">
            Novos episódios com histórias inspiradoras e conhecimento sobre corrida e performance.
          </p>
          <Button
            variant="warm"
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => window.open(CHANNEL_URL, "_blank")}
          >
            <Youtube className="w-5 h-5 mr-2" />
            Inscreva-se no canal
          </Button>
        </div>
      </section>

      {/* ─── 7. INTEGRAÇÃO COM A CAREFIT ──────────────── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-6">
            Parte do ecossistema <span className="text-earth">CareFit</span>
          </h2>
          <p className="text-lg font-poppins text-muted-foreground mb-8 leading-relaxed">
            O CareFit Cast faz parte do ecossistema da CareFit Run Base, um espaço dedicado ao cuidado, recuperação e performance de atletas de endurance.
          </p>
          <Button
            variant="default"
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => navigate("/")}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Conheça a CareFit Run Base
          </Button>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PodcastSeries",
            name: "CareFit Cast",
            description:
              "Podcast da CareFit Run Base sobre corrida de rua, performance, recovery e histórias do esporte de endurance.",
            url: "https://www.carefitrunbase.com.br/carefit-cast",
            webFeed: CHANNEL_URL,
            author: {
              "@type": "Organization",
              name: "CareFit Run Base",
              url: "https://www.carefitrunbase.com.br",
            },
          }),
        }}
      />
    </div>
  );
};

export default CareFitCast;
