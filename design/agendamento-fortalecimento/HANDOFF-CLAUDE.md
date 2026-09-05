---
data: 2026-09-05
status: design-aprovado-implementacao-pendente
projeto: carefit-site
relacionado: carefit-clickup-automacoes
---

# Handoff — agendamento do fortalecimento CareFit

## Objetivo

Substituir a experiência visual do Google Forms por uma página de agendamento no site da CareFit, sem perder a contagem de vagas, a confirmação e as integrações que já funcionam.

O Gustavo aprovou o design em formato de calendário mensal. Este documento reúne o contexto necessário para continuar no Claude sem redescobrir decisões ou quebrar a operação atual.

## Estado no momento do handoff

- **Design:** aprovado pelo Gustavo em 05/09/2026.
- **Implementação React:** ainda não iniciada.
- **Backend/API da página:** ainda não implementado.
- **Deploy:** nenhum deploy desta página foi feito.
- **Reserva em produção:** continua pelo Google Forms e Apps Script atuais.

## Protótipo aprovado

Abrir localmente:

`C:\Projetos\carefit-site\design\agendamento-fortalecimento\prototipo-aprovado.html`

Características aprovadas:

- visual da CareFit: verde escuro, off-white, dourado e laranja;
- calendário mensal como elemento principal;
- datas com aula identificadas por ponto verde;
- clique na data abre os horários daquele dia;
- cada horário mostra início, término e vagas restantes;
- navegação para meses futuros por setas;
- resumo da escolha antes de continuar;
- etapa final com nome, WhatsApp e e-mail;
- no celular, data e horários ficam empilhados e a tela desce automaticamente para os horários depois do clique;
- fluxo explícito em três etapas: data, horário e dados.

O protótipo usa dados simulados e não faz chamadas externas. Ele é referência de UX, não código pronto de produção.

## O que foi corrigido na automação atual

Projeto Apps Script: `Agenda Fortalecimento`

- ID: `1LJZaY5Izgnm4wU0fIczy9dh0-9DagJUWBRZaqG1VKtUM-4jdIRMy8F1a`
- Editor: `https://script.google.com/home/projects/1LJZaY5Izgnm4wU0fIczy9dh0-9DagJUWBRZaqG1VKtUM-4jdIRMy8F1a/edit`
- Formulário público: `https://docs.google.com/forms/d/e/1FAIpQLSdn0d3K7CfPCQsabilRVtkvEdy4WzBUbgiBez_H0im6v7pBtA/viewform`
- Planilha de respostas: `1ufIbpp-8FM1K-ClDwdvlSmZgjt-_B7sZDdOk8OXtqJ0`, aba gid `1027494207`
- Agenda: `c_7c89b9d6325be9c20ccfe7d7464b05f8a8ba654981e3d6c61bd8d96f701e193b@group.calendar.google.com`
- Fonte local restaurável: `C:\Projetos\carefit-clickup-automacoes\apps-script\agenda-fortalecimento.gs`

Alterações validadas em produção:

1. `VAGAS_PADRAO` foi corrigido de 4 para 3.
2. `lerAgenda_()` passou a ler `ev.getEndTime()`.
3. O rótulo passou a mostrar início e término, por exemplo: `Seg 07/09 — 06h00 às 07h00 (3 vagas)`.
4. Gustavo executou `sincronizarVagas`: o log mostrou 18 aulas e 18 opções publicadas.
5. O formulário público foi conferido: todos os horários exibiam início e término; uma turma apareceu com duas vagas porque já havia uma reserva ativa.
6. `chaveDoTexto_()` continua usando apenas `dd/MM HH:mm` do início da aula, preservando compatibilidade com as reservas antigas e com o n8n.

## Como a reserva funciona hoje

1. A agenda `CareFit - Fortalecimento` contém os eventos recorrentes. O título pode informar a capacidade, por exemplo `FORTALECIMENTO (3 VAGAS)`.
2. O Apps Script lê os próximos **15 dias** da agenda (`DIAS_A_FRENTE = 15`).
3. Ele conta, na planilha vinculada ao Forms, as respostas não canceladas.
4. A pergunta `Escolha sua aula` é reescrita somente com turmas que ainda possuem vaga.
5. Há acionador de hora em hora e acionador no envio do formulário.
6. `aoEnviarFormulario(e)` envia a confirmação com `MailApp` e chama novamente `sincronizarVagas()`.
7. O workflow n8n `NMeynniWMn8Eu3te` lê a planilha e casa a reserva com o atleta para consumir um crédito no ClickUp.

## Dependências que a nova página precisa preservar

Esta é a parte mais importante do handoff.

### 1. A página não deve acessar a planilha diretamente

O navegador não deve receber credencial, permissão de edição ou acesso público ao Google Sheets. Usar uma API intermediária em n8n ou Apps Script Web App.

### 2. O envio do Google Forms hoje faz mais do que gravar uma linha

Se a página nova simplesmente gravar na planilha, o acionador `aoEnviarFormulario(e)` não será executado. Portanto, a nova API precisa assumir explicitamente:

