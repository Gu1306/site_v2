import { useSeo } from "@/hooks/useSeo";
import logo from "@/assets/logocarefitclub.png";
import espaco from "@/assets/hero-runners.jpg";
import fortalecimento from "@/assets/treino_funcional.jpg";
import recovery from "@/assets/recovery_atletas.jpg";
import comunidade from "@/assets/maratona_grupo.jpg";
import fisio from "@/assets/sala-fisioterapia.jpg";

/**
 * Página de links para a bio do Instagram (o link da bio no computador só
 * abre o WhatsApp; aqui o visitante escolhe). Fica fora do menu e sem Navbar
 * de propósito: é uma tela única, pensada para celular.
 * Tudo em estilo inline/CSS próprio para não depender do tema claro/escuro do site.
 */

export const WHATS = "https://api.whatsapp.com/send?phone=5516996008849";
export const MAPS =
  "https://maps.google.com/?q=Av.+Áurea+Aparecida+Bragheto+Machado,+241+-+City+Ribeirão,+Ribeirão+Preto+-+SP,+14021-460";

export const wa = (texto: string) => `${WHATS}&text=${encodeURIComponent(texto)}`;

export interface Item {
  titulo: string;
  sub: string;
  href: string;
  imagem: string;
  pos?: string;
  externo?: boolean;
}

const DESTAQUES: Item[] = [
  {
    titulo: "Agendar pelo WhatsApp",
    sub: "Fale direto com a equipe e marque sua 1ª sessão",
    href: wa("Oi! Vim pelo Instagram e quero agendar minha primeira sessão na CareFit."),
    imagem: fisio,
    pos: "center",
    externo: true,
  },
  {
    titulo: "Agendar 1ª sessão",
    sub: "Escolha o dia e o horário da sua primeira sessão",
    href: "/primeira-sessao",
    imagem: fisio,
    pos: "center",
  },
  {
    titulo: "Yoga · terça e quinta, 6h",
    sub: "Reserve sua vaga na aula (6 vagas)",
    href: "/agendamento-yoga",
    imagem: espaco,
    pos: "center 60%",
  },
  {
    titulo: "Fortalecimento para corredores",
    sub: "Aulas em turma: saiba o que fortalecer e como",
    href: "/agendamento-fortalecimento",
    imagem: fortalecimento,
    pos: "center 35%",
  },
  {
    titulo: "Teste de força",
    sub: "Meça sua força e descubra o que fortalecer",
    href: "/teste-de-forca-ribeirao-preto",
    imagem: recovery,
    pos: "center 40%",
  },
  {
    titulo: "Sessão Jornada Recovery",
    sub: "Para quem já tem sessões em aberto",
    href: "https://carefitrunbase.com.br/agendar",
    imagem: recovery,
    pos: "center 60%",
  },
];

const EXPLORAR: Item[] = [
  { titulo: "Conheça o espaço", sub: "Por dentro da base, em Ribeirão Preto", href: "/espaco", imagem: espaco, pos: "center" },
  { titulo: "Serviços", sub: "Fisioterapia, recovery, avaliação e mais", href: "/servicos", imagem: fisio, pos: "center" },
  { titulo: "CareFit Cast no YouTube", sub: "Podcast e vídeos", href: "https://www.youtube.com/@CAREFITRUNBASE", imagem: comunidade, pos: "center", externo: true },
];

