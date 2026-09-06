import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import {
  agendamentoConfigurado,
  buscarAulas,
  ErroAgendamento,
  normalizarTelefone,
  novaChaveIdempotencia,
  reservarAula,
  type AulaDisponivel,
  type ReservaConfirmada,
} from "@/services/agendamentoFortalecimento";

/* =========================================================================
 *  Reserva de aula do fortalecimento — calendário aprovado em 05/09/2026.
 *  Design de origem: design/agendamento-fortalecimento/prototipo-aprovado.html
 *
 *  Três etapas explícitas: data → horário → dados. A vaga que aparece aqui é
 *  só vitrine; quem decide se ela existe é a API, que relê a agenda dentro de
 *  uma trava antes de gravar. Por isso "Lotada" pode aparecer no confirmar
 *  mesmo depois de a tela ter mostrado vaga — e a tela precisa saber tratar isso.
 *
 *  Datas circulam como texto "AAAA-MM-DD" e horas como "HH:mm", sempre no fuso
 *  de São Paulo, que é o que a API devolve. Nada de `new Date(iso)` com fuso no
 *  meio: quem abrir a página viajando não pode ver a aula no dia errado.
 * ========================================================================= */

const MESES_A_FRENTE = 3;
const WHATSAPP_CAREFIT = "(16) 99600-8849";
const ENDERECO = "Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto/SP";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const SEMANA_CURTA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const SEMANA_LONGA = [
  "domingo", "segunda-feira", "terça-feira",
  "quarta-feira", "quinta-feira", "sexta-feira", "sábado",
];

interface Mes {
  ano: number;
  mes: number; // 0-11
}

const doisDigitos = (n: number) => String(n).padStart(2, "0");
const iso = (ano: number, mes: number, dia: number) => `${ano}-${doisDigitos(mes + 1)}-${doisDigitos(dia)}`;
const indiceMes = ({ ano, mes }: Mes) => ano * 12 + mes;
const chaveMes = ({ ano, mes }: Mes) => `${ano}-${doisDigitos(mes + 1)}`;
const somarMeses = ({ ano, mes }: Mes, n: number): Mes => {
  const total = ano * 12 + mes + n;
  return { ano: Math.floor(total / 12), mes: total % 12 };
};

function porExtenso(data: string): string {
  const [ano, mes, dia] = data.split("-").map(Number);
  const semana = SEMANA_LONGA[new Date(ano, mes - 1, dia).getDay()];
  return `${semana}, ${dia} de ${MESES[mes - 1]}`;
}

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** "06:00" + "07:00" → "1 hora de aula". Sai do horário real, não de suposição. */
function duracao(aula: AulaDisponivel): string {
  const [hi, mi] = aula.horaInicio.split(":").map(Number);
  const [hf, mf] = aula.horaFim.split(":").map(Number);
  const minutos = hf * 60 + mf - (hi * 60 + mi);
  if (minutos <= 0) return "Aula de fortalecimento";
  if (minutos % 60 === 0) return `${minutos / 60} hora${minutos > 60 ? "s" : ""} de aula`;
  return `${minutos} min de aula`;
}

function textoVagas(aula: AulaDisponivel): string {
  if (aula.vagas <= 0) return "Lotada";
  if (aula.vagas === 1) return "Última vaga";
  return `${aula.vagas} vagas`;
}

type Etapa = "agenda" | "dados" | "pronto";

