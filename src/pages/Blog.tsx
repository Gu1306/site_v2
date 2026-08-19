import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "@/components/Footer";
import { posts, formatarData, type Post } from "@/lib/blog";
import { proximasProvas, provasDaSemana, diaEMes } from "@/lib/agenda";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

/**
 * O Jornal do 016 — a home do portal.
 *
 * Direção escolhida em 19/08/2026: densidade de veículo de imprensa. Manchete
 * dominante, régua de última hora, agenda fixa na lateral e grade de três
 * colunas. O layout aguenta volume diário; é isso que o motor precisa alimentar.
 */

const SECOES = ["Tudo", "Provas", "Resultados", "A cidade", "Treino", "Serviços"] as const;

const Blog = () => {
  const [secao, setSecao] = useState<(typeof SECOES)[number]>("Tudo");

  useSeo({
    titulo: "Jornal do 016 — a corrida de Ribeirão Preto | CareFit Run Base",
    descricao:
      "Provas, resultados e serviço para quem corre em Ribeirão Preto e região. Agenda conferida na fonte, atualizada toda semana. Runner ajuda runner.",
    caminho: "/blog",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Jornal do 016",
      description: "A corrida de Ribeirão Preto e região",
      url: `${SITE_URL}/blog`,
      publisher: { "@type": "Organization", name: "CareFit Run Base" },
    },
  });

  const filtrados =
    secao === "Tudo" ? posts : posts.filter((post) => post.categoria === secao);
  const [manchete, ...resto] = filtrados;
  const agenda = proximasProvas(5);
  const semana = provasDaSemana();

  return (
    <div className="min-h-screen bg-warm">
      {/* Cabeçalho do veículo */}
      <header className="pt-24 md:pt-28 border-b-[3px] border-primary bg-warm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-baseline justify-between gap-4 py-6">
            <Link to="/blog" className="flex items-baseline gap-3">
              <span className="font-montserrat font-black text-2xl md:text-3xl tracking-tight text-primary">
                JORNAL DO 016
              </span>
              <span className="font-montserrat font-bold text-[11px] md:text-xs tracking-[0.2em] text-secondary">
                RUNNER AJUDA RUNNER
              </span>
            </Link>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {SECOES.map((nome) => (
                <button
                  key={nome}
                  onClick={() => setSecao(nome)}
                  className={`font-montserrat font-semibold text-xs tracking-[0.1em] uppercase transition-colors ${
                    secao === nome
                      ? "text-secondary"
                      : "text-primary/70 hover:text-primary"
                  }`}
                >
                  {nome}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Régua de última hora — só existe quando há prova na janela de 8 dias */}
      {semana.length > 0 && (
        <div className="bg-primary text-white">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="font-montserrat font-extrabold text-[11px] tracking-[0.18em] text-earth shrink-0">
              ESTA SEMANA
            </span>
            <span className="font-poppins font-light text-sm">
              {semana.map((prova, i) => (
                <span key={`${prova.data}-${prova.nome}`}>
                  {i > 0 && <span className="mx-2 opacity-40">·</span>}
                  <strong className="font-semibold">{prova.nome}</strong>{" "}
                  {diaEMes(prova.data).dia}/{diaEMes(prova.data).mes.toLowerCase()}
                  {prova.detalhe ? `, ${prova.detalhe}` : ""}
                </span>
              ))}
            </span>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-10 md:py-14">
        {filtrados.length === 0 ? (
          <p className="py-20 text-center font-poppins text-primary/60">
            Nada em {secao} ainda.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Manchete */}
            <article className="lg:col-span-2">
              <Link to={`/blog/${manchete.slug}`} className="group block">
                <div className="font-montserrat font-extrabold text-[11px] tracking-[0.2em] text-secondary mb-4 uppercase">
                  {manchete.categoria}
                  {manchete.local && " · Ribeirão Preto"}
                </div>
                <h1 className="font-montserrat font-black text-4xl md:text-6xl leading-[1.02] tracking-tight text-primary text-balance mb-5 group-hover:text-secondary transition-colors">
                  {manchete.titulo}
                </h1>
                <p className="font-poppins font-light text-lg md:text-xl leading-relaxed text-primary/80 max-w-[62ch] mb-5">
                  {manchete.descricao}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-poppins text-[13px] text-primary/60">
                  <span>{formatarData(manchete.data)}</span>
                  <span>·</span>
                  <span>{manchete.autor}</span>
                  <span>·</span>
                  <span>{manchete.minutosDeLeitura} min</span>
                </div>
              </Link>
            </article>

            {/* Agenda fixa */}
            <aside className="lg:border-l-2 lg:border-primary/15 lg:pl-8">
              <h2 className="font-montserrat font-extrabold text-xs tracking-[0.2em] text-primary mb-6">
                PRÓXIMAS PROVAS
              </h2>
              <ul className="space-y-5">
                {agenda.map((prova) => {
                  const { dia, mes } = diaEMes(prova.data);
                  const proxima = prova === agenda[0];
                  return (
                    <li key={`${prova.data}-${prova.nome}`} className="flex gap-4">
                      <div
                        className={`shrink-0 w-14 text-center py-2 ${
                          proxima
                            ? "bg-secondary text-white"
                            : "border-2 border-primary text-primary"
                        }`}
                      >
                        <div className="font-montserrat font-black text-xl leading-none">{dia}</div>
                        <div className="text-[10px] font-semibold tracking-[0.14em]">{mes}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-montserrat font-bold text-[15px] text-primary leading-snug">
                          {prova.nome}
                        </div>
                        <div className="font-poppins font-light text-[13px] text-primary/70">
                          {prova.distancias}
                          {prova.cidade !== "Ribeirão Preto" && ` · ${prova.cidade}`}
                        </div>
                        {!prova.confirmado && (
                          <div className="font-poppins text-[11px] text-primary/45 mt-0.5">
                            data não confirmada na fonte
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 pt-4 border-t border-primary/15">
                <p className="font-poppins font-light text-[13px] text-primary/70 leading-relaxed">
                  Organiza prova ou atende corredor em Ribeirão?{" "}
                  <a
                    href="https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20quero%20mandar%20uma%20informa%C3%A7%C3%A3o%20para%20o%20Jornal%20do%20016."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-montserrat font-bold text-secondary hover:underline"
                  >
                    Manda pra gente
                  </a>{" "}
                  que a gente publica.
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* Grade editorial */}
        {resto.length > 0 && (
          <section className="mt-14 md:mt-16">
            <h2 className="border-t-[3px] border-primary pt-3 font-montserrat font-extrabold text-xs tracking-[0.2em] text-primary mb-8">
              {secao === "Tudo" ? "ÚLTIMAS DA CIDADE" : secao.toUpperCase()}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-12">
              {resto.map((post) => (
                <CartaoPost key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Assinatura editorial */}
        <section className="mt-16 border-t border-primary/15 pt-8">
          <p className="font-poppins font-light text-primary/70 max-w-2xl leading-relaxed">
            <strong className="font-montserrat font-bold text-primary">Runner ajuda runner.</strong>{" "}
            O Jornal do 016 é mantido pela CareFit Run Base e existe para quem corre em
            Ribeirão Preto e região. Data de prova a gente confere na fonte do organizador —
            e diz quando não conseguiu.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const CartaoPost = ({ post }: { post: Post }) => (
  <article>
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className="font-montserrat font-bold text-[11px] tracking-[0.16em] text-secondary mb-2 uppercase">
        {post.categoria}
      </div>
      <h3 className="font-montserrat font-bold text-xl leading-tight text-primary mb-2.5 group-hover:text-secondary transition-colors">
        {post.titulo}
      </h3>
      <p className="font-poppins font-light text-sm leading-relaxed text-primary/75 mb-3">
        {post.descricao}
      </p>
      <div className="font-poppins text-xs text-primary/55">
        {formatarData(post.data)} · {post.minutosDeLeitura} min
      </div>
    </Link>
  </article>
);

export default Blog;
