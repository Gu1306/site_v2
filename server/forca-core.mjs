// GERADO por scripts/sync-forca-core.mjs. Não editar. Fonte SHA256: 3b402591eb637799337836d122c05e4d676d27e6e8716406321dae4e41192957
/**
 * Leitura do Excel exportado pelo app FightTech (dinamômetro QUELINGSPORT DC01)
 * e cálculo dos resultados conforme o protocolo 1 da CareFit — o "01 / MANUAL CLÍNICO".
 *
 * Regras que vêm do manual e não podem ser alteradas aqui sem decisão técnica:
 *   - resultado principal = média dos 3 picos (p. 10); maior pico é secundário (p. 11)
 *   - índice de simetria = membro mais fraco ÷ mais forte × 100; assimetria = 100 − simetria (p. 13)
 *   - as três tentativas são sempre preservadas, inclusive a mais baixa (p. 9 e 21)
 *   - `Mean force` do app NÃO é a média dos picos e nunca substitui o cálculo (p. 12)
 *
 * Armadilhas do export, todas verificadas no arquivo real:
 *   - todas as colunas numéricas chegam como TEXTO, menos `Time to peak force(ms)`
 *   - data, nome, exercício e lado só aparecem na primeira linha de cada bloco
 *   - não existe coluna com o número da tentativa: a ordem das linhas é a única fonte
 */
/**
 * Variação máxima aceita entre as três tentativas de um mesmo lado.
 * Decisão de 12/09/2026: começa em 15%. Acima disso o relatório sinaliza,
 * porque costuma ser falha de execução ou de fixação, não diferença de força.
 */
export const CV_MAXIMO = 15;
/**
 * Os sete testes do protocolo. Os nomes confirmados pelo Gustavo em 12/09/2026, lidos
 * direto do FightTech, vêm primeiro; os demais sinônimos cobrem variações e o inglês.
 * A normalização remove acentos e troca os travessões do app por espaço, então
 * "Flexão Plantar Isométrica – Joelho Estendido — Unilateral" chega aqui achatado.
 */
