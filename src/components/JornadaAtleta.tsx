import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Flag, Pause, Play } from "lucide-react";

/**
 * Mapa interativo de um ciclo de maratona, semana a semana.
 * EXEMPLO ILUSTRATIVO: não é dado de um atleta real. Mostra como o plano de
 * recovery é montado em cima do treino, do check-in e do histórico do corredor.
 */

type Semana = {
  km: number;
  titulo: string;
  treino: string;
  sessao?: { nota: number; chegou: string; fez: string };
  viu?: string;
  alerta?: boolean;
  treinador?: string;
  prova?: boolean;
};

const FASES = [
  { nome: "Base forte", semanas: 4 },
  { nome: "Subida", semanas: 4 },
  { nome: "Ápice", semanas: 2 },
  { nome: "Polimento", semanas: 2 },
  { nome: "Volta", semanas: 1 },
];

const SEMANAS: Semana[] = [
  {
    km: 40, titulo: "A primeira sessão abre a história",
    treino: "40 km. Início do ciclo, 12 semanas até a maratona.",
    sessao: { nota: 82, chegou: "Energia boa, sono em dia, sem dor.", fez: "Avaliação completa em 80 minutos e liberação de panturrilha." },
    viu: "Histórico de canelite no ciclo anterior e panturrilha direita mais tensa que a esquerda.",
  },
  {
    km: 46, titulo: "O plano de recovery é montado",
    treino: "46 km. Volume subindo como planejado.",
    sessao: { nota: 80, chegou: "Bem. A panturrilha respondeu ao que foi feito.", fez: "Reavaliação e plano do ciclo: sessões a cada duas semanas, mais próximas no pico e uma logo depois da prova." },
    viu: "Com a data da prova, a planilha e o histórico na mão, dá para saber onde o corpo vai ser mais exigido.",
  },
  { km: 52, titulo: "Sem sessão, mas com alguém olhando", treino: "52 km. Terceira semana seguida de aumento.", viu: "Nada fora do esperado. O treino segue sendo acompanhado pelo Strava." },
  {
    km: 42, titulo: "Semana de descarga",
    treino: "42 km. O treinador reduziu a carga.",
    sessao: { nota: 85, chegou: "Descansada, sem dor.", fez: "Sessão de manutenção: liberação e ofurô." },
  },
  { km: 56, titulo: "A subida começa", treino: "56 km. Longão de 24 km no domingo.", viu: "Ritmo estável no longão. Sem sinal de alerta." },
  {
    km: 62, titulo: "O check-in acende o primeiro sinal", alerta: true,
    treino: "62 km. Maior volume do ciclo até aqui.",
    sessao: { nota: 48, chegou: "Dormindo mal e com estresse alto no trabalho. Nota do dia abaixo de 50.", fez: "A sessão mudou: nada intenso. Ofurô e bota de compressão para o corpo desacelerar." },
    viu: "Carga subindo e descanso caindo ao mesmo tempo. É a combinação que costuma vir antes da lesão.",
    treinador: "Avisamos o treinador, que segurou o ritmo do longão seguinte.",
  },
  {
    km: 68, titulo: "Um problema pequeno, tratado pequeno", alerta: true,
    treino: "68 km. Longão de 28 km.",
    sessao: { nota: 62, chegou: "Dor 3 de 10 na canela esquerda depois do longão.", fez: "Sessão encaixada na mesma semana: avaliação da canela, liberação e laser." },
    viu: "Mesma região da canelite antiga. O histórico já dizia para onde olhar.",
    treinador: "Combinamos com o treinador antecipar a semana de descarga.",
  },
  { km: 50, titulo: "A descarga faz o trabalho dela", treino: "50 km. Semana leve, como combinado.", viu: "O atleta relata que a dor na canela cedeu. O volume volta a subir na semana seguinte." },
  {
    km: 72, titulo: "O pico do ciclo",
    treino: "72 km. Longão de 32 km, o maior do ciclo.",
    sessao: { nota: 74, chegou: "Cansada, como se espera no pico. Canela sem dor.", fez: "Reavaliação da canela, liberação e bota de compressão depois do longão." },
    viu: "O corpo aguentou a semana mais pesada. O problema da semana 7 não voltou.",
  },
  { km: 64, titulo: "Começa a descida", treino: "64 km. O volume começa a cair.", viu: "Treinos de ritmo dentro do planejado." },
  {
    km: 46, titulo: "A prova entra na sessão",
    treino: "46 km. Polimento.",
    sessao: { nota: 86, chegou: "Energia alta, sono bom, ansiedade de prova.", fez: "Sessão para soltar: liberação e mobilidade." },
    viu: "Estudamos o percurso da maratona: onde estão as subidas e onde o corpo dela costuma pedir mais.",
    treinador: "Alinhamos com o treinador a estratégia para os trechos mais duros.",
  },
  { km: 28, prova: true, titulo: "Semana da prova", treino: "28 km de treino e, no domingo, os 42 km da maratona.", viu: "Nenhuma intervenção nova na semana da prova. O que tinha que ser feito já foi feito." },
  {
    km: 15, titulo: "A prova, quilômetro por quilômetro",
    treino: "15 km. Só rodagens leves.",
    sessao: { nota: 60, chegou: "Dolorida, feliz e sem lesão.", fez: "Sessão de recuperação: imersão no gelo e ofurô." },
    viu: "Lemos a prova inteira: onde o ritmo se manteve, onde caiu e o que isso diz sobre o próximo ciclo.",
  },
];

