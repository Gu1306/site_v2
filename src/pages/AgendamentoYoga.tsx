import AgendamentoAulas, { type ConfigAgendamento } from "@/components/AgendamentoAulas";

/**
 * Web App do Apps Script `Agenda Yoga` (apps-script/agenda-yoga.gs no repo
 * carefit-clickup-automacoes). Enquanto estiver vazio a página mostra
 * "agendamento em configuração" e manda para o WhatsApp — não quebra.
 * Preencher com a URL /exec depois de publicar o Web App. Fica como constante,
 * e não como variável VITE_*, pelo mesmo motivo do fortalecimento: a URL vai
 * para o bundle de qualquer jeito e variável sem ARG no Dockerfile deixa a
 * página muda sem erro no log.
 */
const ENDPOINT_YOGA =
  "https://script.google.com/macros/s/AKfycbxh9ceNePIIaavA9WKaDBKstVAF7jeG0KC_UZ5eXKlLZUZHj2FRm64ErhMvS7JwMOzLYA/exec";

const CONFIG: ConfigAgendamento = {
  endpoint: ENDPOINT_YOGA,
  seoTitulo: "Agendar aula de yoga | CareFit Run Base",
  seoDescricao:
    "Aula de yoga às terças e quintas, das 6h às 7h, na CareFit Run Base em Ribeirão Preto. R$ 60 por aula. Escolha o dia e reserve sua vaga.",
  caminho: "/agendamento-yoga",
  eyebrow: "Yoga · terças e quintas, 6h às 7h",
  nomeAula: "Aula de yoga",
  textoConfirmar: "Confirmar minha aula",
  destaque: "R$ 60 por aula",
  avisoSucesso: "Valor: R$ 60 por aula. A CareFit te chama no WhatsApp para combinar o pagamento.",
};

const AgendamentoYoga = () => <AgendamentoAulas config={CONFIG} />;

export default AgendamentoYoga;
