import type { Avaliacao } from '@/lib/avaliacaoForca';

const kg = (n: number | undefined) => n === undefined ? '—' : `${n.toFixed(1).replace('.', ',')} kg`;
const pct = (n: number | null) => n === null ? '—' : `${n.toFixed(1).replace('.', ',')}%`;

/** Conferência dos dados. O documento oficial tem um único renderizador na VPS. */
export default function RelatorioForca({ avaliacao, avaliador, alertas }: {
  avaliacao: Avaliacao; avaliador: string; alertas: {movimento: string; texto: string}[];
}) {
  return <section className="af-form">
    <h2>Conferência da avaliação</h2>
    <p>{avaliacao.atleta.nome} · {avaliacao.data} · {avaliacao.atleta.peso} kg · {avaliador}</p>
    <p className="af-nota">Em telas pequenas, deslize a tabela para conferir todas as colunas.</p>
    <div style={{overflowX: 'auto'}} role="region" aria-label="Tabela de resultados" tabIndex={0}>
      <table style={{width: '100%', minWidth: 720, borderCollapse: 'separate', borderSpacing: '8px', textAlign: 'left'}}>
        <caption>Resultados calculados a partir do Excel. O servidor confere novamente antes de salvar.</caption>
        <thead><tr><th>Movimento</th><th>Lado</th><th>Picos (kg)</th><th>Média</th><th>Maior</th><th>CV</th><th>Assimetria</th></tr></thead>
        <tbody>{avaliacao.movimentos.flatMap(m => (['E', 'D'] as const).map(l => {
          const r = l === 'E' ? m.esquerdo : m.direito;
          if (!r) return null;
          return <tr key={m.chave + l} style={{borderBottom: '1px solid #ddd'}}>
            <td>{m.nome}</td><td>{l === 'E' ? 'Esquerdo' : 'Direito'}</td>
            <td>{r.picos.map(p => p.toFixed(2).replace('.', ',')).join(' / ')}</td>
            <td>{kg(r.media)}</td><td>{kg(r.maior)}</td><td>{pct(r.cv)}</td><td>{pct(m.assimetria)}</td>
          </tr>;
        }))}</tbody>
      </table>
    </div>
    {avaliacao.razoes.length > 0 && <><h3>Razões entre forças</h3><ul>{avaliacao.razoes.map(r => <li key={r.titulo+r.lado}>{r.titulo}, lado {r.lado}: {pct(r.valor)}. {r.nota}</li>)}</ul></>}
    {alertas.length > 0 && <><h3>Execução</h3><ul>{alertas.map((a,i) => <li key={i}>{a.movimento}: {a.texto}</li>)}</ul></>}
    {avaliacao.problemas.length > 0 && <><h3>Limitações</h3><ul>{avaliacao.problemas.map((p,i) => <li key={i}>{p}</li>)}</ul></>}
    <p>As diferenças descrevem esta medição; não são previsão de lesão ou comparação com norma externa.</p>
  </section>;
}
