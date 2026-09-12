/**
 * Relatório do atleta. Desenhado para sair em A4 pelo "imprimir" do navegador.
 *
 * Sobre as cores: elas marcam a MAGNITUDE da assimetria (até 10%, 10–20%, acima de 20%),
 * não chance de lesão. O manual da CareFit proíbe ler assimetria isolada como indicador
 * de risco, então nenhuma faixa aqui recebe rótulo de risco — só o tamanho do número.
 * A paleta passou nos cinco testes do validador (banda de luminosidade, croma, separação
 * para daltonismo, piso de visão normal e contraste), e cada faixa vem sempre com o nome
 * escrito junto, nunca só a cor.
 */
import { faixaAssimetria, CV_MAXIMO, type Avaliacao, type Lado, type Faixa, type MovimentoResultado } from '@/lib/avaliacaoForca';

const COR: Record<Faixa, string> = { baixa: '#12805A', media: '#B87A00', alta: '#A8322A' };
const ROTULO: Record<Faixa, string> = { baixa: 'até 10%', media: '10% a 20%', alta: 'acima de 20%' };
const NEUTRO = '#9ca3af';

const dataBR = (iso: string) => /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10).split('-').reverse().join('/') : iso;
const kg = (v: number | null | undefined) => v === null || v === undefined ? '—' : `${v.toFixed(1).replace('.', ',')} kg`;
const pct = (v: number | null | undefined, casas = 1) => v === null || v === undefined ? '—' : `${v.toFixed(casas).replace('.', ',')}%`;
const ladoNome = (lado: Lado | null) => lado === 'E' ? 'esquerdo' : lado === 'D' ? 'direito' : '—';
const corDe = (m: MovimentoResultado) => { const f = faixaAssimetria(m.assimetria); return f ? COR[f] : NEUTRO; };

/** Altura de cada região no esquema do corpo (viewBox 200×340). */
const ZONA: Record<string, number> = {
  'flexao-quadril': 150, 'extensao-quadril': 150, 'abducao-quadril': 150, 'aducao-quadril': 150,
  'extensao-joelho': 232, 'flexao-joelho': 232,
  'flexao-plantar': 300,
};

/**
 * Esquema dos membros inferiores. Cada teste vira um marcador colorido pela faixa
 * de assimetria e posicionado no lado MAIS FRACO — quem olha vê de imediato se a
 * fraqueza se concentra de um lado só. Testes sem os dois lados medidos ficam no centro.
 */
