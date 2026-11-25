import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, CalendarPlus, Check, Loader2, LogOut, MessageCircle } from "lucide-react";
import AgendamentoAulas, { type ConfigAgendamento } from "@/components/AgendamentoAulas";
import { useSeo } from "@/hooks/useSeo";
import logo from "@/assets/logocarefitclub.png";
import {
  ErroAgendamento,
  endpointFortalecimento,
  type CodigoErro,
  type ReservaConfirmada,
} from "@/services/agendamentoFortalecimento";
import { ENDPOINT_YOGA } from "@/pages/AgendamentoYoga";
import {
  apiApp,
  cancelarReserva,
  capitalizar,
  ErroApp,
  NOME_MODALIDADE,
  type InicioDoAtleta,
  type Modalidade,
  type ReservaDoAtleta,
} from "@/services/appAtleta";

/* =========================================================================
 *  App do atleta — /app
 *
 *  Fase 1: quem já é atleta CareFit entra com o WhatsApp (código de 6 dígitos),
 *  vê as próximas aulas e o saldo do pacote de fortalecimento, reserva sem
 *  redigitar os dados e cancela sozinho. Quem ainda não tem cadastro continua
 *  pela página pública de reserva, que não mudou.
 *
 *  Não há service worker de propósito: a página se instala na tela inicial só
 *  com o manifesto, e sem cache próprio um deploy novo nunca fica preso no
 *  celular de ninguém.
 * ========================================================================= */

const WHATSAPP_CAREFIT = "(16) 99600-8849";
const LINK_WHATSAPP = "https://wa.me/5516996008849";

// Agendas de reserva do Google de cada fisioterapeuta, para quem JÁ tem plano.
// Primeira sessão e avaliação ficam fora: são porta de entrada, com pagamento.
// Tipo sem nenhuma agenda cadastrada não aparece na tela.
const AGENDAS_FISIO: { titulo: string; detalhe: string; agendas: { nome: string; url: string }[] }[] = [
  {
    titulo: "Sessão Jornada Recovery",
    detalhe: "60 min · para quem já está na jornada",
    agendas: [
      { nome: "Lívia", url: "https://calendar.app.google/J94MCG5wCeiCcmNu7" },
      { nome: "Lais", url: "https://calendar.app.google/tgvbpVkLSokd5ZwT9" },
      { nome: "Igor", url: "https://calendar.app.google/nAerGDU7JSxEH2EGA" },
    ],
  },
  {
    titulo: "Sessão de reabilitação",
    detalhe: "Fisioterapia · para quem já fez a avaliação",
    agendas: [
      { nome: "Lívia", url: "https://calendar.app.google/qjxaZRdT3Dcu35vcA" },
      { nome: "Lais", url: "https://calendar.app.google/kqLUAb3SfBftBkRT8" },
      { nome: "Igor", url: "https://calendar.app.google/R5Sre6h6ch7FVDZ59" },
    ],
  },
];
const semAcento = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const CONFIG: Record<Modalidade, ConfigAgendamento> = {
  fortalecimento: {
    endpoint: endpointFortalecimento,
    seoTitulo: "CareFit | Reservar fortalecimento",
    seoDescricao: "Reserve sua aula de fortalecimento na CareFit Run Base.",
    caminho: "/app",
    eyebrow: "Fortalecimento para corredores",
    nomeAula: "Aula de fortalecimento",
    textoConfirmar: "Confirmar minha aula",
  },
  yoga: {
    endpoint: ENDPOINT_YOGA,
    seoTitulo: "CareFit | Reservar yoga",
    seoDescricao: "Reserve sua aula de yoga na CareFit Run Base.",
    caminho: "/app",
    eyebrow: "Yoga · terças e quintas, 6h às 7h",
    nomeAula: "Aula de yoga",
    textoConfirmar: "Confirmar minha aula",
    destaque: "R$ 60 por aula",
    avisoSucesso: "Valor: R$ 60 por aula. A CareFit te chama no WhatsApp para combinar o pagamento.",
  },
};

type Tela = { nome: "verificando" } | { nome: "entrar" } | { nome: "inicio" } | { nome: "reservar"; modalidade: Modalidade };

