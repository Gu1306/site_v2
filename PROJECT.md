---
slug: carefit-site
status: ativo
objetivo: Manter e evoluir o site institucional e os fluxos digitais de conversão e agendamento da CareFit Run Base
nota-mae: "20_CareFit/02_Negocio/marketing/site-seo/carefit-site-seo-e-conversao.md"
proxima-acao: Lucas importar o primeiro Excel no painel e validar o treino aplicado no PC espelhado na TV
---

# CareFit Site

## Sistemas relacionados

- GitHub: `Gu1306/site_v2`
- Hospedagem: Railway, com deploy a partir da branch `main`
- Automação: n8n
- Agenda e reservas: Google Calendar, Google Sheets e Google Apps Script

## Caminhos importantes

- Código do site: `C:\Projetos\carefit-site\src`
- Página da ficha pré-aula: `src/pages/FichaPreAula.tsx`
- Design aprovado do agendamento: `design/agendamento-fortalecimento/prototipo-aprovado.html`
- Handoff para implementação: `design/agendamento-fortalecimento/HANDOFF-CLAUDE.md`
- Como ligar o agendamento: `design/agendamento-fortalecimento/IMPLEMENTACAO.md`
- Página de agendamento: `src/pages/AgendamentoFortalecimento.tsx` (rota `/agendamento-fortalecimento`)
- Cliente da API de agendamento: `src/services/agendamentoFortalecimento.ts`
- Automação atual da reserva e API do agendamento: `C:\Projetos\carefit-clickup-automacoes\apps-script\agenda-fortalecimento.gs`
- Painel interno de fortalecimento: `src/pages/PainelFortalecimento.tsx` (rota privada `/painel-fortalecimento`)
- Backend privado do painel: `server/index.mjs` e `server/fortalecimento.mjs`
- Operação, arquitetura e publicação: `design/fortalecimento-tv/OPERACAO.md`
- Modelo Excel de treinos: `public/modelo-treinos-carefit.xlsx`
- Validação da importação: `src/lib/fortalecimentoImport.ts`
- Página pública do teste de força: `src/pages/TesteDeForca.tsx` (rota `/teste-de-forca-ribeirao-preto`)
- Painel interno da avaliação de força: `src/pages/PainelAvaliacaoForca.tsx` (rota privada `/painel-avaliacao-forca`)
- Leitura do Excel e cálculo da avaliação: `src/lib/avaliacaoForca.ts`
- Gravação da avaliação no CRM: `server/avaliacao-forca.mjs`
- Protocolo e decisões técnicas do serviço: `C:\Projetos\carefit-avaliacao-forca`

## Dados sensíveis

- Credenciais de produção vivem nos serviços correspondentes e em arquivos locais ignorados pelo Git; nunca registrar valores neste arquivo.

## Decisões importantes

- 2026-09-12: preview de link passou a ser por rota, no servidor. O robô do WhatsApp não roda JavaScript e, como o site é uma SPA, lia sempre o `index.html` — o preview de qualquer link caía na foto de corrida e no título institucional. O `useSeo` não resolve isso: roda no cliente, depois que o robô já foi embora. O mapa `PREVIEWS` no topo de `server/index.mjs` reescreve title/description/canonical/og/twitter; incluir outra rota é acrescentar uma entrada. Vale hoje para `/ficha` e `/agendamento-fortalecimento`.
- 2026-09-12: a imagem de preview (`public/og-fortalecimento.jpg`) usa só a faixa da foto da arte de fortalecimento, sem o texto dela. O cartão do WhatsApp já mostra título e descrição como texto, então repetir a frase na imagem só tira espaço da foto.
- 2026-09-12: esta alteração foi publicada por uma `git worktree` separada, porque havia sessão do Codex ativa no repo com a branch `feat/teste-de-forca` em aberto. Copiar o `server/index.mjs` inteiro teria arrastado o painel de avaliação inacabado para produção; só o bloco do preview foi aplicado sobre a versão da `main`.

