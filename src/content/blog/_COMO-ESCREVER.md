# Como publicar no blog da CareFit

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
| `categoria` | Uma só: `Provas`, `Treino`, `Lesões`, `Recovery`, `Bastidores`, `Cidade`. |
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
- **Estrutura:** de 500 a 1.200 palavras, `##` a cada 2–4 parágrafos, listas e
  tabelas quando ajudarem a escanear.
- **Não abra com `# Título`** — o título do frontmatter já vira o `<h1>`. Comece em `##`.
- **Fecho:** uma ponte natural para a CareFit, sem discurso de venda. O CTA do rodapé
  já existe na página.

## Antes de commitar

```bash
npm run build   # o prebuild também atualiza o sitemap
```
