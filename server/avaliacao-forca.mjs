// Registro das avaliações de força no ClickUp, no card do atleta.
// Mesmo desenho do painel de fortalecimento: subtarefa com JSON embutido,
// idempotência por requestId e releitura para confirmar o que foi gravado.
import { IDS, PublicError } from './fortalecimento.mjs';
import { createHash } from 'node:crypto';
import { readSheet } from 'read-excel-file/node';
import { recalcularResultados, lerExportFightTech, calcularAvaliacao, nomesCombinam, dataValida, MOVIMENTOS } from './forca-core.mjs';
export { nomesCombinam } from './forca-core.mjs';

export const MARCADOR = 'CAREFIT_AVALIACAO_V1';
const PREFIXO = 'Avaliação de força CareFit — ';

export function desempacotar(task) {
  for (const origem of [task.description, task.markdown_description]) {
    if (typeof origem !== 'string') continue;
    const texto = origem.replace(/\r\n/g, '\n');
    const indice = texto.indexOf(MARCADOR + '\n');
    if (indice < 0) continue;
    const linhas = texto.slice(indice + MARCADOR.length + 1).trimStart().split('\n');
    if (linhas[0].startsWith('```')) linhas.shift();
    try { return JSON.parse(linhas[0]); } catch { /* tenta a outra representação */ }
  }
  return null;
}

const numeroBR = valor => Number(valor).toFixed(1).replace('.', ',');

export function empacotar(registro) {
  const linhas = registro.resultados.map(r => [
    r.nome,
    r.esquerdo ? `${numeroBR(r.esquerdo.media)} kg` : '—',
    r.direito ? `${numeroBR(r.direito.media)} kg` : '—',
    r.assimetria === null || r.assimetria === undefined ? '—' : `${numeroBR(r.assimetria)}%`,
    r.ladoMenor === 'E' ? 'esquerdo' : r.ladoMenor === 'D' ? 'direito' : '—',
  ].map(v => String(v).replace(/[|\r\n]/g, ' ')).join(' | '));

  let texto = `Avaliação de força — ${registro.data}\n\n`;
  texto += `Atleta: ${registro.atleta.nome} · nascimento ${registro.atleta.nascimento} · ${numeroBR(registro.atleta.peso)} kg\n`;
  texto += `Avaliador: ${registro.author}\n\n`;
  texto += 'Movimento | Esquerdo | Direito | Assimetria | Lado menor\n--- | --- | --- | --- | ---\n';
  texto += linhas.join('\n');
  texto += '\n\nMédia dos três picos, conforme o protocolo CareFit. Assimetria não é diagnóstico nem previsão de lesão.\n';
  texto += `\n\`\`\`json\n${MARCADOR}\n${JSON.stringify(registro)}\n\`\`\`\n`;
  return texto;
}

const texto = (valor, rotulo, max) => {
  if (typeof valor !== 'string' || !valor.trim() || valor.length > max) throw new PublicError(`Confira ${rotulo}.`);
  return valor.trim();
};
const hash = valor => createHash('sha256').update(valor).digest('hex');

export function validarEnvio(body) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body?.requestId || '')) throw new PublicError('Identificador da operação inválido.');
  if (!dataValida(body?.data)) throw new PublicError('Confira a data da avaliação.');
  const entrada = body.atleta || {};
  const email = String(entrada.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) throw new PublicError('Confira o e-mail do atleta.');
  if (!dataValida(entrada.nascimento)) throw new PublicError('Confira a data de nascimento.');
  const atleta = {nome: texto(entrada.nome, 'o nome do atleta', 80), nascimento: entrada.nascimento, peso: Number(entrada.peso), email};
  let calculo;
  try { calculo = recalcularResultados(body.resultados, atleta, body.data); }
  catch (erro) { throw new PublicError(erro.message); }
  return {requestId: body.requestId, data: body.data, atleta, idade: calculo.idade, resultados: calculo.movimentos, razoes: calculo.razoes, problemas: calculo.problemas};
}