- 2026-09-10: painel privado de fortalecimento publicado em `https://www.carefitrunbase.com.br/painel-fortalecimento`, com servidor Node, autenticação própria da equipe, prescrição em subtarefas do CRM, cópia imutável do treino por aula, modo TV com até três atletas e evolução confirmada antes do status `realizada`. Acesso separado do login ClickUp. Manter uma réplica do serviço.
- 2026-09-10: corrigida a leitura do retorno Markdown do ClickUp. O painel prioriza `description`, aceita o formato escapado de `markdown_description`, envolve novos registros em bloco de código e consolida tentativas repetidas pelo `requestId` sem apagar subtarefas já criadas. Treinos que falharam apenas na confirmação são recuperados automaticamente.
- 2026-09-10: painel ganhou importação de Excel para vários atletas. O arquivo padrão tem uma linha por exercício; o navegador valida e associa o nome ao CRM antes de usar o mesmo fluxo versionado do formulário individual. Importar salva no card do atleta e não substitui a escolha manual **Usar nesta aula**.

- 2026-09-12: publicada a página pública do teste de força com preço (R$ 250 avulso, R$ 190 com plano ativo). É a primeira página do site a exibir valor. A seção "o que ele não responde" é deliberada: o protocolo da CareFit proíbe tratar assimetria isolada como diagnóstico ou indicador de risco, então a página não promete previsão de lesão.
- 2026-09-12: painel interno da avaliação de força em `/painel-avaliacao-forca`. A equipe digita nome, nascimento e peso, anexa o Excel do FightTech, e o navegador lê o arquivo, calcula e monta o relatório. Nada sai do computador antes de clicar em salvar. O cookie de sessão passou de `Path=/api/fortalecimento` para `Path=/api`, então os dois painéis compartilham o mesmo login da equipe.
- 2026-09-12: o relatório usa apenas comparações internas — assimetria entre os lados, razão entre músculos opostos e evolução do próprio atleta. **Não** compara com a tabela de valores de referência de `dados de.xlsx`: ela é a tabela da Kinology, medida com a cinta no tornozelo, enquanto o protocolo CareFit prende na coxa. O braço de alavanca dobra e o valor em kg quase dobra junto, o que faria todo atleta aparecer acima do esperado.
- 2026-09-12: o relatório também **não** traz a faixa de "chance de lesão" que a Kinology usa (até 10% baixa, 10–20% média, acima de 20% alta). Contradiz o manual da CareFit e a literatura não sustenta esses limiares.
- 2026-09-12: o peso é digitado pela equipe no painel, não lido do cadastro do aplicativo. A força relativa depende dele, e ninguém audita o cadastro do FightTech.
- 2026-09-12: salvar grava uma subtarefa no card do atleta no ClickUp, com a tabela legível e o JSON embutido, e anexa o Excel original. Mesmo desenho do painel de fortalecimento: idempotência por `requestId` e releitura para confirmar.
- 2026-09-12: o de-para dos nomes de exercício do app está incompleto de propósito. Só um dos sete nomes é conhecido (`Flexão Isométrica do Quadril`); os outros aparecem no painel para a equipe mapear na mão até a primeira sessão completa revelar como o app os nomeia.

- 2026-07-22: o site atual é o repositório `site_v2`; o backend antigo do zip inicial foi removido porque nunca esteve conectado à produção.
- 2026-09-05: a ficha pré-aula do fortalecimento passou a existir em `/ficha` e se comunica com o n8n.
- 2026-09-05: Gustavo aprovou o design de agendamento em formato de calendário mensal, com a data abrindo os horários disponíveis.
- 2026-09-05: o protótipo está aprovado, mas a página de reserva ainda não foi implementada nem publicada.
- 2026-09-05: a página de agendamento foi implementada em `/agendamento-fortalecimento`, com a API no Web App do próprio Apps Script (e não no n8n) — é lá que estão a agenda, a planilha, o e-mail e o `LockService`, a única trava real contra overbooking.
- 2026-09-05: a reserva feita pelo site grava na mesma planilha e no mesmo formato do Google Forms, de propósito: é o que mantém o workflow n8n `NMeynniWMn8Eu3te` e o consumo de crédito no ClickUp funcionando sem alteração.
- 2026-09-05: o horizonte do formulário continua em 15 dias; a API do site tem o seu próprio (21 dias por padrão, teto de 180). Mexer no formulário mudaria o que os atletas veem hoje.
- 2026-09-05: agendamento NO AR. Web App publicado, deploy do site feito, e o teste de concorrência na última vaga passou em produção — duas reservas simultâneas, uma entrou e a outra recebeu `LOTADA`. O Google Forms segue em paralelo: os dois escrevem na mesma planilha.
- 2026-09-05: a URL /exec vive no código, não em variável do Railway. Ela aparece no bundle de qualquer jeito (o navegador a chama), então a env var só adicionava uma forma silenciosa de falhar. O `Dockerfile` ganhou o ARG/ENV para o override continuar possível.
