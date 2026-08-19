import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navigation from "./components/Navigation";

// A home é a porta de entrada: entra no bundle inicial para não custar
// um round-trip extra antes da primeira pintura. Todas as outras rotas
// são carregadas sob demanda (ver React.lazy abaixo).
import Index from "./pages/Index";

const Manifesto = lazy(() => import("./pages/Manifesto"));
const Servicos = lazy(() => import("./pages/Servicos"));
const CicloCompleto = lazy(() => import("./pages/CicloCompleto"));
const Historia = lazy(() => import("./pages/Historia"));
const Espaco = lazy(() => import("./pages/Espaco"));
const Comunidade = lazy(() => import("./pages/Comunidade"));
const ComunidadeCareFit = lazy(() => import("./pages/ComunidadeCareFit"));
const Contato = lazy(() => import("./pages/Contato"));
const Agendar = lazy(() => import("./pages/Agendar"));
const IceMindExperience = lazy(() => import("./pages/IceMindExperience"));
const NossaHistoria = lazy(() => import("./pages/NossaHistoria"));
const CareFitCast = lazy(() => import("./pages/CareFitCast"));
const FisioterapiaCorredores = lazy(() => import("./pages/FisioterapiaCorredores"));
const NutricaoCorredores = lazy(() => import("./pages/NutricaoCorredores"));
const RecoveryCorredores = lazy(() => import("./pages/RecoveryCorredores"));
const AvaliacaoCorredor = lazy(() => import("./pages/AvaliacaoCorredor"));
const FortalecimentoCorredores = lazy(() => import("./pages/FortalecimentoCorredores"));
const FisioterapiaTriatletas = lazy(() => import("./pages/FisioterapiaTriatletas"));
const BiomecanicaCorrida = lazy(() => import("./pages/BiomecanicaCorrida"));
const TreinamentoMaratona = lazy(() => import("./pages/TreinamentoMaratona"));
const PrevencaoLesoes = lazy(() => import("./pages/PrevencaoLesoes"));
const LesoesNaCorrida = lazy(() => import("./pages/LesoesNaCorrida"));
const Canelite = lazy(() => import("./pages/Canelite"));
const FascitePlantar = lazy(() => import("./pages/FascitePlantar"));
const TendiniteAquiles = lazy(() => import("./pages/TendiniteAquiles"));
const DorNoJoelho = lazy(() => import("./pages/DorNoJoelho"));
const BandaIliotibial = lazy(() => import("./pages/BandaIliotibial"));
const FraturaEstresse = lazy(() => import("./pages/FraturaEstresse"));
const LandingPerformance = lazy(() => import("./pages/LandingPerformance"));
const ConhecaCareFit = lazy(() => import("./pages/ConhecaCareFit"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

const HIDE_NAV_ON = ["/conheca-a-carefit", "/performance-ribeirao-preto"];

const ConditionalNavigation = () => {
  const { pathname } = useLocation();
  if (HIDE_NAV_ON.includes(pathname)) return null;
  return <Navigation />;
};

// Sem isso o React Router mantém a posição de scroll ao trocar de rota,
// e quem sai de uma página longa cai no meio da próxima.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div
      className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin"
      role="status"
      aria-label="Carregando"
    />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ConditionalNavigation />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/jornada" element={<CicloCompleto />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/espaco" element={<Espaco />} />
            <Route path="/comunidade" element={<Comunidade />} />
            <Route path="/comunidade-carefit" element={<ComunidadeCareFit />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/ice-mind-experience" element={<IceMindExperience />} />
            <Route path="/nossa-historia" element={<NossaHistoria />} />
            <Route path="/carefit-cast" element={<CareFitCast />} />
            <Route path="/fisioterapia-para-corredores-ribeirao-preto" element={<FisioterapiaCorredores />} />
            <Route path="/nutricao-para-corredores-ribeirao-preto" element={<NutricaoCorredores />} />
            <Route path="/recovery-corredores-ribeirao-preto" element={<RecoveryCorredores />} />
            <Route path="/avaliacao-do-corredor-ribeirao-preto" element={<AvaliacaoCorredor />} />
            <Route path="/fortalecimento-para-corredores-ribeirao-preto" element={<FortalecimentoCorredores />} />
            <Route path="/fisioterapia-para-triatletas-ribeirao-preto" element={<FisioterapiaTriatletas />} />
            <Route path="/biomecanica-da-corrida-ribeirao-preto" element={<BiomecanicaCorrida />} />
            <Route path="/treinamento-para-maratona-ribeirao-preto" element={<TreinamentoMaratona />} />
            <Route path="/prevencao-de-lesoes-na-corrida-ribeirao-preto" element={<PrevencaoLesoes />} />
            <Route path="/lesoes-na-corrida" element={<LesoesNaCorrida />} />
            <Route path="/canelite-ribeirao-preto" element={<Canelite />} />
            <Route path="/fascite-plantar-ribeirao-preto" element={<FascitePlantar />} />
            <Route path="/dor-no-joelho-corrida-ribeirao-preto" element={<DorNoJoelho />} />
            <Route path="/tendinite-aquiles-ribeirao-preto" element={<TendiniteAquiles />} />
            <Route path="/banda-iliotibial-ribeirao-preto" element={<BandaIliotibial />} />
            <Route path="/fratura-por-estresse-ribeirao-preto" element={<FraturaEstresse />} />
            <Route path="/performance-ribeirao-preto" element={<LandingPerformance />} />
            <Route path="/conheca-a-carefit" element={<ConhecaCareFit />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