export async function conferirArquivo(body) {
  const base64 = body.arquivoBase64;
  if (typeof base64 !== 'string' || base64.length > 2_666_668 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) throw new PublicError('Excel ausente ou inválido (máximo 2 MB).');
  const bytes = Buffer.from(base64, 'base64');
  if (!bytes.length || bytes.length > 2_000_000) throw new PublicError('Excel ausente ou acima de 2 MB.');
  let linhas;
  try { linhas = await readSheet(bytes, 'All'); }
  catch { throw new PublicError('Não foi possível ler a aba All do Excel. Exporte novamente pelo FightTech.'); }
  if (linhas.length > 1000) throw new PublicError('O arquivo tem linhas demais para uma avaliação.');
  const leitura = lerExportFightTech(linhas);
  if (leitura.problemas.length) throw new PublicError(leitura.problemas.join(' '));
  const mapa = Object.fromEntries(leitura.naoReconhecidos.map(nome => {
    const chave = body.mapa?.[nome];
    if (!MOVIMENTOS.some(m => m.chave === chave)) throw new PublicError(`Mapeie o exercício: ${nome}`);
    return [nome, chave];
  }));
  leitura.tentativas = leitura.tentativas.map(t => ({...t, chave: t.chave || mapa[t.exercicioBruto]}));
  if (leitura.datas[0] !== body.data) throw new PublicError('A data da avaliação precisa ser a data medida no Excel.');
  const calculo = calcularAvaliacao(leitura, body.atleta, new Date(`${body.data}T12:00:00`));
  const envio = validarEnvio({...body, resultados: calculo.movimentos});
  // Também confere o que foi exibido no navegador antes de salvar.
  const exibido = validarEnvio(body);
  if (JSON.stringify(exibido.resultados) !== JSON.stringify(envio.resultados)) throw new PublicError('Os resultados exibidos divergem do Excel. Gere a conferência novamente.', 409);
  return {envio, bytes, origem: {atletaNoApp: leitura.atletaNoApp, data: leitura.datas[0], sha256: hash(bytes), mapa, tentativas: leitura.tentativas}};
}

/** Anexo vai por multipart; o cliente JSON do painel não serve para isso. */
export function criarUploader(token, fetcher = fetch) {
  return async (taskId, nomeArquivo, bytes) => {
    const form = new FormData();
    form.append('attachment', new Blob([bytes]), nomeArquivo);
    let res;
    try {
      res = await fetcher(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, {
        method: 'POST', headers: { Authorization: token }, body: form, signal: AbortSignal.timeout(30000),
      });
    } catch { throw new PublicError('O ClickUp não respondeu ao anexar o Excel.', 503); }
    if (!res.ok) throw new PublicError('A avaliação foi salva, mas o Excel não pôde ser anexado. Anexe o arquivo no card manualmente.', 503);
    return res.json();
  };
}

