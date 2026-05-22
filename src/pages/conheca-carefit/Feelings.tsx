const FEELINGS_1 = [
  "Eles entenderam meu caso.",
  "Não foi protocolo padrão.",
  "Tem uma lógica por trás do que fizeram.",
  "Agora eu sei melhor o que meu corpo precisa.",
  "Existe um plano possível pra eu evoluir.",
];

const FEELINGS_2 = [
  "Tenho senso de continuidade.",
  "Meu corpo respondeu e eles acompanharam.",
  "Faz sentido ter um plano.",
  "Eu quero seguir nesse ecossistema.",
];

interface FeelColProps {
  badge: string;
  title: string;
  items: string[];
}

function FeelCol({ badge, title, items }: FeelColProps) {
  return (
    <div>
      <div className="feel-col__head">
        <span className="feel-col__badge">{badge}</span>
        <span className="feel-col__title">{title}</span>
      </div>
      <ul className="feel-list">
        {items.map((q, i) => (
          <li className="feel-item" key={i}>
            <span className="feel-item__quote">&ldquo;</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Feelings() {
  return (
    <section className="section feelings" id="o-que-vai-sentir">
      <div className="container">
        <div style={{ maxWidth: 720 }}>
          <span className="eyebrow-section">A experiência</span>
          <h2 className="section-title">
            O que você vai <em>sentir</em>.
          </h2>
          <p className="section-lede">
            Não vendemos sessão. Vendemos clareza, direção e cuidado contínuo.
            Aqui está o que corredores nos contam ao sair de cada encontro.
          </p>
        </div>

        <div className="feelings__grid">
          <FeelCol badge="01" title="Ao sair da sessão 1" items={FEELINGS_1} />
          <FeelCol badge="02" title="Ao sair da sessão 2" items={FEELINGS_2} />
        </div>
      </div>
    </section>
  );
}
