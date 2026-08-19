import dados from "@/content/agenda-provas.json";

/**
 * Agenda de provas do 016. Fonte única — a barra lateral do blog, os posts de
 * calendário e a régua de última hora leem daqui, então corrigir uma data em um
 * lugar corrige em todos. Quem mantém o arquivo é o motor de conteúdo.
 */

export interface Prova {
  data: string; // AAAA-MM-DD
  nome: string;
  cidade: string;
  distancias: string;
  detalhe?: string;
  /** true só quando a data foi conferida na página do organizador. */
  confirmado: boolean;
  fonte?: string;
}

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export const provas: Prova[] = (dados.provas as Prova[])
  .slice()
  .sort((a, b) => a.data.localeCompare(b.data));

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

export function proximasProvas(quantidade = 5): Prova[] {
  const corte = hoje();
  return provas.filter((prova) => prova.data >= corte).slice(0, quantidade);
}

/** Provas em Ribeirão e região dentro da janela — alimenta a régua de destaque. */
export function provasDaSemana(): Prova[] {
  const corte = hoje();
  const limite = new Date();
  limite.setDate(limite.getDate() + 8);
  const fim = limite.toISOString().slice(0, 10);
  return provas.filter((prova) => prova.data >= corte && prova.data <= fim);
}

export function diaEMes(data: string): { dia: string; mes: string } {
  const [, mes, dia] = data.split("-");
  return { dia, mes: MESES[Number(mes) - 1] ?? "" };
}

export function porExtenso(data: string): string {
  const { dia, mes } = diaEMes(data);
  return `${dia}/${mes.toLowerCase()}`;
}
