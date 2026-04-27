

## Atualizar todas as datas do Ice Mind para 15/03/2026

15 de Março de 2026 cai num **Domingo**, entao o texto "Domingo!" continua correto.

### Alteracoes em `src/pages/IceMindExperience.tsx`:

1. **Linha 11-12** - Comentario e constante `eventDate`:
   - De: `new Date("2026-02-08T08:15:00")`
   - Para: `new Date("2026-03-15T08:15:00")`

2. **Linha 68** - Data exibida no hero:
   - De: `08 de Fevereiro de 2026`
   - Para: `15 de Março de 2026`

3. **Linha 593** - Data exibida na secao de agendamento (que ainda estava com data antiga):
   - De: `18 de Janeiro de 2026`
   - Para: `15 de Março de 2026`

O horario (08:15 as 10:30) e demais informacoes permanecem iguais.

