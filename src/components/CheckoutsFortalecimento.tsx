import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, CircleAlert, Clock, RefreshCw, Send } from 'lucide-react';

// Check-out pós-aula dentro do painel do treinador.
// Antes, depois de registrar a evolução, a aula sumia do painel e o resto do ciclo só existia
// no ClickUp (dois checkboxes e um campo de texto). Aqui o treinador vê as aulas de hoje e de
// ontem, lê o rascunho que o robô escreveu, ajusta se quiser e autoriza o envio.
// Quem envia continua sendo o robô do n8n, com todas as travas dele.

type Estado = 'sem-evolucao' | 'sem-pedido' | 'gerando' | 'parado' | 'reprovado' | 'pronto' | 'fila' | 'enviado' | 'bloqueado';
type Item = { id: string; name: string; day: string; slot: string | null; state: Estado; reason: string; sentAt: string | null; evolution: string; text: string };
type Pendente = { id: string; name: string; day: string; slot: string | null };
type Lista = { today: string; yesterday?: string; items: Item[]; pending?: Pendente[]; syncedAt: string };

const MAXIMO = 1300;
const ROTULO: Record<Estado, string> = {
  'sem-evolucao': 'Sem evolução', 'sem-pedido': 'Mensagem não pedida', gerando: 'Robô escrevendo', parado: 'Não foi gerada',
  reprovado: 'Rascunho reprovado', pronto: 'Pronta para revisar', fila: 'Na fila de envio', enviado: 'Enviada', bloqueado: 'Envio barrado',
};
const nomeDe = (item: Item) => item.name.replace(/\s*—\s*Aula.*$/i, '');
const hora = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

async function chamar<T>(rota: string, dados?: unknown): Promise<T> {
  const resposta = await fetch('/api/fortalecimento/' + rota, {
    method: dados === undefined ? 'GET' : 'POST', credentials: 'same-origin',
    headers: dados === undefined ? {} : { 'Content-Type': 'application/json' },
    body: dados === undefined ? undefined : JSON.stringify(dados), signal: AbortSignal.timeout(120000),
  });
  const json = await resposta.json();
  if (!resposta.ok) throw new Error(json.error || 'Não foi possível carregar os check-outs.');
  return json;
}

