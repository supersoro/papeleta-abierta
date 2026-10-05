"use client";
import { useRef, useState } from "react";
import { PARTIES, topicName, type TopicKey } from "@/lib/data";
import { useProvincia } from "./Provincia";
import { AvisoError } from "./AvisoError";
import { Dot } from "./Dot";

type Cita = { fuente: string; pagina: number | null; url: string; tipo?: "programa" | "resumen" };
type Resp = { id: string; menciona: boolean; titular?: string; respuesta: string; citas: Cita[] };
type Hist = { id: string; titulo: string; fecha: string | null; fuente: string; votos: Record<string, string> };
type Result = {
  fuera_de_tema: boolean;
  nota_voto?: boolean;
  nota_valoracion?: boolean;
  solo_nota?: boolean;
  partidos: Resp[];
  modo: string;
  tema?: TopicKey | null;
  historial?: Hist[];
};

const FEATURED = "¿Qué harán con el precio del alquiler?";
const EXAMPLES = [
  FEATURED,
  "¿Quién propone construir más vivienda?",
  "¿Qué partidos quieren mantener las nucleares?",
  "Compárame PSOE y PP en impuestos",
  "¿Qué dicen sobre inmigración?",
];

function goSection(e: React.MouseEvent<HTMLAnchorElement>, id: "test" | "temas") {
  e.preventDefault();
  history.replaceState(null, "", `#${id}`);
  window.dispatchEvent(new CustomEvent("papeleta:tab", { detail: id }));
}

function srcLine(c: Cita) {
  const page = c.pagina ? ` · p. ${c.pagina}` : "";
  return `${c.fuente}${page}`;
}

export function Buscador() {
  const { provincia, setOpen } = useProvincia();
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
        body: JSON.stringify({ q: text, provincia }),
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

  const shown = res?.partidos?.length
    ? res.partidos.map(a => PARTIES.find(p => p.id === a.id)).filter((p): p is NonNullable<typeof p> => !!p)
    : [];

  return (
    <section className="sheet hero" role="tabpanel">
      <div>
        <h1 className="ask-title">¿Qué quieres saber antes de votar?</h1>
        <p className="lede">Pregunta sobre vivienda, impuestos, inmigración, energía, pensiones… Cada respuesta incluye sus fuentes. O <a href="#temas" onClick={e => goSection(e, "temas")}>compara partidos por tema</a>.</p>
        <p className="privacidad">No guardamos tus preguntas.</p>
        {!provincia && <p className="small">Responde por los cinco partidos estatales. <button className="btn link" type="button" onClick={() => setOpen(true)}>Elige provincia</button> para incluir a ERC, Junts, PNV, EH Bildu, BNG, CC o UPN si se presentan.</p>}
      </div>
      <form className="ask" onSubmit={e => { e.preventDefault(); run(q); }}>
        <input id="q" type="text" autoComplete="off" maxLength={300} value={q} onChange={e => setQ(e.target.value)}
          placeholder="¿Qué partidos quieren aumentar la oferta de vivienda?" aria-label="Tu pregunta" />
        <button className="btn primary" type="submit" disabled={loading}>Preguntar</button>
        {loading && <button className="btn" type="button" onClick={() => ctl.current?.abort()}>Parar</button>}
      </form>
      <div className="chips">
        {EXAMPLES.map(x => (
          <button key={x} className={`chip${x === FEATURED ? " featured" : ""}`} type="button" onClick={() => { setQ(x); run(x); }}>{x}</button>
        ))}
      </div>

      {loading && <p className="status">Buscando en los programas…</p>}
      {error && <p className="err">{error}</p>}
      {res?.fuera_de_tema && <p className="status">Esta pregunta no trata sobre las propuestas de los partidos. Prueba con un tema concreto: vivienda, impuestos, sanidad…</p>}

      {res && !res.fuera_de_tema && (
        <div className="answers" aria-live="polite">
          {(res.solo_nota || res.nota_voto) && !res.nota_valoracion && (
            <p className="status">Esta web no recomienda a quién votar. Si quieres una orientación personal, usa el <a href="#test" onClick={e => goSection(e, "test")}>test de afinidad</a> o <a href="#temas" onClick={e => goSection(e, "temas")}>compara por tema</a>.</p>
          )}
          {res.nota_valoracion && (
            <p className="status">Esta pregunta pide un criterio de valoración. Puedes comparar sus propuestas{res.tema ? ` sobre ${topicName(res.tema).toLowerCase()}` : ""}. Abajo están, sin ordenarlas por calidad.</p>
          )}

          {!res.solo_nota && shown.map(p => {
            const a = res.partidos.find(x => x.id === p.id);
            const hist = (res.historial || []).filter(h => h.votos[p.id]);
            return (
              <article key={p.id} className={`ans ${a?.menciona ? "" : "none"}`}>
                <h3><Dot color={p.color} />{p.name}</h3>
                <p className="ans-k">Qué propone</p>
                <p className="titular">{a?.menciona ? a.titular : "No consta en su programa."}</p>
                {a?.menciona && a.respuesta && <p className="medida-sec">{a.respuesta}</p>}
                {a?.menciona && a.citas[0] && (
                  <p className="src-line">
                    <span className={`badge ${a.citas[0].tipo === "resumen" || a.citas[0].pagina == null ? "badge-res" : "badge-prog"}`}>{srcLine(a.citas[0])}</span>
                    <a href={a.citas[0].url} target="_blank" rel="noopener">Ver fuente</a>
                    {a.citas.slice(1).map((c, i) => (
                      <a key={i} href={c.url} target="_blank" rel="noopener">{srcLine(c)}</a>
                    ))}
                  </p>
                )}
                {hist.length > 0 && (
                  <div className="hist-block">
                    <p className="ans-k">Qué ha votado (2023-2026)</p>
                    {hist.map(h => (
                      <p key={h.id} className="small">
                        En la legislatura votó {h.votos[p.id]} de {h.titulo}{h.fecha ? ` (${h.fecha})` : ""}.{" "}
                        <a href={h.fuente} target="_blank" rel="noopener">Registro oficial</a>
                      </p>
                    ))}
                  </div>
                )}
                <AvisoError partido={p.id} afirmacion="buscador" />
              </article>
            );
          })}

          {!res.solo_nota && (
          <p className="small">
            Las respuestas de arriba salen de los programas de 2023 (Podemos: 2024) hasta que se publiquen los de estas elecciones. El origen del texto está en la etiqueta de la cita. Pueden contener errores: abre siempre la fuente.
            {res.modo !== "programas" ? " Algunos partidos se han consultado sobre resúmenes porque su PDF no está cargado." : ""}
          </p>
          )}
        </div>
      )}
    </section>
  );
}
