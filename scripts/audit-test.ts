// Auditoría de sesgo estructural del test · npm run audit
// Para cada circunscripción tipo simula: respuestas al azar, persona neutral, persona que dice «sí» o «no» a todo,
// y votantes de cada partido con discrepancias aleatorias. Usa el cálculo recomendado: «Neutral» no cuenta.
import { QUESTIONS as Q, ORDER } from "../lib/test-2026.ts";

const REGIONS: Record<string, string[]> = {
  "Resto de España": ["PP", "PSOE", "VOX", "SUMAR", "POD"],
  "Cataluña": ["PP", "PSOE", "VOX", "SUMAR", "POD", "ERC", "JUNTS"],
  "País Vasco": ["PP", "PSOE", "VOX", "SUMAR", "POD", "BILDU", "PNV"],
  "Navarra": ["PP", "PSOE", "VOX", "SUMAR", "POD", "BILDU", "UPN"],
  "Galicia": ["PP", "PSOE", "VOX", "SUMAR", "POD", "BNG"],
  "Canarias": ["PP", "PSOE", "VOX", "SUMAR", "POD", "CC"],
};
const CALIBRATE = process.env.CALIBRATE !== "0";
const BLEND = Number(process.env.BLEND ?? 0.5); // 0 = sin calibrar, 1 = calibrado completo
// Afinidad media que obtendría alguien que responde al azar (sin neutral) frente a una posición p
const EXP = (p: number) => [-2, -1, 1, 2].reduce((s, a) => s + 1 - Math.abs(a - p) / 4, 0) / 4;
const idx = (id: string) => ORDER.indexOf(id as any);
const score = (ans: number[], parties: string[]) => parties.map(id => {
  const k = idx(id); let s = 0, n = 0;
  let e = 0; // afinidad esperada respondiendo al azar, con las mismas preguntas contadas
  Q.forEach((q, j) => { const pk = q.p[k]; if (ans[j] === 0 || pk === null) return; s += 1 - Math.abs(ans[j] - pk) / 4; e += EXP(pk); n++; });
  if (!n) return 0;
  const raw = s / n, E = e / n;
  const cal = raw >= E ? 0.5 + 0.5 * (raw - E) / (1 - E) : 0.5 * raw / E;
  return CALIBRATE ? BLEND * cal + (1 - BLEND) * raw : raw;
});
const winners = (ans: number[], parties: string[]) => { const a = score(ans, parties); const m = Math.max(...a); return parties.filter((_, i) => Math.abs(a[i] - m) < 1e-9); };
const rnd = () => Math.floor(Math.random() * 5) - 2;
const fmt = (o: Record<string, number>, n: number, parties: string[]) => parties.map(p => `${p} ${(100 * (o[p] || 0) / n).toFixed(0)}%`).join(" · ");

console.log(`Preguntas: ${Q.length} · pendientes de revisión experta: ${Q.filter(q => q.revisar).length}\n`);

// Dirección de los enunciados (bloque estatal): ¿decir «sí» acerca a la izquierda o a la derecha?
const L = (q: any) => (q.p[idx("PSOE")] + q.p[idx("SUMAR")] + q.p[idx("POD")]) / 3, R = (q: any) => (q.p[idx("PP")] + q.p[idx("VOX")]) / 2;
const lq = Q.filter(q => L(q) > R(q)).length, rq = Q.filter(q => R(q) > L(q)).length;
console.log(`Dirección: «de acuerdo» acerca a PSOE/Sumar/Podemos en ${lq} · a PP/Vox en ${rq} · empate ${Q.length - lq - rq}`);
console.log("Posición media por partido:", ORDER.map(p => `${p} ${((()=>{const v=Q.map(q=>q.p[idx(p)]).filter(x=>x!==null) as number[];return v.reduce((s,x)=>s+x,0)/v.length})()).toFixed(2)}`).join(" · "));

for (const [region, parties] of Object.entries(REGIONS)) {
  console.log(`\n■ ${region}`);
  const yes = score(Q.map(() => 1), parties), no = score(Q.map(() => -1), parties);
  console.log("  Todo «De acuerdo»:", parties.map((p, i) => `${p} ${(100 * yes[i]).toFixed(0)}`).join(" · "));
  console.log("  Todo «En desacuerdo»:", parties.map((p, i) => `${p} ${(100 * no[i]).toFixed(0)}`).join(" · "));
  const o: Record<string, number> = {}; const N = 30000;
  for (let i = 0; i < N; i++) { let a = Q.map(rnd); const w = winners(a, parties); w.forEach(x => o[x] = (o[x] || 0) + 1 / w.length); }
  console.log("  Al azar gana:", fmt(o, N, parties));
  const rec = parties.map(p => {
    const k = idx(p); const c: Record<string, number> = {}; const M = 8000;
    for (let i = 0; i < M; i++) { const a = Q.map(q => (Math.random() < 1 / 3 || q.p[k] === null ? rnd() : (q.p[k] as number))); const w = winners(a, parties); w.forEach(x => c[x] = (c[x] || 0) + 1 / w.length); }
    const conf = Object.entries(c).filter(([x]) => x !== p).sort((a, b) => b[1] - a[1])[0];
    return `${p} ${(100 * (c[p] || 0) / M).toFixed(0)}%${conf && conf[1] / M > 0.05 ? ` (lo confunde con ${conf[0]} ${(100 * conf[1] / M).toFixed(0)}%)` : ""}`;
  });
  console.log("  Reconoce a su votante:", rec.join(" · "));
}

console.log("\nPares que el test apenas separa (menos de 4 preguntas con 2+ puntos de diferencia):");
for (let a = 0; a < ORDER.length; a++) for (let b = a + 1; b < ORDER.length; b++) {
  const d = Q.filter(q => q.p[a] !== null && q.p[b] !== null && Math.abs((q.p[a] as number) - (q.p[b] as number)) >= 2).length;
  if (d < 4) console.log(`  ${ORDER[a]}–${ORDER[b]}: ${d}`);
}
