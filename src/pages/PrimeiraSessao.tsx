import { useSeo } from "@/hooks/useSeo";
import logo from "@/assets/logocarefitclub.png";
import fisio from "@/assets/sala-fisioterapia.jpg";
import recovery from "@/assets/recovery_atletas.jpg";
import espaco from "@/assets/hero-runners.jpg";
import { Card, CSS, WHATS, wa, type Item } from "./Links";

/** Agendamento da 1ª sessão: dois calendários (Igor e Lais) + WhatsApp. Visual igual ao /links. */
const ITENS: Item[] = [
  {
    titulo: "Agendar com o Igor",
    sub: "Escolha o dia e o horário no calendário dele",
    href: "https://calendar.app.google/ZCfVQVRJ2ixyQ6Xj6",
    imagem: fisio,
    pos: "center",
    externo: true,
  },
  {
    titulo: "Agendar com a Lais",
    sub: "Escolha o dia e o horário no calendário dela",
    href: "https://calendar.app.google/8r6VBjsgfK1WiBWY8",
    imagem: recovery,
    pos: "center 40%",
    externo: true,
  },
  {
    titulo: "Conheça como é a nossa primeira sessão",
    sub: "Veja o que acontece antes de vir",
    href: "/conheca-a-carefit",
    imagem: espaco,
    pos: "center 60%",
  },
  {
    titulo: "Prefere falar no WhatsApp?",
    sub: "A equipe te ajuda a marcar",
    href: wa("Oi! Vim pelo Instagram e quero agendar minha primeira sessão na CareFit."),
    imagem: fisio,
    externo: true,
  },
];

export default function PrimeiraSessao() {
  useSeo({
    titulo: "Agendar primeira sessão | CareFit Run Base",
    descricao: "Escolha o profissional, o dia e o horário da sua primeira sessão na CareFit Run Base, em Ribeirão Preto.",
    caminho: "/primeira-sessao",
  });
  return (
    <main className="lk">
      <style>{CSS}</style>
      <div className="lk-wrap">
        <header className="lk-top">
          <img className="lk-logo" src={logo} alt="CareFit Run Base" />
          <h1>Agende sua 1ª sessão</h1>
          <p className="lk-tag">Escolha com quem e quando. Leva poucos minutos.</p>
        </header>
        <div className="lk-sec">Escolha o profissional</div>
        {ITENS.slice(0, 2).map((d, i) => <Card key={d.titulo} item={d} hero={i === 0} />)}
        <div className="lk-sec">Antes de vir</div>
        <Card item={ITENS[2]} />
        <div className="lk-sec">Dúvidas</div>
        <Card item={ITENS[3]} />
        <p className="lk-end"><a href="/links">← Voltar</a> · <a href={WHATS}>WhatsApp</a></p>
      </div>
    </main>
  );
}
