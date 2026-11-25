# Direção de arte web da CareFit (prompt)

**Como usar:** toda página nova ou redesenho neste repositório segue este arquivo. Fora daqui, copie tudo a partir de "O prompt" até o fim, preencha a seção 12 com a página que você quer e cole no Claude ou no Cursor.

**Duas cópias:** esta e a do vault, em `20_CareFit/02_Negocio/marketing/CareFit-Direcao-de-Arte-Web.md`. Mudou uma, mude a outra.

**De onde vieram os valores (25/11/2026):** `src/pages/home.css` e `src/pages/Index.tsx` da home de posicionamento (no ar desde 24/11), tokens do `CareFit-Design-System.md` v1.0 do vault (a paleta digital é a mesma), voz em `C:\Projetos\carefit-sistema-conteudo\instancia\voz.md`. Contrastes medidos pela fórmula WCAG.

**Quando atualizar:** sempre que a home mudar de cor, fonte ou seção. A home é a página-modelo; este prompt descreve a home.

---

## O prompt

### PAPEL

Você vai construir uma página do site da CareFit Run Base (carefitrunbase.com.br), clínica de fisioterapia esportiva e recovery só para corredores, em Ribeirão Preto. Esta direção de arte já tomou as decisões de layout, tipografia, cor, movimento e texto. Não troque nenhuma por gosto próprio. Se algo não estiver coberto aqui, escolha a opção mais contida e diga no fim o que decidiu.

A home (`src/pages/Index.tsx` + `src/pages/home.css`) é a página-modelo. Toda página nova tem que parecer feita pela mesma mão. Na dúvida, copie a solução da home.

**Posicionamento em uma frase:** a CareFit não é recovery por equipamento. É um fisioterapeuta com um corredor, uma hora inteira, e a sessão decidida por avaliação. O visual tem que dizer "cuidado individual e técnico". Nunca "clínica com aparelhos em fila", nunca "startup de tecnologia".

### 01 · COR

| Token | Hex | Uso |
|---|---|---|
| `--forest` | `#1A3C34` | texto principal, botão principal, faixas escuras |
| `--forest-hover` | `#2A5C50` | hover do botão principal |
| `--paper` | `#F5F5F0` | fundo da página |
| `--sage` | `#E9EDE5` | faixa clara alternada, coluna em destaque |
| `--sage-hover` | `#E4EADF` | hover sobre sálvia, etiqueta |
| `--muted` | `#536760` | texto secundário, numeração (5,5:1 no papel) |
| `--title-sage` | `#6C8273` | só a última linha do título grande (3,8:1, só em 24px ou mais) |
| `--line` | `#DCE1D8` | linha fina |
| `--line-strong` | `#BCC9BF` | linha no topo de cartão |
| `--terracota` | `#C8622A` | ícone, anel de foco, marcador, texto de 24px ou mais (3,7:1 no papel: reprova em texto pequeno) |
| `--terracota-texto` | `#A84F1D` | acento em texto pequeno (5,0:1 no papel, 4,7:1 no sálvia) |
| `--gold` | `#D4A656` | só sobre a faixa verde: bandeira, ponto, rótulo (5,4:1) |

Sobre a faixa verde: texto `#D1DDD3`, rótulo `#A9C0B5`, linhas em branco com 12% a 28% de opacidade.

- Proporção por página: papel e sálvia uns 75%, verde uns 20%, terracota e dourado juntos no máximo 5%.
- No máximo duas faixas verdes por página: uma no meio para explicar, uma no fim para convidar.
- Terracota é marcador, não fundo. Nunca botão terracota, nunca seção terracota.
- Dourado só aparece sobre verde.
- Sem gradiente de cor. O único gradiente permitido é a sombra escura no pé da foto para a legenda (transparente até `rgba(10,35,28,.8)`, da metade para baixo).
- Não use `--gradient-hero`, `--gradient-warm`, `--shadow-glow` nem `--transition-bounce` do `index.css`: são resto do tema antigo.
- Sem roxo, azul, neon, preto puro. Branco puro só dentro de botão ou de texto sobre verde.
- O verde `#0E3C41` e o bege `#F4EDE4` são as cores do logo e das peças impressas. Na página, valem os tokens acima.
- Texto apagado é sempre `--muted`. Não clareie mais que isso: cinza mais claro reprova no contraste.