export const MOVIMENTOS = [
    { chave: 'flexao-quadril', nome: 'Flexão de quadril', sinonimos: ['flexao isometrica do quadril unilateral', 'flexao isometrica do quadril', 'flexao de quadril', 'flexao do quadril', 'hip flexion'] },
    { chave: 'extensao-quadril', nome: 'Extensão de quadril', sinonimos: ['extensao isometrica do quadril unilateral', 'extensao isometrica do quadril', 'extensao de quadril', 'extensao do quadril', 'hip extension'] },
    { chave: 'abducao-quadril', nome: 'Abdução de quadril', sinonimos: ['abducao isometrica do quadril unilateral', 'abducao isometrica do quadril', 'abducao de quadril', 'abducao do quadril', 'hip abduction'] },
    { chave: 'aducao-quadril', nome: 'Adução de quadril', sinonimos: ['aducao isometrica do quadril unilateral', 'aducao isometrica do quadril', 'aducao de quadril', 'aducao do quadril', 'hip adduction'] },
    { chave: 'extensao-joelho', nome: 'Extensão de joelho', sinonimos: ['extensao isometrica do joelho unilateral', 'extensao isometrica do joelho', 'extensao de joelho', 'extensao do joelho', 'knee extension'] },
    { chave: 'flexao-joelho', nome: 'Flexão de joelho', sinonimos: ['flexao isometrica do joelho unilateral', 'flexao isometrica do joelho', 'flexao de joelho', 'flexao do joelho', 'knee flexion'] },
    { chave: 'flexao-plantar', nome: 'Flexão plantar', sinonimos: ['flexao plantar isometrica joelho estendido unilateral', 'flexao plantar isometrica joelho estendido', 'flexao plantar isometrica', 'flexao plantar', 'panturrilha', 'plantar flexion'] },
];
export const faixaAssimetria = (valor) => valor === null ? null : valor <= 10 ? 'baixa' : valor <= 20 ? 'media' : 'alta';
const semAcento = (valor) => String(valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[‐-―-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
/** O export traz "27.65" como texto. Aceita vírgula porque o app é localizado. */
export const numero = (valor) => {
    if (typeof valor === 'number')
        return Number.isFinite(valor) ? valor : null;
    if (typeof valor !== 'string')
        return null;
    const texto = String(valor ?? '').trim().replace(',', '.');
    if (!texto || !/^-?\d+(\.\d+)?$/.test(texto))
        return null;
    const n = Number(texto);
    return Number.isFinite(n) ? n : null;
};
export const reconhecerMovimento = (nome) => {
    const alvo = semAcento(nome);
    if (!alvo)
        return null;
    for (const movimento of MOVIMENTOS) {
        if (movimento.sinonimos.some(sinonimo => alvo === sinonimo))
            return movimento.chave;
    }
    return null;
};
const lerLado = (valor) => {
    const texto = semAcento(valor);
    if (texto === 'l' || texto === 'e' || texto === 'left' || texto === 'esquerdo')
        return 'E';
    if (texto === 'r' || texto === 'd' || texto === 'right' || texto === 'direito')
        return 'D';
    return null;
};
const COLUNAS = { data: 0, atleta: 1, exercicio: 2, lado: 3, pico: 4 };
export const dataValida = (valor) => {
    if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor))
        return false;
    const d = new Date(`${valor}T12:00:00Z`);
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === valor;
};
export const normalizarNome = (valor) => semAcento(valor).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
/** Correspondência conservadora; abreviações precisam de associação registrada. */
export const nomesCombinam = (a, b) => {
    const x = normalizarNome(a);
    const y = normalizarNome(b);
    return x.length >= 3 && x === y;
};
/** Fronteira comum do servidor e da VPS: só picos e chaves entram no cálculo. */
export function recalcularResultados(resultados, atleta, data) {
    if (!Array.isArray(resultados) || resultados.length < 1 || resultados.length > 7)
        throw new Error('A avaliação precisa ter de 1 a 7 movimentos.');
    if (!dataValida(data) || !dataValida(atleta.nascimento))
        throw new Error('Data da avaliação ou nascimento inválida.');
    if (!Number.isFinite(atleta.peso) || atleta.peso < 25 || atleta.peso > 250)
        throw new Error('Peso deve ficar entre 25 e 250 kg.');
    const idade = calcularIdade(atleta.nascimento, new Date(`${data}T12:00:00`));
    if (idade === null)
        throw new Error('Nascimento incompatível com a data da avaliação.');
    const chaves = new Set();
    const tentativas = [];
    for (const r of resultados) {
        const movimento = MOVIMENTOS.find(m => m.chave === r?.chave);
        if (!movimento || chaves.has(r.chave))
            throw new Error('Movimento desconhecido ou repetido.');
        chaves.add(r.chave);
        if (!r.esquerdo && !r.direito)
            throw new Error('Movimento sem resultado.');
        for (const lado of ['E', 'D']) {
            const valor = lado === 'E' ? r.esquerdo : r.direito;
            if (valor === null || valor === undefined)
                continue;
            if (!Array.isArray(valor.picos) || valor.picos.some(p => typeof p !== 'number' || !Number.isFinite(p) || p <= 0 || p > 500))
                throw new Error('Há picos de força fora da faixa aceitável.');
            if (valor.picos.length !== 3)
                throw new Error('Cada lado medido precisa de três tentativas válidas.');
            valor.picos.forEach((pico, i) => tentativas.push({ exercicioBruto: movimento.nome, chave: movimento.chave, lado, ordem: i + 1, pico, data, atletaNoApp: atleta.nome, linha: tentativas.length + 2 }));
        }
    }
    return calcularAvaliacao({ tentativas, problemas: [], naoReconhecidos: [], atletaNoApp: atleta.nome, datas: [data] }, atleta, new Date(`${data}T12:00:00`));
}
/**
 * Lê as linhas cruas da aba `All`. Repete data, nome, exercício e lado para baixo,
 * porque o app só preenche a primeira linha de cada bloco de tentativas.
 */
