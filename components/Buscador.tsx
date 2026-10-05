"use client";
import { useRef, useState } from "react";
import { PARTIES } from "@/lib/data";
import { Dot } from "./Dot";

type Cita = { fuente: string; pagina: number | null; url: string };
type Resp = { id: string; menciona: boolean; respuesta: string; citas: Cita[] };
type Result = { fuera_de_tema: boolean; partidos: Resp[]; modo: string };

const EXAMPLES = [
  "¿Qué harán con el precio del alquiler?",
  "¿Quién quiere bajar impuestos?",
  "¿Qué proponen sobre las nucleares?",
  "¿Qué dicen sobre inmigración?",
  "¿Qué proponen para reducir las listas de espera?",
];

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

  return (
    <section className="sheet" role="tabpanel">
      <h2>¿Qué propone cada partido sobre…?</h2>
      <form className="ask" onSubmit={e => { e.preventDefault(); run(q); }}>
        <input id="q" type="text" autoComplete="off" maxLength={300} value={q} onChange={e => setQ(e.target.value)}
          placeholder="Por ejemplo: ¿qué harán con el precio del alquiler?" aria-label="Tu pregunta" />
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
          {PARTIES.map(p => {
            const a = res.partidos.find(x => x.id === p.id);
            return (
              <div key={p.id} className={`ans ${a?.menciona ? "" : "none"}`}>
                <h3><Dot color={p.color} />{p.name}</h3>
                <p>{a?.menciona ? a.respuesta : "Los textos consultados de este partido no tratan esta cuestión."}</p>
                {a?.menciona && a.citas.length > 0 && (
                  <span className="cite">
                    {a.citas.map((c, i) => (
                      <span key={i}>{i > 0 && " · "}<a href={c.url} target="_blank" rel="noopener">{c.fuente}{c.pagina ? `, p. ${c.pagina}` : ""}</a></span>
                    ))}
                  </span>
                )}
              </div>
            );
          })}
          {res.modo !== "programas" && (
            <p className="small">Algunos partidos se han consultado sobre los resúmenes de esta web porque su programa aún no está cargado.</p>
          )}
        </div>
      )}

      <p className="small">Las respuestas se generan con IA a partir de los programas electorales, con su página de origen. No valoran ni recomiendan voto, y pueden contener errores: comprueba siempre la fuente. No guardamos tus preguntas.</p>
    </section>
  );
}
