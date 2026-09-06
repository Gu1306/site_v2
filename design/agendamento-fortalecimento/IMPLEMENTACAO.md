---
data: 2026-09-05
status: no-ar
projeto: carefit-site
relacionado: carefit-clickup-automacoes
---

# Implementação — agendamento do fortalecimento

Continuação de [HANDOFF-CLAUDE.md](HANDOFF-CLAUDE.md). O que este documento cobre: o que
foi construído, as decisões que fechei no caminho, como está ligado e o que foi verificado
em produção.

**No ar desde 05/09/2026.** O Google Forms continua funcionando em paralelo — os dois
escrevem na mesma planilha e o site ressincroniza as opções do formulário a cada reserva.

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

**7. Sem endpoint, a página não quebra.**
Se nem a constante nem a env var tiverem valor, a página mostra "agendamento online em
configuração" e manda para o WhatsApp, em vez de aparecer quebrada. Vale como rede de
segurança caso a URL seja esvaziada por engano.

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

## Como está ligado (05/09/2026)

### Web App

Implantação publicada em 05/09/2026 às 21h52, versão 1:

```
https://script.google.com/macros/s/AKfycbxcap4um1pU8wOOE3MdmlUL4LKi083kmxS6f8zdjBW0YrgmTvhZ8B9L-B8C-u6H3-Q1/exec
```

Executando como o dono da agenda, acessível por qualquer pessoa. `?saude=1` responde
`{"ok":true,"servico":"agenda-fortalecimento","versao":2}` — é o jeito mais rápido de saber
se o Web App está de pé sem depender da agenda.

**Atualizar o código depois:** editar o `.gs` aqui, colar no editor e fazer
*Implantar > Gerenciar implantações > editar (lápis) > Versão: Nova versão*. Isso
**mantém a mesma URL**. Criar uma implantação *nova* gera uma URL diferente e exigiria
mexer no site — não é o caminho.

### Site

A URL `/exec` vive em `src/services/agendamentoFortalecimento.ts`, na constante
`ENDPOINT_FIXO`. **Não existe variável a configurar no Railway.** A URL não é segredo:
a página a chama do navegador, então ela aparece no bundle de qualquer visitante. O que
protege o endpoint é a validação do lado do Apps Script, não a obscuridade.

`VITE_AGENDAMENTO_FORTALECIMENTO_API` continua funcionando como override, para apontar a
página a outra implantação sem commit. Para isso o `Dockerfile` ganhou o `ARG`/`ENV`
correspondente — sem ele, o Railway entrega a variável ao build e o Vite não a enxerga,
e a página nasce em modo "em configuração" sem erro nenhum no log.

## O que foi verificado em produção

Tudo abaixo rodou contra a agenda e a planilha de verdade em 05/09/2026:

| Critério de aceite | Resultado |
|---|---|
| Horários com início, término e vagas reais | 27 aulas em 21 dias; contagem batendo com a planilha |
| CORS a partir do navegador | `Access-Control-Allow-Origin: *` no 302 e no 200 |
| POST atravessa o redirect do Apps Script | confirmado com `fetch` seguindo a mesma especificação do navegador |
| Grava no formato que o n8n lê | `Sex 25/09 — 08h00 às 09h00 (3 vagas)` |
| Confirmação por e-mail | chegou |
| Clique duplo não duplica | idempotência devolveu a reserva original, sem linha nova |
| Turma lotada não aceita reserva | fecha em 0 e passa a recusar |
| **Duas reservas simultâneas na última vaga** | **uma entrou, a outra recebeu `LOTADA`** |
| Telefone normalizado em E.164 | `"+5516996008849"` gravado como texto (ver a ressalva abaixo) |
| Nenhum segredo no bundle | sem ID de planilha ou de agenda no build |

As reservas de teste (nome começando com `TESTE`) saem pela coluna à direita da aula, o
mesmo mecanismo de cancelamento da operação.

### Ressalva do telefone — encontrada e corrigida em 05/09

Lendo as células gravadas com `valueRenderOption=FORMULA` apareceu o seguinte: o Sheets lia
`+5516996008849` como **fórmula aritmética** e guardava o **número** `5516996008849`. O `+`
do E.164 sumia. Os dígitos sobreviviam — o n8n casa pelos últimos 8 — mas o que a planilha
guardava deixava de ser o que a API mandou.

Corrigido com um apóstrofo na frente do valor, que força texto. **Confirmado na versão 2 do
Web App:** os três `valueRenderOption` passaram a devolver a string `"+5516996008849"`.

As reservas gravadas antes disso ficam com o telefone como número. Não precisa consertar
retroativamente: os dígitos estão íntegros e nada quebra com elas.

**A lição é maior que o telefone:** qualquer valor que comece com `+`, `=`, `-` ou `@` vira
fórmula ao entrar no Sheets por `appendRow`. Se o valor é dado e não conta, force texto.

### Armadilha que custou caro, para não repetir

Testar o `POST` com `curl -L` **grava a reserva e mente que falhou**. O Apps Script executa
o `doPost` em `/exec` e só então redireciona para servir o resultado; o curl reenvia o POST
sem `Content-Length` e leva um `411`. Quem lê o 411 conclui que nada aconteceu — e já
aconteceu. Foi assim que nasceram reservas fantasma na primeira rodada de teste.
Use `fetch` (Node ou navegador), que segue o redirect do jeito certo.

## O que continua pendente

- **Divulgar a página.** Ela está `noindex` e não é linkada de lugar nenhum ainda. Para
  aparecer na busca, trocar `noindex: true` por `false` no `useSeo` da página.
- **Decidir quando o Google Forms deixa de ser a porta pública.** Os dois convivem hoje:
  a reserva pelo site ressincroniza as opções do formulário a cada gravação.
- **Não há limite de tentativas no endpoint.** Qualquer um que ache a URL pode disparar
  reservas. O Google Forms tinha exatamente a mesma exposição, então isso não é uma
  regressão — mas é um risco que passa a valer para um endpoint que grava sozinho.


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