export function lerExportFightTech(linhas) {
    const tentativas = [];
    const problemas = [];
    const naoReconhecidos = new Set();
    const datas = new Set();
    const nomes = new Set();
    let data = '';
    let atleta = '';
    let exercicio = '';
    let lado = null;
    let ordem = 0;
    const cabecalho = linhas[0] ?? [];
    if (semAcento(cabecalho[COLUNAS.exercicio]) !== 'exercise' || semAcento(cabecalho[COLUNAS.lado]) !== 'l/r' || semAcento(cabecalho[COLUNAS.pico]) !== 'peak force(kg)') {
        problemas.push('Este arquivo não parece ser o export do FightTech. Esperado o cabeçalho com as colunas “Exercise”, “L/R” e “Peak force(KG)”.');
        return { tentativas, problemas, naoReconhecidos: [], atletaNoApp: '', datas: [] };
    }
    for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i] ?? [];
        // Uma separação vazia encerra o contexto: não adivinhar o próximo bloco.
        if (linha.every(v => v === null || v === undefined || String(v).trim() === '')) {
            data = '';
            atleta = '';
            exercicio = '';
            lado = null;
            ordem = 0;
            continue;
        }
        const dataCelula = String(linha[COLUNAS.data] ?? '').trim();
        const atletaCelula = String(linha[COLUNAS.atleta] ?? '').trim();
        const exercicioCelula = String(linha[COLUNAS.exercicio] ?? '').trim();
        const ladoCelula = lerLado(linha[COLUNAS.lado]);
        const ladoPreenchido = String(linha[COLUNAS.lado] ?? '').trim() !== '';
        // Identidade/data nova não herda exercício; exercício novo não herda lado.
        const novaSessao = (dataCelula && dataCelula !== data) || (atletaCelula && atletaCelula !== atleta);
        if (novaSessao) {
            exercicio = '';
            lado = null;
            ordem = 0;
        }
        if (exercicioCelula && exercicioCelula !== exercicio) {
            lado = null;
            ordem = 0;
        }
        if (dataCelula)
            data = dataCelula;
        if (atletaCelula)
            atleta = atletaCelula;
        if (exercicioCelula)
            exercicio = exercicioCelula;
        if (ladoPreenchido) {
            lado = ladoCelula;
            ordem = 0;
        }
        if (data)
            datas.add(data.slice(0, 10));
        if (atleta)
            nomes.add(atleta);
        const pico = numero(linha[COLUNAS.pico]);
        if (pico === null || pico <= 0 || pico > 500) {
            problemas.push(`Linha ${i + 1}: pico ausente, ilegível ou fora da faixa (0 a 500 kg). Corrija o export.`);
            continue;
        }
        if (!lado) {
            problemas.push(`Linha ${i + 1}: não foi possível saber se a tentativa é do lado direito ou esquerdo.`);
            continue;
        }
        if (!exercicio) {
            problemas.push(`Linha ${i + 1}: tentativa sem nome de exercício.`);
            continue;
        }
        if (!atleta || !dataValida(data.slice(0, 10))) {
            problemas.push(`Linha ${i + 1}: identificação ou data ausente/inválida.`);
            continue;
        }
        const chave = reconhecerMovimento(exercicio);
        if (!chave)
            naoReconhecidos.add(exercicio);
        ordem += 1;
        tentativas.push({ exercicioBruto: exercicio, chave, lado, ordem, pico, data, atletaNoApp: atleta, linha: i + 1 });
    }
    if (!tentativas.length)
        problemas.push('Nenhuma tentativa foi encontrada no arquivo.');
    if (datas.size > 1)
        problemas.push(`O arquivo tem tentativas de ${datas.size} datas diferentes (${[...datas].join(', ')}). O protocolo compara lados medidos na mesma sessão.`);
    if (nomes.size > 1)
        problemas.push(`O arquivo tem ${nomes.size} nomes diferentes (${[...nomes].join(', ')}). Exporte um atleta por vez.`);
    return { tentativas, problemas, naoReconhecidos: [...naoReconhecidos], atletaNoApp: [...nomes][0] ?? '', datas: [...datas] };
}
const media = (valores) => valores.reduce((soma, v) => soma + v, 0) / valores.length;
const coeficienteVariacao = (valores) => {
    if (valores.length < 2)
        return 0;
    const m = media(valores);
    if (!m)
        return 0;
    const variancia = valores.reduce((soma, v) => soma + (v - m) ** 2, 0) / (valores.length - 1);
    return (Math.sqrt(variancia) / m) * 100;
};
function resumirLado(picos) {
    return {
        picos,
        media: media(picos),
        maior: Math.max(...picos),
        cv: coeficienteVariacao(picos),
        // Sinaliza o efeito de aprendizagem: o manual mantém as 3 tentativas, então o
        // relatório mostra a tendência em vez de escondê-la dentro da média.
        crescente: picos.length >= 3 && picos.every((p, i) => i === 0 || p > picos[i - 1]),
    };
}
/** Pares agonista/antagonista. `comparavel` diz se a razão é lida sem ressalva. */
const PARES = [
    {
        titulo: 'Joelho — flexores / extensores', a: 'flexao-joelho', b: 'extensao-joelho', comparavel: true,
    },
    {
        titulo: 'Quadril — abdutores / adutores', a: 'abducao-quadril', b: 'aducao-quadril', comparavel: true,
    },
    {
        titulo: 'Quadril — flexores / extensores', a: 'flexao-quadril', b: 'extensao-quadril', comparavel: false,
        nota: 'Os dois testes são feitos em posições e ângulos diferentes, então esta razão não é comparável com valores de outros protocolos. Serve para acompanhar o próprio atleta ao longo do tempo.',
    },
];
export const calcularIdade = (nascimento, referencia = new Date()) => {
    if (!dataValida(nascimento))
        return null;
    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(nascimento);
    if (!partes)
        return null;
    const nasc = new Date(`${nascimento}T12:00:00`);
    if (Number.isNaN(nasc.getTime()))
        return null;
    let idade = referencia.getFullYear() - nasc.getFullYear();
    const mes = referencia.getMonth() - nasc.getMonth();
    if (mes < 0 || (mes === 0 && referencia.getDate() < nasc.getDate()))
        idade -= 1;
    return idade >= 0 && idade < 120 ? idade : null;
};
export function calcularAvaliacao(leitura, atleta, hoje = new Date()) {
    const problemas = [...leitura.problemas];
    const movimentos = [];
    for (const definicao of MOVIMENTOS) {
        const doMovimento = leitura.tentativas.filter(t => t.chave === definicao.chave);
        if (!doMovimento.length)
            continue;
        const alertas = [];
        const porLado = (lado) => {
            const picos = doMovimento.filter(t => t.lado === lado).sort((a, b) => a.linha - b.linha).map(t => t.pico);
            if (!picos.length)
                return null;
            const nome = lado === 'E' ? 'esquerdo' : 'direito';
            if (picos.length !== 3)
                alertas.push(`Lado ${nome}: ${picos.length} tentativa(s) em vez de 3. O protocolo pede três tentativas válidas.`);
            return resumirLado(picos);
        };
        const esquerdo = porLado('E');
        const direito = porLado('D');
        if (!esquerdo || !direito)
            alertas.push('Só um dos lados foi medido; não é possível calcular assimetria.');
        for (const [resultado, nome] of [[esquerdo, 'esquerdo'], [direito, 'direito']]) {
            if (!resultado)
                continue;
            if (resultado.cv > CV_MAXIMO)
                alertas.push(`Lado ${nome}: variação de ${resultado.cv.toFixed(1)}% entre as tentativas, acima do limite operacional de ${CV_MAXIMO}%. Confira a execução e a fixação.`);
            if (resultado.crescente)
                alertas.push(`Lado ${nome}: os três picos subiram do primeiro ao último. O padrão pode estar relacionado à familiarização; não confirma sua causa.`);
        }
        let simetria = null;
        let assimetria = null;
        let ladoMenor = null;
        if (esquerdo && direito) {
            const menor = Math.min(esquerdo.media, direito.media);
            const maior = Math.max(esquerdo.media, direito.media);
            simetria = maior > 0 ? (menor / maior) * 100 : null;
            assimetria = simetria === null ? null : 100 - simetria;
            ladoMenor = esquerdo.media === direito.media ? null : esquerdo.media < direito.media ? 'E' : 'D';
        }
        const relativa = (resultado) => resultado && atleta.peso > 0 ? resultado.media / atleta.peso : null;
        movimentos.push({
            chave: definicao.chave, nome: definicao.nome, esquerdo, direito,
            simetria, assimetria, ladoMenor,
            relativaEsquerdo: relativa(esquerdo), relativaDireito: relativa(direito),
            alertas,
        });
    }
    const razoes = [];
    for (const par of PARES) {
        const a = movimentos.find(m => m.chave === par.a);
        const b = movimentos.find(m => m.chave === par.b);
        if (!a || !b)
            continue;
        for (const lado of ['E', 'D']) {
            const campo = lado === 'E' ? 'esquerdo' : 'direito';
            const forcaA = a[campo]?.media;
            const forcaB = b[campo]?.media;
            if (!forcaA || !forcaB)
                continue;
            razoes.push({
                titulo: par.titulo, lado, valor: (forcaA / forcaB) * 100,
                detalhe: `${forcaA.toFixed(1).replace('.', ',')} kg / ${forcaB.toFixed(1).replace('.', ',')} kg`,
                comparavel: par.comparavel, nota: par.nota,
            });
        }
    }
    const faltando = MOVIMENTOS.filter(m => !movimentos.some(r => r.chave === m.chave));
    if (faltando.length && movimentos.length) {
        problemas.push(`Movimento(s) sem resultado nesta avaliação: ${faltando.map(m => m.nome).join(', ')}.`);
    }
    return {
        atleta,
        idade: calcularIdade(atleta.nascimento, hoje),
        data: leitura.datas[0] ?? '',
        movimentos, razoes, problemas,
    };
}
