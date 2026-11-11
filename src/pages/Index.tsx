import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";
import espaco from "@/assets/espaco-1.jpg";
import treino from "@/assets/espaco-2.jpg";
import "./home.css";

const whatsapp = "https://api.whatsapp.com/send?phone=5516996008849";
const caminhos = [
  { title: "Voltar a correr", text: "Uma dor ou lesão mudou seus planos? Comece por entender o que seu corpo precisa para retomar a corrida.", link: "/fisioterapia-para-corredores-ribeirao-preto", label: "Conheça a fisioterapia" },
  { title: "Construir uma base forte", text: "Prepare seu corpo para a rotina de treinos, com fortalecimento específico e acompanhamento de perto.", link: "/fortalecimento-em-turma", label: "Conheça o fortalecimento" },
  { title: "Cuidar da recuperação", text: "Dê espaço à recuperação entre treinos e provas, com um cuidado orientado para o seu momento.", link: "/recovery-corredores-ribeirao-preto", label: "Conheça o recovery" },
  { title: "Yoga para corredores", text: "Um momento para trabalhar mobilidade, respiração e consciência corporal, complementando sua rotina de corrida.", link: "/agendamento-yoga", label: "Reserve sua aula de yoga" },
];

export default function Index() {
  useSeo({ titulo: "CareFit Run Base | Cuidado para seguir correndo", descricao: "Evolua na corrida com cuidado e consistência. Fisioterapia, fortalecimento, recovery e yoga para corredores em Ribeirão Preto. Conheça sua primeira sessão.", caminho: "/" });
  return <>
    <main className="carefit-home">
      <section className="home-hero home-wrap">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Cuidado para corredores · Ribeirão Preto</p>
          <h1>Mais cuidado hoje.<br /><span>Mais corrida<br />na sua vida.</span></h1>
          <p className="home-lead">Evolua com consistência e confiança no seu corpo. Fisioterapia, fortalecimento, recovery e yoga conectados ao que você quer viver na corrida.</p>
          <Link className="home-button" to="/conheca-a-carefit">Conheça sua primeira sessão <ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="home-text-link home-help" href={whatsapp} target="_blank" rel="noopener noreferrer">Prefere conversar? Fale com a equipe <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <figure className="home-hero-photo">
          <img src={espaco} alt="Espaço de cuidado e treinamento da CareFit Run Base" fetchPriority="high" width="800" height="900" />
          <figcaption><span>Sua corrida começa com uma boa base.</span><small>CareFit Run Base · Ribeirão Preto</small></figcaption>
        </figure>
      </section>

      <section className="home-proof" aria-label="A experiência da CareFit">
        <div className="home-wrap home-proof-inner">
          <p>Você não corre sozinho.<br /><strong>A gente cuida para você seguir.</strong></p>
          {/* Base documentada da home: mapas dos atletas, contagem em 15/10/2026. */}
          <p><b>395+</b><span>corredores atendidos</span></p>
          <p><b>145+</b><span>meia maratonistas</span></p>
          <p><b>45+</b><span>maratonistas</span></p>
        </div>
      </section>

      <section className="home-wrap home-section" aria-labelledby="home-momento">
        <div className="home-section-heading"><p className="home-eyebrow">O seu momento é o ponto de partida</p><h2 id="home-momento">O que você quer viver<br />na corrida agora?</h2><p>Da volta aos treinos à próxima linha de chegada, o cuidado começa por você.</p></div>
        <div className="home-paths">{caminhos.map((item, i) => <article key={item.title}><span className="home-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p><Link className="home-text-link" to={item.link}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link></article>)}</div>
      </section>

      <section className="home-method">
        <div className="home-wrap home-method-inner">
          <div><p className="home-eyebrow">Prevenção como estratégia</p><h2>Seu objetivo orienta.<br />O cuidado acompanha.</h2><p className="home-lead">Sua história, sua rotina e seus desafios ajudam a construir o caminho. A gente acompanha sua evolução e ajusta o cuidado ao longo da jornada.</p><Link className="home-text-link" to="/jornada">Conheça o método CareFit <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <ol className="home-steps">
            <li><span>01</span><div><h3>Entender você</h3><p>Ouvir sua história, avaliar seu momento e conhecer o que você quer conquistar.</p></div></li>
            <li><span>02</span><div><h3>Traçar o próximo passo</h3><p>Definir as prioridades do cuidado e orientar um caminho que faça sentido para sua rotina.</p></div></li>
            <li><span>03</span><div><h3>Acompanhar a evolução</h3><p>Reavaliar, ajustar e caminhar junto. Da recuperação à construção de uma base mais forte.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="home-wrap home-section home-stories">
        <div className="home-section-heading"><p className="home-eyebrow">Histórias de quem corre com a gente</p><h2>Cada chegada tem<br />uma história por trás.</h2></div>
        <div className="home-videos">{[
          { id: "62WMUc35hbo", name: "Thais Vignini", race: "Desafio Disney Wine & Dine" },
          { id: "lbfcs-QlmDE", name: "Talita Kriunas", race: "Meia Maratona de Lisboa" },
          { id: "XF8N96nULVg", name: "Léo Andrade", race: "Meia Maratona do Rio" },
        ].map(person => <article key={person.id}><iframe src={`https://www.youtube-nocookie.com/embed/${person.id}`} title={`História de ${person.name} — ${person.race}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /><h3>{person.name}</h3><p>{person.race}</p></article>)}</div>
      </section>

      <section className="home-wrap home-base">
        <img src={treino} alt="Área de fortalecimento da CareFit em Ribeirão Preto" loading="lazy" width="800" height="600" />
        <div><p className="home-eyebrow"><MapPin size={14} aria-hidden="true" /> Sua base em Ribeirão Preto</p><h2>Um lugar para cuidar<br />de quem você é.<br /><span>E de onde quer chegar.</span></h2><p>Um espaço dedicado ao corredor, com equipe próxima e cuidado que vai além da sessão. Aqui, sua próxima prova importa. Os anos de corrida que vêm depois também.</p><Link className="home-text-link" to="/espaco">Conheça a nossa base <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </section>

      <section className="home-start">
        <div className="home-wrap home-start-inner"><div><p className="home-eyebrow">Vamos começar pela sua história</p><h2>O próximo passo é cuidar de você.</h2><p>Conheça a Primeira Sessão Dupla: dois encontros para entender seu momento e orientar os próximos passos da sua corrida.</p><ul><li><Check size={17} aria-hidden="true" /> Avaliação e cuidado personalizado</li><li><Check size={17} aria-hidden="true" /> Segunda sessão de cortesia</li></ul></div><div className="home-start-action"><Link className="home-button" to="/conheca-a-carefit">Conheça sua primeira sessão <ArrowRight size={18} aria-hidden="true" /></Link><a href={whatsapp} target="_blank" rel="noopener noreferrer">Tire suas dúvidas com a equipe</a></div></div>
      </section>
    </main>
    <Footer />
  </>;
}