### 02 · TIPOGRAFIA

Montserrat nos títulos e números, Poppins no resto. As duas já estão carregadas no `index.html`. Não traga outra fonte.

- **H1:** Montserrat 600, `clamp(40px, 4.7vw, 66px)`, entrelinha 1.07, tracking -0.045em. Duas ou três linhas curtas, quebradas à mão com `<br />`. A última linha em `--title-sage`. Exemplo: "Uma hora inteira. / Um fisioterapeuta. / Só você."
- **H2:** Montserrat 500, `clamp(28px, 3.3vw, 43px)`, entrelinha 1.17, mesmo tracking. Quase sempre em duas linhas, a segunda completando a primeira: "Primeiro a gente entende. / Depois a gente trata."
- **H3:** Montserrat 600, 20px, entrelinha 1.3 (16 a 17px em grade densa).
- **Lead** (parágrafo de abertura): Poppins 16px, entrelinha 1.85, largura máxima 480px, cor `--muted`.
- **Corpo:** Poppins 14px, entrelinha 1.8. Nunca abaixo de 13px em texto corrido.
- **Eyebrow** (rótulo acima do título): 11px, peso 600, maiúsculas, tracking 0.13em (9px no celular). É o único lugar com caixa alta.
- **Número de prova:** Montserrat 500, 30 a 36px, tracking -0.04em, com legenda de 10 a 12px embaixo.
- **Numeração de passos:** "01", "02", 11px, cor `--muted`.
- Título em frase normal, nunca em Title Case: "Conheça a equipe", não "Conheça Nossa Equipe".
- Parágrafo com mais de duas linhas fica alinhado à esquerda. Centralize só rótulo curto ou botão isolado.
- Big Shoulders Display existe só para nome de plano e número grande em página de preço.

### 03 · ESPAÇO E GRADE

- Container com largura máxima de 1200px. Margem lateral de 40px (28px até 1000px de tela, 22px até 700px).
- Seção: 90px em cima e embaixo (56px no celular). Faixa colorida: 65 a 85px (50px no celular).
- Texto ao lado de imagem: duas colunas `1.1fr / 1fr`, espaço de 60 a 90px. Abaixo de 700px, uma coluna, com texto antes da imagem.
- Itens de lista e cartões se separam por uma linha fina no topo (1px `--line-strong` e 20 a 22px de respiro). Não por caixa com sombra.
- Raio: 5px em foto, vídeo e botão; 6 a 8px em painel. Nada de 12px, 16px ou pílula arredondada em tudo.
- Sem sombra. A profundidade vem da troca de fundo: papel, sálvia, verde.

### 04 · COMPONENTES

- **Botão principal:** fundo `--forest`, texto branco, Poppins 13px 600, altura mínima 54px, padding 16px 23px, raio 5px, seta `ArrowRight` de 18px à direita com 16px de espaço. Hover em `--forest-hover`, 200ms. Sobre a faixa verde: fundo `--paper` e texto `--forest`.
- **Link secundário:** texto 13px 500 com `ArrowUpRight`, sublinhado no hover (offset 5px). É assim que o WhatsApp aparece: "Prefere conversar? Fale com a equipe".
- Um botão principal por tela visível. Dois botões iguais lado a lado não existem aqui.
- Botão `variant="outline"` do shadcn sobre fundo escuro precisa de fundo explícito (`bg-white/10`). Sem isso fica branco no branco.
- **Ícones:** lucide-react, 14 a 18px, traço padrão, sempre `aria-hidden`. Check em terracota para lista do que a pessoa recebe. Nunca ícone dentro de círculo colorido.
- **Comparação:** três colunas (tema, o comum, a CareFit). A coluna CareFit em `--sage` com cabeçalho `--forest`. O comum em `--muted`. No celular, cada linha vira um cartão empilhado com rótulo pequeno.

### 05 · FOTO E VÍDEO

