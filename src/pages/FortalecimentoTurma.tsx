import { Link } from "react-router-dom";
import { useSeo } from "@/hooks/useSeo";
import Footer from "@/components/Footer";

const AGENDAMENTO = "/agendamento-fortalecimento";

const ganhos = [
  {
    titulo: "Menos risco de lesão",
    texto:
      "Força é a intervenção com melhor evidência para reduzir lesão por excesso de uso na corrida.",
  },
  {
    titulo: "Quadril e joelho estáveis",
    texto:
      "Trabalho direto nos estabilizadores que seguram o joelho alinhado quando você cansa.",
  },
  {
    titulo: "Economia de corrida",
    texto:
      "Mais eficiência no mesmo esforço: o corpo gasta menos para manter o mesmo ritmo.",
  },
  {
    titulo: "Aguentar mais treino",
    texto:
      "Base para suportar o volume da preparação sem quebrar no meio do ciclo.",
  },
];

const horarios = ["06h — 07h", "07h — 08h", "08h — 09h"];
const dias = ["Segunda", "Quarta", "Sexta"];

const passos = [
  {
    titulo: "Você reserva o horário",
    texto:
      "Escolhe dia e hora na página de agendamento. A vaga é sua na hora, e a confirmação chega no seu e-mail.",
  },
  {
    titulo: "Conta sua história antes",
    texto:
      "Uma ficha rápida sobre lesões, dores e seu momento de treino. O treinador chega sabendo com quem vai trabalhar.",
  },
  {
    titulo: "Treina e recebe o retorno",
    texto:
      "Uma hora de treino conduzido. Depois da aula, você recebe no WhatsApp o que foi feito e o que observar até a próxima.",
  },
];