- validação da disponibilidade no momento da reserva;
- gravação da reserva;
- confirmação por e-mail;
- recálculo/publicação das vagas enquanto o Forms coexistir;
- resposta clara de sucesso, lotação ou erro.

### 3. O n8n depende do formato atual da planilha

Para a primeira versão, o caminho de menor risco é manter um adaptador que grave na mesma planilha e preserve os cabeçalhos usados pelo workflow, especialmente `Escolha sua aula`, nome, e-mail, telefone e a coluna imediatamente à direita usada como cancelamento.

Se a estrutura mudar, revisar e testar `NMeynniWMn8Eu3te` antes de publicar.

### 4. Evitar reserva acima da capacidade

O `GET` de horários serve somente para exibição. No `POST` da reserva, o servidor deve reler disponibilidade e gravar dentro de uma trava (`LockService` no Apps Script ou mecanismo equivalente). Nunca confiar no número de vagas enviado pelo navegador.

### 5. O horizonte atual não atende totalmente ao design aprovado

O Apps Script lê apenas 15 dias. O requisito aprovado é mostrar a semana atual e mais duas semanas, além de permitir navegação futura. A API deve aceitar intervalo de datas ou paginação mensal; no mínimo, aumentar o horizonte inicial para 21 dias sem limitar a consulta futura.

## Contrato de API sugerido

### `GET /agendamento-fortalecimento/horarios?inicio=YYYY-MM-DD&fim=YYYY-MM-DD`

Resposta por aula:

- identificador estável;
- início e término em ISO com fuso `America/Sao_Paulo`;
- capacidade;
- reservas ativas;
- vagas restantes;
- status disponível ou lotada.

### `POST /agendamento-fortalecimento/reservas`

Entrada:

- identificador da aula;
- nome;
- e-mail;
- telefone;
- chave de idempotência.

O servidor deve validar, travar, reler a vaga, gravar, confirmar e responder. Em caso de concorrência, retornar `409` quando a última vaga tiver sido ocupada.

## Caminho de implementação sugerido no site

1. Criar a rota `/agendamento-fortalecimento` no `App.tsx`.
2. Implementar a página React seguindo o protótipo aprovado e os componentes/tokens já usados no site.
3. Reaproveitar o padrão de webhook/CORS já validado em `src/pages/FichaPreAula.tsx` e nos workflows da ficha, sem copiar segredos para o frontend.
4. Implementar a leitura real de horários.
5. Implementar a reserva com trava e idempotência.
6. Preservar temporariamente a escrita compatível com a planilha atual para não quebrar o consumidor do ClickUp.
7. Validar desktop e celular, incluindo o auto-scroll dos horários no mobile.
8. Fazer teste concorrente da última vaga.
9. Só depois decidir quando o Google Forms deixa de ser a porta pública.
10. Publicar somente após autorização explícita do Gustavo e registrar o deploy no diário do Diretor de Tecnologia.

## Critérios de aceite

- calendário inicia no período atual e navega para datas futuras;
- somente datas com aula são clicáveis;
- horários mostram início, término e vagas reais;
- turma lotada não pode ser reservada;
- duas tentativas simultâneas não ultrapassam a capacidade;
- reserva chega ao mesmo fluxo do ClickUp sem alterar o saldo incorretamente;
- confirmação chega ao e-mail informado;
- telefone é normalizado para E.164 antes de integrações que exigem esse formato;
- erros de CORS, rede e lotação têm mensagem compreensível;
- experiência funcional a partir de 320 px;
- nenhum segredo, ID de credencial ou permissão da planilha aparece no bundle do navegador.

## Arquivos para começar

- `C:\Projetos\carefit-site\PROJECT.md`
- `C:\Projetos\carefit-site\design\agendamento-fortalecimento\prototipo-aprovado.html`
- `C:\Projetos\carefit-site\src\pages\FichaPreAula.tsx`
- `C:\Projetos\carefit-site\src\App.tsx`
- `C:\Projetos\carefit-clickup-automacoes\apps-script\agenda-fortalecimento.gs`
- `G:\Meu Drive\Mundo de Gu\Mundo de GU\20_CareFit\01_Tecnico\fortalecimento\STATUS-DO-SISTEMA-fortalecimento.md`
- `G:\Meu Drive\Mundo de Gu\Mundo de GU\20_CareFit\carefit-wiki\wiki\diretor-tech\registro-de-sistemas.md`
- `G:\Meu Drive\Mundo de Gu\Mundo de GU\20_CareFit\carefit-wiki\wiki\diretor-tech\backlog-tecnico.md`

## Observações de coordenação

- A memória operacional define o Claude como dono de `carefit-site`; este arquivo é o handoff formal do Codex.
- O repositório estava limpo e sincronizado com `origin/main` no início deste registro (`fbecf0b`).
- Estes arquivos de documentação e design foram adicionados localmente, sem deploy e sem alteração na aplicação de produção.
- Não apagar nem substituir a página `/ficha`; ela é outro fluxo, já em produção.
