# Painel de fortalecimento — operação e publicação

Implementação: 09/09/2026. Rota: `/painel-fortalecimento` no site atual da CareFit.

## Para Lucas

1. Entrar com usuário e senha da equipe. O acesso ao painel é separado da senha do ClickUp.
2. Há duas formas de cadastrar:
   - **Programar treino:** buscar um atleta e preencher o formulário na tela.
   - **Importar Excel:** baixar o modelo CareFit, preencher uma linha por exercício, enviar o arquivo, revisar os atletas encontrados e confirmar. A importação aceita vários atletas no mesmo arquivo.
3. Na aula agendada, clicar em **Abrir treinos** e **Usar nesta aula** na versão desejada. É possível trocar a versão antes de começar a salvar a evolução.
4. Espelhar o PC na TV, escolher o horário e clicar em **Abrir na TV**. Se necessário, usar F11. As setas avançam os blocos de exercícios dos mesmos atletas.
5. Voltar à agenda, clicar em **Registrar evolução** e **Salvar evolução e concluir aula**. A aula passa a `realizada` no ClickUp, saindo das pendentes.

O treino fica em subtarefas `Treino CareFit — …` no card permanente do atleta. A cópia aplicada fica em `Sessão CareFit — …` dentro da aula. A evolução também fica no campo existente `Evolução atelta` da aula. Não editar o bloco de registro estruturado diretamente no ClickUp: usar o formulário do painel.

### Modelo Excel

O botão **Importar Excel** oferece o arquivo `modelo-treinos-carefit.xlsx`. A aba `Treinos`
tem estas colunas, nesta ordem: `Nome do treino`, `Atleta no ClickUp`, `Nome curto na TV`,
`Exercício`, `Séries`, `Repetições/tempo`, `Carga + unidade` e `Pausa (s)`.

Cada linha representa um exercício. Nome do treino, atleta e nome curto devem ser repetidos
nas linhas do mesmo treino. O painel ignora maiúsculas e acentos ao localizar o nome, mas só
aceita uma correspondência exata e única no CRM. Antes da gravação, mostra os treinos prontos
e bloqueia o lote se houver coluna ausente, atleta desconhecido, valor inválido, divergência
de nome curto ou mais de 24 exercícios. Arquivos maiores que 1 MB ou 500 linhas são recusados.

O arquivo é processado no navegador autenticado. O backend recebe cada treino validado pelo
mesmo endpoint do formulário individual, preservando versão, confirmação e idempotência. Uma
falha parcial mostra o resultado por atleta e a repetição mantém o mesmo `requestId`, sem
duplicar os que já foram salvos. Importar cria versões nos cards dos atletas; não escolhe
automaticamente qual versão vale em uma aula. Lucas continua clicando em **Usar nesta aula**.

## Configuração do serviço existente na Railway

Manter o repositório e o domínio existentes. O Dockerfile agora inicia o servidor Node; as páginas públicas continuam usando o mesmo mecanismo de arquivos do antigo `serve`.

Variáveis somente de runtime:

- `CLICKUP_API_TOKEN`: token existente autorizado ao CRM e aulas.
- `PORTAL_ORIGIN`: origem HTTPS exata do endereço final, incluindo `www` se utilizado, sem barra final.
- `PORTAL_SESSION_SECRET`: segredo aleatório de pelo menos 32 caracteres.
- `PORTAL_USERS_JSON`: JSON de usuários e hashes scrypt; nunca colocar senhas puras aqui.
- `PORT`: fornecida pela Railway.

Gerador local: `scripts/setup-fortalecimento.mjs`. Credenciais geradas estão apenas em `.env.local` e `acessos-fortalecimento.local`, ignorados pelo Git e Docker. Não executar novamente sobre arquivos existentes. A troca do hash de um usuário revoga suas sessões anteriores. Login dura 12 horas.

**Operar com uma réplica.** A fila de escrita por atleta/aula é local ao processo. ClickUp não oferece transação entre criar subtarefa, gravar campo e trocar status. A implementação verifica cada etapa e retoma a mesma conclusão após falha. Não escalar horizontalmente sem um coordenador durável de escritas. Fazer deploy fora das aulas para evitar sobreposição de processos em atualização gradual.

Não colocar as variáveis em argumentos de build nem prefixá-las com `VITE_`. O contêiner não inclui os arquivos locais de credenciais. Sem configuração válida, a API privada responde 503; o site público permanece disponível.

## Validação

- Testes automatizados de versões imutáveis, repetição da operação, conflito de edição, falha ao gravar evolução, retomada da conclusão, datas/horários, vínculo de atleta, acesso fora da lista, login, cookie e CSRF.
- Consulta real autenticada: 09/09 sem aulas pendentes; 11/09 com uma aula às 07h, corretamente vinculada, ainda sem treino cadastrado.
- Nenhuma prescrição fictícia ou conclusão de aula real foi criada para testar.
- Build de produção validado. A checagem TypeScript completa encontra um erro anterior em `src/pages/conheca-carefit/Icon.tsx` (propriedade stroke numérica), independente deste painel.
- Não houve teste na TV física nem inspeção visual automatizada de navegador. Layout usa medidas do viewport e altura dos exercícios para determinar a paginação.

## Situação da publicação

Publicado em 09/09/2026 (Brasília) em https://www.carefitrunbase.com.br/painel-fortalecimento. Railway confirmou SUCCESS para e50516cc-ac6b-4221-bbd6-fd0e51215b53, commit 53ed86d. Logins de Lucas e Gustavo, consulta real de agenda, bloqueio sem sessão e páginas públicas validados por HTTP. PORT=8080 preserva o destino dos domínios; uma réplica ativa. Nenhuma aula real concluída durante a verificação.

Em 10/09/2026, o primeiro uso real revelou que o ClickUp escapava `_`, `[` e `]` em `markdown_description`: a subtarefa era criada, mas a confirmação do painel falhava e novas tentativas repetiam o registro. A correção do commit `5995c1c` passou a priorizar `description`, manter fallback para Markdown, proteger novos JSONs em bloco de código e consolidar registros com o mesmo `requestId`. Deploy `44e6f322-29bb-4cb8-9a01-c952d084923e` concluído. O treino da Aline foi recuperado e a repetição idempotente em produção não criou nova subtarefa. Os registros anteriores foram preservados; não apagar sem decisão explícita.
