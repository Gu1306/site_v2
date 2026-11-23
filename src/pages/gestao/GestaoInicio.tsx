import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Calculator, CalendarDays, Dumbbell, Gauge, ListChecks, Megaphone, Users } from 'lucide-react';
import { Carregando, TelaLogin, Topo, useSessaoGestao } from './acesso';
import fotoEspaco from '@/assets/espaco-1.jpg';

// Espaço da equipe: uma porta só, e cada área é um cartão. Área nova = cartão novo aqui
// e linha nova em AREAS (acesso.tsx). `breve` = ainda não existe; aparece tracejado.
const MODULOS = [
  { chave: 'financeiro', para: '/gestao/financeiro', icone: BarChart3, rotulo: 'GESTÃO', titulo: 'Financeiro', texto: 'Fechamento semanal: sessões por profissional e por tipo, fortalecimento, yoga e produção da semana.', acao: 'ABRIR FECHAMENTO', cor: 'destaque', soFinanceiro: true },
  { chave: 'campanha', para: '/gestao/campanha', icone: Calculator, rotulo: 'MARKETING', titulo: 'Campanha', texto: 'Calculadora de tráfego pago: quanto custa cada sessão comparecida e se a verba volta, com quem continuou de verdade no ClickUp.', acao: 'ABRIR CALCULADORA', cor: 'verde', soFinanceiro: true },
  { chave: 'fortalecimento', para: '/painel-fortalecimento', icone: Dumbbell, rotulo: 'OPERAÇÃO', titulo: 'Fortalecimento', texto: 'Aulas do dia, treino de cada atleta e registro da evolução, direto no ClickUp.', acao: 'ABRIR PAINEL', externa: true },
  { chave: 'forca', para: '/painel-avaliacao-forca', icone: Gauge, rotulo: 'ATLETAS', titulo: 'Avaliação de força', texto: 'Excel do dinamômetro vira relatório e fica salvo no card do atleta.', acao: 'ABRIR AVALIAÇÃO', externa: true },
  { chave: 'tarefas', icone: ListChecks, rotulo: 'EM BREVE', titulo: 'Tarefas', texto: 'A semana da equipe em colunas, lida do ClickUp.', breve: true },
  { chave: 'agenda', icone: CalendarDays, rotulo: 'EM BREVE', titulo: 'Agenda', texto: 'As agendas dos fisios, da turma e da yoga num calendário só.', breve: true },
  { chave: 'conteudo', icone: Megaphone, rotulo: 'EM BREVE', titulo: 'Conteúdo', texto: 'Próximos posts, alcance e seguidores do Instagram.', breve: true },
  { chave: 'atletas', icone: Users, rotulo: 'EM BREVE', titulo: 'Atletas', texto: 'Quem treinou na semana, pelo Strava, e quem esfriou.', breve: true },
];

const TZ = 'America/Sao_Paulo';
function saudacao() {
  const h = Number(new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: 'numeric', hour12: false }).format(new Date()));
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}
const hojeExtenso = () => new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
const primeiroNome = (u: string) => u.charAt(0).toUpperCase() + u.slice(1).split(/[.\s_-]/)[0];

export default function GestaoInicio() {
  const { sessao, setSessao, verificando, erro, sair } = useSessaoGestao();
  useEffect(() => { document.title = 'Central de gestão · CareFit'; }, []);

  if (verificando) return <Carregando />;
  if (!sessao) return <TelaLogin titulo="Central de gestão" onEntrar={setSessao} aviso={erro} />;

  const visiveis = MODULOS.filter(m => !m.soFinanceiro || sessao.financeiro);
  return (
    <div className="gs-pagina gs-inicio">
      <Topo usuario={sessao.user} financeiro={sessao.financeiro} onSair={() => void sair()} />
      <main className="gs-casca">
        <section className="gs-saudacao">
          <div>
            <span className="gs-trilha">CAREFIT <b>/</b> INÍCIO <b>·</b> {hojeExtenso()}</span>
            <h1>{saudacao()}, <em>{primeiroNome(sessao.user)}</em></h1>
            <p>A operação da CareFit em um lugar só. Escolha uma área para começar.</p>
            <div className="gs-atalhos">
              {sessao.financeiro && <Link to="/gestao/financeiro">+ Fechamento da semana</Link>}
              <a href="/painel-fortalecimento">+ Aula de hoje</a>
              {sessao.financeiro && <Link to="/gestao/campanha">+ Simular campanha</Link>}
            </div>
          </div>
          <div className="gs-saudacao-foto" style={{ backgroundImage: `url(${fotoEspaco})` }} aria-hidden="true" />
        </section>

        <section className="gs-cartoes" aria-label="Áreas da central">
          {visiveis.map(m => {
            const classe = 'gs-cartao' + (m.cor === 'destaque' ? ' gs-cartao-destaque' : m.cor === 'verde' ? ' gs-cartao-verde' : '') + (m.breve ? ' gs-cartao-breve' : '');
            const miolo = (
              <>
                <span className="gs-cartao-icone"><m.icone size={18} aria-hidden="true" /></span>
                <small>{m.rotulo}</small>
                <h2>{m.titulo}</h2>
                <p>{m.texto}</p>
                {m.acao && <b>{m.acao} <span aria-hidden="true">→</span></b>}
              </>
            );
            if (m.breve) return <div key={m.chave} className={classe}>{miolo}</div>;
            if (m.externa) return <a key={m.chave} href={m.para} className={classe}>{miolo}</a>;
            return <Link key={m.chave} to={m.para!} className={classe}>{miolo}</Link>;
          })}
        </section>
        <footer className="gs-rodape">CareFit Run Base · Dados protegidos por acesso individual</footer>
      </main>
    </div>
  );
}