export function criarServicoAvaliacao(api, upload) {
  const emCurso = new Map();
  async function cardAtleta(id) {
    if (!/^[a-zA-Z0-9_-]{3,40}$/.test(id)) throw new PublicError('Card inválido.');
    const t = await api(`/task/${id}?include_subtasks=true&include_markdown_description=true`);
    if (String(t.list?.id) !== IDS.athletes || t.parent) throw new PublicError('Card fora da lista de atletas.', 403);
    return t;
  }

  async function historico(card) {
    const subs = (card.subtasks || []).filter(t => t.name?.startsWith(PREFIXO));
    const resultado = [];
    // Leitura sequencial respeita o limite de requisições do ClickUp.
    for (const s of subs) {
      const t = await api(`/task/${s.id}?include_markdown_description=true`);
      const dados = desempacotar(t);
      if (dados?.kind === 'avaliacao-forca' && String(t.parent) === String(card.id)) resultado.push({ ...dados, id: t.id });
    }
    return resultado.sort((a, b) => String(b.data).localeCompare(String(a.data)));
  }

  return {
    async atletas() {
      const todos = [];
      for (let pagina = 0; pagina < 100; pagina++) {
        const r = await api(`/list/${IDS.athletes}/task?include_closed=true&subtasks=false&page=${pagina}`);
        todos.push(...(r.tasks || []).filter(t => !t.parent));
        if (r.last_page || r.tasks?.length < 100) break;
      }
      return todos.map(t => ({ id: t.id, name: t.name })).sort((a, b) => a.name.localeCompare(b.name));
    },

    async historicoDe(id) { return historico(await cardAtleta(id)); },

    async salvar(atletaId, body, usuario) {
      // Evita duas criações concorrentes no mesmo processo; deploy deve manter uma réplica.
      const chaveOperacao = `${atletaId}:${body?.requestId}`;
      const anterior = emCurso.get(chaveOperacao);
      const assinatura = hash(JSON.stringify(body));
      if (anterior) {
        if (anterior.assinatura !== assinatura) throw new PublicError('Operação em curso com conteúdo diferente.', 409);
        return anterior.promessa;
      }
      const promessa = salvarUma(atletaId, body, usuario);
      emCurso.set(chaveOperacao, {assinatura, promessa});
      try { return await promessa; } finally { emCurso.delete(chaveOperacao); }
    },
  };

  async function salvarUma(atletaId, body, usuario) {
    validarEnvio(body);
    if (typeof upload !== 'function') throw new PublicError('Anexo do Excel indisponível.', 503);
    const {envio, bytes, origem} = await conferirArquivo(body);
    const card = await cardAtleta(atletaId);
    const confirmacao = body.confirmacao;
    if (confirmacao?.conferida !== true || confirmacao.cardId !== atletaId || confirmacao.nomeCard !== card.name || confirmacao.atletaNoApp !== origem.atletaNoApp) throw new PublicError('Confira o atleta do Excel e o card escolhido antes de salvar.', 409);
    const divergente = !nomesCombinam(envio.atleta.nome, card.name) || !nomesCombinam(envio.atleta.nome, origem.atletaNoApp);
    const motivo = divergente ? texto(confirmacao.motivo, 'o motivo da associação dos nomes diferentes', 300) : '';
    if (divergente && motivo.length < 12) throw new PublicError('Explique a associação dos nomes diferentes (mínimo 12 caracteres).', 409);
    const associacao = {cardId: atletaId, nomeCard: card.name, atletaNoApp: origem.atletaNoApp, divergente, motivo};
    const montagens = validarMontagens(body.montagens, envio.resultados);
    const anexoNome = `fighttech-${origem.sha256}.xlsx`;
    const conteudoHash = hash(JSON.stringify({envio, origem, associacao, montagens}));
    const anteriores = await historico(card);
    const repetido = anteriores.find(r => r.requestId === envio.requestId);
    if (repetido && repetido.conteudoHash !== conteudoHash) throw new PublicError('Este identificador já foi usado com outros dados. Gere uma nova avaliação.', 409);
    let task;
    let registro;
    if (repetido) {
      task = await api(`/task/${repetido.id}?include_markdown_description=true`);
      registro = desempacotar(task);
    } else {
      registro = {kind: 'avaliacao-forca', schemaVersion: 2, ...envio, origem, associacao: {...associacao, conferidaPor: usuario, conferidaEm: new Date().toISOString()}, montagens, anexoNome, conteudoHash, author: usuario, createdAt: new Date().toISOString()};
      const criada = await api(`/list/${IDS.athletes}/task`, 'POST', {name: `${PREFIXO}${registro.data}`, parent: atletaId, markdown_content: empacotar(registro), notify_all: false});
      task = await api(`/task/${criada.id}?include_markdown_description=true`);
    }
    const confirmada = desempacotar(task);
    if (confirmada?.conteudoHash !== conteudoHash || String(task.parent) !== atletaId) throw new PublicError('Não foi possível confirmar a avaliação salva. Repita o envio para recuperar a operação.', 503);
    const temAnexo = () => (task.attachments || []).some(a => (a.title || a.name) === anexoNome);
    if (!temAnexo()) {
      await upload(task.id, anexoNome, bytes);
      task = await api(`/task/${task.id}?include_markdown_description=true`);
      if (!temAnexo()) throw new PublicError('Avaliação salva; anexo ainda não confirmado. Repita o envio para conferir ou recuperar o Excel.', 503);
    }
    return {...confirmada, id: task.id, anexo: true, card: card.name};
  }
}

export function validarMontagens(valor, resultados) {
  const montagens = {};
  for (const r of resultados) {
    for (const lado of ['E', 'D']) {
      if (!(lado === 'E' ? r.esquerdo : r.direito)) continue;
      const m = valor?.[r.chave]?.[lado];
      const preenchido = m && Object.values(m).some(v => String(v ?? '').trim() !== '');
      if (!preenchido) continue;
      const distanciaCm = Number(m?.distanciaCm); const anguloGraus = Number(m?.anguloGraus);
      if (!m || !Number.isFinite(distanciaCm) || distanciaCm <= 0 || distanciaCm > 200 || m.anguloGraus === '' || !Number.isFinite(anguloGraus) || anguloGraus < 0 || anguloGraus > 180) throw new PublicError(`Registre distância e ângulo de ${r.nome}, lado ${lado}.`);
      if (!montagens[r.chave]) montagens[r.chave] = {};
      montagens[r.chave][lado] = {distanciaCm, anguloGraus, referencia: texto(m.referencia, 'o marco de referência da distância', 120), ancoragem: texto(m.ancoragem, 'a montagem e ancoragem', 300)};
    }
  }
  return montagens;
}