- Só foto real do acervo da CareFit (`G:\Meu Drive\PROJETO CARE SPACE\Fotos`). Nunca banco de imagem, nunca pessoa gerada por IA, nunca celular com tela inventada.
- Pessoa antes de equipamento. A sala com as botas em fila abrindo a página foi exatamente o que fazia a CareFit parecer "recovery em massa".
- Se a foto certa não existe (hoje não há foto de fisioterapeuta atendendo corredor), use a melhor foto real que houver e avise no fim o que precisa ser fotografado. Não disfarce a falta.
- **Foto de abertura:** retrato vertical, raio 6px, legenda branca no pé sobre a sombra escura, com nome e função em 10px embaixo.
- Toda imagem com `width`, `height` e `alt` que diz quem é e o que faz ("Lívia Dias, fisioterapeuta esportiva da CareFit Run Base"). A primeira com `fetchPriority="high"`, as outras com `loading="lazy"`.
- **Vídeo de relato:** vertical 9:16, `preload="none"` com capa. Só um toca por vez. Autoplay mudo em loop só para vídeo de ambiente sem fala.

### 06 · MOVIMENTO

Na CareFit, movimento existe para explicar, não para enfeitar. A página tem que funcionar inteira com o movimento desligado.

- Uma curva só no site inteiro: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hover: só cor e fundo, em 200ms. Nada cresce, nada pula.
- Troca de conteúdo (aba, passo, semana do ciclo): entra de `translateY(6px)` para 0 com opacidade, em 350ms.
- Animação de dado é bem-vinda quando ensina algo: a linha do ciclo que se desenha, a barra que sobe até o valor, o passo que acende. Use `stroke-dashoffset` e `transform`. Nunca anime `width`, `height`, `top` ou `box-shadow`.
- O título principal nunca começa invisível. `opacity: 0` no H1 atrasa a página e deixa a tela vazia no celular lento.
- Tudo atrás de `prefers-reduced-motion: reduce`, que desliga as transições.
- Proibido: parallax, 3D, shader de fundo, cursor que segue, contador que gira até o número, texto digitado letra a letra, faixa de logos rolando sem fim, carrossel automático, bounce, brilho.

### 07 · TEXTO

É a parte que mais denuncia site feito por IA.

- Português do Brasil, frase curta, uma ideia por frase. "A gente", não "nós". Tom de quem atende conversando, nunca de institucional.
- Acolhedor, técnico, nunca autoritário. Nada de terrorismo de lesão.
- Frases da casa, para usar quando couberem (sem forçar): "A gente não deixa um problema pequeno ficar grande." · "Na CareFit não tem palpite, não tem achismo." · "Fortalecer sabendo o que fortalecer e como fortalecer." · "Você não corre sozinho."
- Zero emoji no site. No máximo um ponto de exclamação por página.
- Proibido: "Transforme sua...", "Descubra o poder", "experiência única", "de ponta", "revolucionário", "eleve sua performance", "correr sem lesões", "resultado garantido", "Saiba mais" sem destino claro.
- Sempre "profissional de educação física", nunca "educador físico".
- Números, só os documentados: 395+ corredores atendidos, 145+ meia maratonistas, 45+ maratonistas (contagem de 15/10/2026). Não invente estatística, porcentagem nem depoimento.
- Preço, duração e nome de oferta, só de `src/lib/ofertasCarefit.ts`. Não existem mais: Jornada Propósito de 12 semanas, R$ 5.400, nutricionista.
- Equipe: Gustavo Rosa (fundador, ultramaratonista), Lívia Dias (fisioterapeuta esportiva), Lais e Igor (fisioterapia), Lucas Pereira (fortalecimento, profissional de educação física), Cintya (yoga). Não invente cargo, título nem especialização.
- Conversa com o treinador do atleta: "sempre que temos essa oportunidade", nunca como garantia.
- Atleta de exemplo inventado vem escrito como ilustrativo na própria página. Dado de atleta real só se for verificável (Strava, resultado oficial). Nunca nome de familiar, horas de sono ou rotina doméstica.

### 08 · SEÇÕES

Todas já existem na home. Monte a página com elas, nesta família de ordem: quem e o quê, prova, explicação, pessoas, convite.

