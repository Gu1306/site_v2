import { Link } from "react-router-dom";
import Icon from "./Icon";

const PROFILES = [
  { icon: "loop", title: "Sua rotina de treinos ficou mais exigente", desc: "Você quer entender como organizar o cuidado e a recuperação entre os treinos." },
  { icon: "flag", title: "Você está se preparando para uma prova", desc: "Quer conversar sobre sua rotina, seu histórico e o que seu corpo precisa neste momento." },
  { icon: "bandage", title: "Você procura um recovery personalizado", desc: "Quer uma avaliação que ajude a escolher o cuidado adequado ao seu contexto." },
  { icon: "target", title: "Você quer conhecer a CareFit antes de continuar", desc: "Dois encontros para conhecer o atendimento e decidir seus próximos passos com a equipe." },
];

export default function Audience() {
  return <section className="section" id="pra-quem-e">
    <div className="container">
      <span className="eyebrow-section">Para o seu momento</span>
      <h2 className="section-title">A Sessão Dupla faz sentido <em>para você?</em></h2>
      <p className="section-lede">Uma porta de entrada para conhecer o cuidado da CareFit e olhar com atenção para a sua rotina de corrida.</p>
      <div className="audience__grid">{PROFILES.map((p) => <article className="aud-card" key={p.title}>
        <span className="aud-card__icon"><Icon name={p.icon} size={22} /></span>
        <h3 className="aud-card__title">{p.title}</h3><p className="aud-card__desc">{p.desc}</p>
      </article>)}</div>
      <p className="practical__alternative">Se uma dor ou lesão está limitando sua corrida, comece pela <Link to="/lp/fisioterapia-ribeirao-preto">avaliação de reabilitação · R$ 180</Link>.</p>
    </div>
  </section>;
}
