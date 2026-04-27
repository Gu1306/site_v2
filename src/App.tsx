import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Manifesto from "./pages/Manifesto";
import Servicos from "./pages/Servicos";
import CicloCompleto from "./pages/CicloCompleto";
import Historia from "./pages/Historia";
import Espaco from "./pages/Espaco";
import Comunidade from "./pages/Comunidade";
import ComunidadeCareFit from "./pages/ComunidadeCareFit";
import Contato from "./pages/Contato";
import Agendar from "./pages/Agendar";
import IceMindExperience from "./pages/IceMindExperience";
import NossaHistoria from "./pages/NossaHistoria";
import EnvioResultados from "./pages/EnvioResultados";
import CareFitCast from "./pages/CareFitCast";
import FisioterapiaCorredores from "./pages/FisioterapiaCorredores";
import NutricaoCorredores from "./pages/NutricaoCorredores";
import PlaceholderPage from "./pages/PlaceholderPage";
import RecoveryCorredores from "./pages/RecoveryCorredores";
import AvaliacaoCorredor from "./pages/AvaliacaoCorredor";
import FortalecimentoCorredores from "./pages/FortalecimentoCorredores";
import FisioterapiaTriatletas from "./pages/FisioterapiaTriatletas";
import BiomecanicaCorrida from "./pages/BiomecanicaCorrida";
import TreinamentoMaratona from "./pages/TreinamentoMaratona";
import PrevencaoLesoes from "./pages/PrevencaoLesoes";
import LesoesNaCorrida from "./pages/LesoesNaCorrida";
import Canelite from "./pages/Canelite";
import FascitePlantar from "./pages/FascitePlantar";
import TendiniteAquiles from "./pages/TendiniteAquiles";
import DorNoJoelho from "./pages/DorNoJoelho";
import BandaIliotibial from "./pages/BandaIliotibial";
import FraturaEstresse from "./pages/FraturaEstresse";
import LandingPerformance from "./pages/LandingPerformance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
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
          <Route path="/envio-resultados" element={<EnvioResultados />} />
          <Route path="/carefit-cast" element={<CareFitCast />} />
          <Route path="/fisioterapia-para-corredores-ribeirao-preto" element={<FisioterapiaCorredores />} />
          {/* Placeholder pages - content coming soon */}
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
