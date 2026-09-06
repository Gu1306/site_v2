---
data: 2026-09-05
status: implementado-local-aguardando-endpoint-e-autorizacao
projeto: carefit-site
relacionado: carefit-clickup-automacoes
---

# Implementação — agendamento do fortalecimento

Continuação de [HANDOFF-CLAUDE.md](HANDOFF-CLAUDE.md). O que este documento cobre: o que
foi construído, as decisões que fechei no caminho, e os passos que só o Gustavo pode dar.

**Nada foi publicado.** O site segue como estava em produção e a reserva continua
acontecendo pelo Google Forms.

## O que existe agora

| Onde | Arquivo | O que é |
|---|---|---|
| Site | `src/pages/AgendamentoFortalecimento.tsx` | A página do calendário aprovado, em React |
| Site | `src/services/agendamentoFortalecimento.ts` | Cliente da API (busca de horários, reserva, E.164, idempotência) |
| Site | `src/App.tsx` | Rota `/agendamento-fortalecimento` + navegação global escondida nela |
| Site | `.env.example` | `VITE_AGENDAMENTO_FORTALECIMENTO_API` documentada |
| Automações | `apps-script/agenda-fortalecimento.gs` | `doGet` / `doPost` do Web App, trava, gravação na planilha e conferência de mapeamento |

## Decisões que fechei

**1. A API é um Web App do próprio Apps Script, não um workflow n8n.**
O handoff deixava as duas portas abertas. Escolhi o Apps Script porque ele já tem a
agenda, a planilha, o e-mail de confirmação e — o que decide a questão — o `LockService`,
que é a única trava real disponível para impedir que duas pessoas levem a mesma última
vaga. Pelo n8n eu precisaria de credencial nova, de um mecanismo de trava inventado e de
uma segunda cópia da regra de vagas. O n8n continua fazendo o que já fazia: ler a planilha
e consumir o crédito no ClickUp.

**2. A reserva do site grava na MESMA planilha, no MESMO formato.**
O rótulo escrito na coluna `Escolha sua aula` sai idêntico ao que o formulário escreveria:
`Seg 07/09 — 06h00 às 07h00 (3 vagas)`. É isso que mantém o workflow `NMeynniWMn8Eu3te`
funcionando sem nenhuma alteração. O número entre parênteses é quantas vagas existiam
*antes* desta reserva — igual ao que o formulário mostraria na hora da escolha. Ele existe
só por compatibilidade de formato; ninguém deve usá-lo como dado.

**3. As colunas são encontradas pelo nome do cabeçalho, não pela posição.**
Renomear uma pergunta do formulário quebraria a gravação em silêncio, então antes de
publicar rode `conferirMapeamento()` no editor do Apps Script: ele imprime o cabeçalho real
e qual coluna vai receber aula, nome, e-mail e telefone. Se alguma vier errada, o ajuste é
na lista de termos em `acharColunas_`.

**4. Erro de negócio vem como `200` com `ok: false`.**
O contrato do handoff pedia `409` quando a última vaga acaba. O `ContentService` do Apps
Script não permite escolher o status HTTP — todas as respostas são 200. O `409` virou
`{ ok: false, codigo: "LOTADA" }`, e a página traduz cada código numa frase de gente.
Se um dia a API mudar de casa, o código de status pode voltar sem mexer no frontend.

**5. O horizonte do formulário continua em 15 dias.**
O handoff pedia no mínimo 21 dias para a API. A API tem o seu próprio horizonte
(`API_DIAS_PADRAO = 21`, teto de 180) e aceita qualquer intervalo. Não mexi no
`DIAS_A_FRENTE`, que rege o formulário em produção: aumentar ali mudaria a lista de opções
que os atletas veem hoje, sem ninguém ter pedido.

**6. A página está `noindex`.**
É uma página de reserva divulgada por link direto, e ainda não anunciada. Para deixá-la
aparecer na busca, troque `noindex: true` por `false` no `useSeo` da página.

**7. Sem endpoint configurado, a página não quebra.**
Se `VITE_AGENDAMENTO_FORTALECIMENTO_API` não existir no build, a página mostra
"agendamento online em configuração" e manda para o WhatsApp, em vez de aparecer quebrada.

## Contrato implementado

### `GET <exec>?inicio=AAAA-MM-DD&fim=AAAA-MM-DD`

```json
{
  "ok": true,
  "janela": { "inicio": "2026-09-05", "fim": "2026-09-30" },
  "aulas": [
    {
      "id": "2026-09-07T06:00",
      "data": "2026-09-07",
      "horaInicio": "06:00",
      "horaFim": "07:00",
      "inicioISO": "2026-09-07T06:00:00-03:00",
      "fimISO": "2026-09-07T07:00:00-03:00",
      "rotulo": "Seg 07/09 — 06h00 às 07h00",
      "capacidade": 3,
      "reservas": 1,
      "vagas": 2,
      "status": "disponivel"
    }
  ]
}
```

