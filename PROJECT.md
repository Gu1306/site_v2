---
slug: carefit-site
status: ativo
objetivo: Manter e evoluir o site institucional e os fluxos digitais de conversão e agendamento da CareFit Run Base
nota-mae: "20_CareFit/02_Negocio/marketing/site-seo/carefit-site-seo-e-conversao.md"
proxima-acao: Decidir quando o Google Forms deixa de ser a porta publica da reserva de fortalecimento, agora que a pagina do site esta no ar e no menu (o que falta conferir no ClickUp esta no backlog do Diretor de Tech)
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

## Dados sensíveis

- Credenciais de produção vivem nos serviços correspondentes e em arquivos locais ignorados pelo Git; nunca registrar valores neste arquivo.

## Decisões importantes

- 2026-07-22: o site atual é o repositório `site_v2`; o backend antigo do zip inicial foi removido porque nunca esteve conectado à produção.
- 2026-09-05: a ficha pré-aula do fortalecimento passou a existir em `/ficha` e se comunica com o n8n.
- 2026-09-05: Gustavo aprovou o design de agendamento em formato de calendário mensal, com a data abrindo os horários disponíveis.
- 2026-09-05: o protótipo está aprovado, mas a página de reserva ainda não foi implementada nem publicada.
- 2026-09-05: a página de agendamento foi implementada em `/agendamento-fortalecimento`, com a API no Web App do próprio Apps Script (e não no n8n) — é lá que estão a agenda, a planilha, o e-mail e o `LockService`, a única trava real contra overbooking.
- 2026-09-05: a reserva feita pelo site grava na mesma planilha e no mesmo formato do Google Forms, de propósito: é o que mantém o workflow n8n `NMeynniWMn8Eu3te` e o consumo de crédito no ClickUp funcionando sem alteração.
- 2026-09-05: o horizonte do formulário continua em 15 dias; a API do site tem o seu próprio (21 dias por padrão, teto de 180). Mexer no formulário mudaria o que os atletas veem hoje.
- 2026-09-05: agendamento NO AR. Web App publicado, deploy do site feito, e o teste de concorrência na última vaga passou em produção — duas reservas simultâneas, uma entrou e a outra recebeu `LOTADA`. O Google Forms segue em paralelo: os dois escrevem na mesma planilha.
- 2026-09-05: a URL /exec vive no código, não em variável do Railway. Ela aparece no bundle de qualquer jeito (o navegador a chama), então a env var só adicionava uma forma silenciosa de falhar. O `Dockerfile` ganhou o ARG/ENV para o override continuar possível.