export const CSS = `
.lk{--verde:#0E3C41;--verde2:#145159;--dourado:#C9B27C;--bege:#F3ECDD;min-height:100vh;background:radial-gradient(1200px 600px at 50% -10%,#1b6670 0%,var(--verde) 55%,#082a2e 100%);color:var(--bege);font-family:Montserrat,Poppins,system-ui,sans-serif;padding:32px 16px 48px}
.lk *{box-sizing:border-box}
.lk-wrap{max-width:560px;margin:0 auto}
.lk-top{text-align:center;margin-bottom:26px}
.lk-logo{display:block;margin:0 auto;width:104px;height:104px;border-radius:50%;box-shadow:0 0 0 3px var(--dourado),0 12px 30px rgba(0,0,0,.35)}
.lk h1{font-size:22px;font-weight:800;letter-spacing:.2px;margin:14px 0 4px}
.lk-tag{font-size:14px;line-height:1.45;color:#d9d2bf;margin:0 auto;max-width:380px}
.lk-sec{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--dourado);font-weight:700;margin:28px 4px 10px}
.lk-card{position:relative;display:flex;align-items:flex-end;min-height:120px;border-radius:18px;overflow:hidden;margin-bottom:12px;text-decoration:none;color:#fff;box-shadow:0 8px 22px rgba(0,0,0,.28);transition:transform .15s ease,box-shadow .15s ease}
.lk-card:hover,.lk-card:focus-visible{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.4);outline:none}
.lk-card:focus-visible{box-shadow:0 0 0 3px var(--dourado)}
.lk-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lk-card::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,42,46,.88) 0%,rgba(8,42,46,.55) 55%,rgba(8,42,46,.05) 100%)}
.lk-txt{position:relative;z-index:1;padding:16px 56px 16px 18px}
.lk-txt b{display:block;font-size:16px;font-weight:800;line-height:1.2}
.lk-txt span{display:block;font-size:12.5px;opacity:.85;margin-top:4px;line-height:1.35}
.lk-seta{position:absolute;z-index:1;right:16px;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:var(--dourado);color:var(--verde);display:grid;place-items:center;font-weight:900;font-size:16px}
.lk-hero{min-height:150px}
.lk-hero .lk-txt b{font-size:19px}
.lk-wapp{background:#25D366}
.lk-wapp .lk-seta{background:#fff;color:#128C4B}
.lk-redes{display:flex;gap:10px;margin-top:6px}
.lk-btn{flex:1;text-align:center;padding:13px 8px;border-radius:14px;background:rgba(243,236,221,.1);border:1px solid rgba(201,178,124,.45);color:var(--bege);text-decoration:none;font-weight:700;font-size:13.5px}
.lk-btn:hover,.lk-btn:focus-visible{background:rgba(243,236,221,.2);outline:none}
.lk-end{text-align:center;margin-top:26px;font-size:12.5px;line-height:1.6;color:#d9d2bf}
.lk-end a{color:var(--dourado);font-weight:700;text-decoration:none}
@media (prefers-reduced-motion:reduce){.lk-card{transition:none}}
`;

export function Card({ item, hero }: { item: Item; hero?: boolean }) {
  const extra = item.externo ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const zap = item.href.startsWith(WHATS);
  return (
    <a href={item.href} className={`lk-card${hero ? " lk-hero" : ""}${zap ? " lk-wapp" : ""}`} {...extra}>
      {!zap && <img src={item.imagem} alt="" loading="lazy" style={{ objectPosition: item.pos }} />}
      <div className="lk-txt">
        <b>{item.titulo}</b>
        <span>{item.sub}</span>
      </div>
      <div className="lk-seta" aria-hidden="true">→</div>
    </a>
  );
}

export default function Links() {
  useSeo({
    titulo: "CareFit Run Base | Links",
    descricao:
      "Agende, reserve yoga e fortalecimento, conheça o Ice Mind e fale com a CareFit Run Base, em Ribeirão Preto.",
    caminho: "/links",
  });

  return (
    <main className="lk">
      <style>{CSS}</style>
      <div className="lk-wrap">
        <header className="lk-top">
          <img className="lk-logo" src={logo} alt="CareFit Run Base" />
          <h1>CareFit Run Base</h1>
          <p className="lk-tag">Fisioterapia, força e recuperação para quem corre. Ribeirão Preto · SP</p>
        </header>

        <div className="lk-sec">Comece por aqui</div>
        {DESTAQUES.map((d, i) => (
          <Card key={d.titulo} item={d} hero={i === 0} />
        ))}

        <div className="lk-sec">Conheça a CareFit</div>
        {EXPLORAR.map((d) => (
          <Card key={d.titulo} item={d} />
        ))}

        <div className="lk-sec">Fale com a gente</div>
        <div className="lk-redes">
          <a className="lk-btn" href={MAPS} target="_blank" rel="noopener noreferrer">Como chegar</a>
          <a className="lk-btn" href="https://www.instagram.com/carefitrunbase" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a className="lk-btn" href={WHATS} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>

        <p className="lk-end">
          Av. Áurea A. B. Machado, 241 · City Ribeirão<br />
          Ribeirão Preto/SP · <a href="/">carefitrunbase.com.br</a>
        </p>
      </div>
    </main>
  );
}