const MAX_KM = Math.max(...SEMANAS.map(s => s.km));
const TOTAL_SESSOES = SEMANAS.filter(s => s.sessao).length;
const TOTAL_ALERTAS = SEMANAS.filter(s => s.alerta).length;

function faseDaSemana(indice: number) {
  let fim = 0;
  for (const fase of FASES) { fim += fase.semanas; if (indice < fim) return fase.nome; }
  return "";
}

function rotulo(semana: Semana, i: number) {
  const partes = [`Semana ${i + 1}`, `${semana.km} quilômetros`];
  if (semana.prova) partes.push("maratona");
  if (semana.sessao) partes.push("sessão na CareFit");
  if (semana.alerta) partes.push("sinal de atenção");
  if (semana.treinador) partes.push("conversa com o treinador");
  return partes.join(", ");
}

export default function JornadaAtleta() {
  const [atual, setAtual] = useState(0);
  const [tocando, setTocando] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    if (!tocando) return;
    timer.current = window.setTimeout(() => {
      if (atual === SEMANAS.length - 1) setTocando(false);
      else setAtual(atual + 1);
    }, 3200);
    return () => window.clearTimeout(timer.current);
  }, [tocando, atual]);

  const escolher = (i: number) => { setTocando(false); setAtual(Math.max(0, Math.min(SEMANAS.length - 1, i))); };
  const tocar = () => { if (!tocando && atual === SEMANAS.length - 1) setAtual(0); setTocando(!tocando); };

  const semana = SEMANAS[atual];
  // Linha da montanha: liga o topo das barras. Coordenadas em % da área do gráfico.
  const pontos = SEMANAS.map((s, i) => `${((i + 0.5) / SEMANAS.length) * 100},${100 - (s.km / MAX_KM) * 100}`).join(" ");

  return (
    <div className="home-journey">
      <div className="home-journey-map">
        <div className="home-journey-phases" aria-hidden="true">
          {FASES.map(fase => <span key={fase.nome} style={{ gridColumn: `span ${fase.semanas}` }}>{fase.nome}</span>)}
        </div>

        <div className="home-journey-chart" role="group" aria-label="Volume de treino por semana. Escolha uma semana para ver os detalhes."
          onKeyDown={event => {
            if (event.key === "ArrowRight") { event.preventDefault(); escolher(atual + 1); }
            if (event.key === "ArrowLeft") { event.preventDefault(); escolher(atual - 1); }
          }}>
          <svg className="home-journey-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={pontos} />
          </svg>
          {SEMANAS.map((s, i) => (
            <button key={i} type="button" className={`home-journey-week${i === atual ? " is-on" : ""}${i < atual ? " is-past" : ""}`}
              aria-label={rotulo(s, i)} aria-pressed={i === atual} onClick={() => escolher(i)}>
              <span className="home-journey-bar-area">
                <span className="home-journey-bar" style={{ height: `${(s.km / MAX_KM) * 100}%` }}>
                  {s.prova && <Flag className="home-journey-flag" size={15} aria-hidden="true" />}
                  <i>{s.km}</i>
                </span>
              </span>
              <span className="home-journey-num">{i + 1}</span>
              <span className={`home-journey-dot${s.sessao ? " is-session" : ""}`} />
              <span className={`home-journey-dot${s.alerta ? " is-alert" : ""}`} />
              <span className={`home-journey-dot${s.treinador ? " is-coach" : ""}`} />
            </button>
          ))}
        </div>

        <ul className="home-journey-legend" aria-hidden="true">
          <li><span className="home-journey-key is-bar" />Km da semana (Strava)</li>
          <li><span className="home-journey-key is-session" />Sessão na CareFit</li>
          <li><span className="home-journey-key is-alert" />Sinal que a gente viu</li>
          <li><span className="home-journey-key is-coach" />Conversa com o treinador</li>
        </ul>
      </div>

      <div className="home-journey-panel" aria-live="polite">
        <div className="home-journey-panel-top">
          <p className="home-journey-when">Semana {atual + 1} de {SEMANAS.length} · {faseDaSemana(atual)}</p>
          <div className="home-journey-controls">
            <button type="button" onClick={() => escolher(atual - 1)} disabled={atual === 0} aria-label="Semana anterior"><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" className="home-journey-play" onClick={tocar} aria-label={tocando ? "Pausar" : "Percorrer o ciclo sozinho"}>
              {tocando ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}{tocando ? "Pausar" : "Ver o ciclo"}
            </button>
            <button type="button" onClick={() => escolher(atual + 1)} disabled={atual === SEMANAS.length - 1} aria-label="Próxima semana"><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
        </div>

        <h3 key={atual} className="home-journey-title">{semana.titulo}</h3>

        <dl key={`d${atual}`} className="home-journey-facts">
          <div><dt>O treino mostrou</dt><dd>{semana.treino}</dd></div>
          {semana.sessao && <div><dt>Como chegou na sessão</dt><dd><span className={`home-journey-score${semana.sessao.nota < 50 ? " is-low" : ""}`}>Nota do dia {semana.sessao.nota}</span>{semana.sessao.chegou}</dd></div>}
          {semana.viu && <div className={semana.alerta ? "is-alert" : undefined}><dt>O que a gente viu</dt><dd>{semana.viu}</dd></div>}
          {semana.sessao && <div><dt>O que a gente fez</dt><dd>{semana.sessao.fez}</dd></div>}
          {semana.treinador && <div><dt>Com o treinador</dt><dd>{semana.treinador}</dd></div>}
          {!semana.sessao && <div><dt>Na CareFit</dt><dd>Sem sessão nesta semana. O acompanhamento continua pelos treinos.</dd></div>}
        </dl>
      </div>

      <div className="home-journey-end">
        <p className="home-journey-end-title">Ao fim do ciclo, isto fica registrado sobre o atleta</p>
        <ul>
          <li><b>{SEMANAS.length}</b><span>semanas de treino lidas</span></li>
          <li><b>{TOTAL_SESSOES}</b><span>sessões, cada uma montada no dia</span></li>
          <li><b>{TOTAL_ALERTAS}</b><span>sinais pegos antes de virar lesão</span></li>
          <li><b>1</b><span>prova estudada quilômetro por quilômetro</span></li>
        </ul>
        <p>O próximo ciclo começa daqui, e não do zero.</p>
      </div>

      <p className="home-journey-note">Exemplo ilustrativo de um ciclo de maratona. Cada atleta tem a sua história, o seu volume e o seu plano.</p>
    </div>
  );
}
