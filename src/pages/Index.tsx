import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import JornadaAtleta from "@/components/JornadaAtleta";
import { useSeo } from "@/hooks/useSeo";
import livia from "@/assets/home-livia.jpg";
import gustavo from "@/assets/home-gustavo.jpg";
import sala from "@/assets/home-sala-atendimento.jpg";
import imersao from "@/assets/home-imersao.jpg";
import "./home.css";

const whatsapp = "https://api.whatsapp.com/send?phone=5516996008849";

// O coração da home: o que separa a sessão da CareFit do recovery por equipamento.
const diferencas = [
  { tema: "Quem decide", comum: "Você escolhe o equipamento num cardápio.", carefit: "O fisioterapeuta avalia você, escolhe o protocolo e explica o porquê." },
  { tema: "Quem acompanha", comum: "Vários atletas ao mesmo tempo, cada um na sua poltrona.", carefit: "Um fisioterapeuta com um corredor, a sessão inteira." },
  { tema: "Quanto tempo", comum: "O tempo do aparelho.", carefit: "Uma hora de atendimento. Na primeira sessão, 80 minutos." },
  { tema: "Sua história", comum: "Cada visita começa do zero.", carefit: "Suas lesões, provas e treinos ficam registrados. A sessão seguinte parte daí." },
  { tema: "Para quem", comum: "Qualquer esporte, qualquer objetivo.", carefit: "Só corrida. A equipe corre e sabe o que é ter uma prova marcada." },
  { tema: "O que você leva", comum: "Alívio do cansaço de hoje.", carefit: "O problema pequeno tratado antes de virar lesão, e o próximo passo definido." },
];

const sessao = [
  { title: "Você conta como chegou", text: "Sono, energia, estresse e dor. O que mudou nos treinos desde a última vez e o que vem pela frente." },
  { title: "O fisioterapeuta avalia", text: "Testa, toca e observa. Cruza o que encontrou com o seu histórico e com a sua próxima prova." },
  { title: "O protocolo é escolhido para aquele dia", text: "Liberação, dry needling, laser, gelo, ofurô, bota de compressão. Entra o que faz sentido para você, na ordem que faz sentido." },
  { title: "Você sai sabendo o próximo passo", text: "O que foi encontrado, o que fazer até a próxima sessão e o que observar nos treinos." },
];

const caminhos = [
  { title: "Voltar a correr", text: "Uma dor ou lesão mudou seus planos? Comece pela avaliação com fisioterapeuta.", link: "/fisioterapia-para-corredores-ribeirao-preto", label: "Conheça a fisioterapia" },
  { title: "Cuidar da recuperação", text: "Treinando forte ou com prova chegando? Comece pela Primeira Sessão Dupla.", link: "/conheca-a-carefit", label: "Conheça a primeira sessão" },
  { title: "Construir uma base forte", text: "Fortalecimento específico para corredor, em turma pequena e com acompanhamento de perto.", link: "/fortalecimento-em-turma", label: "Conheça o fortalecimento" },
  { title: "Yoga para corredores", text: "Mobilidade, respiração e consciência corporal para complementar a sua rotina de corrida.", link: "/agendamento-yoga", label: "Reserve sua aula de yoga" },
];

const historias = [
  { id: "62WMUc35hbo", name: "Thais Vignini", race: "Desafio Disney Wine & Dine" },
  { id: "lbfcs-QlmDE", name: "Talita Kriunas", race: "Meia Maratona de Lisboa" },
  { id: "XF8N96nULVg", name: "Léo Andrade", race: "Meia Maratona do Rio" },
];