1. **Abertura dividida:** eyebrow, H1 de duas ou três linhas, lead, botão principal e link do WhatsApp de um lado; foto vertical com legenda do outro. 145px de respiro no topo, por causa do menu fixo.
2. **Faixa de prova:** linha fina em cima e embaixo, uma frase curta e três números grandes.
3. **Comparação:** a tabela "o comum × a CareFit" da seção 04.
4. **Passo a passo:** faixa sálvia. De um lado, título, lead e foto; do outro, lista numerada de 01 a 04 com linha entre os itens.
5. **Explicação interativa:** faixa verde com um gráfico ou mapa que o visitante controla (modelo: `src/components/JornadaAtleta.tsx`). No máximo uma por página.
6. **Caminhos:** cartões 2×2 com linha no topo, número, H3, texto e link secundário.
7. **Pessoas:** foto vertical da pessoa e texto curto com nome e o que ela faz.
8. **Relatos:** quatro vídeos verticais, cada um com título curto, a frase da pessoa entre aspas e o nome como rótulo. No celular, rolagem lateral com encaixe.
9. **Convite final:** faixa verde, H2, o que a pessoa recebe em dois ou três itens com check, botão em papel e link para tirar dúvida.

Não use: grade de três cartões com ícone e título genérico, faixa "empresas que confiam", seção de "nossos valores", linha do tempo da empresa. FAQ só com dúvida real de agendamento, até seis perguntas.

### 09 · TÉCNICA (no repositório `carefit-site`)

- React, Vite e TypeScript. Página nova em `src/pages/`, com CSS próprio importado na página e todas as classes sob uma classe raiz que declara os tokens (o padrão do `home.css`: `.carefit-home { --forest: #1a3c34; ... }`). Não mexa no `index.css` global nem no `tailwind.config.ts`.
- Toda página usa `useSeo({ titulo, descricao, caminho })` e termina com `<Footer />`. Rota interna com `Link` do react-router.
- Rota que vai ser compartilhada no WhatsApp precisa de entrada no mapa `PREVIEWS` de `server/index.mjs`, porque o robô do WhatsApp não roda JavaScript.
- Variável `VITE_*` nova precisa de `ARG` no `Dockerfile`, senão a página compila sem ela, sem erro.
- WhatsApp da equipe: `https://api.whatsapp.com/send?phone=5516996008849`, com `target="_blank" rel="noopener noreferrer"`.

### 10 · ACESSIBILIDADE

- Contraste de 4,5:1 em texto de até 23px e de 3:1 em título grande e ícone. Os pares da seção 01 já foram medidos. Cor nova só depois de medir.
- Foco visível em tudo que é clicável: contorno de 3px em terracota com 5px de afastamento. Sobre a faixa verde, o contorno fica dourado (terracota no verde dá só 3,0:1).
- Tabela de verdade em `<table>` ou com `role="table"`, `row` e `cell`. Gráfico com o mesmo conteúdo em texto.
- Área de toque mínima de 40×40px.
- Teste em 390px e em 1280px de largura, sem rolagem horizontal.

### 11 · ANTES DE ENTREGAR

Responda em lista, uma linha cada:

1. Alguma cor fora da seção 01?
2. Algum texto em caixa alta fora do eyebrow?
3. Algum número, preço, nome ou cargo que não veio das fontes da seção 07?
4. Algum gradiente, sombra, efeito de vidro ou emoji?
5. O H1 aparece sem esperar animação?
6. A página funciona com o movimento desligado?
7. Em 390px, sem rolagem lateral?
8. Que decisões você tomou que esta direção não cobria?
9. Que foto ou vídeo está faltando?

### 12 · A PÁGINA DE AGORA

Preencha antes de colar.

- **Página e endereço:**
- **Para quem e em que momento da corrida:**
- **O que a pessoa precisa entender nos primeiros 5 segundos:**
- **Oferta, preço e duração** (de `ofertasCarefit.ts`):
- **Ação principal e destino:**
- **Seções da lista 08, em ordem:**
- **Fotos e vídeos disponíveis** (caminhos):
- **O que não pode faltar / o que não pode aparecer:**
