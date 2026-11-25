/* =========================================================================
 *  Cliente do app do atleta (/app) e do link de cancelamento (/cancelar-aula).
 *
 *  Do outro lado está o servidor do próprio site (server/app-atleta.mjs). O
 *  navegador nunca fala com o ClickUp nem manda nome/telefone na reserva: o
 *  servidor preenche com o que está no cadastro do atleta.
 * ========================================================================= */

export type Modalidade = "fortalecimento" | "yoga";

export const NOME_MODALIDADE: Record<Modalidade, string> = {
  fortalecimento: "Fortalecimento",
  yoga: "Yoga",
};

export class ErroApp extends Error {
  status: number;
  /** Código de negócio da agenda (`LOTADA`, `PASSADA`…), quando houver. */
  codigo?: string;

  constructor(mensagem: string, status: number, codigo?: string) {
    super(mensagem);
    this.name = "ErroApp";
    this.status = status;
    this.codigo = codigo;
  }
}

export async function apiApp<T>(rota: string, dados?: unknown): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch("/api/app/" + rota, {
      method: dados === undefined ? "GET" : "POST",
      credentials: "same-origin",
      headers: dados === undefined ? {} : { "Content-Type": "application/json" },
      body: dados === undefined ? undefined : JSON.stringify(dados),
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw new ErroApp("Sem conexão agora. Confere a internet e tenta de novo.", 0);
  }

  let json: { error?: string; codigo?: string } & T;
  try {
    json = await resposta.json();
  } catch {
    throw new ErroApp("O servidor não respondeu como esperado. Atualize a página.", resposta.status);
  }
  if (!resposta.ok) {
    throw new ErroApp(json.error || "Não foi possível concluir.", resposta.status, json.codigo);
  }
  return json;
}

export interface ReservaDoAtleta {
  modalidade: Modalidade;
  /** "2026-11-27T07:00" */
  aulaId: string;
  data: string;
  horaInicio: string;
  /** "sexta-feira, 27/11, às 07h00" */
  quando: string;
  /** Autoriza o cancelamento desta reserva, e só dela. */
  token: string;
}

export interface PlanoDoAtleta {
  plano: string;
  total: number;
  feitas: number;
  restam: number;
  validade: string | null;
}

export interface InicioDoAtleta {
  primeiroNome: string;
  fortalecimento: {
    temPacote: boolean;
    disponiveis: number;
    agendadas: number;
    feitas: number;
    /** Nome do pacote em uso, ex.: "24 aulas". */
    plano: string | null;
    /** AAAA-MM-DD; nulo quando não há data de contratação no cadastro. */
    validade: string | null;
  };
  /** Primeiro nome do profissional que atende o atleta, segundo o cadastro. */
  fisio?: string | null;
  /** Planos de sessão que ainda têm saldo. */
  planos: PlanoDoAtleta[];
  reservas: ReservaDoAtleta[];
  avisos: string[];
}

export interface DetalheReserva {
  modalidade: Modalidade;
  aulaId: string;
  quando: string;
  cancelada: boolean;
  passada: boolean;
  primeiroNome: string;
}

export interface Cancelamento {
  ok: true;
  jaCancelada: boolean;
  quando: string;
  aulaId: string;
}

export const cancelarReserva = (modalidade: Modalidade, token: string) =>
  apiApp<Cancelamento>("cancelar", { modalidade, token });

export const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);
