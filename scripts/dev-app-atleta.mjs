// Servidor local para VER o app do atleta sem tocar em produção.
//
//   npm run build && node scripts/dev-app-atleta.mjs      → http://localhost:8091/app
//
// O login, o saldo, a reserva e o cancelamento são de mentira (ficam na memória deste
// processo): nenhum WhatsApp sai, nada é gravado na planilha nem no ClickUp. O código de
// acesso é sempre 123456. Só o calendário é real — ele lê as turmas direto da agenda
// pública, que é somente leitura.
import { createServer } from '../server/index.mjs';
import { PublicError } from '../server/fortalecimento.mjs';
import { validarAnotacao, textoDoComentario, lerAnotacao } from '../server/app-atleta.mjs';

const PORTA = Number(process.env.PORT || 8091);
const token = n => String(n).repeat(32).slice(0, 32);
let reservas = [
  { modalidade: 'fortalecimento', aulaId: '2026-11-27T07:00', data: '2026-11-27', horaInicio: '07:00', quando: 'sexta-feira, 27/11, às 07h00', token: token('a') },
  { modalidade: 'yoga', aulaId: '2026-12-01T06:00', data: '2026-12-01', horaInicio: '06:00', quando: 'terça-feira, 01/12, às 06h00', token: token('b') },
];
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const quandoDe = aulaId => {
  const [ano, mes, dia] = aulaId.slice(0, 10).split('-').map(Number);
  return `${DIAS[new Date(ano, mes - 1, dia).getDay()]}, ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}, às ${aulaId.slice(11, 13)}h${aulaId.slice(14)}`;
};
const achar = (m, t) => reservas.find(r => r.modalidade === m && r.token === t);

const app = {
  async pedirCodigo(telefone) { if (String(telefone || '').replace(/\D/g, '').length < 10) throw new PublicError('Coloque o seu WhatsApp com DDD.'); return { ok: true }; },
  async confirmarCodigo(telefone, codigo) { if (codigo !== '123456') throw new PublicError('Código inválido ou vencido. Peça um novo.', 401); return { atletaId: 'dev', tel8: '00000000' }; },
  async inicio(sessao) {
    if (!sessao) throw new PublicError('Entre com o seu WhatsApp para continuar.', 401);
    return { primeiroNome: 'Ana', fisio: 'Lais', fortalecimento: { temPacote: true, disponiveis: 14, agendadas: reservas.filter(r => r.modalidade === 'fortalecimento').length, feitas: 9, usadas: [{ data: '2026-11-23', faltou: false }, { data: '2026-11-18', faltou: true }, { data: '2026-11-16', faltou: false }, { data: '2026-11-09', faltou: false }], plano: '24 aulas', validade: '2027-01-30' }, planos: [{ plano: 'Semestral', total: 12, feitas: 4, restam: 8, validade: '2027-03-12', datas: ['2026-11-12', '2026-10-29', '2026-10-15', '2026-09-30'], usadas: [{ data: '2026-11-12', texto: 'Oi, Ana! Na sessão de hoje trabalhamos a liberação da panturrilha. Como você está se sentindo?' }, { data: '2026-10-29', cedidaPara: 'Ana Júlia' }, { data: '2026-10-15', texto: 'Oi, Ana! Na sessão de hoje fizemos mobilidade de quadril e liberação de glúteo. Qualquer desconforto, me avise.' }, { data: '2026-09-30' }],mensagens: [{ data: '2026-11-12', texto: 'Oi, Ana! Tudo bem?\n\nNa sessão de hoje trabalhamos a liberação da panturrilha e do posterior de coxa, com botas de compressão no final.\n\nPara os próximos dias: mantenha a hidratação e faça o alongamento de panturrilha que combinamos, depois dos treinos.\n\nComo você está se sentindo depois da sessão?' }, { data: '2026-10-15', texto: 'Oi, Ana! Na sessão de hoje fizemos mobilidade de quadril e liberação de glúteo. Qualquer desconforto, me avise.' }] }, { plano: 'Reabilitação', total: 8, feitas: 7, restam: 1, validade: '2026-11-22' }], reservas: [...reservas].sort((a, b) => a.aulaId.localeCompare(b.aulaId)), avisos: [] };
  },
  async reservar(sessao, entrada) {
    if (!sessao) throw new PublicError('Entre com o seu WhatsApp para continuar.', 401);
    const nova = { modalidade: entrada.modalidade, aulaId: entrada.aulaId, data: entrada.aulaId.slice(0, 10), horaInicio: entrada.aulaId.slice(11), quando: quandoDe(entrada.aulaId), token: token(reservas.length + 3) };
    reservas.push(nova);
    return { ...nova, inicioISO: '', fimISO: '', email: 'ana@email.com', nome: 'Ana Souza' };
  },
  async detalhe(modalidade, t) {
    const r = achar(modalidade, t);
    if (!r) throw new PublicError('Não achei essa reserva. O link pode ser antigo.', 409);
    return { modalidade, aulaId: r.aulaId, quando: r.quando, cancelada: false, passada: false, primeiroNome: 'Ana' };
  },
  async cancelar(modalidade, t) {
    const r = achar(modalidade, t);
    if (!r) throw new PublicError('Não achei essa reserva. O link pode ser antigo.', 409);
    reservas = reservas.filter(x => x !== r);
    return { ok: true, jaCancelada: false, quando: r.quando, aulaId: r.aulaId, credito: null };
  },
  // Diário: os "comentários" ficam na memória, no mesmo formato que vai para o ClickUp.
  async diario(sessao) {
    if (!sessao) throw new PublicError('Entre com o seu WhatsApp para continuar.', 401);
    return { anotacoes: comentarios.map((c, i) => ({ id: 'c' + i, ...lerAnotacao(c), registradoEm: null })).sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora)) };
  },
  async anotar(sessao, entrada) {
    if (!sessao) throw new PublicError('Entre com o seu WhatsApp para continuar.', 401);
    const texto = textoDoComentario(validarAnotacao(entrada, new Date(Date.now() - 3 * 3600000).toISOString().slice(0, 10)), 'agora');
    comentarios.unshift(texto);
    console.log('\n--- comentário que iria para o ClickUp ---\n' + texto);
    return { ok: true };
  },
};
const comentarios = [
  textoDoComentario({ data: '2026-11-24', hora: '06:40', momento: 'Ao acordar', intensidade: 4, texto: 'Acordei com a lombar travada, lado direito. Melhorou depois do banho.' }, '24/11/2026 06:45'),
  textoDoComentario({ data: '2026-11-22', hora: '', momento: 'Depois do treino', intensidade: null, texto: 'Canela bem melhor! Fiz 12 km sem sentir nada.' }, '22/11/2026 10:02'),
];

const env = { PORTAL_ORIGIN: `http://localhost:${PORTA}`, PORTAL_SESSION_SECRET: 'dev-'.repeat(12), CLICKUP_API_TOKEN: 'dev' };
createServer(env, {}, {}, {}, {}, {}, app).listen(PORTA, '127.0.0.1', () => {
  console.log(`App do atleta (dados falsos): http://localhost:${PORTA}/app  ·  código 123456`);
  console.log(`Link de cancelamento de exemplo: http://localhost:${PORTA}/cancelar-aula?m=yoga&t=${token('b')}`);
});
