# Como publicar no Jornal do 016

> **O que este veículo é.** O Jornal do 016 é o jornal da corrida de Ribeirão Preto e
> região, mantido pela CareFit Run Base. Lema: **runner ajuda runner** — cada texto
> existe para ser útil a quem corre aqui, não para vender a clínica. A venda vem de
> ser o lugar onde o corredor de Ribeirão se informa, não de empurrar serviço no meio
> da notícia.

Este arquivo é o contrato. Vale para humano e para agente — o pipeline automático
(radar → Claude → post) escreve seguindo exatamente o que está aqui.

Publicar um post = criar um `.md` nesta pasta, commitar e dar push na `main`.
O Railway rebuilda e o post entra no ar. Não há CMS, banco nem painel.

Arquivos começados com `_` são de apoio e nunca viram post.

## O arquivo

Nome do arquivo = slug da URL. `provas-de-corrida-ribeirao-preto-setembro-2026.md`
vira `/blog/provas-de-corrida-ribeirao-preto-setembro-2026`.

Slug em minúsculas, sem acento, separado por hífen. Se a pauta for local, **inclua
"ribeirao-preto"** — é o termo que traz busca.

## Frontmatter (obrigatório)

```markdown
---
titulo: As provas de corrida de Ribeirão Preto em setembro de 2026
descricao: Uma frase que aparece no Google e no card do blog. Até 155 caracteres.
data: 2026-08-19
autor: Equipe CareFit
categoria: Provas
tags: [provas, ribeirao-preto, calendario]
local: true
status: publicado
fontes:
  - Calendário VaiCorrendo | https://www.vaicorrendo.com/calendario-de-corridas-2026/
  - Instagram @jbx.sports | https://www.instagram.com/jbx.sports/
---
```

| Campo | O que é |
|---|---|
| `titulo` | Vira o `<h1>` e o title da aba. **Não repita no corpo.** |
| `descricao` | Meta description e subtítulo do card. Uma frase, até 155 caracteres. |
| `data` | `AAAA-MM-DD`. Ordena a listagem — a mais recente vira destaque. |
| `autor` | "Equipe CareFit" no padrão; nome próprio quando for texto assinado. |
| `categoria` | Uma só, e tem que ser exatamente uma destas — são as seções do jornal: `Provas`, `Resultados`, `A cidade`, `Treino`, `Serviços`. |
| `tags` | 2 a 5, minúsculas com hífen. |
| `local` | `true` quando a pauta é ancorada em Ribeirão e região — acende o selo 📍. |
| `status` | `publicado` ou `rascunho`. Rascunho fica fora da listagem, do sitemap e leva `noindex`, mas abre pela URL direta (é assim que se revisa). |
| `fontes` | `Título | URL`, uma por linha. Toda afirmação factual precisa de uma. |

## Regra de autonomia (a que o agente obedece)

**Publica direto (`status: publicado`):** pauta factual e local — calendário de provas,
cobertura de evento da cidade, notícia que afeta quem corre em Ribeirão, agenda,
resultado, bastidor da base.

**Entra como `rascunho` e avisa o Gustavo:** qualquer texto que faça afirmação
clínica ou de eficácia — lesão, tratamento, recovery, luz vermelha, gelo, suplemento,
"reduz dor", "acelera recuperação", "previne". Esse conteúdo só vai ao ar depois do
Diretor de Fisio conferir. Na dúvida entre os dois casos, é rascunho.

## Como escrever

- **Comece pelo que interessa.** Nada de "a corrida vem crescendo no Brasil".
  A primeira frase já entrega o fato.
- **Português do dia a dia**, segunda pessoa, sem jargão. Se usar termo técnico,
  explique na mesma frase.
- **Sem promessa de cura, sem número inventado.** Dado sem fonte não entra.
- **Estrutura:** notícia curta tem de 250 a 500 palavras; matéria de fôlego, de 700 a
  1.200. `##` a cada 2–4 parágrafos, listas e tabelas quando ajudarem a escanear.
- **Metade do jornal é Ribeirão.** Notícia nacional ou internacional entra quando um
  corredor daqui se importa — e o texto diz por quê. Sem essa ponte, não entra.
- **Não abra com `# Título`** — o título do frontmatter já vira o `<h1>`. Comece em `##`.
- **Fecho:** uma ponte natural para a CareFit, sem discurso de venda. O CTA do rodapé
  já existe na página.

## Antes de commitar

```bash
npm run build   # o prebuild também atualiza o sitemap
```


## A agenda de provas é um arquivo, não um texto

`src/content/agenda-provas.json` é a fonte única do calendário: alimenta a barra
lateral do jornal, a régua "esta semana" e qualquer post de calendário. Quando uma
prova nova aparecer, ou uma data mudar, **edite o JSON** — não só o texto do post.

O campo `confirmado` é honestidade, não enfeite:

- `true` — a data foi conferida **na página do organizador ou na prova oficial**.
- `false` — veio do calendário regional ou de post de terceiro. O site mostra
  "data não confirmada na fonte" embaixo, e está tudo bem: é melhor publicar com a
  ressalva do que fingir certeza.

## Seção Serviços — quem atende corredor em Ribeirão

O jornal cobre quem serve o corredor da cidade: assessoria, loja, fisio, nutrição,
podologia, massagem, fotógrafo de prova, ponto de retirada de kit. Regras:

- É **serviço ao leitor**, não publicidade. Nada de superlativo, nada de "o melhor".
- Concorrente da CareFit entra normalmente se for útil ao corredor. Omitir alguém
  porque compete com a casa quebra o "runner ajuda runner" — e o leitor percebe.
- Nunca publique preço, telefone ou endereço sem fonte pública verificável.
