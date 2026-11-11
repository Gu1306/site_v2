import { Link } from "react-router-dom";
import { ORIENTACOES } from "@/lib/ofertasCarefit";
import { MAPS } from "../Links";
import espaco from "@/assets/espaco-1.jpg";

const FAQ = [
  { q: "Quanto tempo dura e o que está incluído?", a: "São dois encontros por R$ 230: a primeira sessão tem 80 minutos, com avaliação e cuidado personalizado. O retorno de 1 hora está incluído e acontece em até 15 dias." },
  { q: "Preciso contratar um plano depois?", a: "Não. Depois dos encontros, a equipe pode propor um acompanhamento de acordo com o seu caso. Você decide se quer continuar, sem assinatura obrigatória." },
  ...ORIENTACOES,
];

export default function Practical() {
  return <section className="section practical" id="antes-de-vir">
    <div className="container practical__grid">
      <div>
        <span className="eyebrow-section">Antes de vir</span>
        <h2 className="section-title">Tudo claro para <em>agendar</em>.</h2>
        {FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        <p className="practical__alternative">Está com dor ou uma lesão limitando a corrida? Conheça a <Link to="/lp/fisioterapia-ribeirao-preto">avaliação de reabilitação de R$ 180</Link>.</p>
      </div>
      <div className="practical__place">
        <img src={espaco} alt="Espaço de atendimento da CareFit Run Base" loading="lazy" width="640" height="480" />
        <h3>Seu atendimento na CareFit</h3>
        <p>Av. Áurea A. B. Machado, 241<br />Sala 8, segundo andar · City Ribeirão<br />Ribeirão Preto/SP</p>
        <a href={MAPS} target="_blank" rel="noopener noreferrer">Ver como chegar ↗</a>
      </div>
    </div>
  </section>;
}
