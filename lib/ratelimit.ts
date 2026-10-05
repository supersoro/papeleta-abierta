// Límites de uso del buscador: por IP y minuto, y un tope diario global para controlar el coste.
// Con UPSTASH_REDIS_REST_URL/TOKEN los contadores se comparten entre instancias (recomendado en producción).
// Sin ellos se usa memoria local, que en Vercel es por instancia: suficiente para la prueba.

const PER_MIN = Number(process.env.RATE_LIMIT_PER_MINUTE || 5);
const DAILY = Number(process.env.DAILY_LIMIT || 2000);
const URL_ = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const mem = new Map<string, { n: number; exp: number }>();

async function incr(key: string, ttlSec: number): Promise<number> {
  if (URL_ && TOKEN) {
    const r = await fetch(`${URL_}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, String(ttlSec), "NX"]]),
      cache: "no-store",
    });
    const data = await r.json();
    return Number(data?.[0]?.result ?? 0);
  }
  const now = Date.now();
  const e = mem.get(key);
  if (!e || e.exp < now) { mem.set(key, { n: 1, exp: now + ttlSec * 1000 }); return 1; }
  e.n += 1;
  return e.n;
}

export async function checkAvisoLimit(ip: string): Promise<boolean> {
  const minute = Math.floor(Date.now() / 60000);
  const ipKey = await hash(ip);
  const n = await incr(`aviso:${ipKey}:${minute}`, 60);
  return n <= 3;
}

export async function redisCommand(cmds: string[][]): Promise<any[] | null> {
  if (!URL_ || !TOKEN) return null;
  const r = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  return r.json();
}

export async function checkLimits(ip: string): Promise<{ ok: true } | { ok: false; reason: "minute" | "daily" }> {
  const minute = Math.floor(Date.now() / 60000);
  const day = new Date().toISOString().slice(0, 10);
  // Las IP no se guardan en claro: solo un hash corto que caduca en un minuto.
  const ipKey = await hash(ip);
  const n = await incr(`rl:${ipKey}:${minute}`, 60);
  if (n > PER_MIN) return { ok: false, reason: "minute" };
  const d = await incr(`daily:${day}`, 90000);
  if (d > DAILY) return { ok: false, reason: "daily" };
  return { ok: true };
}

async function hash(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}
