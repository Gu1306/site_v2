import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputPath = fileURLToPath(new URL('../public/modelo-treinos-carefit.xlsx', import.meta.url));
const previewPath = fileURLToPath(new URL('../work/modelo-treinos-carefit-preview.png', import.meta.url));
const inspectTracePath = fileURLToPath(new URL('../work/modelo-treinos-carefit.inspect.ndjson', import.meta.url));

const workbook = Workbook.create();
const workouts = workbook.worksheets.add('Treinos');
const instructions = workbook.worksheets.add('Como preencher');

const headers = [[
  'Nome do treino',
  'Atleta no ClickUp',
  'Nome curto na TV',
  'Exercício',
  'Séries',
  'Repetições/tempo',
  'Carga + unidade',
  'Pausa (s)'
]];
workouts.getRange('A1:H1').values = headers;
workouts.getRange('A2:H101').values = Array.from({ length: 100 }, () => Array(8).fill(null));
workouts.freezePanes.freezeRows(1);
workouts.showGridLines = false;
workouts.tabColor = '#E89A70';
workouts.getRange('A1:H101').format.font = { name: 'Aptos', size: 11, color: '#123C40' };
workouts.getRange('A1:H1').format = {
  fill: '#123C40',
  font: { name: 'Aptos', size: 11, bold: true, color: '#FFFFFF' },
  rowHeight: 30,
  wrapText: true,
  verticalAlignment: 'center'
};
workouts.getRange('A2:H101').format = {
  fill: '#F8F3EE',
  rowHeight: 24,
  verticalAlignment: 'center'
};
workouts.getRange('A1:A101').format.columnWidth = 24;
workouts.getRange('B1:B101').format.columnWidth = 30;
workouts.getRange('C1:C101').format.columnWidth = 22;
workouts.getRange('D1:D101').format.columnWidth = 32;
workouts.getRange('E1:E101').format.columnWidth = 10;
workouts.getRange('F1:F101').format.columnWidth = 20;
workouts.getRange('G1:G101').format.columnWidth = 20;
workouts.getRange('H1:H101').format.columnWidth = 12;
workouts.getRange('E2:E101').format.numberFormat = '0';
workouts.getRange('H2:H101').format.numberFormat = '0';

instructions.showGridLines = false;
instructions.tabColor = '#123C40';
instructions.getRange('A1:B1').values = [['Modelo CareFit', 'Importação de treinos de fortalecimento']];
instructions.getRange('A1:B1').format = {
  fill: '#123C40',
  font: { name: 'Aptos', size: 15, bold: true, color: '#FFFFFF' },
  rowHeight: 34
};
instructions.getRange('A3:B11').values = [
  ['Como usar', 'Preencha a aba Treinos e envie este arquivo no Painel de Fortalecimento.'],
  ['Uma linha', 'Cada linha representa um exercício.'],
  ['Mesmo treino', 'Repita nome do treino, atleta e nome curto em todas as linhas daquele treino.'],
  ['Atleta', 'Digite o nome completo como aparece no ClickUp. O painel mostrará qualquer nome não encontrado antes de importar.'],
  ['Nome curto', 'É o nome exibido na TV, com até 32 caracteres.'],
  ['Séries', 'Número inteiro de 1 a 20.'],
  ['Repetições/tempo', 'Exemplos: 10, 8/lado ou 30 s.'],
  ['Carga + unidade', 'Exemplos: 12 kg, elástico leve ou corpo.'],
  ['Pausa', 'Tempo em segundos, de 0 a 900.']
];
instructions.getRange('A3:A11').format = {
  fill: '#E89A70',
  font: { name: 'Aptos', size: 11, bold: true, color: '#123C40' },
  verticalAlignment: 'center'
};
instructions.getRange('B3:B11').format = {
  fill: '#F8F3EE',
  font: { name: 'Aptos', size: 11, color: '#123C40' },
  wrapText: true,
  verticalAlignment: 'center'
};
instructions.getRange('A3:B11').format.rowHeight = 38;
instructions.getRange('A1:A11').format.columnWidth = 20;
instructions.getRange('B1:B11').format.columnWidth = 72;

workbook.recalculate();
const inspection = await workbook.inspect({ kind: 'table', range: 'Treinos!A1:H5', include: 'values,formulas' });
if (!inspection) throw new Error('Não foi possível inspecionar o modelo.');
const preview = await workbook.render({ sheetName: 'Como preencher', autoCrop: 'all', scale: 1, format: 'png' });
await fs.mkdir(fileURLToPath(new URL('../work/', import.meta.url)), { recursive: true });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
await fs.rename(`${outputPath}.inspect.ndjson`, inspectTracePath).catch(error => {
  if (error.code !== 'ENOENT') throw error;
});
console.log(JSON.stringify({ output: outputPath, preview: previewPath, inspection }, null, 2));
