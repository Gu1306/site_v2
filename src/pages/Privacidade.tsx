import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";
import { reabrirCookies, tagAtiva } from "@/lib/tracking";

// Versão do texto. Mudou o texto, muda a versão e a data.
const VERSAO = "Versão 1 · 8 de novembro de 2026";
const EMAIL = "privacidade@carefitrunbase.com.br";

const Bloco = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-montserrat font-bold text-xl md:text-2xl text-primary mb-3">{titulo}</h2>
    <div className="space-y-3 text-foreground/80 leading-relaxed">{children}</div>
  </section>
);

const Privacidade = () => {
  useSeo({
    titulo: "Política de privacidade | CareFit Run Base",
    descricao:
      "Como a CareFit Run Base trata os dados de quem visita o site, fala com a gente e é atendido na base.",
    caminho: "/privacidade",
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{VERSAO}</p>
        <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-6">
          Política de privacidade
        </h1>
        <p className="text-lg text-foreground/80 leading-relaxed mb-10">
          Aqui explicamos, sem juridiquês, quais dados a CareFit recebe quando você usa este site
          ou fala com a gente, para que servem e como você controla isso.
        </p>

        <Bloco titulo="Quem cuida dos seus dados">
          <p>
            <strong>CAREFIT CLUB LTDA</strong> (CareFit Run Base), CNPJ 51.709.083/0001-23, Av. Áurea
            Apparecida Braghetto Machado, 241, Ribeirão Preto/SP.
          </p>
          <p>
            Encarregado de dados: Gustavo Conrado Couto Rosa Devide. Contato:{" "}
            <a className="text-primary underline underline-offset-2" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>{" "}
            ou WhatsApp (16) 99600-8849.
          </p>
        </Bloco>

        <Bloco titulo="Cookies e anúncios do Google">
          <p>
            Usamos a tag do Google Ads para saber quais páginas são visitadas, quantas pessoas
            clicam em “Agendar” ou no WhatsApp e quais anúncios trouxeram essas visitas.
          </p>
          <p>
            <strong>Só com a sua permissão</strong>, o Google também grava cookies para incluir o
            seu navegador em listas de público da CareFit. Com isso, podemos mostrar anúncios da
            CareFit a quem já conheceu o site (o chamado remarketing). Essas listas não mostram à
            CareFit quem você é, e o Google as mantém por até 540 dias.
          </p>
          <p>
            Se você recusar, o Google recebe apenas sinais sem cookie, que servem para contar visitas,
            e o seu navegador não entra em nenhuma lista. Você pode mudar a sua escolha quando quiser.
          </p>
          {tagAtiva() && (
            <button
              type="button"
              onClick={reabrirCookies}
              className="mt-1 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Mudar minha escolha de cookies
            </button>
          )}
          <p className="text-sm">
            O site também guarda nesta aba do navegador, até ela ser fechada, de qual anúncio ou
            link você veio. Esse registro serve para identificar a origem da mensagem quando você
            nos chama no WhatsApp.
          </p>
        </Bloco>

        <Bloco titulo="O que você nos envia">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Formulário de contato:</strong> nome, e-mail, telefone, objetivo e mensagem,
              para respondermos ao seu pedido.
            </li>
            <li>
              <strong>Agendamentos</strong> (fortalecimento, yoga e primeira sessão): nome e
              contato (telefone ou e-mail), para reservar o seu horário e confirmar com você.
            </li>
            <li>
              <strong>Ficha pré-aula:</strong> rotina de treino, provas e informações de saúde que
              você escolhe contar (dores, lesões, cirurgias e condições). Esses dados são sensíveis
              e servem só para planejar o seu atendimento com segurança. Só a equipe que atende
              você tem acesso a eles.
            </li>
            <li>
              <strong>Pesquisa de satisfação:</strong> as suas respostas sobre o atendimento, para
              melhorarmos o serviço.
            </li>
            <li>
              <strong>WhatsApp:</strong> ao clicar no botão, você sai do site e vai para o WhatsApp,
              que segue a política da Meta. A mensagem pronta pode incluir de onde você veio (por
              exemplo, “google”).
            </li>
          </ul>
          <p>
            Quem é atendido na base assina a ficha de cadastro e termos da CareFit, que detalha o
            tratamento dos dados de atendimento.
          </p>
        </Bloco>

        <Bloco titulo="Com quem compartilhamos">
          <p>
            Não vendemos dados. Usamos empresas que operam sistemas para nós, cada uma só com o
            necessário: Google (anúncios, planilhas e agenda), Meta (WhatsApp), ClickUp (cadastro
            e acompanhamento dos atletas), Railway e Render (hospedagem do site e do servidor) e a
            nossa ferramenta de automação (n8n). Alguns desses serviços guardam dados em servidores
            fora do Brasil.
          </p>
        </Bloco>

        <Bloco titulo="Por quanto tempo">
          <p>
            Guardamos os dados enquanto houver relacionamento com você e, depois disso, pelo prazo
            que a lei ou o conselho profissional exigir. Dados de contato de quem não virou
            atleta podem ser apagados a qualquer momento, se você pedir.
          </p>
        </Bloco>

        <Bloco titulo="Seus direitos">
          <p>
            A Lei Geral de Proteção de Dados (LGPD) garante a você o direito de confirmar se
            tratamos seus dados, acessá-los, corrigi-los, pedir que sejam apagados ou anonimizados,
            levá-los para outro serviço, saber com quem foram compartilhados e retirar o seu
            consentimento. Para isso, escreva para{" "}
            <a className="text-primary underline underline-offset-2" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            . Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
          <p>Menores de 18 anos usam os nossos serviços com o acompanhamento de um responsável.</p>
        </Bloco>

        <Bloco titulo="Mudanças nesta política">
          <p>
            Se este texto mudar, a versão e a data no topo da página mudam junto.
          </p>
        </Bloco>
      </main>
      <Footer />
    </div>
  );
};

export default Privacidade;
