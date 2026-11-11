import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSeo } from "@/hooks/useSeo";
import { track } from "@/lib/tracking";
import { OFERTAS, ORIENTACOES, servicoCarefit, agendamentoCarefit, whatsappOferta, type ServicoCarefit } from "@/lib/ofertasCarefit";
import logo from "@/assets/logocarefitclub.png";
import { CSS, MAPS, WHATS } from "./Links";

export default function PrimeiraSessao() {
  const [params] = useSearchParams();
  const servico = servicoCarefit(params.get("servico"));
  const oferta = servico ? OFERTAS[servico] : null;
  useEffect(() => { window.scrollTo(0, 0); }, [servico]);
  useSeo({
    titulo: oferta ? `Agendar ${oferta.nome} | CareFit Run Base` : "Escolha seu atendimento | CareFit Run Base",
    descricao: oferta ? `${oferta.nome}: ${oferta.valor}. ${oferta.duracao}. Escolha o profissional e o horário.` : "Escolha entre Primeira Sessão Dupla e avaliação de reabilitação na CareFit, em Ribeirão Preto.",
    caminho: servico ? agendamentoCarefit(servico) : "/primeira-sessao",
  });
  return (
    <main className="lk booking">
      <style>{CSS}{BOOKING_CSS}</style>
      <div className="lk-wrap">
        <header className="lk-top">
          <img className="lk-logo" src={logo} alt="CareFit Run Base" />
          <p className="booking-eyebrow">Atendimento presencial · Ribeirão Preto</p>
          <h1>{oferta ? `Agende sua ${servico === "dupla" ? "Sessão Dupla" : "avaliação de reabilitação"}` : "Qual atendimento você procura?"}</h1>
          <p className="lk-tag">{oferta ? "Escolha o fisioterapeuta e veja os horários disponíveis." : "Veja o que está incluído e escolha o melhor caminho para o seu momento."}</p>
        </header>
        {!oferta || !servico ? (
          <div className="booking-options">
            {(Object.keys(OFERTAS) as ServicoCarefit[]).map((id) => (
              <Link className="booking-offer booking-choice" key={id} to={agendamentoCarefit(id)} onClick={() => track("servico_select", { servico: id })}>
                <h2>{OFERTAS[id].nome}</h2>
                <strong>{OFERTAS[id].valor}</strong><span>{OFERTAS[id].duracao}</span>
                <p>{OFERTAS[id].resumo}</p>
                <b>Escolher profissional →</b>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <section className="booking-offer" aria-label="Atendimento escolhido">
              <h2>{oferta.nome}</h2><strong>{oferta.valor}</strong><span>{oferta.duracao}</span>
              <p>{oferta.resumo}</p>
              <Link to={oferta.pagina}>Ver o que está incluído</Link>
            </section>
            <h2 className="lk-sec">Escolha o fisioterapeuta</h2>
            <div className="booking-professionals">
              {(["Igor", "Lais"] as const).map((nome) => (
                <a className="booking-professional" key={nome} href={oferta.agendas[nome]} target="_blank" rel="noopener noreferrer"
                  onClick={() => track("calendario_click", { servico, profissional: nome })}>
                  <span className="booking-avatar" aria-hidden="true">{nome[0]}</span>
                  <span><b>{nome}</b><span>Fisioterapeuta · equipe CareFit</span><strong>Ver horários com {nome} ↗</strong></span>
                </a>
              ))}
            </div>
            <p className="booking-help">Os horários abrem no Google Agenda. A confirmação depende do pagamento e do ok da equipe pelo WhatsApp.</p>
            <a className="booking-whatsapp" href={whatsappOferta(servico)} target="_blank" rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { servico, onde: "agendamento" })}>Preciso de ajuda pelo WhatsApp</a>
            <section className="booking-faq" aria-label="Antes de vir">
              <h2 className="lk-sec">Antes de vir</h2>
              {ORIENTACOES.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
            </section>
            <p className="lk-end"><Link to="/primeira-sessao">Escolher outro atendimento</Link></p>
          </>
        )}
        <p className="lk-end">Av. Áurea A. B. Machado, 241 · sala 8, segundo andar<br />City Ribeirão · Ribeirão Preto/SP<br /><a href={MAPS} target="_blank" rel="noopener noreferrer">Como chegar</a> · <a href={servico ? whatsappOferta(servico) : WHATS}>WhatsApp</a> · <Link to="/privacidade">Privacidade</Link></p>
      </div>
    </main>
  );
}

const BOOKING_CSS = `
.booking .lk-logo{width:64px;height:64px}.booking .lk-wrap{max-width:620px}.booking-eyebrow{font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:22px 0 10px;color:var(--dourado)}
.booking h1{font-size:clamp(24px,5vw,32px);line-height:1.2;margin-bottom:12px}.booking-offer{padding:24px;border:1px solid rgba(201,178,124,.5);border-radius:18px;background:rgba(243,236,221,.08)}
.booking-offer h2{font-size:19px;font-weight:700;margin:0 0 12px}.booking-offer>strong{font-size:28px;color:var(--dourado);display:block}.booking-offer>span{font-size:14px;display:block;margin-top:4px}.booking-offer p{font-size:14px;line-height:1.6;margin:14px 0}.booking-offer a,.booking-choice>b{color:var(--dourado);font-weight:700;font-size:13px}
.booking-options{display:grid;gap:16px}.booking-choice{display:block;text-decoration:none;color:inherit;transition:background .2s}.booking-choice:hover{background:rgba(243,236,221,.14)}
.booking-professionals{display:grid;gap:12px}.booking-professional{display:flex;gap:16px;align-items:center;padding:20px;border-radius:16px;background:#f5f5f0;color:#0e3c41;text-decoration:none;border:2px solid transparent}.booking-professional:hover{border-color:var(--dourado)}.booking-avatar{display:grid;place-items:center;width:48px;height:48px;flex-shrink:0;border-radius:50%;background:#e4ebe5;font-size:24px;font-weight:700}.booking-professional b{display:block;font-size:19px}.booking-professional span span{display:block;font-size:12px;margin:4px 0 10px}.booking-professional strong{font-size:14px}
.booking-help{font-size:13px;line-height:1.6;color:#ddd7c9;margin:16px 0}.booking-whatsapp{display:block;text-align:center;padding:15px;border:1px solid var(--dourado);border-radius:12px;font-weight:700;font-size:14px;color:var(--bege)}.booking-faq details{border-bottom:1px solid #ffffff26;padding:14px 0}.booking-faq summary{cursor:pointer;font-size:14px;font-weight:700}.booking-faq p{font-size:13px;line-height:1.65;margin:10px 0;color:#ddd7c9}.booking a:focus-visible,.booking summary:focus-visible{outline:3px solid var(--dourado);outline-offset:4px}
`;
