/* =========================================================================
 *  Cliente da API de agendamento do fortalecimento.
 *
 *  Do outro lado está o Web App do Apps Script `Agenda Fortalecimento`
 *  (repo carefit-clickup-automacoes, arquivo apps-script/agenda-fortalecimento.gs).
 *  Ele é quem fala com a agenda e com a planilha — o navegador nunca toca
 *  no Google Sheets nem carrega credencial nenhuma.
 *
 *  Duas manias do Apps Script moldam este arquivo:
 *
 *  1. O POST vai com Content-Type text/plain de propósito. Com
 *     application/json o navegador dispara um preflight OPTIONS, e Web App
 *     do Apps Script não responde OPTIONS — a reserva morreria em CORS.
 *     O corpo continua sendo JSON; o doPost lê e.postData.contents.
 *
 *  2. O ContentService sempre devolve 200. Erro de negócio vem no corpo,
 *     em { ok: false, codigo }. É esse `codigo` que vira mensagem na tela.
 * ========================================================================= */

/**
 * URL /exec da implantação do Web App.
 * Preferência para a env var (VITE_… entra no build do Vite); o valor fixo
 * existe para o caso de o Gustavo querer só colar a URL e subir.
 */
const ENDPOINT_FIXO = "";

const ENDPOINT =
  (import.meta.env.VITE_AGENDAMENTO_FORTALECIMENTO_API as string | undefined)?.trim() ||
  ENDPOINT_FIXO;

/** Sem endpoint a página não tenta buscar nada e mostra o aviso de configuração. */
export const agendamentoConfigurado = ENDPOINT !== "";

export interface AulaDisponivel {
  /** "2026-09-07T06:00" — hora local de São Paulo. É o que o POST devolve. */
  id: string;
  /** "2026-09-07" */
  data: string;
  /** "06:00" */
  horaInicio: string;
  /** "07:00" */
  horaFim: string;
  inicioISO: string;
  fimISO: string;
  rotulo: string;
  capacidade: number;
  reservas: number;
  vagas: number;
  status: "disponivel" | "lotada";
}

export interface ReservaConfirmada {
  aulaId: string;
  /** "segunda-feira, 07/09, às 06h00" */
  quando: string;
  inicioISO: string;
  fimISO: string;
  nome: string;
  email: string;
}

export type CodigoErro =
  | "CONFIG"
  | "REDE"
  | "RESPOSTA"
  | "DADOS"
  | "LOTADA"
  | "NAO_ENCONTRADA"
  | "OCUPADO"
  | "PAYLOAD"
  | "ERRO";

export class ErroAgendamento extends Error {
  codigo: CodigoErro;

  constructor(codigo: CodigoErro, mensagem: string) {
    super(mensagem);
    this.name = "ErroAgendamento";
    this.codigo = codigo;
  }
}

const ERRO_REDE =
  "Não consegui falar com a agenda. Confere a internet e tenta de novo.";

/**
 * Web App fora do ar, implantação privada ou login do Google no caminho
 * devolvem HTML, não JSON. Sem esta checagem o erro apareceria como um
 * "Unexpected token <" incompreensível para quem está reservando.
 */
async function lerJson(resposta: Response): Promise<Record<string, unknown>> {
  const texto = await resposta.text();
  try {
    return JSON.parse(texto) as Record<string, unknown>;
  } catch {
    throw new ErroAgendamento(
      "RESPOSTA",
      "A agenda respondeu em um formato inesperado. Avise a CareFit."
    );
  }
}

function garantirEndpoint() {
  if (!agendamentoConfigurado) {
    throw new ErroAgendamento(
      "CONFIG",
      "O agendamento online ainda não está ligado nesta versão do site."
    );
  }
}

export interface JanelaBusca {
  /** "AAAA-MM-DD" */
  inicio: string;
  /** "AAAA-MM-DD" — o dia entra inteiro. */
  fim: string;
}

export async function buscarAulas(
  janela: JanelaBusca,
  signal?: AbortSignal
): Promise<AulaDisponivel[]> {
  garantirEndpoint();

  const url = `${ENDPOINT}?inicio=${encodeURIComponent(janela.inicio)}&fim=${encodeURIComponent(janela.fim)}`;

  let resposta: Response;
  try {
    resposta = await fetch(url, { method: "GET", signal });
  } catch (erro) {
    if ((erro as Error)?.name === "AbortError") throw erro;
    throw new ErroAgendamento("REDE", ERRO_REDE);
  }

  const corpo = await lerJson(resposta);
  if (!corpo.ok) {
    throw new ErroAgendamento(
      (corpo.codigo as CodigoErro) || "ERRO",
      (corpo.mensagem as string) || "Não consegui carregar os horários."
    );
  }

  return (corpo.aulas as AulaDisponivel[]) || [];
}

export interface PedidoReserva {
  aulaId: string;
  nome: string;
  email: string;
  /** Já normalizado em E.164 pelo chamador. */
  telefone: string;
  /** Mesma chave em toda retentativa da MESMA reserva. */
  idempotencia: string;
}

export async function reservarAula(pedido: PedidoReserva): Promise<ReservaConfirmada> {
  garantirEndpoint();

  let resposta: Response;
  try {
    resposta = await fetch(ENDPOINT, {
      method: "POST",
      // Ver o comentário do topo: text/plain evita o preflight.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(pedido),
    });
  } catch {
    throw new ErroAgendamento("REDE", ERRO_REDE);
  }

  const corpo = await lerJson(resposta);
  if (!corpo.ok) {
    throw new ErroAgendamento(
      (corpo.codigo as CodigoErro) || "ERRO",
      (corpo.mensagem as string) || "Não consegui confirmar a reserva."
    );
  }

  return corpo.reserva as ReservaConfirmada;
}

/**
 * WhatsApp em E.164 (+5516999998849) para o que vem depois — ClickUp,
 * Evolution API e qualquer integração que não aceita "(16) 99999-8849".
 * Número com cara errada volta como veio: quem valida é o formulário.
 */
export function normalizarTelefone(bruto: string): string {
  const digitos = String(bruto || "").replace(/\D/g, "");
  if (!digitos) return "";
  if (digitos.startsWith("55") && digitos.length >= 12 && digitos.length <= 13) {
    return `+${digitos}`;
  }
  if (digitos.length === 10 || digitos.length === 11) return `+55${digitos}`;
  return `+${digitos}`;
}

/** Chave de idempotência — sobrevive a clique duplo e a POST repetido pela rede. */
export function novaChaveIdempotencia(): string {
  const cripto = globalThis.crypto;
  if (cripto?.randomUUID) return cripto.randomUUID().replace(/-/g, "");
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}
