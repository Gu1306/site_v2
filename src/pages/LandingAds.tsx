import { Link, useParams } from "react-router-dom";
import { useSeo } from "@/hooks/useSeo";
import { track, atribuicao } from "@/lib/tracking";
import { LP_POR_SLUG, type Foto } from "./lp/landingAdsData";
import { MAPS, WHATS } from "./Links";
import NotFound from "./NotFound";
import logo from "@/assets/logocarefitclub.png";
import fisio from "@/assets/sala-fisioterapia.jpg";
import recovery from "@/assets/recovery_atletas.jpg";
import corrida from "@/assets/hero-runners.jpg";
import espaco from "@/assets/espaco-1.jpg";

const FOTOS: Record<Foto, string> = { fisio, recovery, corrida };

const AGENDAR = "/primeira-sessao";
const ENDERECO = "Av. Áurea A. B. Machado, 241 · Ribeirão Preto/SP";

/** Landing de anúncio: uma oferta, uma ação (agendar). Sem menu, sem links para fora do funil. */
export default function LandingAds() {
  const { slug = "" } = useParams();
  const lp = LP_POR_SLUG[slug];

  useSeo({
    titulo: lp?.seoTitulo ?? "CareFit Run Base",
    descricao: lp?.seoDescricao ?? "",
    caminho: `/lp/${slug}`,
    noindex: true, // página de anúncio: não concorre com a página SEO equivalente
  });

  if (!lp) return <NotFound />;

  const zapHref = () => {
    const a = atribuicao();
    const origem = `[google · ${lp.tag}${a.utm_campaign ? " · " + a.utm_campaign : ""}]`;
    return `${WHATS}&text=${encodeURIComponent(`${lp.zap} ${origem}`)}`;
  };
  const aoAgendar = (onde: string) => () => track("agendar_click", { lp: lp.tag, onde });
  const aoZap = (onde: string) => () => track("whatsapp_click", { lp: lp.tag, onde });

  return (
    <main className="lp">
      <style>{CSS}</style>

      <header className="lp-hero">
        <img className="lp-hero-img" src={FOTOS[lp.foto]} alt="" />
        <div className="lp-hero-in">
          <img className="lp-logo" src={logo} alt="CareFit Run Base" />
          <p className="lp-selo">{lp.selo}</p>
          <h1>{lp.titulo}</h1>
          <p className="lp-sub">{lp.subtitulo}</p>
          <p className="lp-oferta">
            <b>1ª sessão R$ 230</b> · e a 2ª sessão é cortesia
          </p>
          <div className="lp-cta">
            <Link className="lp-btn lp-btn-pri" to={AGENDAR} onClick={aoAgendar("hero")}>
              Agendar minha 1ª sessão
            </Link>
            <a className="lp-btn lp-btn-zap" href={zapHref()} target="_blank" rel="noopener noreferrer" onClick={aoZap("hero")}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="lp-sec">
        <h2>{lp.reconhece.titulo}</h2>
        <ul className="lp-lista">
          {lp.reconhece.itens.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="lp-sec lp-alt">
        <h2>{lp.cuidado.titulo}</h2>
        <div className="lp-grade">
          {lp.cuidado.itens.map((i) => (
            <div className="lp-card" key={i.t}>
              <b>{i.t}</b>
              <span>{i.d}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-sec">
        <h2>Como é a sua primeira sessão</h2>
        <ol className="lp-passos">
          <li>
            <b>Avaliação completa</b>
            <span>A gente entende o seu caso: dor, histórico, carga de treino e o que o corpo sustenta hoje.</span>
          </li>
          <li>
            <b>Direcionamento claro</b>
            <span>Você sai sabendo o que ajustar em treino, força e recuperação.</span>
          </li>
          <li>
            <b>2ª sessão de cortesia</b>
            <span>Quem faz a primeira sessão ganha a segunda.</span>
          </li>
        </ol>
        <Link className="lp-btn lp-btn-pri lp-solo" to={AGENDAR} onClick={aoAgendar("passos")}>
          Escolher dia e horário
        </Link>
        <p className="lp-nota">Você escolhe com quem agendar: Igor ou Lais.</p>
      </section>

      {lp.depoimentos && lp.depoimentos.length > 0 && (
        <section className="lp-sec lp-alt">
          <h2>Quem já passou por aqui</h2>
          {lp.depoimentos.map((d) => (
            <blockquote className="lp-dep" key={d.autor}>
              “{d.texto}”<cite>{d.autor}</cite>
            </blockquote>
          ))}
        </section>
      )}

      <section className="lp-sec">
        <h2>Onde fica</h2>
        <img className="lp-espaco" src={espaco} alt="Espaço da CareFit Run Base em Ribeirão Preto" loading="lazy" />
        <p className="lp-end">{ENDERECO}</p>
        <a className="lp-link" href={MAPS} target="_blank" rel="noopener noreferrer">
          Ver no mapa
        </a>
      </section>

      <section className="lp-sec lp-alt">
        <h2>Perguntas frequentes</h2>
        {lp.faq.map((f) => (
          <details className="lp-faq" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section className="lp-fim">
        <h2>Pronto para cuidar disso?</h2>
        <p>1ª sessão R$ 230 e a 2ª sessão é cortesia.</p>
        <Link className="lp-btn lp-btn-pri lp-solo" to={AGENDAR} onClick={aoAgendar("fim")}>
          Agendar minha 1ª sessão
        </Link>
        <a className="lp-link lp-link-claro" href={zapHref()} target="_blank" rel="noopener noreferrer" onClick={aoZap("fim")}>
          Prefere falar no WhatsApp?
        </a>
      </section>

      <footer className="lp-rodape">CareFit Run Base · {ENDERECO}</footer>

      {/* Barra fixa no celular: o botão acompanha a leitura inteira. */}
      <div className="lp-barra">
        <Link className="lp-btn lp-btn-pri" to={AGENDAR} onClick={aoAgendar("barra")}>
          Agendar 1ª sessão
        </Link>
        <a className="lp-zap-redondo" href={zapHref()} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" onClick={aoZap("barra")}>
          WhatsApp
        </a>
      </div>
    </main>
  );
}

const CSS = `
.lp{--verde:#0E3C41;--verde2:#145159;--dourado:#C9B27C;--bege:#F3ECDD;--zap:#25D366;background:#fbf8f1;color:#1d2b2d;font-family:Montserrat,Poppins,system-ui,sans-serif;padding-bottom:84px}
.lp *{box-sizing:border-box}
.lp h1,.lp h2{font-family:inherit}
.lp-hero{position:relative;color:var(--bege);background:var(--verde);overflow:hidden}
.lp-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.28}
.lp-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,60,65,.55),rgba(8,42,46,.95))}
.lp-hero-in{position:relative;z-index:1;max-width:640px;margin:0 auto;padding:28px 20px 34px;text-align:center}
.lp-logo{width:64px;height:64px;border-radius:50%;box-shadow:0 0 0 2px var(--dourado)}
.lp-selo{margin:14px 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--dourado);font-weight:700}
.lp h1{font-size:27px;line-height:1.15;font-weight:800;margin:0 0 12px}
.lp-sub{font-size:15.5px;line-height:1.5;margin:0 auto 16px;color:#e6dfcc;max-width:520px}
.lp-oferta{display:inline-block;margin:0 0 18px;padding:9px 16px;border-radius:999px;border:1px solid rgba(201,178,124,.6);background:rgba(201,178,124,.12);font-size:14px}
.lp-oferta b{color:var(--dourado)}
.lp-cta{display:flex;flex-direction:column;gap:10px;max-width:420px;margin:0 auto}
.lp-btn{display:block;text-align:center;text-decoration:none;font-weight:800;font-size:16px;padding:15px 18px;border-radius:14px;line-height:1.2}
.lp-btn-pri{background:var(--dourado);color:var(--verde);box-shadow:0 8px 20px rgba(0,0,0,.25)}
.lp-btn-zap{background:transparent;color:var(--bege);border:1.5px solid rgba(243,236,221,.55);font-weight:700}
.lp-btn:focus-visible,.lp-link:focus-visible{outline:3px solid #fff;outline-offset:2px}
.lp-sec{padding:34px 20px;max-width:640px;margin:0 auto}
.lp-alt{background:#f2ecdf;max-width:none}
.lp-alt>*{max-width:600px;margin-left:auto;margin-right:auto}
.lp h2{font-size:21px;font-weight:800;color:var(--verde);margin:0 0 14px}
.lp-lista{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.lp-lista li{position:relative;padding:12px 14px 12px 40px;background:#fff;border-radius:12px;font-size:15px;line-height:1.45;box-shadow:0 1px 4px rgba(14,60,65,.08)}
.lp-lista li::before{content:"✓";position:absolute;left:14px;top:11px;color:var(--verde2);font-weight:900}
.lp-grade{display:grid;gap:10px}
.lp-card{background:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 1px 4px rgba(14,60,65,.08)}
.lp-card b{display:block;color:var(--verde);font-size:15px;margin-bottom:3px}
.lp-card span{font-size:14px;line-height:1.45;color:#3b4b4d}
.lp-passos{list-style:none;counter-reset:p;margin:0 0 18px;padding:0;display:grid;gap:12px}
.lp-passos li{counter-increment:p;position:relative;padding-left:46px}
.lp-passos li::before{content:counter(p);position:absolute;left:0;top:0;width:32px;height:32px;border-radius:50%;background:var(--verde);color:var(--dourado);display:grid;place-items:center;font-weight:800}
.lp-passos b{display:block;color:var(--verde);font-size:15.5px}
.lp-passos span{font-size:14px;line-height:1.45;color:#3b4b4d}
.lp-solo{max-width:420px;margin:0 auto}
.lp-nota{text-align:center;font-size:13px;color:#566567;margin:10px 0 0}
.lp-dep{margin:0 0 12px;padding:16px;background:#fff;border-left:4px solid var(--dourado);border-radius:10px;font-size:15px;line-height:1.5}
.lp-dep cite{display:block;margin-top:8px;font-size:13px;color:#566567;font-style:normal;font-weight:700}
.lp-espaco{width:100%;height:190px;object-fit:cover;border-radius:14px;margin-bottom:10px}
.lp-end{margin:0 0 6px;font-size:14.5px}
.lp-link{color:var(--verde2);font-weight:700;font-size:14.5px}
.lp-faq{background:#fff;border-radius:12px;padding:0 14px;margin-bottom:8px;box-shadow:0 1px 4px rgba(14,60,65,.08)}
.lp-faq summary{cursor:pointer;padding:14px 0;font-weight:700;font-size:14.5px;color:var(--verde);list-style:none}
.lp-faq summary::-webkit-details-marker{display:none}
.lp-faq summary::after{content:"+";float:right;font-weight:800}
.lp-faq[open] summary::after{content:"–"}
.lp-faq p{margin:0 0 14px;font-size:14px;line-height:1.55;color:#3b4b4d}
.lp-fim{background:var(--verde);color:var(--bege);text-align:center;padding:38px 20px}
.lp-fim h2{color:#fff;margin-bottom:6px}
.lp-fim p{margin:0 0 18px;color:#e6dfcc}
.lp-link-claro{display:inline-block;margin-top:14px;color:var(--dourado)}
.lp-rodape{text-align:center;font-size:12px;color:#6a7a7c;padding:16px 20px}
.lp-barra{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(14,60,65,.97);box-shadow:0 -6px 18px rgba(0,0,0,.25)}
.lp-barra .lp-btn-pri{flex:1;padding:13px 12px;font-size:15px;box-shadow:none}
.lp-zap-redondo{display:grid;place-items:center;padding:0 16px;border-radius:14px;background:var(--zap);color:#073b1c;font-weight:800;font-size:14px;text-decoration:none}
@media(min-width:720px){.lp h1{font-size:36px}.lp-cta{flex-direction:row}.lp-cta .lp-btn{flex:1}.lp-barra{display:none}.lp{padding-bottom:0}.lp-grade{grid-template-columns:1fr 1fr}}
@media(prefers-reduced-motion:reduce){.lp *{transition:none!important;animation:none!important}}
`;