const FortalecimentoTurma = () => {
  useSeo({
    titulo: "Treino de força para corredores em turma | CareFit Run Base",
    descricao:
      "Corredor que fortalece machuca menos e corre por mais tempo. Treino de força só para quem corre, em turma de três, às segundas, quartas e sextas em Ribeirão Preto.",
    caminho: "/fortalecimento-em-turma",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary pt-28 pb-16 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1/2 -right-24 h-[32rem] w-[32rem] rounded-full bg-secondary/25 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:px-8">
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Fortalecimento para corredores · Ribeirão Preto
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
              Corredor que fortalece
              <span className="mt-1 block text-accent">
                machuca menos e corre por mais tempo.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Treino de força feito só para quem corre, em turma de três. Segunda, quarta e
              sexta, antes do dia começar — na única base de Ribeirão Preto onde força,
              fisioterapia e recovery trabalham juntos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={AGENDAMENTO}
                className="inline-block rounded bg-secondary px-8 py-4 text-base font-bold text-white shadow-lg shadow-secondary/40 transition hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Agendar minha aula
              </Link>
              <a
                href="#grade"
                className="inline-block rounded border-2 border-white/35 bg-transparent px-8 py-4 text-base font-bold text-white transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Ver os horários
              </a>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Você escolhe o dia e o horário na hora. Sem conversa de venda antes.
            </p>
          </div>

          <aside className="rounded-md border border-accent/30 bg-white/5 p-7">
            <div className="text-[5.5rem] font-extrabold leading-none tracking-tighter text-accent">
              3
            </div>
            <p className="mt-3 text-lg font-medium text-white/90">
              pessoas por turma. Nunca mais que isso.
            </p>
            <div className="mt-5 flex gap-2" aria-hidden="true">
              <span className="h-1.5 w-full rounded-full bg-accent" />
              <span className="h-1.5 w-full rounded-full bg-accent" />
              <span className="h-1.5 w-full rounded-full bg-accent" />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              É o número que permite corrigir execução no meio da série, ajustar carga por
              pessoa e saber quem está com dor hoje. Acima disso, vira academia.
            </p>
          </aside>
        </div>
      </section>

      {/* Especialidade */}
      <section className="border-t-4 border-secondary bg-card py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-secondary">
            Especialistas, não generalistas
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            Entrou na CareFit, é corredor.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Aqui ninguém pega treino de academia e adapta para quem corre. O treino já nasce
            para a corrida, porque é só com corredor que a gente trabalha. E quando aparece
            uma dor, a fisioterapia está na sala ao lado — não em outra agenda, em outro
            bairro, com outra pessoa que nunca viu você treinar.
          </p>
          <p className="mt-5 border-l-4 border-accent pl-4 text-lg font-medium text-foreground">
            Essa é a diferença que você sente na terceira semana.
          </p>
        </div>
      </section>

      {/* Por que força */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-secondary">
              Por que força, se o seu esporte é correr
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Quilometragem constrói fôlego. Ela não constrói estrutura.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              O corredor que só corre pede à mesma musculatura que ela absorva impacto
              milhares de vezes por treino, sem nunca ter treinado para isso. É aí que a
              canela dói, o joelho reclama na descida e a lesão volta sempre no mesmo lugar.
            </p>
          </div>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            {ganhos.map((ganho, indice) => (
              <li key={ganho.titulo} className="flex gap-4 bg-card p-6">
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                  {indice + 1}
                </span>
                <span>
                  <strong className="mb-1 block text-base font-bold text-primary">
                    {ganho.titulo}
                  </strong>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {ganho.texto}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Grade */}
      <section id="grade" className="bg-primary py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-accent">
              A grade
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Três dias na semana, três horários por dia.
            </h2>
            <p className="mt-5 text-lg text-white/75">
              Todas as turmas acontecem de manhã, para caber antes do trabalho. Você reserva
              aula por aula e vê na hora quais turmas ainda têm vaga.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[26rem] border-separate border-spacing-2 tabular-nums">
              <caption className="caption-bottom pt-4 text-left text-sm text-white/55">
                Turmas de uma hora. A disponibilidade de cada dia aparece em tempo real na
                página de agendamento.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="sr-only">
                    Horário
                  </th>
                  {dias.map((dia) => (
                    <th
                      key={dia}
                      scope="col"
                      className="p-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-accent"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horarios.map((faixa) => (
                  <tr key={faixa}>
                    <th
                      scope="row"
                      className="whitespace-nowrap pr-4 text-left text-base font-semibold text-white"
                    >
                      {faixa.slice(0, 3)}
                    </th>
                    {dias.map((dia) => (
                      <td
                        key={`${dia}-${faixa}`}
                        className="rounded border border-accent/25 bg-white/5 px-2 py-4 text-center"
                      >
                        <span className="block text-sm font-bold text-white">{faixa}</span>
                        <span className="mt-1 block text-xs text-accent">3 vagas</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <Link
              to={AGENDAMENTO}
              className="inline-block rounded bg-secondary px-8 py-4 text-base font-bold text-white shadow-lg shadow-secondary/40 transition hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Ver turmas com vaga e reservar
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-secondary">
              Como funciona
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Da reserva à sua primeira aula.
            </h2>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {passos.map((passo, indice) => (
              <li key={passo.titulo} className="border-t-2 border-secondary pt-4">
                <span className="mb-2 block text-xs font-bold tracking-[0.1em] text-secondary">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <strong className="mb-2 block text-lg font-bold text-primary">
                  {passo.titulo}
                </strong>
                <p className="text-sm leading-relaxed text-muted-foreground">{passo.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Investimento */}
      <section className="bg-muted py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-secondary">
              Investimento
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Pacote de 24 aulas.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Força não responde a aula solta: responde a frequência. Por isso o pacote é a
              porta, e o valor por aula cai para quem já treina com a gente.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-md border-2 border-secondary bg-card p-7">
              <p className="text-base font-bold text-primary">Chegando agora</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Para quem está começando na CareFit
              </p>
              <p className="mt-5 text-4xl font-extrabold tracking-tight text-primary tabular-nums">
                R$ 1.920
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                24 aulas · 4× de R$ 480 · R$ 80 por aula
              </p>
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                Reserve a primeira aula e acerte o pacote na base.
              </p>
            </div>

            <div className="rounded-md border border-border bg-card p-7">
              <p className="text-base font-bold text-primary">Atleta CareFit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Para quem já faz acompanhamento na base
              </p>
              <p className="mt-5 text-4xl font-extrabold tracking-tight text-primary tabular-nums">
                R$ 1.800
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                24 aulas · 4× de R$ 450 · R$ 75 por aula
              </p>
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                Vale para quem já tem plano de recovery ou fisioterapia ativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fechamento */}
      <section className="bg-primary py-14 text-center md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Ribeirão Preto
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            A próxima turma tem três lugares.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
            Escolha o horário que cabe na sua semana e venha treinar. Se não servir, a gente
            remarca.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to={AGENDAMENTO}
              className="inline-block rounded bg-secondary px-8 py-4 text-base font-bold text-white shadow-lg shadow-secondary/40 transition hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Agendar minha aula
            </Link>
          </div>

          <div className="mt-12 grid gap-6 border-t border-accent/20 pt-8 text-left sm:grid-cols-2">
            <div>
              <strong className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Onde
              </strong>
              <p className="text-sm leading-relaxed text-white/75">
                CareFit Run Base
                <br />
                Av. Áurea Aparecida Bragheto Machado, 241
                <br />
                Ribeirão Preto / SP
              </p>
            </div>
            <div>
              <strong className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Quando
              </strong>
              <p className="text-sm leading-relaxed text-white/75">
                Segunda, quarta e sexta
                <br />
                Turmas às 06h, 07h e 08h
                <br />
                Uma hora de aula
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FortalecimentoTurma;
