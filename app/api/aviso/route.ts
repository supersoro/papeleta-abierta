import { NextRequest, NextResponse } from "next/server";
import { checkAvisoLimit, redisCommand } from "@/lib/ratelimit";
import { PARTIES } from "@/lib/data";
import { AFIRMACIONES } from "@/lib/posiciones";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let partido = "";
  let afirmacion = "";
  let que = "";
  let fuente = "";
  let email = "";
  let consentimiento = false;
  try {
    const body = await req.json();
    partido = String(body?.partido ?? "").trim();
    afirmacion = String(body?.afirmacion ?? "").trim();
    que = String(body?.que ?? "").trim();
    fuente = String(body?.fuente ?? "").trim();
    email = String(body?.email ?? "").trim();
    consentimiento = !!body?.consentimiento;
  } catch {}

  if (que.length < 8 || que.length > 1200) {
    return NextResponse.json({ error: "Describe el error en unas líneas." }, { status: 400 });
  }
  if (partido && !PARTIES.some(p => p.id === partido)) {
    return NextResponse.json({ error: "Partido no reconocido." }, { status: 400 });
  }
  if (afirmacion && !AFIRMACIONES.some(a => a.id === afirmacion) && afirmacion !== "buscador") {
    return NextResponse.json({ error: "Afirmación no reconocida." }, { status: 400 });
  }
  if (email && !consentimiento) {
    return NextResponse.json({ error: "Si dejas un correo, marca la casilla de consentimiento." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "El correo no es válido." }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  if (!(await checkAvisoLimit(ip))) {
    return NextResponse.json({ error: "Has enviado varios avisos seguidos. Espera un minuto." }, { status: 429 });
  }

  const record = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    partido,
    afirmacion,
    que,
    fuente,
    ...(email && consentimiento ? { email } : {}),
  };

  const stored = await redisCommand([
    ["LPUSH", "avisos", JSON.stringify(record)],
    ["LTRIM", "avisos", "0", "499"],
  ]);
  if (!stored) {
    return NextResponse.json({ error: "El formulario de avisos no está configurado todavía." }, { status: 503 });
  }
  console.error("aviso recibido", { tipo: "aviso", partido, afirmacion });
  return NextResponse.json({ ok: true });
}