export default function Index() {
  useSeo({
    titulo: "Fisioterapia esportiva para corredores em Ribeirão Preto | CareFit Run Base",
    descricao: "Clínica de fisioterapia esportiva e recovery para corredores em Ribeirão Preto. Um fisioterapeuta, um corredor, uma hora: cada sessão começa por uma avaliação.",
    caminho: "/",
  });

  return <>
    <main className="carefit-home">
      <section className="home-hero home-wrap">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Fisioterapia e performance para corredores · Ribeirão Preto</p>
          <h1>Uma hora inteira.<br />Um fisioterapeuta.<br /><span>Só você.</span></h1>
          <p className="home-lead">A CareFit não é um lugar onde você entra, usa o equipamento e vai embora. Cada sessão começa por uma avaliação. É ela que decide o que o seu corpo precisa hoje.</p>
          <Link className="home-button" to="/conheca-a-carefit">Conheça sua primeira sessão <ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="home-text-link home-help" href={whatsapp} target="_blank" rel="noopener noreferrer">Prefere conversar? Fale com a equipe <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <figure className="home-hero-photo">
          <img src={livia} alt="Lívia Dias, fisioterapeuta esportiva da CareFit Run Base" fetchPriority="high" width="1100" height="1650" />
          <figcaption><span>Na sessão, o fisioterapeuta fica com você do começo ao fim.</span><small>Lívia Dias · fisioterapeuta esportiva</small></figcaption>
        </figure>
      </section>

      <section className="home-proof" aria-label="A CareFit em números">
        <div className="home-wrap home-proof-inner">
          <p>Você não corre sozinho.<br /><strong>A gente cuida para você seguir.</strong></p>
          {/* Base documentada da home: mapas dos atletas, contagem em 15/10/2026. */}
          <p><b>395+</b><span>corredores atendidos</span></p>
          <p><b>145+</b><span>meia maratonistas</span></p>
          <p><b>45+</b><span>maratonistas</span></p>
        </div>
      </section>

      <section className="home-wrap home-section" aria-labelledby="home-diferenca">
        <div className="home-section-heading">
          <p className="home-eyebrow">Por que não é um recovery comum</p>
          <h2 id="home-diferenca">A bota e o gelo são ferramentas.<br />O que muda é quem decide como usar.</h2>
          <p>Os equipamentos você encontra em muitos lugares. A diferença está em ter um fisioterapeuta que conhece a sua história e monta a sessão para você.</p>
        </div>
        <div className="home-compare" role="table" aria-label="Recovery por equipamento comparado com a sessão na CareFit">
          <div className="home-compare-head" role="row">
            <span role="columnheader" className="home-compare-tema" />
            <span role="columnheader">Recovery por equipamento</span>
            <span role="columnheader" className="home-compare-nos">Sessão na CareFit</span>
          </div>
          {diferencas.map(item => <div className="home-compare-row" role="row" key={item.tema}>
            <span role="rowheader" className="home-compare-tema">{item.tema}</span>
            <p role="cell" className="home-compare-comum"><small>Recovery por equipamento</small>{item.comum}</p>
            <p role="cell" className="home-compare-nos"><small>Sessão na CareFit</small><Check size={16} aria-hidden="true" />{item.carefit}</p>
          </div>)}
        </div>
      </section>

      <section className="home-method">
        <div className="home-wrap home-method-inner">
          <div>
            <p className="home-eyebrow">Como é uma sessão</p>
            <h2>Primeiro a gente entende.<br />Depois a gente trata.</h2>
            <p className="home-lead">Nenhuma sessão é igual à anterior, porque você não chega igual. O que entra no atendimento depende do que a avaliação mostrar.</p>
            <img className="home-method-photo" src={sala} alt="Sala de atendimento individual da CareFit, com macas e banheira de imersão" loading="lazy" width="1500" height="1000" />
          </div>
          <ol className="home-steps">
            {sessao.map((item, i) => <li key={item.title}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section className="home-between">
        <div className="home-wrap">
          <div className="home-section-heading">
            <p className="home-eyebrow">Um ciclo inteiro, semana a semana</p>
            <h2>A gente não deixa um problema<br />pequeno ficar grande.</h2>
            <p>O plano de recovery nasce do seu treino, da sua prova e da sua história. Escolha uma semana para ver o que o treino mostrou, o que a gente viu e o que a gente fez.</p>
          </div>
          <JornadaAtleta />
        </div>
      </section>

      <section className="home-wrap home-section" aria-labelledby="home-momento">
        <div className="home-section-heading"><p className="home-eyebrow">Por onde começar</p><h2 id="home-momento">O que você quer viver<br />na corrida agora?</h2><p>Da volta aos treinos à próxima linha de chegada, o cuidado começa pelo seu momento.</p></div>
        <div className="home-paths">{caminhos.map((item, i) => <article key={item.title}><span className="home-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p><Link className="home-text-link" to={item.link}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link></article>)}</div>
      </section>

      <section className="home-wrap home-base home-team">
        <img src={gustavo} alt="Gustavo Rosa, fundador da CareFit Run Base e ultramaratonista" loading="lazy" width="1100" height="1650" />
        <div>
          <p className="home-eyebrow">Quem cuida de você</p>
          <h2>Feita por quem corre.<br /><span>Para quem corre.</span></h2>
          <p>A CareFit nasceu do Gustavo Rosa, ultramaratonista, e da Lívia Dias, fisioterapeuta esportiva. Hoje a equipe tem também a Lais e o Igor na fisioterapia, o Lucas Pereira no fortalecimento e a Cintya na yoga.</p>
          <p>Todo mundo aqui conhece a dor de quem treina para uma prova. E o sonho também.</p>
        </div>
      </section>

      <section className="home-wrap home-section home-stories">
        <div className="home-section-heading"><p className="home-eyebrow">Histórias de quem corre com a gente</p><h2>Cada chegada tem<br />uma história por trás.</h2></div>
        <div className="home-videos">{historias.map(person => <article key={person.id}><iframe src={`https://www.youtube-nocookie.com/embed/${person.id}`} title={`História de ${person.name} — ${person.race}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /><h3>{person.name}</h3><p>{person.race}</p></article>)}</div>
      </section>

      <section className="home-wrap home-base">
        <img src={imersao} alt="Área de imersão da CareFit Run Base em Ribeirão Preto" loading="lazy" width="1500" height="1000" />
        <div><p className="home-eyebrow"><MapPin size={14} aria-hidden="true" /> Sua base em Ribeirão Preto</p><h2>Um espaço inteiro<br />pensado para o corredor.</h2><p>Sala de atendimento, imersão no gelo, ofurô e área de fortalecimento no mesmo lugar. Tudo com hora marcada, para o seu tempo ser respeitado.</p><Link className="home-text-link" to="/espaco">Conheça a nossa base <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </section>

      <section className="home-start">
        <div className="home-wrap home-start-inner">
          <div>
            <p className="home-eyebrow">Vamos começar pela sua história</p>
            <h2>Venha ver a diferença numa sessão.</h2>
            <p>A Primeira Sessão Dupla são dois encontros: no primeiro, 80 minutos para entender sua história e iniciar o cuidado. No retorno, em até 15 dias, a gente avalia como seu corpo respondeu e ajusta os próximos passos.</p>
            <ul><li><Check size={17} aria-hidden="true" /> Avaliação e cuidado individual</li><li><Check size={17} aria-hidden="true" /> Segunda sessão de cortesia</li></ul>
            <p className="home-start-dor">Está com uma dor que limita a sua corrida? <Link to="/fisioterapia-para-corredores-ribeirao-preto">Comece pela avaliação de fisioterapia</Link>.</p>
          </div>
          <div className="home-start-action"><Link className="home-button" to="/conheca-a-carefit">Conheça sua primeira sessão <ArrowRight size={18} aria-hidden="true" /></Link><a href={whatsapp} target="_blank" rel="noopener noreferrer">Tire suas dúvidas com a equipe</a></div>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
