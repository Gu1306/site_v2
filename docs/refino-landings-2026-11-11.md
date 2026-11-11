# Refinamento das páginas de entrada — 2026-11-11

Pedido de Gustavo: aplicar a revisão das landings de Primeira Sessão Dupla e avaliação de reabilitação, incluindo clareza da oferta e continuidade até a agenda.

## Comportamento entregue

- `/conheca-a-carefit`: benefício e preço na abertura; oferta antes do vídeo no celular; dois encontros visíveis; CTA para escolha de profissional; FAQ, localização, relatos existentes e rodapé com destinos reais. Retirada a seção repetitiva de sensações e a seleção de perfis que simulava uma recomendação. Botão flutuante do WhatsApp removido porque cobria o CTA no celular; links de ajuda continuam na página.
- `/lp/*`: oferta identificada até a agenda; reabilitação com história de 30 minutos e avaliação de 50 minutos; entregas e preço do tratamento subsequente claros; fotografia do espaço, relatos já publicados, FAQ operacional e linguagem de retorno incluído no recovery.
- `/primeira-sessao`: sem parâmetro, oferece escolha entre os dois serviços. `?servico=dupla` e `?servico=reabilitacao` mantêm nome, valor, duração e links específicos. Parâmetro desconhecido volta à escolha, sem presumir um serviço.
- Quatro agendas distintas em `src/lib/ofertasCarefit.ts`. Links fornecidos por Gustavo foram abertos e os nomes conferidos: `V6csYAUdvWsTQRKS7` = Lais; `Av1wz7zCBixHRvpJ9` = Igor, ambos avaliação de reabilitação de 80 minutos a R$ 180. As agendas existentes de primeira sessão mostram 80 minutos a R$ 230, por isso a landing foi alinhada de 1h30 para 80 min. Retorno de 1h em até 15 dias preservado da oferta publicada.
- Instruções de roupa, confirmação após pagamento/WhatsApp e antecedência de 24h vieram das descrições públicas das agendas, conferidas em 2026-11-11.
- Mensagem do WhatsApp mantém serviço/valor sem presumir origem Instagram. LPs deixam de marcar todo acesso como Google.
- Previews HTTP e canonical distinguem os serviços; parâmetros de campanha não entram no canonical. A landing de anúncio continua com noindex.
- Eventos `servico_select`, `calendario_click` e cliques de CTA com serviço/profissional. Esses eventos medem intenção, não reserva confirmada; nenhuma confirmação foi simulada.

## Verificação

- `npm run build`, `npx tsc --noEmit -p tsconfig.app.json` e ESLint dos arquivos TS/TSX alterados.
- `npm run test:fortalecimento`: 67 testes aprovados.
- Validação HTTP local de previews, canonical, parâmetros inválidos e destinos distintos em `work/validate-landings.mjs` (scratch ignorado pelo Git).
- Navegação e inspeção visual em 1280px e 390px; sem overflow horizontal nas telas verificadas; agendas e WhatsApp conferidos sem enviar mensagem nem criar reserva.
- Corrigido conflito de tipo preexistente em `IconProps`: `stroke` numérico é espessura, não a propriedade SVG de cor.

## Limites e pendências

- Não há fotos identificadas de Igor e Lais no acervo do site: a seleção usa iniciais e função, sem inventar retratos, credenciais ou especializações.
- Reservas confirmadas ainda precisam ser reconciliadas com Google Agenda/CRM; cliques não são prova de comparecimento ou pagamento.
- A agenda pública de reabilitação do Igor mostra endereço nº 263; as demais agendas e o site mostram nº 241, sala 8. Mantido nº 241 no site; a configuração externa da agenda não foi alterada.
- Trabalho realizado em worktree `carefit-site-refino-landing`, preservando as alterações locais do financeiro no repositório principal.
