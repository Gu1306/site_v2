# Fortalecimento: operação do Lucas e tela da TV

Revisão: 2026-09-09. Pedido de Gustavo: dia/horário no ClickUp, preparação individual e três treinos simultâneos com identidade CareFit. Lucas já tem ClickUp; TV espelha o PC da CareFit.

## Implementado na operação

- Lista 901328170178: início, término e etiqueta de turma adicionados à visualização original.
- Aulas de hoje — Lucas: quadro 2ky5k569-1673. Filtro startDate=today, grupos por tag, inclui agendada/realizada/faltou/complete. Hora segue o fuso da conta no ClickUp; usar São Paulo.
- Agenda de aulas: calendário 2ky5k569-1693; selecionar visualização Dia pela interface.
- Aulas por dia e horário: lista 2ky5k569-1713, agrupada por vencimento (mesmo dia da aula) e ordenada por início.
- Etiquetas 06h00-07h00, 07h00-08h00, 08h00-09h00. Elas identificam a turma; não são a fonte de disponibilidade.
- Workflow NMeynniWMn8Eu3te ativo/publicado: campos de data via HTTP com value_options.time=true; início e término nativos com flags de hora; duração de 60 minutos; etiqueta calculada em America/Sao_Paulo. Crédito, reservas e mensagens existentes preservados. Nenhum envio manual disparado.
- Seis aulas recuperadas das reservas por e-mail/telefone + dia ou correspondência única. Gustavo Rosa — Aula 1/1 ficou pendente por não haver reserva ativa compatível; não inferir horário.
- Orientação de uso e modelo de programação adicionados à descrição da lista.

## Modelo de treino proposto

O card do CRM é a identidade permanente do atleta. Criar nele subtarefas Treino de fortalecimento — A/B — vigência. A descrição contém tabela estruturada, editável no ClickUp: ordem, exercício, séries, repetições ou tempo, carga com unidade, pausa e instrução. Cabeçalho: objetivo, responsável, vigência e revisão.

Cada aula tem um vínculo ao atleta e deve apontar explicitamente para o treino escolhido. Ao realizar, guardar a versão aplicada na aula, separando programação da execução. Alterar o treino futuro não deve reescrever aulas realizadas. O campo Evolução atelta continua sendo a observação da sessão, não a fonte da prescrição.

Lucas preenche os exercícios e as cargas. Nenhuma prescrição real foi criada nesta entrega.

## Proposta visual

proposta.html é um fragmento interativo para discussão, com dados fictícios. Modos: agenda do dia, programação e TV; escolha das três turmas; até três colunas; edição local reflete na TV; tema petróleo/claro e escala de texto ajustáveis. Não faz requisições e não persiste no ClickUp.

Paleta baseada no site atual: verde petróleo #0E3C41, terracota #C8643D, dourado #D4A656 e fundo claro #F4EDE4. TV em 16:9; cada coluna deve manter o mesmo atleta ao trocar bloco/página. Treinos longos exigem paginação por bloco, não diminuição indefinida da fonte. Definir nome de exibição curto para legibilidade.

## Integração ainda necessária para colocar a TV em operação

1. Implementar rota privada do painel no site, com autenticação da equipe e acesso de Lucas. O site atual é público e estático; não basta adicionar uma página com dados reais no bundle.
2. Backend consulta aulas do dia por start_date, confirma etiqueta/horário, resolve relação Nome para o CRM e busca o treino explicitamente escolhido. Campo vazio/horário divergente deve virar pendência visível, sem inferência de turma.
3. Programação: editor estruturado grava os treinos no card/subtarefa do atleta e preserva revisões; valida séries, unidades e vigência; trata conflitos de edição. Usar backend, nunca token ClickUp no navegador.
4. TV recebe somente nome de exibição, treino e instruções autorizadas para a turma. Dados cadastrais, financeiros e anamnese ficam fora do retorno da TV.
5. Atualização periódica com indicação de última sincronização, estado de erro e opção de atualizar; não esconder um quarto atleta quando houver conflito, alertar o treinador.
6. Testar com três atletas, alteração de carga, troca de turma, cancelamento, card sem treino, perda de conexão e leitura na TV real. Não publicar dados fictícios como cadastro real.

## Verificação realizada

Testes das expressões para 06/07/08h em UTC-03: 60 minutos, flags de hora e nomes de etiquetas corretos. Leitura posterior confirmou timestamps em seis cards e versão publicada do workflow. API das views confirmou agrupamentos/filtros e os cards devolvidos. A interface visual das views não foi inspecionada: navegador disponível não estava autenticado no ClickUp. Protótipo: sintaxe JavaScript validada; não houve teste na TV física.

## Operação e manutenção

- Não reagendar arrastando etiquetas no quadro: isso não atualiza Google Calendar/Sheets nem a contagem de vagas.
- Fonte continua Apps Script/planilha de reservas. Novos horários fora de 06/07/08h requerem revisão da duração e criação das respectivas etiquetas.
- A idempotência legada usa atleta+dia e ainda não distingue duas reservas do mesmo atleta no mesmo dia; não foi modificada neste ajuste de layout.
- Backups locais (ignorados no Git) em carefit-clickup-automacoes/backups; script datado em scripts/fortalecimento-layout.js. Snapshot de execução original preserva os valores anteriores dos cards.
- O registro de sistemas continha informações históricas conflitantes sobre capacidade; para esta entrega vale o pedido de Gustavo: três atletas por turma.

## Refinamento do fluxo após revisão do Gustavo

Quadro diário alterado para apenas agendada + hoje; status e evolução expostos na view. Fluxo: abrir aula/treino, realizar, salvar evolução no card da aula, marcar realizada. Nenhum status de aula alterado por esta configuração. Histórico permanece nas outras views. Ainda não há trava de conclusão sem evolução.

Simplificação desejada: Lucas cadastra por formulário no painel (atleta, exercício, séries, repetições/tempo, carga e pausa); persistência no ClickUp feita pela integração. Não exigir upload de arquivo nem edição manual de tabela. PC espelhado: modo TV ocupa viewport real, mantém três colunas em desktop e pagina treinos longos por bloco para preservar legibilidade. O link operacional ainda não existe.
