// Cálculo de afinidad del test · versión 29-N
// Sustituye a la función de afinidad actual. Tres cambios respecto a la versión anterior:
//  1. Las respuestas «Neutral» (0) del usuario no cuentan.
//  2. Las posiciones null de un partido (sin posición conocida) no cuentan para ese partido.
//  3. Calibración al 50 %: compensa la ventaja que tienen los partidos con posiciones moderadas
//     frente a respuestas tibias o aleatorias (ver auditoría). Se muestra al usuario esta cifra.
// Solo se calcula para los partidos que se presentan en la provincia del usuario.

import { PARTIES, type Party, type PartyId } from "./data";
import { QUESTIONS, ORDER } from "./test-2026";

export type Answer = -2 | -1 | 0 | 1 | 2 | null | undefined; // null = saltada, undefined = sin responder

const BLEND = 0.5;
const expected = (p: number) => [-2, -1, 1, 2].reduce((s, a) => s + 1 - Math.abs(a - p) / 4, 0) / 4;

export function affinity(answers: Answer[], important: boolean[], parties: string[]) {
  return parties
    .map(id => {
      const k = ORDER.indexOf(id as (typeof ORDER)[number]);
      let s = 0, e = 0, w = 0, counted = 0;
      QUESTIONS.forEach((q, j) => {
        const a = answers[j], p = q.p[k];
        if (a === undefined || a === null || a === 0 || p === null || p === undefined) return;
        const weight = important[j] ? 2 : 1;
        s += weight * (1 - Math.abs(a - p) / 4);
        e += weight * expected(p);
        w += weight;
        counted++;
      });
      if (!w) return { id, pct: null as number | null, counted };
      const raw = s / w, E = e / w;
      const cal = raw >= E ? 0.5 + (0.5 * (raw - E)) / (1 - E) : (0.5 * raw) / E;
      return { id, pct: Math.round(100 * (BLEND * cal + (1 - BLEND) * raw)), counted };
    })
    .sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));
}

// Mostrar el resultado solo si el usuario ha dado al menos 8 respuestas no neutrales;
// si no, pedirle que conteste más (con todo neutral no hay base para calcular nada).
export const MIN_ANSWERS = 8;
export type Ans = Answer;

export function countedAnswers(ans: Answer[]) {
  return ans.filter(a => a !== undefined && a !== null && a !== 0).length;
}

export function stanceOf(q: (typeof QUESTIONS)[number], id: string): number | null {
  const k = ORDER.indexOf(id as (typeof ORDER)[number]);
  if (k < 0) return null;
  const v = q.p[k];
  return v === undefined ? null : v;
}

function joinEs(xs: string[]) {
  if (xs.length === 1) return xs[0];
  return xs.slice(0, -1).join(", ") + " y " + xs[xs.length - 1];
}

export function explainAffinity(ans: Answer[], partyIds: string[]) {
  const parties = partyIds.map(id => PARTIES.find(p => p.id === id)).filter((p): p is Party => !!p);
  const topics = [...new Set(QUESTIONS.map(q => q.t))];
  const coincide: string[][] = parties.map(() => []);
  const discrepa: string[][] = parties.map(() => []);
  for (const topic of topics) {
    parties.forEach((p, k) => {
      let agree = 0, disagree = 0, n = 0;
      QUESTIONS.forEach((q, j) => {
        if (q.t !== topic) return;
        const a = ans[j];
        const party = stanceOf(q, p.id);
        if (a === undefined || a === null || a === 0 || party == null) return;
        n++;
        const d = Math.abs(a - party);
        if (d === 0) agree++;
        if (d >= 3) disagree++;
      });
      if (!n) return;
      if (agree >= 1 && agree >= disagree) coincide[k].push(topic);
      else if (disagree >= 1 && disagree > agree) discrepa[k].push(topic);
    });
  }
  const take = (xs: string[]) => xs.slice(0, 2);
  const rank = (rows: string[][], prep: string) =>
    parties.map((p, k) => ({ p, topics: take(rows[k]) }))
      .filter(x => x.topics.length)
      .sort((a, b) => b.topics.length - a.topics.length)
      .slice(0, 3)
      .map(x => `${prep} ${x.p.name} en ${joinEs(x.topics)}`);
  const parts = [
    rank(coincide, "con").length ? `Coincides ${rank(coincide, "con").join("; ")}` : "",
    rank(discrepa, "de").length ? `discrepas especialmente ${rank(discrepa, "de").join("; ")}` : "",
  ].filter(Boolean);
  if (!parts.length) return "";
  const text = parts.join(". ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export function withParty(rows: { id: string; pct: number | null; counted: number }[]) {
  return rows.map(r => {
    const p = PARTIES.find(x => x.id === r.id);
    return { ...p!, pct: r.pct ?? 0, counted: r.counted };
  }).filter(p => p.id);
}