`?saude=1` devolve `{ ok: true, servico: "agenda-fortalecimento" }` — bom para conferir a
implantação sem depender da agenda.

### `POST <exec>`

Corpo (enviado como `text/plain` de propósito — ver abaixo):

```json
{
  "aulaId": "2026-09-07T06:00",
  "nome": "Fulano de Tal",
  "email": "fulano@email.com",
  "telefone": "+5516999998888",
  "idempotencia": "3f2b9c1e4a..."
}
```

Sucesso: `{ ok: true, reserva: { aulaId, quando, inicioISO, fimISO, nome, email } }`.
Repetição da mesma chave: o mesmo objeto com `repetida: true`, sem gravar de novo.
Falha: `{ ok: false, codigo, mensagem }` com `codigo` em `LOTADA`, `NAO_ENCONTRADA`,
`DADOS`, `OCUPADO`, `PAYLOAD` ou `ERRO`.

**Por que `text/plain`:** com `application/json` o navegador dispara um preflight `OPTIONS`,
e Web App do Apps Script não responde `OPTIONS` — a reserva morreria em CORS. O corpo
continua sendo JSON; o `doPost` lê `e.postData.contents`.

## O que o Gustavo precisa fazer

### 1. Publicar o Web App (5 minutos)

1. Abra o editor: <https://script.google.com/home/projects/1LJZaY5Izgnm4wU0fIczy9dh0-9DagJUWBRZaqG1VKtUM-4jdIRMy8F1a/edit>
2. Cole o conteúdo de `C:\Projetos\carefit-clickup-automacoes\apps-script\agenda-fortalecimento.gs`
   sobre o arquivo do projeto (é o mesmo arquivo, com a API no fim).
3. Rode `conferirMapeamento` e leia o log. Confirme que aula, nome e e-mail apontam para as
   colunas certas. **Se alguma estiver errada, pare aqui e me chame.**
4. Rode `sincronizarVagas` uma vez para garantir que nada quebrou no fluxo atual.
5. Implantar > Nova implantação > tipo **Aplicativo da Web**:
   - Executar como: **eu**
   - Quem pode acessar: **qualquer pessoa**
6. Copie a URL que termina em `/exec`.
7. Teste no navegador: `<URL>?saude=1` deve devolver `{"ok":true,...}`.

### 2. Ligar no site

No Railway, variável de ambiente do serviço do site:

```
VITE_AGENDAMENTO_FORTALECIMENTO_API=<a URL /exec>
```

Vite injeta variáveis no momento do build, então **é preciso um novo deploy** para a
variável valer. Para testar local: crie um `.env` com a mesma linha e rode `npm run dev`.

### 3. Testes antes de anunciar a página

- [ ] Desktop: calendário abre no mês corrente, só dias com aula clicam, horários mostram início, término e vagas reais.
- [ ] Celular (até 320 px): ao tocar na data, a tela desce sozinha para os horários.
- [ ] Reserva de ponta a ponta com um e-mail seu: linha aparece na planilha, e-mail de confirmação chega, formulário do Google atualiza as vagas.
- [ ] ClickUp: o workflow `NMeynniWMn8Eu3te` casou a reserva e consumiu o crédito igual a uma reserva pelo Forms.
- [ ] Turma lotada aparece como "Lotada" e não deixa reservar.
- [ ] **Teste de concorrência:** deixe uma aula com 1 vaga e confirme em dois navegadores ao mesmo tempo. Um deve receber "a última vaga acabou de ser preenchida"; a planilha deve ter uma linha só.
- [ ] Clique duplo no "Confirmar" não gera duas linhas.

### 4. Só depois

- Decidir quando o Google Forms deixa de ser a porta pública.
- Registrar o deploy no diário do Diretor de Tecnologia (`wiki/diretor-tech/registro-de-sistemas.md`).

## Riscos conhecidos

- **Cabeçalho da planilha.** Se alguém renomear a pergunta `Escolha sua aula`, o formulário,
  a API e o n8n quebram juntos. O `conferirMapeamento()` existe para detectar isso antes.
- **Cota do `MailApp`.** A confirmação por e-mail agora sai por dois caminhos (formulário e
  site). Continua muito abaixo da cota diária de uma conta Workspace, mas é bom saber.
- **Cancelamento continua manual.** Nada aqui muda isso: a coluna à direita da aula segue
  sendo preenchida na mão para liberar a vaga.
- **A janela do site vai até 3 meses à frente.** Se a agenda tiver eventos recorrentes sem
  fim, a página mostra tudo o que existir nesse intervalo — vale conferir se a recorrência
  do Google Agenda tem data de término coerente com o que a operação quer vender.
