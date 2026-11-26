import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Check, Loader2, Mic, NotebookPen, Square } from "lucide-react";
import {
  anotarNoDiario,
  lerDiario,
  MOMENTOS_DIARIO,
  type AnotacaoDiario,
} from "@/services/appAtleta";

/* =========================================================================
 *  Diário para a fisio (sugestão do João Galindo, 26/11/2026)
 *
 *  O atleta sente algo na semana (dor ao acordar, fisgada no treino, canela
 *  que melhorou) e esquece na hora da sessão. Aqui ele anota na hora, falando
 *  ou digitando; o servidor grava como comentário no card dele no ClickUp,
 *  e a fisio lê antes ou durante a sessão.
 *
 *  O microfone usa o reconhecimento de voz do próprio navegador: o texto vai
 *  aparecendo enquanto a pessoa fala e nada de áudio passa pelo nosso
 *  servidor. Onde o navegador não oferece, o microfone do teclado faz o mesmo.
 * ========================================================================= */

interface ResultadoFala {
  isFinal: boolean;
  0: { transcript: string };
}
interface EventoFala {
  resultIndex: number;
  results: ArrayLike<ResultadoFala>;
}
interface Reconhecedor {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((evento: EventoFala) => void) | null;
  onend: (() => void) | null;
  onerror: ((evento: { error: string }) => void) | null;
}
type ConstrutorFala = new () => Reconhecedor;

const reconhecimentoDoNavegador = (): ConstrutorFala | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: ConstrutorFala; webkitSpeechRecognition?: ConstrutorFala };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

const MENSAGEM_ERRO_FALA: Record<string, string> = {
  "not-allowed": "O microfone está bloqueado para o site. Libere nas configurações do navegador ou use o microfone do teclado.",
  "service-not-allowed": "Este navegador não deixou usar o microfone aqui. Use o microfone do teclado.",
  "no-speech": "Não ouvi nada. Toque no microfone e fale de novo.",
  "audio-capture": "Não achei o microfone do celular. Use o microfone do teclado.",
  network: "A transcrição precisa de internet. Confere a conexão ou use o microfone do teclado.",
};

const doisDigitos = (n: number) => String(n).padStart(2, "0");
const hojeLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
};
const horaLocal = () => {
  const d = new Date();
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
};
const diasAntes = (iso: string, dias: number) => {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - dias);
  return d.toISOString().slice(0, 10);
};
const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const quandoFoi = (a: AnotacaoDiario) => {
  const [ano, mes, dia] = a.data.split("-");
  const semana = DIAS_SEMANA[new Date(a.data + "T12:00:00Z").getUTCDay()];
  return [`${semana}, ${dia}/${mes}${ano !== String(new Date().getFullYear()) ? "/" + ano : ""}${a.hora ? " às " + a.hora : ""}`, a.momento]
    .filter(Boolean)
    .join(" · ");
};
const juntar = (antes: string, novo: string) => {
  const limpo = novo.trim();
  if (!limpo) return antes;
  if (!antes.trim()) return limpo.charAt(0).toUpperCase() + limpo.slice(1);
  return antes.replace(/\s+$/, "") + " " + limpo;
};