const AppAtleta = () => {
  useSeo({
    titulo: "CareFit | Minhas aulas",
    descricao: "Reserve e cancele suas aulas de fortalecimento e yoga na CareFit Run Base.",
    caminho: "/app",
    noindex: true,
  });

  const [tela, setTela] = useState<Tela>({ nome: "verificando" });
  const [inicio, setInicio] = useState<InicioDoAtleta | null>(null);
  const [erroGeral, setErroGeral] = useState("");
  const [recado, setRecado] = useState("");

  const carregar = useCallback(async () => {
    setErroGeral("");
    try {
      setInicio(await apiApp<InicioDoAtleta>("inicio"));
      setTela((atual) => (atual.nome === "reservar" ? atual : { nome: "inicio" }));
    } catch (erro) {
      if (erro instanceof ErroApp && erro.status === 401) {
        setInicio(null);
        setTela({ nome: "entrar" });
      } else {
        setErroGeral(erro instanceof Error ? erro.message : "Não consegui abrir agora.");
        setTela((atual) => (atual.nome === "verificando" ? { nome: "inicio" } : atual));
      }
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const sair = async () => {
    try {
      await apiApp("sair", {});
    } finally {
      setInicio(null);
      setRecado("");
      setTela({ nome: "entrar" });
    }
  };

  if (tela.nome === "reservar") {
    const modalidade = tela.modalidade;
    return (
      <AgendamentoAulas
        key={modalidade}
        config={CONFIG[modalidade]}
        app={{
          aoVoltar: () => {
            setTela({ nome: "inicio" });
            carregar();
          },
          reservar: async (aulaId, idempotencia) => {
            try {
              return await apiApp<ReservaConfirmada>("reservar", { modalidade, aulaId, idempotencia });
            } catch (erro) {
              if (erro instanceof ErroApp && erro.status === 401) {
                setTela({ nome: "entrar" });
              }
              const falha = erro instanceof ErroApp ? erro : null;
              throw new ErroAgendamento(
                (falha?.codigo as CodigoErro) || "ERRO",
                falha?.message || "Não consegui confirmar a reserva agora."
              );
            }
          },
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
      <div className="mx-auto w-full max-w-xl">
        {tela.nome === "verificando" ? (
          <div className="grid min-h-[60vh] place-items-center text-primary/60" role="status">
            <span className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Abrindo...
            </span>
          </div>
        ) : tela.nome === "entrar" ? (
          <Entrar aoEntrar={carregar} />
        ) : (
          <Inicio
            inicio={inicio}
            erro={erroGeral}
            recado={recado}
            aoRecado={setRecado}
            aoRecarregar={carregar}
            aoReservar={(modalidade) => {
              setRecado("");
              setTela({ nome: "reservar", modalidade });
            }}
            aoSair={sair}
          />
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ Entrar */

const Entrar = ({ aoEntrar }: { aoEntrar: () => void }) => {
  const [passo, setPasso] = useState<"telefone" | "codigo">("telefone");
  const [telefone, setTelefone] = useState("");
  const [codigo, setCodigo] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const telefoneOk = telefone.replace(/\D/g, "").length >= 10;

  const pedir = async (evento?: FormEvent) => {
    evento?.preventDefault();
    if (!telefoneOk || ocupado) return;
    setOcupado(true);
    setErro("");
    try {
      await apiApp("codigo", { telefone });
      setCodigo("");
      setPasso("codigo");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não consegui enviar o código.");
    } finally {
      setOcupado(false);
    }
  };

  const confirmar = async (evento: FormEvent) => {
    evento.preventDefault();
    if (codigo.length !== 6 || ocupado) return;
    setOcupado(true);
    setErro("");
    try {
      await apiApp("entrar", { telefone, codigo });
      aoEntrar();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não consegui entrar.");
      setOcupado(false);
    }
  };

  const campo =
    "w-full min-h-[52px] rounded-xl border border-primary/15 bg-white px-4 text-lg text-primary outline-none placeholder:text-primary/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

  return (
    <div className="pt-6 sm:pt-10">
      <img src={logo} alt="CareFit Run Base" className="mx-auto h-20 w-auto" />
      <div className="mt-6 rounded-3xl bg-warm px-5 py-7 sm:px-8">
        <h1 className="text-2xl font-semibold leading-tight text-primary">Suas aulas na CareFit</h1>

        {passo === "telefone" ? (
          <form onSubmit={pedir} className="mt-2">
            <p className="text-sm leading-relaxed text-primary/70">
              Entre com o WhatsApp que está no seu cadastro. A gente manda um código por lá, sem
              senha para lembrar.
            </p>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs font-medium text-primary/70">WhatsApp com DDD</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                autoFocus
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="16 99999-8888"
                className={campo}
              />
            </label>
            {erro && <Alerta>{erro}</Alerta>}
            <button
              type="submit"
              disabled={!telefoneOk || ocupado}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 font-medium text-secondary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {ocupado && <Loader2 className="h-4 w-4 animate-spin" />}
              Receber código no WhatsApp
            </button>
          </form>
        ) : (
          <form onSubmit={confirmar} className="mt-2">
            <p className="text-sm leading-relaxed text-primary/70">
              Se esse número está no nosso cadastro, o código de 6 dígitos acabou de chegar no seu
              WhatsApp. Ele vale por 10 minutos.
            </p>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs font-medium text-primary/70">Código</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className={campo + " text-center tracking-[0.4em]"}
              />
            </label>
            {erro && <Alerta>{erro}</Alerta>}
            <button
              type="submit"
              disabled={codigo.length !== 6 || ocupado}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 font-medium text-secondary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {ocupado && <Loader2 className="h-4 w-4 animate-spin" />}
              Entrar
            </button>
            <div className="mt-4 flex justify-between text-[13px] font-medium text-primary/70">
              <button
                type="button"
                className="min-h-[40px] underline underline-offset-2"
                onClick={() => {
                  setPasso("telefone");
                  setErro("");
                }}
              >
                Trocar o número
              </button>
              <button type="button" className="min-h-[40px] underline underline-offset-2" disabled={ocupado} onClick={() => pedir()}>
                Mandar outro código
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-primary/55">
              Não chegou? O número pode estar diferente no cadastro. Fala com a gente no WhatsApp{" "}
              {WHATSAPP_CAREFIT}.
            </p>
          </form>
        )}
      </div>

      <p className="mt-5 text-center text-[13px] leading-relaxed text-primary/60">
        Ainda não é atleta CareFit? Reserve direto pela página de{" "}
        <a className="font-medium text-primary underline underline-offset-2" href="/agendamento-fortalecimento">
          fortalecimento
        </a>{" "}
        ou de{" "}
        <a className="font-medium text-primary underline underline-offset-2" href="/agendamento-yoga">
          yoga
        </a>
        .
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ Início */

/** "2027-01-30" → "30/01/2027", sem passar por Date (fuso não pode mudar o dia). */
const dataCurta = (iso: string) => iso.split("-").reverse().join("/");

const Numero = ({ rotulo, valor }: { rotulo: string; valor: number | string }) => (
  <div className="rounded-xl bg-primary/5 px-2 py-2">
    <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-primary/55">{rotulo}</dt>
    <dd className="mt-0.5 text-sm font-semibold text-primary">{valor}</dd>
  </div>
);

interface InicioProps {
  inicio: InicioDoAtleta | null;
  erro: string;
  recado: string;
  aoRecado: (texto: string) => void;
  aoRecarregar: () => Promise<void>;
  aoReservar: (modalidade: Modalidade) => void;
  aoSair: () => void;
}

const Inicio = ({ inicio, erro, recado, aoRecado, aoRecarregar, aoReservar, aoSair }: InicioProps) => {
  // Aulas canceladas nesta visita: somem da lista na hora, sem esperar a releitura.
  const [canceladas, setCanceladas] = useState<string[]>([]);

  if (!inicio) {
    return (
      <div className="pt-10 text-center">
        <Alerta>{erro || "Não consegui abrir suas aulas agora."}</Alerta>
        <button
          type="button"
          onClick={aoRecarregar}
          className="mt-4 min-h-[46px] rounded-xl border border-primary/20 bg-white px-5 font-medium text-primary"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  const reservas = inicio.reservas.filter((r) => !canceladas.includes(r.modalidade + r.token));
  const pacote = inicio.fortalecimento;
  const planos = inicio.planos || [];

  return (
    <>
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-11 w-auto" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-secondary">CareFit Run Base</p>
            <h1 className="text-xl font-semibold leading-tight text-primary">Oi, {inicio.primeiroNome}</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={aoSair}
          className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-primary/60 hover:text-primary"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </header>

      {recado && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-emerald-700/10 px-4 py-3.5" role="status">
          <Check className="mt-0.5 h-5 w-5 flex-none text-emerald-700" />
          <p className="text-sm leading-relaxed text-primary">{recado}</p>
        </div>
      )}
      {erro && <Alerta>{erro}</Alerta>}
      {inicio.avisos.map((aviso) => (
        <Alerta key={aviso}>{aviso}</Alerta>
      ))}

      <section className="mt-6" aria-labelledby="titulo-aulas">
        <h2 id="titulo-aulas" className="text-[13px] font-medium uppercase tracking-[0.09em] text-primary/55">
          Suas próximas aulas
        </h2>
        {reservas.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-primary/20 px-4 py-6 text-center text-sm text-primary/60">
            Você não tem aula reservada.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2.5">
            {reservas.map((reserva) => (
              <Aula
                key={reserva.modalidade + reserva.token}
                reserva={reserva}
                aoCancelar={() => {
                  setCanceladas((antes) => [...antes, reserva.modalidade + reserva.token]);
                  aoRecado(
                    reserva.modalidade === "fortalecimento" && pacote.temPacote
                      ? "Aula cancelada. A vaga voltou para a turma e o crédito volta para o seu pacote em até 15 minutos."
                      : "Aula cancelada. A vaga voltou para a turma."
                  );
                  aoRecarregar();
                }}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 grid gap-2.5" aria-label="Reservar aula">
        <BotaoReservar titulo="Reservar fortalecimento" detalhe="Veja os dias e horários com vaga" onClick={() => aoReservar("fortalecimento")} />
        <BotaoReservar titulo="Reservar yoga" detalhe="Terça e quinta, 6h às 7h · R$ 60 por aula" onClick={() => aoReservar("yoga")} />
      </section>

      <section className="mt-7" aria-labelledby="titulo-fisio">
        <h2 id="titulo-fisio" className="text-[13px] font-medium uppercase tracking-[0.09em] text-primary/55">
          Agendar sessão com fisioterapeuta
        </h2>
        <div className="mt-3 grid gap-2.5">
          {AGENDAS_FISIO.filter((tipo) => tipo.agendas.length > 0).map((tipo) => (
            <article key={tipo.titulo} className="rounded-2xl border border-primary/10 bg-white px-5 py-5">
              <h3 className="text-sm font-semibold text-primary">{tipo.titulo}</h3>
              <p className="mt-0.5 text-xs text-primary/60">{tipo.detalhe}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {tipo.agendas.map((agenda) => {
                  const meu = Boolean(inicio.fisio) && semAcento(inicio.fisio || "") === semAcento(agenda.nome);
                  return (
                    <a
                      key={agenda.nome}
                      href={agenda.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver horários de ${agenda.nome}${meu ? ", que atende você" : ""}`}
                      className={
                        "flex min-h-[52px] flex-col items-center justify-center rounded-xl px-2 py-2 text-center text-sm font-medium transition " +
                        (meu ? "bg-primary text-primary-foreground hover:opacity-95" : "border border-primary/20 text-primary hover:bg-primary/5")
                      }
                    >
                      {agenda.nome}
                      {meu && <span className="text-[10px] font-normal text-primary-foreground/75">atende você</span>}
                    </a>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-primary/60">
          Toque no nome para ver os horários livres e reservar. Para remarcar ou cancelar, avise com 24 horas de
          antecedência.
        </p>
      </section>

      {(pacote.temPacote || planos.length > 0) && (
        <section className="mt-7" aria-labelledby="titulo-em-aberto">
          <h2 id="titulo-em-aberto" className="text-[13px] font-medium uppercase tracking-[0.09em] text-primary/55">
            O que você tem com a gente
          </h2>
          <div className="mt-3 grid gap-2.5">
            {pacote.temPacote && (
              <article className="rounded-2xl bg-warm px-5 py-5">
                <h3 className="text-sm font-semibold text-primary">
                  Fortalecimento{pacote.plano ? ` · pacote de ${pacote.plano}` : ""}
                </h3>
                <p className="mt-2 text-primary">
                  <strong className="text-3xl font-semibold">{pacote.disponiveis}</strong>{" "}
                  <span className="text-sm">{pacote.disponiveis === 1 ? "aula disponível" : "aulas disponíveis"}</span>
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Numero rotulo="Agendadas" valor={pacote.agendadas} />
                  <Numero rotulo="Feitas" valor={pacote.feitas} />
                  <Numero rotulo="Validade" valor={pacote.validade ? dataCurta(pacote.validade) : "—"} />
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-primary/60">
                  O saldo atualiza em até 15 minutos depois de reservar ou cancelar.
                </p>
              </article>
            )}
            {planos.map((plano) => (
              <article key={plano.plano + (plano.validade || "")} className="rounded-2xl border border-primary/10 bg-white px-5 py-5">
                <h3 className="text-sm font-semibold text-primary">Sessões · plano {plano.plano}</h3>
                <p className="mt-2 text-primary">
                  <strong className="text-3xl font-semibold">{plano.restam}</strong>{" "}
                  <span className="text-sm">{plano.restam === 1 ? "sessão em aberto" : "sessões em aberto"}</span>
                </p>
                {/* Sessão cancelada ou lançada fora do plano faz a soma não fechar: aí só o que é certo aparece. */}
                {plano.feitas + plano.restam === plano.total ? (
                  <>
                    <div
                      className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10"
                      role="img"
                      aria-label={`${plano.feitas} de ${plano.total} sessões feitas`}
                    >
                      <div
                        className="h-full rounded-full bg-secondary"
                        style={{ width: `${Math.round((plano.feitas / Math.max(1, plano.total)) * 100)}%` }}
                      />
                    </div>
                    <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <Numero rotulo="Feitas" valor={plano.feitas} />
                      <Numero rotulo="Do plano" valor={plano.total} />
                      <Numero rotulo="Validade" valor={plano.validade ? dataCurta(plano.validade) : "—"} />
                    </dl>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-primary/70">
                    Validade: {plano.validade ? dataCurta(plano.validade) : "—"}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mt-7" aria-label="Falar com a CareFit">
        <a
          href={LINK_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[56px] items-center justify-center gap-2.5 rounded-2xl border border-primary/20 bg-white px-5 font-medium text-primary transition hover:bg-primary/5"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Falar com a CareFit no WhatsApp
        </a>
        <p className="mt-2 text-center text-xs leading-relaxed text-primary/60">
          {planos.length > 0 ? "Para marcar sua sessão ou tirar dúvida. " : "Para tirar dúvida ou falar com a equipe. "}
          {WHATSAPP_CAREFIT}
        </p>
      </section>

      <details className="mt-6 rounded-2xl bg-primary/5 px-5 py-4 text-sm text-primary">
        <summary className="cursor-pointer font-medium">Como colocar o app na tela do celular</summary>
        <div className="mt-3 grid gap-3 text-[13px] leading-relaxed text-primary/75">
          <p>
            <strong className="font-semibold text-primary">iPhone:</strong> abra esta página no Safari, toque no botão de
            compartilhar (o quadrado com a seta para cima) e escolha “Adicionar à Tela de Início”.
          </p>
          <p>
            <strong className="font-semibold text-primary">Android:</strong> abra esta página no Chrome, toque nos três
            pontinhos no canto de cima e escolha “Adicionar à tela inicial” ou “Instalar app”.
          </p>
          <p>Na primeira vez que abrir pelo ícone, o app pede o código de novo. Depois fica guardado.</p>
        </div>
      </details>
    </>
  );
};

const Aula = ({ reserva, aoCancelar }: { reserva: ReservaDoAtleta; aoCancelar: () => void }) => {
  const [confirmando, setConfirmando] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const cancelar = async () => {
    setOcupado(true);
    setErro("");
    try {
      await cancelarReserva(reserva.modalidade, reserva.token);
      aoCancelar();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não consegui cancelar agora.");
      setOcupado(false);
    }
  };

  return (
    <li className="rounded-2xl border border-primary/10 bg-white px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-medium uppercase tracking-[0.09em] text-secondary">
            {NOME_MODALIDADE[reserva.modalidade]}
          </span>
          <p className="mt-0.5 text-[15px] font-medium leading-snug text-primary">{capitalizar(reserva.quando)}</p>
        </div>
        {!confirmando && (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="min-h-[40px] flex-none rounded-lg border border-primary/15 px-3 text-[13px] font-medium text-primary/75 hover:bg-primary/5"
          >
            Cancelar
          </button>
        )}
      </div>

      {confirmando && (
        <div className="mt-3 border-t border-primary/10 pt-3">
          <p className="text-[13px] text-primary/70">Cancelar esta aula? A vaga volta para a turma.</p>
          {erro && <Alerta>{erro}</Alerta>}
          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              onClick={cancelar}
              disabled={ocupado}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {ocupado && <Loader2 className="h-4 w-4 animate-spin" />}
              Sim, cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmando(false);
                setErro("");
              }}
              disabled={ocupado}
              className="min-h-[44px] flex-1 rounded-xl border border-primary/20 px-4 text-sm font-medium text-primary disabled:opacity-50"
            >
              Manter a aula
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

const BotaoReservar = ({ titulo, detalhe, onClick }: { titulo: string; detalhe: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-[64px] items-center gap-3.5 rounded-2xl bg-primary px-4 py-3 text-left text-primary-foreground transition-opacity hover:opacity-95"
  >
    <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-primary-foreground/10">
      <CalendarPlus className="h-5 w-5" />
    </span>
    <span>
      <span className="block text-[15px] font-medium">{titulo}</span>
      <span className="mt-0.5 block text-xs text-primary-foreground/70">{detalhe}</span>
    </span>
  </button>
);

export const Alerta = ({ children }: { children: ReactNode }) => (
  <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-secondary/25 bg-secondary/10 px-3.5 py-3 text-left" role="alert">
    <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-secondary" />
    <p className="text-[13px] leading-relaxed text-primary/80">{children}</p>
  </div>
);

export default AppAtleta;
