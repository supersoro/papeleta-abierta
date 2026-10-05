// Búsqueda BM25 sobre los fragmentos de los programas (data/chunks.json).
// Sin dependencias ni servicios externos: el índice se construye en memoria al arrancar.

export type Chunk = { id: string; party: string; page: number; text: string };

const STOP = new Set(
  "a al algo algun alguna algunas alguno algunos ante antes aqui asi aun bajo bien cada como con contra cual cuales cuando de del desde donde dos el ella ellas ellos en entre era es esa esas ese eso esos esta estan estas este esto estos fue ha han hasta hay la las le les lo los mas me mi mientras muy nos o otra otras otro otros para pero poco por porque que quien se sea segun ser si sin sino sobre son su sus tambien tan tanto te tiene tienen todo todos tras tu un una uno unos y ya va van hacer haran harian propone proponen dice dicen partido partidos quiere quieren sobre opina piensa".split(" ")
);

export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Tokens normalizados con un recorte simple a 6 letras como "raíz" (alquiler/alquileres → alquil)
export function tokenize(s: string): string[] {
  return normalize(s)
    .split(/[^a-zñ0-9]+/)
    .filter(w => w.length > 2 && !STOP.has(w))
    .map(w => (w.length > 6 ? w.slice(0, 6) : w));
}

type Index = { chunks: Chunk[]; tf: Map<string, number>[]; len: number[]; df: Map<string, number>; avg: number };

export function buildIndex(chunks: Chunk[]): Index {
  const tf: Map<string, number>[] = [];
  const len: number[] = [];
  const df = new Map<string, number>();
  for (const c of chunks) {
    const m = new Map<string, number>();
    const toks = tokenize(c.text);
    for (const t of toks) m.set(t, (m.get(t) || 0) + 1);
    for (const t of m.keys()) df.set(t, (df.get(t) || 0) + 1);
    tf.push(m);
    len.push(toks.length);
  }
  const avg = len.reduce((a, b) => a + b, 0) / Math.max(1, len.length);
  return { chunks, tf, len, df, avg };
}

export function search(idx: Index, query: string, opts: { party?: string; k?: number } = {}): { chunk: Chunk; score: number }[] {
  const k1 = 1.4, b = 0.75, N = idx.chunks.length;
  const q = [...new Set(tokenize(query))];
  const out: { chunk: Chunk; score: number }[] = [];
  idx.chunks.forEach((c, i) => {
    if (opts.party && c.party !== opts.party) return;
    let s = 0;
    for (const t of q) {
      const f = idx.tf[i].get(t);
      if (!f) continue;
      const n = idx.df.get(t) || 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * idx.len[i]) / idx.avg)));
    }
    if (s > 0) out.push({ chunk: c, score: s });
  });
  return out.sort((a, b) => b.score - a.score).slice(0, opts.k ?? 5);
}