const AgendamentoFortalecimento = () => {
  useSeo({
    titulo: "Agendar aula de fortalecimento | CareFit Run Base",
    descricao:
      "Escolha o dia e o horário da sua aula de fortalecimento para corredores na CareFit Run Base, em Ribeirão Preto.",
    caminho: "/agendamento-fortalecimento",
    // Página de reserva, divulgada por link direto. Trocar para false quando
    // o Gustavo quiser que ela apareça na busca.
    noindex: true,
  });

  const mesAtual = useMemo<Mes>(() => {
    const agora = new Date();
    return { ano: agora.getFullYear(), mes: agora.getMonth() };
  }, []);
  const mesLimite = useMemo(() => somarMeses(mesAtual, MESES_A_FRENTE), [mesAtual]);
  const hojeISO = useMemo(() => {
    const agora = new Date();
    return iso(agora.getFullYear(), agora.getMonth(), agora.getDate());
  }, []);

  const [mesVisivel, setMesVisivel] = useState<Mes>(mesAtual);
  const [aulasPorMes, setAulasPorMes] = useState<Record<string, AulaDisponivel[]>>({});
  const [carregando, setCarregando] = useState(false);
  const [erroCarga, setErroCarga] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);

  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  // A aula fica guardada inteira, não só o id: na etapa de dados o cache de
  // horários pode ser invalidado (uma vaga que acabou, por exemplo) e a tela
  // não pode perder a escolha — nem a mensagem de erro — junto com ele.
  const [aula, setAula] = useState<AulaDisponivel | null>(null);

  const [etapa, setEtapa] = useState<Etapa>("agenda");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroReserva, setErroReserva] = useState<ErroAgendamento | null>(null);
  const [reserva, setReserva] = useState<ReservaConfirmada | null>(null);

  const painelHorarios = useRef<HTMLDivElement>(null);
  const chaveIdempotencia = useRef<string>(novaChaveIdempotencia());

  const chave = chaveMes(mesVisivel);
  const aulasDoMes = aulasPorMes[chave];

  /* ----------------------------------------------------------- Carregamento */
  useEffect(() => {
    if (!agendamentoConfigurado) return;
    if (aulasPorMes[chave]) {
      setErroCarga(null); // mês já em cache: o erro que ficou de outro mês não é dele
      return;
    }

    let obsoleto = false;
    const controle = new AbortController();
    const ultimoDia = new Date(mesVisivel.ano, mesVisivel.mes + 1, 0).getDate();
    const primeiro = iso(mesVisivel.ano, mesVisivel.mes, 1);
    const janela = {
      // O mês corrente começa hoje: não existe reserva para ontem.
      inicio: primeiro < hojeISO ? hojeISO : primeiro,
      fim: iso(mesVisivel.ano, mesVisivel.mes, ultimoDia),
    };

    setCarregando(true);
    setErroCarga(null);

    buscarAulas(janela, controle.signal)
      .then((aulas) => {
        if (obsoleto) return;
        setAulasPorMes((antes) => ({ ...antes, [chave]: aulas }));
      })
      .catch((erro) => {
        if (obsoleto || (erro as Error)?.name === "AbortError") return;
        setErroCarga(
          erro instanceof ErroAgendamento
            ? erro.message
            : "Não consegui carregar os horários agora."
        );
      })
      .finally(() => {
        // Sem esta guarda, a busca abandonada de um mês desligaria o "carregando"
        // do mês que o atleta acabou de abrir.
        if (!obsoleto) setCarregando(false);
      });

    return () => {
      obsoleto = true;
      controle.abort();
    };
  }, [chave, mesVisivel, hojeISO, aulasPorMes, recarga]);

  const tentarDeNovo = useCallback(() => {
    setAulasPorMes((antes) => {
      const copia = { ...antes };
      delete copia[chave];
      return copia;
    });
    setRecarga((n) => n + 1);
  }, [chave]);

  /** Depois de reservar, as vagas do mês mudaram — o cache não vale mais. */
  const invalidarTudo = useCallback(() => {
    setAulasPorMes({});
    setRecarga((n) => n + 1);
  }, []);

  /* --------------------------------------------------------------- Seleção */
  const aulasDoDia = useMemo(
    () => (dataSelecionada ? (aulasDoMes || []).filter((a) => a.data === dataSelecionada) : []),
    [aulasDoMes, dataSelecionada]
  );

  const diasComAula = useMemo(() => {
    const mapa = new Map<string, { total: number; comVaga: number }>();
    (aulasDoMes || []).forEach((a) => {
      const atual = mapa.get(a.data) || { total: 0, comVaga: 0 };
      mapa.set(a.data, { total: atual.total + 1, comVaga: atual.comVaga + (a.vagas > 0 ? 1 : 0) });
    });
    return mapa;
  }, [aulasDoMes]);

  const escolherData = (data: string) => {
    setDataSelecionada(data);
    setAula(null);
    setErroReserva(null);

    // No celular a lista de horários fica abaixo do calendário: sem esse
    // empurrão, o toque na data parece não ter feito nada.
    if (window.innerWidth <= 700) {
      const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        painelHorarios.current?.scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "start" })
      );
    }
  };

  const trocarMes = (passo: number) => {
    setMesVisivel((atual) => somarMeses(atual, passo));
    setDataSelecionada(null);
    setAula(null);
  };

  const escolhaTexto = aula && dataSelecionada
    ? `${porExtenso(dataSelecionada)} · ${aula.horaInicio} às ${aula.horaFim}`
    : "Escolha uma data e um horário";

  const dadosOk =
    nome.trim().length > 2 &&
    /\S+@\S+\.\S+/.test(email.trim()) &&
    whatsapp.replace(/\D/g, "").length >= 10;

  const irParaDados = () => {
    if (!aula) return;
    chaveIdempotencia.current = novaChaveIdempotencia(); // uma chave por reserva
    setErroReserva(null);
    setEtapa("dados");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const voltarAoCalendario = () => {
    // Se ele voltou porque a vaga acabou, a escolha antiga não vale mais.
    if (erroReserva?.codigo === "LOTADA" || erroReserva?.codigo === "NAO_ENCONTRADA") {
      setAula(null);
    }
    setEtapa("agenda");
    setErroReserva(null);
  };

  const confirmar = async () => {
    if (!aula || !dadosOk || enviando) return;
    setEnviando(true);
    setErroReserva(null);

    try {
      const confirmada = await reservarAula({
        aulaId: aula.id,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: normalizarTelefone(whatsapp),
        idempotencia: chaveIdempotencia.current,
      });
      setReserva(confirmada);
      setEtapa("pronto");
      invalidarTudo();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (erro) {
      const falha =
        erro instanceof ErroAgendamento
          ? erro
          : new ErroAgendamento("ERRO", "Não consegui confirmar a reserva agora.");
      setErroReserva(falha);
      // A vaga sumiu enquanto ele preenchia: os números na tela estão velhos.
      // A escolha continua de pé só para ele ler o aviso e clicar em trocar de
      // horário — quem limpa é o `voltarAoCalendario`.
      if (falha.codigo === "LOTADA" || falha.codigo === "NAO_ENCONTRADA") {
        invalidarTudo();
      }
    } finally {
      setEnviando(false);
    }
  };

  const recomecar = () => {
    setReserva(null);
    setDataSelecionada(null);
    setAula(null);
    setNome("");
    setWhatsapp("");
    setEmail("");
    setEtapa("agenda");
    invalidarTudo();
  };

  /* ---------------------------------------------------------------- Grade */
  const grade = useMemo(() => {
    const ultimoDia = new Date(mesVisivel.ano, mesVisivel.mes + 1, 0).getDate();
    const vazios = new Date(mesVisivel.ano, mesVisivel.mes, 1).getDay();
    const celulas: Array<{ dia: number; data: string } | null> = Array(vazios).fill(null);
    for (let dia = 1; dia <= ultimoDia; dia += 1) {
      celulas.push({ dia, data: iso(mesVisivel.ano, mesVisivel.mes, dia) });
    }
    return celulas;
  }, [mesVisivel]);

  const podeVoltarMes = indiceMes(mesVisivel) > indiceMes(mesAtual);
  const podeAvancarMes = indiceMes(mesVisivel) < indiceMes(mesLimite);

  const passoAtual: 1 | 2 | 3 = etapa === "agenda" ? (dataSelecionada ? 2 : 1) : 3;

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-warm sm:rounded-3xl"
        style={{ boxShadow: "0 20px 60px -20px hsl(var(--primary) / 0.35)" }}>
        {/* ------------------------------------------------------------ Topo */}
        <header className="flex items-center justify-between gap-4 bg-primary px-4 py-3 text-primary-foreground sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.09em]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-earth font-semibold text-primary">
              C
            </span>
            CAREFIT RUN BASE
          </Link>
          <span className="hidden items-center gap-2 text-[11px] text-primary-foreground/70 sm:flex">
            <span className="h-[7px] w-[7px] rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(146,223,184,0.13)]" />
            Vagas atualizadas em tempo real
          </span>
        </header>

        {/* ------------------------------------------------------------ Hero */}
        <div
          className="px-4 pb-6 pt-7 text-primary-foreground sm:px-8"
          style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))" }}
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.13em] text-earth">
            Fortalecimento para corredores
          </p>
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-4xl">
            Quando você quer treinar?
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/75">
            Escolha uma data no calendário para ver os horários disponíveis.
          </p>

          <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Etapas do agendamento">
            {["Data", "Horário", "Seus dados"].map((rotulo, indice) => {
              const numero = indice + 1;
              const feito = passoAtual > numero || etapa === "pronto";
              const ativo = passoAtual === numero && etapa !== "pronto";
              return (
                <li
                  key={rotulo}
                  className={`flex items-center gap-2 text-[11px] ${
                    feito || ativo ? "text-primary-foreground" : "text-primary-foreground/50"
                  }`}
                  aria-current={ativo ? "step" : undefined}
                >
                  <span
                    className={`grid h-7 w-7 flex-none place-items-center rounded-full border text-xs ${
                      feito
                        ? "border-earth bg-earth text-primary"
                        : ativo
                          ? "border-primary-foreground bg-primary-foreground text-primary"
                          : "border-primary-foreground/25 bg-primary-foreground/10"
                    }`}
                  >
                    {feito ? <Check className="h-4 w-4" /> : numero}
                  </span>
                  <span className="truncate">{rotulo}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ------------------------------------------------------------ Corpo */}
        <main className="px-4 pb-9 pt-6 sm:px-8 sm:pt-8">
          {!agendamentoConfigurado ? (
            <Aviso titulo="Agendamento online em configuração">
              A reserva pelo site ainda está sendo ligada. Enquanto isso, chama a CareFit no
              WhatsApp <strong>{WHATSAPP_CAREFIT}</strong> que a gente reserva a sua vaga.
            </Aviso>
          ) : etapa === "pronto" && reserva ? (
            /* ------------------------------------------------------ Sucesso */
            <section className="py-10 text-center" aria-live="polite">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-700 text-primary-foreground">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Aula reservada!</h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-primary/70">
                {capitalizar(reserva.quando)}. A confirmação foi para <strong>{reserva.email}</strong>{" "}
                — se não aparecer, olha no spam.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm text-primary/60">
                📍 {ENDERECO}. Chega uns 10 minutos antes para trocar de roupa e aquecer. Precisa
                cancelar? Chama no WhatsApp {WHATSAPP_CAREFIT} que a vaga volta para a turma.
              </p>
              <button
                type="button"
                onClick={recomecar}
                className="mt-7 min-h-[46px] rounded-xl border border-primary/20 bg-white/60 px-5 font-medium text-primary transition-colors hover:bg-white"
              >
                Agendar outra aula
              </button>
            </section>
          ) : etapa === "dados" && aula && dataSelecionada ? (
            /* -------------------------------------------------------- Dados */
            <section>
              <h2 className="text-xl font-semibold text-primary sm:text-2xl">3. Confirme seus dados</h2>
              <p className="mt-1.5 text-[13px] text-primary/60">
                Usamos essas informações para identificar e confirmar sua reserva.
              </p>

              <div className="my-5 flex items-center gap-3 rounded-2xl bg-earth/30 px-4 py-3.5 text-primary">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-emerald-700 text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-[13px] font-medium">{escolhaTexto}</span>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <Campo rotulo="Nome completo">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className="w-full min-h-[48px] rounded-xl border border-primary/15 bg-white/70 px-3 text-primary outline-none placeholder:text-primary/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  />
                </Campo>
                <Campo rotulo="WhatsApp com DDD">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="16999998888"
                    autoComplete="tel"
                    className="w-full min-h-[48px] rounded-xl border border-primary/15 bg-white/70 px-3 text-primary outline-none placeholder:text-primary/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo rotulo="E-mail">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@email.com"
                      autoComplete="email"
                      className="w-full min-h-[48px] rounded-xl border border-primary/15 bg-white/70 px-3 text-primary outline-none placeholder:text-primary/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    />
                  </Campo>
                </div>
              </div>

              {erroReserva && (
                <div className="mt-4" role="alert">
                  <Aviso titulo={erroReserva.codigo === "LOTADA" ? "Essa vaga acabou" : "Não deu certo"}>
                    {erroReserva.message}
                  </Aviso>
                  {(erroReserva.codigo === "LOTADA" || erroReserva.codigo === "NAO_ENCONTRADA") && (
                    <button
                      type="button"
                      onClick={voltarAoCalendario}
                      className="mt-3 min-h-[46px] w-full rounded-xl bg-secondary px-5 font-medium text-secondary-foreground sm:w-auto"
                    >
                      Escolher outro horário
                    </button>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={voltarAoCalendario}
                  disabled={enviando}
                  className="min-h-[46px] rounded-xl border border-primary/20 bg-white/60 px-5 font-medium text-primary transition-colors hover:bg-white disabled:opacity-50"
                >
                  Voltar ao calendário
                </button>
                <button
                  type="button"
                  onClick={confirmar}
                  disabled={!dadosOk || enviando}
                  className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-5 font-medium text-secondary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
                  {enviando ? "Confirmando..." : "Confirmar minha aula"}
                </button>
              </div>
            </section>
          ) : (
            /* ------------------------------------------------------ Agenda */
            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-secondary text-[13px] font-medium text-secondary-foreground">
                  1
                </span>
                <div>
                  <h2 className="text-xl font-semibold leading-tight text-primary sm:text-2xl">
                    Escolha uma data
                  </h2>
                  <p className="mt-1 text-[13px] text-primary/60">
                    Os dias com ponto verde têm aula com vaga.
                  </p>
                </div>
              </div>

              <div className="grid items-stretch gap-4 lg:grid-cols-[1.4fr_minmax(260px,0.85fr)]">
                {/* Calendário */}
                <div className="rounded-2xl border border-primary/10 bg-white/60 p-3 sm:p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-[17px] font-medium text-primary">
                      {capitalizar(`${MESES[mesVisivel.mes]} de ${mesVisivel.ano}`)}
                    </h3>
                    <div className="flex gap-1.5">
                      <BotaoMes
                        rotulo="Mês anterior"
                        disabled={!podeVoltarMes}
                        onClick={() => trocarMes(-1)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </BotaoMes>
                      <BotaoMes
                        rotulo="Próximo mês"
                        disabled={!podeAvancarMes}
                        onClick={() => trocarMes(1)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </BotaoMes>
                    </div>
                  </div>

                  <div className="mb-1.5 grid grid-cols-7 gap-1 sm:gap-1.5" aria-hidden="true">
                    {SEMANA_CURTA.map((dia) => (
                      <span
                        key={dia}
                        className="grid min-h-[25px] place-items-center text-[10px] font-medium uppercase text-primary/50"
                      >
                        {dia}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {grade.map((celula, indice) => {
                      if (!celula) return <span key={`vazio-${indice}`} className="aspect-square" aria-hidden="true" />;

                      const info = diasComAula.get(celula.data);
                      const passado = celula.data < hojeISO;
                      const clicavel = !!info && !passado;
                      const temVaga = (info?.comVaga || 0) > 0;
                      const selecionado = celula.data === dataSelecionada;

                      return (
                        <button
                          key={celula.data}
                          type="button"
                          disabled={!clicavel}
                          aria-pressed={selecionado}
                          aria-label={
                            clicavel
                              ? `${porExtenso(celula.data)}, ${temVaga ? "com vaga" : "todas as turmas lotadas"}`
                              : `${porExtenso(celula.data)}, sem aula`
                          }
                          onClick={() => escolherData(celula.data)}
                          className={`relative grid aspect-square min-w-0 place-items-center rounded-xl text-sm transition-colors ${
                            selecionado
                              ? "bg-primary font-medium text-primary-foreground"
                              : clicavel
                                ? "bg-white font-medium text-primary ring-1 ring-inset ring-primary/10 hover:bg-white/70"
                                : "cursor-default text-primary/35"
                          }`}
                        >
                          {celula.dia}
                          {clicavel && (
                            <span
                              className={`absolute bottom-1.5 h-[5px] w-[5px] rounded-full ${
                                selecionado
                                  ? "bg-earth"
                                  : temVaga
                                    ? "bg-emerald-700"
                                    : "bg-primary/25"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3.5 flex flex-col gap-1.5 border-t border-primary/10 pt-3 text-[11px] text-primary/60 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-[7px] w-[7px] rounded-full bg-emerald-700" /> Data com vaga
                    </span>
                    <span>
                      Agenda aberta até {MESES[mesLimite.mes]} de {mesLimite.ano}
                    </span>
                  </div>
                </div>

                {/* Horários */}
                <div
                  ref={painelHorarios}
                  className="rounded-2xl border border-primary/10 bg-white/60 p-3 sm:p-4 lg:min-h-[390px]"
                  aria-live="polite"
                >
                  {carregando && !aulasDoMes ? (
                    <div className="grid min-h-[170px] place-items-center text-primary/60 lg:min-h-[354px]">
                      <span className="flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" /> Carregando a agenda...
                      </span>
                    </div>
                  ) : erroCarga ? (
                    <div className="grid min-h-[170px] place-items-center lg:min-h-[354px]">
                      <div className="text-center">
                        <Aviso titulo="Agenda indisponível">{erroCarga}</Aviso>
                        <button
                          type="button"
                          onClick={tentarDeNovo}
                          className="mt-3 min-h-[44px] rounded-xl border border-primary/20 bg-white/70 px-4 text-sm font-medium text-primary"
                        >
                          Tentar de novo
                        </button>
                      </div>
                    </div>
                  ) : !dataSelecionada ? (
                    <div className="grid min-h-[170px] place-items-center text-center text-primary/60 lg:min-h-[354px]">
                      <div>
                        <div className="mx-auto mb-3 grid h-[54px] w-[54px] place-items-center rounded-2xl border border-primary/10 bg-white text-base font-medium text-primary">
                          {new Date().getDate()}
                        </div>
                        <strong className="block text-[15px] font-medium text-primary">
                          Selecione uma data
                        </strong>
                        <span className="mx-auto mt-1.5 block max-w-[220px] text-xs leading-relaxed">
                          Ao clicar em um dia marcado, os horários aparecem aqui.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="border-b border-primary/10 pb-3">
                        <span className="block text-[10px] font-medium uppercase tracking-[0.09em] text-secondary">
                          2. Escolha o horário
                        </span>
                        <h3 className="mt-1 text-lg font-medium text-primary">
                          {capitalizar(porExtenso(dataSelecionada))}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-primary/55">
                          Horários de início e término da aula
                        </p>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                        {aulasDoDia.length === 0 ? (
                          <p className="py-6 text-center text-sm text-primary/60 sm:col-span-3">
                            Nenhum horário nesse dia. Escolha outra data.
                          </p>
                        ) : (
                          aulasDoDia.map((item) => {
                            const escolhida = item.id === aula?.id;
                            const lotada = item.vagas <= 0;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                disabled={lotada}
                                aria-pressed={escolhida}
                                aria-label={`${item.horaInicio} às ${item.horaFim}, ${
                                  lotada ? "turma lotada" : textoVagas(item)
                                }`}
                                onClick={() => setAula(item)}
                                className={`grid min-h-[62px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${
                                  escolhida
                                    ? "border-secondary bg-secondary text-secondary-foreground"
                                    : lotada
                                      ? "cursor-not-allowed border-primary/10 bg-primary/5 text-primary/45"
                                      : "border-primary/10 bg-white text-primary hover:border-primary/25"
                                }`}
                              >
                                <span>
                                  <span className="block text-sm font-medium">
                                    {item.horaInicio} → {item.horaFim}
                                  </span>
                                  <span className="mt-0.5 block text-[10px] opacity-70">
                                    {duracao(item)}
                                  </span>
                                </span>
                                <span
                                  className={`inline-flex min-h-[25px] items-center whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium ${
                                    escolhida
                                      ? "bg-white/20 text-secondary-foreground"
                                      : item.vagas === 1
                                        ? "bg-secondary/15 text-secondary"
                                        : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  {textoVagas(item)}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Resumo + avançar */}
              <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-primary px-4 py-4 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                  <small className="block text-[10px] uppercase tracking-[0.08em] text-primary-foreground/60">
                    Sua escolha
                  </small>
                  <strong className="mt-1 block text-[13px] font-medium" aria-live="polite">
                    {escolhaTexto}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={irParaDados}
                  disabled={!aula}
                  className="min-h-[46px] rounded-xl bg-secondary px-5 font-medium text-secondary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const Campo = ({ rotulo, children }: { rotulo: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-medium text-primary/70">{rotulo}</span>
    {children}
  </label>
);

const BotaoMes = ({
  rotulo,
  disabled,
  onClick,
  children,
}: {
  rotulo: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={rotulo}
    disabled={disabled}
    onClick={onClick}
    className="grid h-10 w-10 place-items-center rounded-xl border border-primary/10 bg-white text-primary transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:bg-primary/5 disabled:text-primary/30"
  >
    {children}
  </button>
);

const Aviso = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-secondary/25 bg-secondary/10 px-4 py-3.5 text-left">
    <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-secondary" />
    <div>
      <strong className="block text-sm font-medium text-primary">{titulo}</strong>
      <p className="mt-1 text-[13px] leading-relaxed text-primary/70">{children}</p>
    </div>
  </div>
);

export default AgendamentoFortalecimento;
