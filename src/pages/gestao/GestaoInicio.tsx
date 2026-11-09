import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Dumbbell, Gauge } from 'lucide-react';
import { Carregando, TelaLogin, Topo, useSessaoGestao } from './acesso';

// Espaço da equipe, no mesmo desenho do portal da RF na UX Up: uma porta só,
// e cada área é um cartão. Área nova = cartão novo aqui.
const MODULOS = [
  { chave: 'financeiro', para: '/gestao/financeiro', icone: BarChart3, rotulo: 'GESTÃO', titulo: 'Financeiro', texto: 'Fechamento semanal: sessões por profissional e por tipo, fortalecimento, yoga e produção da semana.', acao: 'ABRIR FECHAMENTO', destaque: true, soFinanceiro: true },
  { chave: 'fortalecimento', para: '/painel-fortalecimento', icone: Dumbbell, rotulo: 'OPERAÇÃO', titulo: 'Fortalecimento', texto: 'Aulas do dia, treino de cada atleta e registro da evolução, direto no ClickUp.', acao: 'ABRIR PAINEL', destaque: false, soFinanceiro: false },
  { chave: 'forca', para: '/painel-avaliacao-forca', icone: Gauge, rotulo: 'ATLETAS', titulo: 'Avaliação de força', texto: 'Excel do dinamômetro vira relatório e fica salvo no card do atleta.', acao: 'ABRIR AVALIAÇÃO', destaque: false, soFinanceiro: false },
];

export default function GestaoInicio() {
  const { sessao, setSessao, verificando, erro, sair } = useSessaoGestao();
  useEffect(() => { document.title = 'Central de gestão · CareFit'; }, []);

  if (verificando) return <Carregando />;
  if (!sessao) return <TelaLogin titulo="Central de gestão" onEntrar={setSessao} aviso={erro} />;

  const visiveis = MODULOS.filter(m => !m.soFinanceiro || sessao.financeiro);
  return (
    <div className="gs-pagina gs-inicio">
      <Topo usuario={sessao.user} onSair={() => void sair()} />
      <main className="gs-casca">
        <section className="gs-hero">
          <span className="gs-eyebrow">CAREFIT · CENTRAL DE GESTÃO</span>
          <h1>A operação da CareFit, <em>em um só lugar.</em></h1>
          <p>Escolha uma área para começar. Novos módulos entram aqui conforme o sistema evolui.</p>
        </section>
        <section className="gs-cartoes" aria-label="Áreas da central">
          {visiveis.map(m => (
            <Link key={m.chave} to={m.para} className={'gs-cartao' + (m.destaque ? ' gs-cartao-destaque' : '')}>
              <span className="gs-cartao-icone"><m.icone size={22} aria-hidden="true" /></span>
              <small>{m.rotulo}</small>
              <h2>{m.titulo}</h2>
              <p>{m.texto}</p>
              <b>{m.acao} <span aria-hidden="true">→</span></b>
            </Link>
          ))}
        </section>
        <footer className="gs-rodape">CAREFIT RUN BASE · Dados protegidos por acesso individual</footer>
      </main>
    </div>
  );
}
