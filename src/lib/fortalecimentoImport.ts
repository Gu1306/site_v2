export type ImportAthlete = { id: string; name: string };
// Extensão explícita: os testes rodam este arquivo direto no Node, que não
// resolve especificador sem extensão como o bundler resolve.
import { MAX_BLOCK, blockLabel, blocksOf, normalizeBlocks } from './fortalecimentoBlocos.ts';

export type ImportExercise = { name: string; sets: number; reps: string; load: string; rest: number; group?: number | null };
export type ImportWorkout = {
  key: string;
  athleteId: string;
  athleteName: string;
  title: string;
  displayName: string;
  exercises: ImportExercise[];
};

const expected = [
  'Nome do treino',
  'Atleta no ClickUp',
  'Nome curto na TV',
  'Exercício',
  'Séries',
  'Repetições/tempo',
  'Carga + unidade',
  'Pausa (s)'
];

export const normalizeImportText = (value: unknown) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const text = (value: unknown) => String(value ?? '').trim();
const integer = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : Number(text(value).replace(',', '.'));
  return Number.isInteger(parsed) ? parsed : null;
};

export function buildWorkoutImport(rows: unknown[][], athletes: ImportAthlete[]) {
  const issues: string[] = [];
  if (!Array.isArray(rows) || rows.length < 2) return { workouts: [] as ImportWorkout[], issues: ['A aba Treinos está vazia.'] };
  if (rows.length > 501) return { workouts: [] as ImportWorkout[], issues: ['O arquivo pode ter no máximo 500 linhas de exercícios.'] };

  const headers = rows[0].map(normalizeImportText);
  const columns = expected.map(label => headers.indexOf(normalizeImportText(label)));
  const missing = expected.filter((_, index) => columns[index] < 0);
  if (missing.length) return { workouts: [] as ImportWorkout[], issues: [`Colunas ausentes: ${missing.join(', ')}.`] };
  // Coluna opcional: quem usa o modelo antigo, sem ela, importa treinos sem bi-set.
  // Linhas vizinhas do mesmo treino com o mesmo rótulo viram um bloco.
  const blockColumn = headers.findIndex(header => header === 'bloco' || header.startsWith('bloco '));

  const athleteIndex = new Map<string, ImportAthlete[]>();
  for (const athlete of athletes) {
    const key = normalizeImportText(athlete.name);
    athleteIndex.set(key, [...(athleteIndex.get(key) || []), athlete]);
  }

  const groups = new Map<string, { athleteName: string; title: string; displayName: string; exercises: ImportExercise[]; labels: string[] }>();
  rows.slice(1).forEach((row, offset) => {
    const line = offset + 2;
    const values = columns.map(column => row[column]);
    if (values.every(value => text(value) === '')) return;
    const [titleValue, athleteValue, displayValue, exerciseValue, setsValue, repsValue, loadValue, restValue] = values;
    const title = text(titleValue); const athleteName = text(athleteValue); const displayName = text(displayValue);
    const exercise = text(exerciseValue); const reps = text(repsValue); const load = text(loadValue);
    const sets = integer(setsValue); const rest = integer(restValue);
    const rowIssues = [
      !title || title.length > 80 ? 'nome do treino' : '',
      !athleteName || athleteName.length > 100 ? 'atleta' : '',
      !displayName || displayName.length > 32 ? 'nome curto na TV' : '',
      !exercise || exercise.length > 80 ? 'exercício' : '',
      sets === null || sets < 1 || sets > 20 ? 'séries' : '',
      !reps || reps.length > 25 ? 'repetições/tempo' : '',
      !load || load.length > 25 ? 'carga + unidade' : '',
      rest === null || rest < 0 || rest > 900 ? 'pausa' : ''
    ].filter(Boolean);
    if (rowIssues.length) { issues.push(`Linha ${line}: confira ${rowIssues.join(', ')}.`); return; }
    const key = `${normalizeImportText(athleteName)}\u0000${normalizeImportText(title)}`;
    const group = groups.get(key);
    if (group && normalizeImportText(group.displayName) !== normalizeImportText(displayName)) {
      issues.push(`Linha ${line}: o nome curto na TV mudou dentro do mesmo treino.`); return;
    }
    if (!group) groups.set(key, { athleteName, title, displayName, exercises: [], labels: [] });
    groups.get(key)!.exercises.push({ name: exercise, sets: sets!, reps, load, rest: rest! });
    groups.get(key)!.labels.push(blockColumn < 0 ? '' : normalizeImportText(row[blockColumn]));
  });

  const workouts: ImportWorkout[] = [];
  for (const [key, group] of groups) {
    const matches = athleteIndex.get(normalizeImportText(group.athleteName)) || [];
    if (matches.length === 0) { issues.push(`Atleta não encontrado no ClickUp: ${group.athleteName}.`); continue; }
    if (matches.length > 1) { issues.push(`Há mais de um atleta chamado ${group.athleteName}. Cadastre este treino pelo formulário individual.`); continue; }
    if (group.exercises.length > 24) { issues.push(`${group.athleteName} · ${group.title}: máximo de 24 exercícios.`); continue; }
    // Rótulos iguais em linhas vizinhas formam um bloco; o mesmo rótulo repetido
    // longe dali começa outro, porque bi-set é sempre uma sequência.
    let id = 0;
    const exercises = normalizeBlocks(group.exercises.map((exercise, index) => {
      const label = group.labels[index];
      if (!label) return { ...exercise, group: null };
      if (label !== group.labels[index - 1]) id += 1;
      return { ...exercise, group: id };
    }));
    const oversized = blocksOf(exercises).find(block => block.length > MAX_BLOCK);
    if (oversized) { issues.push(`${group.athleteName} · ${group.title}: um ${blockLabel(MAX_BLOCK).toLowerCase()} aceita no máximo ${MAX_BLOCK} exercícios.`); continue; }
    workouts.push({ key, athleteId: matches[0].id, athleteName: matches[0].name, title: group.title, displayName: group.displayName, exercises });
  }
  if (!workouts.length && !issues.length) issues.push('Nenhum treino preenchido foi encontrado.');
  return { workouts, issues };
}
