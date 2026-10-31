import AgendamentoAulas, { type ConfigAgendamento } from "@/components/AgendamentoAulas";
import { endpointFortalecimento } from "@/services/agendamentoFortalecimento";

/* Reserva de aula do fortalecimento. A tela e a lógica vivem em
 * components/AgendamentoAulas.tsx, compartilhadas com o yoga. */
const CONFIG: ConfigAgendamento = {
  endpoint: endpointFortalecimento,
  seoTitulo: "Agendar aula de fortalecimento | CareFit Run Base",
  seoDescricao:
    "Escolha o dia e o horário da sua aula de fortalecimento para corredores na CareFit Run Base, em Ribeirão Preto.",
  caminho: "/agendamento-fortalecimento",
  eyebrow: "Fortalecimento para corredores",
  nomeAula: "Aula de fortalecimento",
  textoConfirmar: "Confirmar minha aula",
};

const AgendamentoFortalecimento = () => <AgendamentoAulas config={CONFIG} />;

export default AgendamentoFortalecimento;
