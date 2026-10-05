// Prueba rápida de la recuperación sin llamar a Claude: npm run test:search -- "precio del alquiler"
import { readFileSync } from "node:fs";
import { buildIndex, search, type Chunk } from "../lib/search.ts";

const chunks: Chunk[] = JSON.parse(readFileSync("data/chunks.json", "utf8"));
const idx = buildIndex(chunks);
const q = process.argv.slice(2).join(" ") || "precio del alquiler";
const parties = [...new Set(chunks.map(c => c.party))];
console.log(`Consulta: "${q}" · ${chunks.length} fragmentos de ${parties.join(", ") || "ningún partido"}\n`);
for (const p of parties) {
  for (const h of search(idx, q, { party: p, k: 3 })) {
    console.log(`[${h.chunk.id}] p.${h.chunk.page} score ${h.score.toFixed(2)}\n  ${h.chunk.text.slice(0, 220)}…\n`);
  }
}
