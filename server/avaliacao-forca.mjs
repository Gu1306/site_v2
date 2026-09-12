// Registro das avaliações de força no ClickUp, no card do atleta.
// Mesmo desenho do painel de fortalecimento: subtarefa com JSON embutido,
// idempotência por requestId e releitura para confirmar o que foi gravado.
import { IDS, PublicError } from './fortalecimento.mjs';

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

export function validarEnvio(body) {
  if (!/^[0-9a-f-]{36}$/.test(body?.requestId || '')) throw new PublicError('Identificador da operação inválido.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body?.data || '')) throw new PublicError('Confira a data da avaliação.');

  const atleta = body.atleta || {};
  const peso = Number(atleta.peso);
  if (!Number.isFinite(peso) || peso < 25 || peso > 250) throw new PublicError('Peso deve ficar entre 25 e 250 kg.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(atleta.nascimento || '')) throw new PublicError('Confira a data de nascimento.');

  if (!Array.isArray(body.resultados) || !body.resultados.length || body.resultados.length > 7) {
    throw new PublicError('A avaliação precisa ter de 1 a 7 movimentos.');
  }
  const lado = valor => {
    if (valor === null || valor === undefined) return null;
    const picos = Array.isArray(valor.picos) ? valor.picos.map(Number) : [];
    if (!picos.length || picos.length > 6 || picos.some(p => !Number.isFinite(p) || p <= 0 || p > 500)) {
      throw new PublicError('Há picos de força fora da faixa aceitável.');
    }
    return { picos, media: Number(valor.media), maior: Number(valor.maior) };
  };
  const resultados = body.resultados.map(r => ({
    chave: texto(r.chave, 'o movimento', 40),
    nome: texto(r.nome, 'o nome do movimento', 60),
    esquerdo: lado(r.esquerdo),
    direito: lado(r.direito),
    assimetria: r.assimetria === null || r.assimetria === undefined ? null : Number(r.assimetria),
    ladoMenor: r.ladoMenor === 'E' || r.ladoMenor === 'D' ? r.ladoMenor : null,
  }));
  if (resultados.every(r => !r.esquerdo && !r.direito)) throw new PublicError('Nenhum resultado foi enviado.');

  return {
    requestId: body.requestId,
    data: body.data,
    atleta: { nome: texto(atleta.nome, 'o nome do atleta', 80), nascimento: atleta.nascimento, peso },
    resultados,
  };
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
      const envio = validarEnvio(body);
      const card = await cardAtleta(atletaId);

      const anteriores = await historico(card);
      const repetido = anteriores.find(r => r.requestId === envio.requestId);
      if (repetido) return repetido;

      const registro = {
        kind: 'avaliacao-forca', ...envio,
        author: usuario, createdAt: new Date().toISOString(),
      };
      const criada = await api(`/list/${IDS.athletes}/task`, 'POST', {
        name: `${PREFIXO}${registro.data}`, parent: atletaId,
        markdown_content: empacotar(registro), notify_all: false,
      });
      const confirmada = desempacotar(await api(`/task/${criada.id}?include_markdown_description=true`));
      if (confirmada?.requestId !== registro.requestId) {
        throw new PublicError('Não foi possível confirmar a avaliação salva. Atualize antes de tentar de novo.', 503);
      }

      let anexo = null;
      if (body.arquivoBase64 && upload) {
        const bytes = Buffer.from(String(body.arquivoBase64), 'base64');
        if (bytes.length > 3_000_000) throw new PublicError('O Excel excede o tamanho aceito para anexo.');
        const nome = String(body.arquivoNome || 'avaliacao-forca.xlsx').replace(/[^\w.\- ]/g, '_').slice(0, 80);
        anexo = await upload(criada.id, nome, bytes);
      }

      return { ...confirmada, id: criada.id, anexo: Boolean(anexo) };
    },
  };
}
