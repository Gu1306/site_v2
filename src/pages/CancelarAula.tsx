import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import logo from "@/assets/logocarefitclub.png";
import {
  apiApp,
  cancelarReserva,
  capitalizar,
  NOME_MODALIDADE,
  type DetalheReserva,
  type Modalidade,
} from "@/services/appAtleta";
import { Alerta } from "@/pages/AppAtleta";

/* =========================================================================
 *  /cancelar-aula?m=<modalidade>&t=<token>
 *
 *  Destino do link "Cancele por aqui" do e-mail de confirmação. Funciona sem
 *  login: o token do link identifica uma reserva e só ela.
 *
 *  O cancelamento só acontece no clique do botão, nunca ao abrir a página.
 *  Leitor de e-mail e antivírus abrem links sozinhos para inspecionar — se
 *  abrir bastasse, a aula seria cancelada sem o atleta ter feito nada.
 * ========================================================================= */

const WHATSAPP_CAREFIT = "(16) 99600-8849";
const PAGINA_RESERVA: Record<Modalidade, string> = {
  fortalecimento: "/agendamento-fortalecimento",
  yoga: "/agendamento-yoga",
};

const CancelarAula = () => {
  useSeo({
    titulo: "Cancelar aula | CareFit Run Base",
    descricao: "Cancele sua reserva de aula na CareFit Run Base.",
    caminho: "/cancelar-aula",
    noindex: true,
  });

  const [parametros] = useSearchParams();
  const modalidade = parametros.get("m") as Modalidade | null;
  const token = parametros.get("t") || "";
  const linkValido = (modalidade === "fortalecimento" || modalidade === "yoga") && token.length >= 20;

  const [reserva, setReserva] = useState<DetalheReserva | null>(null);
  const [carregando, setCarregando] = useState(linkValido);
  const [erro, setErro] = useState(linkValido ? "" : "Esse link de cancelamento está incompleto.");
  const [ocupado, setOcupado] = useState(false);
  const [feito, setFeito] = useState(false);

  useEffect(() => {
    if (!linkValido) return;
    let vivo = true;
    apiApp<DetalheReserva>(`reserva?m=${encodeURIComponent(modalidade!)}&t=${encodeURIComponent(token)}`)
      .then((dados) => {
        if (vivo) setReserva(dados);
      })
      .catch((falha) => {
        if (vivo) setErro(falha instanceof Error ? falha.message : "Não consegui abrir essa reserva.");
      })
      .finally(() => {
        if (vivo) setCarregando(false);
      });
    return () => {
      vivo = false;
    };
  }, [linkValido, modalidade, token]);

  const cancelar = async () => {
    if (!reserva || ocupado) return;
    setOcupado(true);
    setErro("");
    try {
      await cancelarReserva(reserva.modalidade, token);
      setFeito(true);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não consegui cancelar agora.");
    } finally {
      setOcupado(false);
    }
  };

  const jaCancelada = feito || reserva?.cancelada;
  const reservarDeNovo = reserva ? PAGINA_RESERVA[reserva.modalidade] : "/agendamento-fortalecimento";

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-8 sm:px-6 sm:pt-14">
      <div className="mx-auto w-full max-w-md">
        <img src={logo} alt="CareFit Run Base" className="mx-auto h-20 w-auto" />

        <div className="mt-6 rounded-3xl bg-warm px-5 py-7 text-center sm:px-8">
          {carregando ? (
            <span className="flex items-center justify-center gap-2 py-8 text-sm text-primary/75" role="status">
              <Loader2 className="h-4 w-4 animate-spin" /> Abrindo sua reserva...
            </span>
          ) : !reserva ? (
            <>
              <h1 className="text-xl font-semibold text-primary">Não achei essa reserva</h1>
              <Alerta>{erro || "O link pode ser antigo."}</Alerta>
              <p className="mt-4 text-sm text-primary/70">
                Se precisar, fala com a gente no WhatsApp {WHATSAPP_CAREFIT}.
              </p>
            </>
          ) : jaCancelada ? (
            <div aria-live="polite">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-700 text-primary-foreground">
                <Check className="h-7 w-7" />
              </div>
              <h1 className="text-xl font-semibold text-primary">Aula cancelada</h1>
              <p className="mt-2 text-sm leading-relaxed text-primary/70">
                {NOME_MODALIDADE[reserva.modalidade]} de {reserva.quando}. A vaga voltou para a turma.
              </p>
              <a
                href={reservarDeNovo}
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-secondary px-5 font-medium text-secondary-foreground"
              >
                Reservar outro horário
              </a>
            </div>
          ) : reserva.passada ? (
            <>
              <h1 className="text-xl font-semibold text-primary">Essa aula já começou</h1>
              <p className="mt-2 text-sm leading-relaxed text-primary/70">
                {capitalizar(reserva.quando)}. Não dá mais para cancelar por aqui. Fala com a gente no
                WhatsApp {WHATSAPP_CAREFIT}.
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-secondary">
                {NOME_MODALIDADE[reserva.modalidade]}
              </p>
              <h1 className="mt-1 text-xl font-semibold leading-snug text-primary">
                {reserva.primeiroNome ? `${reserva.primeiroNome}, cancelar esta aula?` : "Cancelar esta aula?"}
              </h1>
              <p className="mt-3 text-lg font-medium text-primary">{capitalizar(reserva.quando)}</p>
              <p className="mt-2 text-sm text-primary/75">A vaga volta para a turma na hora.</p>
              {erro && <Alerta>{erro}</Alerta>}
              <button
                type="button"
                onClick={cancelar}
                disabled={ocupado}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground disabled:opacity-50"
              >
                {ocupado && <Loader2 className="h-4 w-4 animate-spin" />}
                Sim, cancelar minha aula
              </button>
              <p className="mt-4 text-[13px] text-primary/75">Abriu sem querer? É só fechar esta página.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelarAula;
