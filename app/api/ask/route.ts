import { NextRequest, NextResponse } from "next/server";
import { ask } from "@/lib/ask";
import { resolveProvincia } from "@/lib/data";
import { checkLimits } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let q = "";
  let provincia: string | null = null;
  try {
    const body = await req.json();
    q = String(body?.q ?? "").trim();
    const p = String(body?.provincia ?? "").trim();
    if (p) provincia = resolveProvincia(p);
  } catch {}
  if (q.length < 3) return NextResponse.json({ error: "Escribe una pregunta un poco más larga." }, { status: 400 });
  if (q.length > 300) return NextResponse.json({ error: "La pregunta es demasiado larga. Resúmela en menos de 300 caracteres." }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "El buscador no está configurado (falta ANTHROPIC_API_KEY)." }, { status: 503 });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  const lim = await checkLimits(ip);
  if (!lim.ok) {
    const msg = lim.reason === "minute" ? "Has hecho muchas preguntas seguidas. Espera un minuto." : "El buscador ha alcanzado el límite de hoy. Vuelve mañana o usa la sección Comparar.";
    return NextResponse.json({ error: msg }, { status: 429 });
  }

  try {
    return NextResponse.json(await ask(q, provincia));
  } catch (e) {
    console.error("ask failed", { name: e instanceof Error ? e.name : "error" });
    return NextResponse.json({ error: "No se pudo generar la respuesta. Inténtalo de nuevo en unos segundos." }, { status: 502 });
  }
}