const DiarioFisio = ({ fisio }: { fisio?: string | null }) => {
  const quem = fisio || "a sua fisio";
  const Fala = reconhecimentoDoNavegador();

  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [data, setData] = useState(hojeLocal);
  const [hora, setHora] = useState(horaLocal);
  const [momento, setMomento] = useState("");
  const [intensidade, setIntensidade] = useState<number | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [recado, setRecado] = useState("");

  const [ouvindo, setOuvindo] = useState(false);
  const [parcial, setParcial] = useState("");
  const [erroFala, setErroFala] = useState("");
  const reconhecedor = useRef<Reconhecedor | null>(null);

  const [anotacoes, setAnotacoes] = useState<AnotacaoDiario[] | null>(null);
  const [erroLista, setErroLista] = useState("");

  const carregar = useCallback(async () => {
    try {
      setAnotacoes((await lerDiario()).anotacoes);
      setErroLista("");
    } catch (falha) {
      setErroLista(falha instanceof Error ? falha.message : "Não consegui ler suas anotações agora.");
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Saiu da tela no meio da fala: desliga o microfone.
  useEffect(() => () => reconhecedor.current?.abort(), []);

  const falar = () => {
    if (!Fala) return;
    if (ouvindo) {
      reconhecedor.current?.stop();
      return;
    }
    setErroFala("");
    const rec = new Fala();
    rec.lang = "pt-BR";
    // Uma frase por toque: no Android o modo contínuo repete trechos do texto.
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (evento) => {
      let finais = "";
      let provisorio = "";
      for (let i = evento.resultIndex; i < evento.results.length; i++) {
        const resultado = evento.results[i];
        if (resultado.isFinal) finais += resultado[0].transcript;
        else provisorio += resultado[0].transcript;
      }
      if (finais) setTexto((antes) => juntar(antes, finais).slice(0, 1000));
      setParcial(provisorio);
    };
    rec.onerror = (evento) => {
      if (evento.error !== "aborted") setErroFala(MENSAGEM_ERRO_FALA[evento.error] || "Não consegui ouvir agora. Tente de novo ou digite.");
    };
    rec.onend = () => {
      setOuvindo(false);
      setParcial("");
      reconhecedor.current = null;
    };
    try {
      rec.start();
      reconhecedor.current = rec;
      setOuvindo(true);
    } catch {
      setErroFala("Não consegui ligar o microfone. Use o microfone do teclado.");
    }
  };

  const limpar = () => {
    setTexto("");
    setMomento("");
    setIntensidade(null);
    setData(hojeLocal());
    setHora(horaLocal());
  };

  const salvar = async (evento: FormEvent) => {
    evento.preventDefault();
    reconhecedor.current?.stop();
    setErro("");
    setRecado("");
    setOcupado(true);
    try {
      await anotarNoDiario({ data, hora, momento, intensidade, texto: texto.trim() });
      limpar();
      setAberto(false);
      setRecado(`Anotado! ${fisio ? fisio + " vai" : "A sua fisio vai"} ver isso na sua próxima sessão.`);
      carregar();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não consegui salvar agora. Tente de novo.");
    } finally {
      setOcupado(false);
    }
  };

  const hoje = hojeLocal();

  return (
    <section className="mt-7" aria-labelledby="titulo-diario">
      <h2 id="titulo-diario" className="text-[13px] font-medium uppercase tracking-[0.09em] text-primary/75">
        Anote para a sua fisio
      </h2>

      <div className="mt-3 rounded-2xl border border-primary/10 bg-white px-5 py-5">
        <p className="text-sm leading-relaxed text-primary/80">
          Sentiu uma dor, uma fisgada ou uma melhora? Anote na hora, falando ou digitando. Fica guardado e {quem} vê
          na sua próxima sessão.
        </p>

        {recado && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-emerald-700/10 px-3.5 py-3" role="status">
            <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-700" />
            <p className="text-[13px] leading-relaxed text-primary">{recado}</p>
          </div>
        )}

        {!aberto ? (
          <button
            type="button"
            onClick={() => {
              setAberto(true);
              setRecado("");
              setData(hojeLocal());
              setHora(horaLocal());
            }}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-4 text-[15px] font-medium text-primary-foreground transition-opacity hover:opacity-95"
          >
            <NotebookPen className="h-5 w-5" aria-hidden="true" />
            Fazer uma anotação
          </button>
        ) : (
          <form onSubmit={salvar} className="mt-4 grid gap-4">
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="diario-texto" className="text-[13px] font-medium text-primary">
                  O que você sentiu?
                </label>
                {Fala && (
                  <button
                    type="button"
                    onClick={falar}
                    aria-pressed={ouvindo}
                    className={
                      "flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition " +
                      (ouvindo ? "animate-pulse bg-secondary text-white" : "border border-primary/20 text-primary hover:bg-primary/5")
                    }
                  >
                    {ouvindo ? <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" /> : <Mic className="h-4 w-4" aria-hidden="true" />}
                    {ouvindo ? "Parar" : "Falar"}
                  </button>
                )}
              </div>
              <textarea
                id="diario-texto"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Ex.: acordei com dor na lombar, do lado direito. Melhorou depois de alongar."
                className="mt-2 w-full resize-y rounded-xl border border-primary/20 bg-white px-3.5 py-3 text-[15px] leading-relaxed text-primary placeholder:text-primary/40 focus:border-primary focus:outline-none"
              />
              {ouvindo && (
                <p className="mt-1.5 text-[13px] italic leading-relaxed text-primary/60" aria-live="polite">
                  {parcial || "Ouvindo… pode falar."}
                </p>
              )}
              {erroFala && <p className="mt-1.5 text-[12px] leading-relaxed text-secondary">{erroFala}</p>}
              <p className="mt-1.5 text-[11px] leading-relaxed text-primary/55">
                {Fala
                  ? "Toque em Falar e conte. Ao parar de falar, o texto entra aqui e dá para corrigir."
                  : "Para falar em vez de digitar, use o microfone do teclado do celular."}
              </p>
            </div>

            <fieldset>
              <legend className="text-[13px] font-medium text-primary">Quando foi?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={data}
                  min={diasAntes(hoje, 60)}
                  max={hoje}
                  onChange={(e) => setData(e.target.value)}
                  aria-label="Dia"
                  required
                  className="min-h-[44px] w-full rounded-xl border border-primary/20 bg-white px-3 text-[15px] text-primary focus:border-primary focus:outline-none"
                />
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  aria-label="Hora (opcional)"
                  className="min-h-[44px] w-full rounded-xl border border-primary/20 bg-white px-3 text-[15px] text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {MOMENTOS_DIARIO.map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={momento === m}
                    onClick={() => setMomento(momento === m ? "" : m)}
                    className={
                      "min-h-[36px] rounded-full px-3 text-[13px] transition " +
                      (momento === m ? "bg-primary text-primary-foreground" : "border border-primary/20 text-primary/80 hover:bg-primary/5")
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-[13px] font-medium text-primary">Intensidade da dor</legend>
              <p className="text-[11px] text-primary/55">0 = nenhuma · 10 = a pior que já sentiu. Pode deixar em branco.</p>
              <div className="mt-2 grid grid-cols-11 gap-1">
                {Array.from({ length: 11 }, (_, n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={intensidade === n}
                    aria-label={`Intensidade ${n}`}
                    onClick={() => setIntensidade(intensidade === n ? null : n)}
                    className={
                      "min-h-[40px] rounded-lg text-[13px] font-medium tabular-nums transition " +
                      (intensidade === n ? "bg-secondary text-white" : "bg-primary/5 text-primary hover:bg-primary/10")
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
            </fieldset>

            {erro && (
              <div className="flex items-start gap-2.5 rounded-xl border border-secondary/25 bg-secondary/10 px-3.5 py-3" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-secondary" />
                <p className="text-[13px] leading-relaxed text-primary/80">{erro}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={ocupado || texto.trim().length < 3}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {ocupado && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar para {fisio || "a fisio"}
              </button>
              <button
                type="button"
                onClick={() => {
                  reconhecedor.current?.abort();
                  setAberto(false);
                  setErro("");
                }}
                disabled={ocupado}
                className="min-h-[48px] rounded-xl border border-primary/20 px-4 text-sm font-medium text-primary disabled:opacity-50"
              >
                Fechar
              </button>
            </div>
          </form>
        )}

        {erroLista && <p className="mt-3 text-[12px] text-primary/60">{erroLista}</p>}
        {anotacoes && anotacoes.length > 0 && (
          <details className="mt-4 rounded-xl bg-primary/5 px-3.5 py-2.5 text-primary">
            <summary className="cursor-pointer text-[13px] font-medium">Suas anotações ({anotacoes.length})</summary>
            <ol className="mt-2 grid gap-2.5">
              {anotacoes.map((a) => (
                <li key={a.id} className="border-t border-primary/10 pt-2.5 first:border-t-0 first:pt-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-primary/70">{quandoFoi(a)}</span>
                    {a.intensidade !== null && (
                      <span className="flex-none rounded-full bg-secondary/15 px-2 py-0.5 text-[11px] font-medium tabular-nums text-secondary">
                        {a.intensidade}/10
                      </span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-primary/85">{a.texto}</p>
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </section>
  );
};

export default DiarioFisio;