function EsquemaCorpo({ movimentos }: { movimentos: MovimentoResultado[] }) {
  const marcadores: { n: number; x: number; y: number; cor: string }[] = [];
  const zonas = [...new Set(movimentos.map(m => ZONA[m.chave]).filter(Boolean))];

  for (const y of zonas) {
    const naZona = movimentos.map((m, i) => ({ m, n: i + 1 })).filter(({ m }) => ZONA[m.chave] === y);
    const grupos: Record<'E' | 'D' | 'C', typeof naZona> = { E: [], D: [], C: [] };
    for (const item of naZona) grupos[item.m.ladoMenor ?? 'C'].push(item);
    // Em grade de duas colunas, para 4 marcadores na mesma região não vazarem do quadro.
    const colocar = (lista: typeof naZona, base: number, sentido: number) => {
      const linhas = Math.ceil(lista.length / 2);
      lista.forEach(({ m, n }, i) => marcadores.push({
        n,
        x: base + sentido * 25 * (i % 2),
        y: y - (linhas - 1) * 12 + Math.floor(i / 2) * 25,
        cor: corDe(m),
      }));
    };
    colocar(grupos.E, 60, -1);
    colocar(grupos.D, 140, 1);
    colocar(grupos.C, 100, 0);
  }

  return (
    <svg viewBox="-8 0 216 352" className="rf-corpo" role="img"
      aria-label="Esquema dos membros inferiores; cada marcador fica do lado mais fraco">
      <g fill="#E4DED2" stroke="#C9BFAD" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="100" cy="22" r="15" />
        <path d="M92 38 h16 v8 h-16 z" />
        <path d="M74 48 q26-6 52 0 l6 42 -10 3 v39 h-44 V93 l-10-3 z" />
        <path d="M70 52 l-8 44 4 30" fill="none" />
        <path d="M130 52 l8 44 -4 30" fill="none" />
        <path d="M82 132 h36 l-1 26 h-34 z" />
        <path d="M84 160 h14 l3 70 -1 76 h-15 l-2-76 z" />
        <path d="M102 160 h14 l-2 70 -1 76 h-15 l-1-76 z" />
        <path d="M83 308 h15 v11 h-21 z" />
        <path d="M103 308 h15 l5 11 h-21 z" />
      </g>
      <line x1="100" y1="132" x2="100" y2="312" stroke="#C9BFAD" strokeWidth="1" strokeDasharray="3 4" />
      {marcadores.map(marcador => (
        <g key={marcador.n}>
          <circle cx={marcador.x} cy={marcador.y} r="11.5" fill={marcador.cor} stroke="#fff" strokeWidth="2.5" />
          <text x={marcador.x} y={marcador.y + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fff">{marcador.n}</text>
        </g>
      ))}
      <text x="40" y="344" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0E3C41" letterSpacing="1">ESQUERDO</text>
      <text x="160" y="344" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0E3C41" letterSpacing="1">DIREITO</text>
    </svg>
  );
}

/** Barras espelhadas: esquerdo cresce para a esquerda, direito para a direita. */
function BarrasLadoALado({ movimentos }: { movimentos: MovimentoResultado[] }) {
  const maior = Math.max(1, ...movimentos.flatMap(m => [m.esquerdo?.media ?? 0, m.direito?.media ?? 0]));
  const largura = (valor: number | undefined) => valor ? `${Math.max(2, (valor / maior) * 100)}%` : '0%';
  return (
    <div className="rf-barras">
      <div className="rf-barras-topo"><span /><div><span>Esquerdo</span><span>Direito</span></div><span /></div>
      {movimentos.map((m, i) => (
        <div className="rf-barra-linha" key={m.chave}>
          <div className="rf-barra-nome"><span className="rf-num" style={{ background: corDe(m) }}>{i + 1}</span>{m.nome}</div>
          <div className="rf-barra-par">
            <div className="rf-barra-lado rf-esq">
              <span className="rf-valor">{kg(m.esquerdo?.media)}</span>
              <span className="rf-fill" style={{ width: largura(m.esquerdo?.media), background: corDe(m) }} />
            </div>
            <div className="rf-eixo" />
            <div className="rf-barra-lado rf-dir">
              <span className="rf-fill" style={{ width: largura(m.direito?.media), background: corDe(m) }} />
              <span className="rf-valor">{kg(m.direito?.media)}</span>
            </div>
          </div>
          <div className="rf-barra-assim" style={{ color: corDe(m) }}>{pct(m.assimetria)}</div>
        </div>
      ))}
    </div>
  );
}

function Legenda() {
  return (
    <div className="rf-legenda-cores">
      {(['baixa', 'media', 'alta'] as Faixa[]).map(faixa => (
        <span key={faixa}><i style={{ background: COR[faixa] }} />{ROTULO[faixa]}</span>
      ))}
      <small>Tamanho da diferença entre os lados. Não é classificação de risco de lesão.</small>
    </div>
  );
}

export default function RelatorioForca({ avaliacao, avaliador, alertas }: {
  avaliacao: Avaliacao; avaliador: string; alertas: { movimento: string; texto: string }[];
}) {
  const comAssimetria = avaliacao.movimentos.filter(m => m.assimetria !== null);
  const maiorAssimetria = comAssimetria.length
    ? comAssimetria.reduce((a, b) => (b.assimetria ?? 0) > (a.assimetria ?? 0) ? b : a)
    : null;

  return (
    <article className="rf">
      <header className="rf-topo">
        <div>
          <p className="rf-marca">CareFit Run Base</p>
          <h2>Relatório de avaliação de força</h2>
          <p className="rf-sub">Dinamometria isométrica de membros inferiores</p>
        </div>
        <div className="rf-id">
          <p className="rf-nome">{avaliacao.atleta.nome}</p>
          <p>{avaliacao.atleta.email}</p>
          <p>{avaliacao.idade !== null ? `${avaliacao.idade} anos` : 'Idade não informada'} · {avaliacao.atleta.peso.toFixed(1).replace('.', ',')} kg</p>
          <p>Avaliação em {dataBR(avaliacao.data)} · {avaliador}</p>
        </div>
      </header>

      <section className="rf-resumo">
        <div className="rf-resumo-mapa">
          <EsquemaCorpo movimentos={avaliacao.movimentos} />
        </div>
        <div className="rf-resumo-texto">
          <h3>Resumo</h3>
          {maiorAssimetria ? (
            <>
              <p className="rf-headline">
                A maior diferença entre os lados apareceu em{' '}
                <strong>{maiorAssimetria.nome.toLowerCase()}</strong>:{' '}
                <strong style={{ color: corDe(maiorAssimetria) }}>{pct(maiorAssimetria.assimetria)}</strong>,
                com o lado <strong>{ladoNome(maiorAssimetria.ladoMenor)}</strong> mais fraco.
              </p>
              <p className="rf-resumo-nota">
                {comAssimetria.filter(m => faixaAssimetria(m.assimetria) === 'baixa').length} de {comAssimetria.length} movimentos
                ficaram até 10% de diferença. No esquema, cada número aparece do lado mais fraco daquele movimento.
              </p>
            </>
          ) : (
            <p className="rf-headline">Não houve movimento com os dois lados medidos, então não há assimetria a comparar.</p>
          )}
          <ol className="rf-indice">
            {avaliacao.movimentos.map((m, i) => (
              <li key={m.chave}>
                <span className="rf-num" style={{ background: corDe(m) }}>{i + 1}</span>
                <span className="rf-indice-nome">{m.nome}</span>
                <span className="rf-indice-valor" style={{ color: corDe(m) }}>{pct(m.assimetria)}</span>
              </li>
            ))}
          </ol>
          <Legenda />
        </div>
      </section>

      <section>
        <h3>Força de cada lado</h3>
        <BarrasLadoALado movimentos={avaliacao.movimentos} />
        <p className="rf-legenda">
          Cada barra é a média dos três picos daquele lado, na mesma escala entre os movimentos.
          Assimetria = 100 − (lado mais fraco ÷ lado mais forte × 100), conforme o protocolo CareFit.
        </p>
      </section>

      <section>
        <h3>As três tentativas</h3>
        <table className="rf-tabela">
          <thead>
            <tr><th>Movimento</th><th>Lado</th><th>1ª</th><th>2ª</th><th>3ª</th><th>Média</th><th>Maior</th><th>Variação</th></tr>
          </thead>
          <tbody>
            {avaliacao.movimentos.flatMap(m => (['E', 'D'] as Lado[]).map(lado => {
              const r = lado === 'E' ? m.esquerdo : m.direito;
              if (!r) return null;
              return (
                <tr key={`${m.chave}-${lado}`}>
                  <td>{m.nome}</td>
                  <td>{ladoNome(lado)}</td>
                  {[0, 1, 2].map(i => <td key={i}>{r.picos[i] !== undefined ? kg(r.picos[i]) : '—'}</td>)}
                  <td><strong>{kg(r.media)}</strong></td>
                  <td>{kg(r.maior)}</td>
                  <td style={r.cv > CV_MAXIMO ? { color: COR.alta, fontWeight: 700 } : undefined}>{pct(r.cv)}</td>
                </tr>
              );
            }).filter(Boolean))}
          </tbody>
        </table>
        <p className="rf-legenda">
          As três tentativas ficam registradas, inclusive a mais baixa. Variação acima de {CV_MAXIMO}% entre elas
          costuma indicar problema de execução ou de fixação, e não diferença real de força.
        </p>
      </section>

      {avaliacao.razoes.length > 0 && (
        <section>
          <h3>Relação entre músculos opostos</h3>
          <table className="rf-tabela">
            <thead><tr><th>Relação</th><th>Lado</th><th>Valor</th><th>Forças</th></tr></thead>
            <tbody>
              {avaliacao.razoes.map((r, i) => (
                <tr key={i}>
                  <td>{r.titulo}{!r.comparavel && <sup>*</sup>}</td>
                  <td>{ladoNome(r.lado)}</td>
                  <td><strong>{pct(r.valor, 0)}</strong></td>
                  <td>{r.detalhe}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {avaliacao.razoes.some(r => !r.comparavel) && (
            <p className="rf-legenda">* {avaliacao.razoes.find(r => !r.comparavel)?.nota}</p>
          )}
        </section>
      )}

      {alertas.length > 0 && (
        <section>
          <h3>Observações de execução</h3>
          <ul className="rf-lista">
            {alertas.map((a, i) => <li key={i}><strong>{a.movimento}:</strong> {a.texto}</li>)}
          </ul>
        </section>
      )}

      {avaliacao.problemas.length > 0 && (
        <section>
          <h3>Limitações desta avaliação</h3>
          <ul className="rf-lista">{avaliacao.problemas.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </section>
      )}

      <footer className="rf-rodape">
        <h3>Como ler este relatório</h3>
        <p>
          Os valores vêm de dinamometria isométrica com fixação externa. Cada movimento foi testado três vezes de
          cada lado, com cinco segundos de contração e um minuto de descanso, e o resultado é a média dos três picos.
        </p>
        <p>
          As comparações que valem aqui são <strong>entre os seus dois lados</strong> e <strong>entre as suas próprias
          avaliações</strong> ao longo do tempo. O valor em quilos depende do aparelho, da posição e do ponto onde a
          cinta é presa, e por isso não deve ser comparado com medições feitas em outro serviço ou equipamento.
        </p>
        <p>
          As cores indicam o tamanho da diferença entre os lados, não chance de lesão. Uma diferença é informação,
          não diagnóstico: ela precisa ser lida junto com histórico de lesão, sintomas, capacidade funcional e demanda
          de treino. Este documento não prevê lesão individual e não substitui a avaliação clínica.
        </p>
        <p className="rf-assinatura">
          CareFit Run Base · Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP
        </p>
      </footer>
    </article>
  );
}