const diaCurto = (iso: string) => new Date(iso + 'T12:00:00-03:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });

export default function CheckoutsFortalecimento({ versao, aoAbrirAula }: { versao: number; aoAbrirAula: (dia: string, turma: string | null) => void }) {
  const [lista, setLista] = useState<Lista | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [ocupado, setOcupado] = useState('');
  // Texto em edição por aula: o que o treinador digitou não pode ser trocado por uma releitura.
  const [textos, setTextos] = useState<Record<string, string>>({});
  const [evolucoes, setEvolucoes] = useState<Record<string, string>>({});
  const [reescrevendo, setReescrevendo] = useState<Record<string, boolean>>({});
  const sequencia = useRef(0);

  const carregar = useCallback(async () => {
    const minha = ++sequencia.current; setCarregando(true);
    try { const r = await chamar<Lista>('checkouts'); if (minha === sequencia.current) { setLista(r); setErro(''); } }
    catch (e) { if (minha === sequencia.current) setErro(e instanceof Error ? e.message : 'Falha na conexão.'); }
    finally { if (minha === sequencia.current) setCarregando(false); }
  }, []);

  useEffect(() => { void carregar(); }, [carregar, versao]);
  // Enquanto o robô está escrevendo ou enviando, relê sozinho a cada minuto.
  const esperando = Boolean(lista?.items.some(i => i.state === 'gerando' || i.state === 'fila'));
  useEffect(() => {
    if (!esperando) return;
    const relogio = setInterval(() => { if (!document.hidden && !ocupado) void carregar(); }, 60000);
    return () => clearInterval(relogio);
  }, [esperando, ocupado, carregar]);

  async function agir(item: Item, rota: 'checkout-generate' | 'checkout-send', dados: Record<string, string>) {
    setOcupado(item.id); setErro('');
    try {
      await chamar(`classes/${item.id}/${rota}`, { ...dados, requestId: crypto.randomUUID() });
      setTextos(({ [item.id]: _, ...resto }) => resto);
      setEvolucoes(({ [item.id]: _, ...resto }) => resto);
      setReescrevendo(({ [item.id]: _, ...resto }) => resto);
      await carregar();
    } catch (e) { setErro(e instanceof Error ? e.message : 'Falha na conexão.'); }
    finally { setOcupado(''); }
  }

  const itens = lista?.items || [];
  const pendentes = itens.filter(i => i.state !== 'enviado').length;
  const semEvolucao = lista?.pending || [];

  return (
    <section className="cf-checkouts" aria-labelledby="cf-checkouts-titulo">
      <header>
        <div>
          <p className="cf-eyebrow">DEPOIS DA AULA</p>
          <h2 id="cf-checkouts-titulo">Mensagem para o atleta</h2>
          <p>
            Aulas concluídas hoje e ontem. O robô escreve a mensagem a partir da evolução; você lê, ajusta se quiser e
            manda. {lista && (pendentes ? `${pendentes} para resolver.` : itens.length ? 'Tudo enviado.' : '')}
          </p>
        </div>
        <Button variant="ghost" size="sm" disabled={carregando} onClick={() => void carregar()}>
          <RefreshCw size={14} /> {carregando ? 'Atualizando…' : 'Atualizar'}
        </Button>
      </header>
      {erro && <div className="cf-alert" role="alert">{erro}</div>}
      {semEvolucao.length > 0 && (
        <div className="cf-checkout-pendentes">
          <h3>{semEvolucao.length === 1 ? '1 aula já aconteceu e está sem evolução' : `${semEvolucao.length} aulas já aconteceram e estão sem evolução`}</h3>
          <p>Sem a evolução a aula não é concluída e o atleta não recebe mensagem. A mensagem só sai se a evolução for registrada no dia da aula ou no dia seguinte.</p>
          <ul>
            {semEvolucao.map(p => {
              const noPrazo = p.day === lista!.today || p.day === lista!.yesterday;
              return (
                <li key={p.id}>
                  <span><strong>{p.name.replace(/\s*—\s*Aula.*$/i, '')}</strong> · {diaCurto(p.day)}{p.slot ? ` · ${p.slot}h` : ''}{noPrazo ? '' : ' · mensagem fora do prazo'}</span>
                  <Button variant="outline" size="sm" onClick={() => aoAbrirAula(p.day, p.slot)}>Registrar evolução</Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {!lista && !erro && <p className="cf-checkout-vazio">Carregando…</p>}
      {lista && itens.length === 0 && <p className="cf-checkout-vazio">Nenhuma aula concluída hoje nem ontem.</p>}
      <div className="cf-checkout-lista">
        {itens.map(item => {
          const texto = textos[item.id] ?? item.text;
          const evolucao = evolucoes[item.id] ?? item.evolution;
          const pedeEvolucao = ['sem-evolucao', 'sem-pedido', 'parado', 'reprovado'].includes(item.state) || (item.state === 'pronto' && reescrevendo[item.id]);
          const travado = ocupado === item.id;
          return (
            <article key={item.id} className={'cf-checkout cf-checkout-' + item.state}>
              <div className="cf-checkout-topo">
                <div>
                  <h3>{nomeDe(item)}</h3>
                  <p>{item.day === lista!.today ? 'Hoje' : 'Ontem'}{item.slot ? ` · turma das ${item.slot}h` : ''}</p>
                </div>
                <span className="cf-checkout-selo">
                  {item.state === 'enviado' ? <Check size={14} /> : item.state === 'gerando' || item.state === 'fila' ? <Clock size={14} /> : item.state === 'pronto' ? <Send size={14} /> : <CircleAlert size={14} />}
                  {ROTULO[item.state]}{item.state === 'enviado' && item.sentAt ? ` às ${hora(item.sentAt)}` : ''}
                </span>
              </div>

              {item.state === 'gerando' && <p className="cf-checkout-nota">O robô passa a cada 10 minutos. Esta tela atualiza sozinha.</p>}
              {item.state === 'fila' && <p className="cf-checkout-nota">Autorizada. O robô envia no WhatsApp do atleta em até 10 minutos.</p>}
              {item.state === 'parado' && <p className="cf-checkout-nota">Já passou do tempo e a mensagem não veio. Quase sempre é porque a evolução não conta o que foi feito na aula. Reescreva com os exercícios e como o atleta foi.</p>}
              {item.state === 'sem-evolucao' && <p className="cf-checkout-nota">Esta aula foi concluída sem evolução. Escreva como foi para o robô montar a mensagem.</p>}
              {(item.state === 'reprovado' || item.state === 'bloqueado') && item.reason && <p className="cf-checkout-motivo">{item.reason}</p>}
              {item.state === 'bloqueado' && <p className="cf-checkout-nota">O robô não tenta de novo sozinho. Fale com o Gustavo.</p>}

              {['pronto', 'fila', 'enviado', 'bloqueado'].includes(item.state) && !reescrevendo[item.id] && (
                <label className="cf-checkout-campo">
                  {item.state === 'pronto' ? 'Mensagem (pode ajustar antes de enviar)' : 'Mensagem'}
                  <Textarea rows={8} maxLength={MAXIMO} readOnly={item.state !== 'pronto' || travado} value={texto} onChange={e => setTextos({ ...textos, [item.id]: e.target.value })} />
                  {item.state === 'pronto' && <small>{texto.length} de {MAXIMO} caracteres</small>}
                </label>
              )}

              {pedeEvolucao && (
                <label className="cf-checkout-campo">
                  Evolução da aula
                  <Textarea rows={5} maxLength={5000} disabled={travado} value={evolucao} onChange={e => setEvolucoes({ ...evolucoes, [item.id]: e.target.value })} placeholder="Exercícios feitos, cargas, como o atleta foi e o que fica para a próxima aula…" />
                </label>
              )}

              <div className="cf-checkout-acoes">
                {item.state === 'pronto' && !reescrevendo[item.id] && (
                  <>
                    <Button className="cf-primary" disabled={travado || !texto.trim()} onClick={() => { if (window.confirm(`Enviar esta mensagem no WhatsApp de ${nomeDe(item)}?`)) void agir(item, 'checkout-send', { text: texto }); }}>
                      <Send size={16} /> {travado ? 'Autorizando…' : 'Enviar no WhatsApp'}
                    </Button>
                    <Button variant="ghost" disabled={travado} onClick={() => setReescrevendo({ ...reescrevendo, [item.id]: true })}>Pedir outra mensagem</Button>
                  </>
                )}
                {pedeEvolucao && (
                  <>
                    <Button className="cf-primary" disabled={travado || !evolucao.trim() || (item.state === 'parado' || item.state === 'reprovado' || item.state === 'pronto') && evolucao.trim() === item.evolution.trim()} onClick={() => void agir(item, 'checkout-generate', { evolution: evolucao })}>
                      {travado ? 'Pedindo…' : item.state === 'sem-evolucao' || item.state === 'sem-pedido' ? 'Gerar mensagem' : 'Gerar de novo'}
                    </Button>
                    {item.state === 'pronto' && <Button variant="ghost" disabled={travado} onClick={() => setReescrevendo(({ [item.id]: _, ...resto }) => resto)}>Voltar para a mensagem</Button>}
                  </>
                )}
              </div>
              {pedeEvolucao && (item.state === 'parado' || item.state === 'reprovado' || item.state === 'pronto') && evolucao.trim() === item.evolution.trim() && (
                <p className="cf-checkout-nota">Mude o texto da evolução para o robô escrever de novo.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
