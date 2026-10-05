"use client";
import { useRef, useState } from "react";
import { LEGISLATURA, PARTIES, topicName, type TopicKey } from "@/lib/data";
import { Dot } from "./Dot";

type Cita = { fuente: string; pagina: number | null; url: string; tipo?: "programa" | "resumen" };
type Resp = { id: string; menciona: boolean; titular?: string; respuesta: string; citas: Cita[] };
type Result = { fuera_de_tema: boolean; sintesis?: string; partidos: Resp[]; modo: string; tema?: TopicKey | null };

const EXAMPLES = [
  "¿Quién propone construir más vivienda?",
  "¿Qué partidos quieren mantener las nucleares?",
  "Compárame PSOE y PP en impuestos",
  "¿Qué dicen sobre inmigración?",
  "¿Quién quiere bajar el IRPF?",
];

function srcLine(c: Cita) {
  const kind = c.tipo === "resumen" || c.pagina == null ? "Resumen" : "Programa";
  const page = c.pagina ? ` · p. ${c.pagina}` : "";
  return `${kind}${page}`;
}

export function Buscador() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const ctl = useRef<AbortController | null>(null);

  async function run(question: string) {
    const text = question.trim();
    if (!text || loading) return;
    ctl.current = new AbortController();
    setLoading(true); setError(""); setRes(null);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text }),
        signal: ctl.current.signal,
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) setError(data.error || "No se pudo completar la búsqueda.");
      else setRes(data);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError("No hay conexión con el buscador. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const hechos = res?.tema ? LEGISLATURA[res.tema] : undefined;

  return (
    <section className="sheet hero" role="tabpanel">
      <div>
        <h1 className="ask-title">¿Qué quieres saber antes de votar?</h1>
        <p className="lede">Pregunta sobre vivienda, impuestos, inmigración, energía, pensiones… Cada respuesta incluye sus fuentes.</p>
      </div>
      <form className="ask" onSubmit={e => { e.preventDefault(); run(q); }}>
        <input id="q" type="text" autoComplete="off" maxLength={300} value={q} onChange={e => setQ(e.target.value)}
          placeholder="¿Qué partidos quieren aumentar la oferta de vivienda?" aria-label="Tu pregunta" />
        <button className="btn primary" type="submit" disabled={loading}>Preguntar</button>
        {loading && <button className="btn" type="button" onClick={() => ctl.current?.abort()}>Parar</button>}
      </form>
      <div className="chips">
        {EXAMPLES.map(x => (
          <button key={x} className="chip" type="button" onClick={() => { setQ(x); run(x); }}>{x}</button>
        ))}
      </div>

      {loading && <p className="status">Buscando en los programas…</p>}
      {error && <p className="err">{error}</p>}
      {res?.fuera_de_tema && <p className="status">Esta pregunta no trata sobre las propuestas de los partidos. Prueba con un tema concreto: vivienda, impuestos, sanidad…</p>}

      {res && !res.fuera_de_tema && (
        <div className="answers" aria-live="polite">
          {res.sintesis && <p className="sintesis">{res.sintesis}</p>}
          {PARTIES.map(p => {
            const a = res.partidos.find(x => x.id === p.id);
            const line = a?.titular || a?.respuesta;
            return (
              <article key={p.id} className={`ans ${a?.menciona ? "" : "none"}`}>
                <h3><Dot color={p.color} />{p.name}</h3>
                <p className="titular">{a?.menciona ? line : "Los textos consultados de este partido no tratan esta cuestión."}</p>
                {a?.menciona && a.citas[0] && (
                  <p className="src-line">
                    <span className={`badge ${a.citas[0].tipo === "resumen" || a.citas[0].pagina == null ? "badge-res" : "badge-prog"}`}>{srcLine(a.citas[0])}</span>
                    <a href={a.citas[0].url} target="_blank" rel="noopener">Ver fuente</a>
                    {a.citas.slice(1).map((c, i) => (
                      <a key={i} href={c.url} target="_blank" rel="noopener">{srcLine(c)}</a>
                    ))}
                  </p>
                )}
              </article>
            );
          })}

          {hechos && hechos.length > 0 && (
            <aside className="hecho">
              <h3>¿Qué ocurrió en la legislatura?</h3>
              <p className="small">Votaciones, leyes y actuaciones de 2023 a 2026 sobre {topicName(res.tema!).toLowerCase()}. No es programa: es lo que ya se ha hecho o votado.</p>
              <ul>
                {hechos.map((h, i) => (
                  <li key={i}>
                    <p>{h.hecho}</p>
                    <span className="cite">{h.src}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <p className="small">
            Las respuestas de arriba salen de los programas (o de un resumen, si el distintivo lo indica). Pueden contener errores: abre siempre la fuente.
            {res.modo !== "programas" ? " Algunos partidos se han consultado sobre resúmenes porque su PDF no está cargado." : ""}
            {" "}No guardamos tus preguntas.
          </p>
        </div>
      )}
    </section>
  );
}
