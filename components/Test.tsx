"use client";
import { useEffect, useState } from "react";
import { QUESTIONS as Q } from "@/lib/test-2026";
import { affinity, countedAnswers, explainAffinity, stanceOf, withParty, MIN_ANSWERS, type Ans } from "@/lib/afinidad";
import { useProvincia, useVisibleParties } from "./Provincia";
import { Dot } from "./Dot";

const OPTS: [number, string][] = [[-2, "Muy en desacuerdo"], [-1, "En desacuerdo"], [0, "Neutral"], [1, "De acuerdo"], [2, "Muy de acuerdo"]];
const KEY = "papeleta-test-2026";
const fmt = (v: number | null | undefined) => (v === undefined || v === null ? "—" : v > 0 ? `+${v}` : String(v));

export function Test() {
  const { provincia, setOpen } = useProvincia();
  const parties = useVisibleParties();
  const [ans, setAns] = useState<Ans[]>(() => Q.map(() => undefined));
  const [imp, setImp] = useState<boolean[]>(() => Q.map(() => false));
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [grow, setGrow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s?.ans?.length === Q.length) {
        const a: Ans[] = s.ans.map((x: number | null | "u") => (x === "u" ? undefined : x));
        setAns(a); setImp(Array.isArray(s.imp) && s.imp.length === Q.length ? s.imp : Q.map(() => false));
        const first = a.findIndex((x: Ans) => x === undefined);
        setI(first === -1 ? 0 : first);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ ans: ans.map(x => (x === undefined ? "u" : x)), imp })); } catch {}
  }, [ans, imp, ready]);
  useEffect(() => { if (done) { setGrow(false); const t = setTimeout(() => setGrow(true), 30); return () => clearTimeout(t); } }, [done]);

  const go = (n: number) => { if (n >= Q.length) { setDone(true); return; } setI(Math.max(0, n)); };
  const answer = (v: number | null) => {
    setAns(a => a.map((x, j) => (j === i ? v as Ans : x)));
    setTimeout(() => go(i + 1), v === null ? 0 : 180);
  };
  const q = Q[i];
  const counted = countedAnswers(ans);

  if (done) {
    const ids = parties.map(p => p.id);
    const r = withParty(affinity(ans, imp, ids));
    const why = explainAffinity(ans, ids);
    const nImp = imp.filter(Boolean).length;
    const tooFew = counted < MIN_ANSWERS;
    return (
      <section role="tabpanel" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="sheet">
          <div className="row">
            <h2>Tu afinidad con cada partido</h2>
            <button className="btn" type="button" onClick={() => { setAns(Q.map(() => undefined)); setImp(Q.map(() => false)); setI(0); setDone(false); }}>Repetir test</button>
          </div>
          {!provincia && <p className="small">Estás viendo los cinco partidos estatales. <button className="btn link" type="button" onClick={() => setOpen(true)}>Elige provincia</button> para incluir a los que se presentan en tu circunscripción.</p>}
          {tooFew ? (
            <p className="small">Has respondido {counted} preguntas con una posición (las neutrales no cuentan). Contesta al menos {MIN_ANSWERS} para ver un resultado fiable. <button className="btn link" type="button" onClick={() => setDone(false)}>Seguir el test</button></p>
          ) : (
            <>
              {why && <p className="why">{why}</p>}
              <p className="small">Afinidad sobre {counted} respuestas no neutrales de {Q.length}{nImp ? `, con ${nImp} temas marcados como importantes` : ""}. El 50 % es el azar: por encima, coincides más que si respondieras al azar. No dice a quién votar. El resultado queda en tu navegador; no publicamos sondeos (la LOREG lo prohíbe desde el 24 de noviembre). <a href="/metodologia">Cómo se calcula</a>.</p>
              <div className="results">
                {r.map(p => (
                  <div className="bar" key={p.id}>
                    <span className="name"><Dot color={p.color} />{p.name}</span>
                    <span className="track"><span className="fill" style={{ width: grow ? `${p.pct}%` : 0, background: p.color }} /></span>
                    <span className="pct">{p.pct} %</span>
                  </div>
                ))}
              </div>
              <details open>
                <summary>Compara pregunta a pregunta</summary>
                <p className="small" style={{ marginTop: 8 }}>Escala: −2 muy en desacuerdo · 0 neutral · +2 muy de acuerdo. Un «—» significa que el partido no tiene posición conocida. Sombreado: coincides.</p>
                <div className="tablewrap" style={{ marginTop: 8 }}>
                  <table>
                    <thead><tr><th style={{ textAlign: "left" }}>Afirmación</th><th>Tú</th>{parties.map(p => <th key={p.id}>{p.name}</th>)}</tr></thead>
                    <tbody>
                      {Q.map((qq, j) => (
                        <tr key={j}>
                          <td className="q">{qq.s}{imp[j] && <strong> (×2)</strong>}</td>
                          <td className="you"><span className="cell">{fmt(ans[j])}</span></td>
                          {parties.map(p => {
                            const v = stanceOf(qq, p.id);
                            return <td key={p.id}><span className={`cell ${ans[j] !== undefined && ans[j] !== null && v != null && ans[j] === v ? "match" : ""}`}>{fmt(v)}</span></td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}
        </div>
        <Metodo />
      </section>
    );
  }

  return (
    <section role="tabpanel" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="sheet" aria-live="polite">
        <div className="ticks" aria-label="Progreso">
          {Q.map((_, j) => (
            <button key={j} type="button" aria-label={`Pregunta ${j + 1}`} onClick={() => go(j)}
              className={`tick ${ans[j] === null ? "skip" : ans[j] !== undefined ? "done" : ""} ${j === i ? "cur" : ""}`} />
          ))}
        </div>
        <div className="qmeta"><span>Pregunta {i + 1} de {Q.length}</span><span>{q.t}</span></div>
        <p className="statement">{q.s}</p>
        {q.c && <p className="context">{q.c}</p>}
        <div className="scale" role="group" aria-label="Tu respuesta">
          {OPTS.map(([v, l]) => (
            <button key={v} className="opt" type="button" aria-pressed={ans[i] === v} onClick={() => answer(v)}>
              <span className="box" />{l}
            </button>
          ))}
        </div>
        <div className="row">
          <label className="weight" htmlFor="w">
            <input type="checkbox" id="w" checked={imp[i]} onChange={e => setImp(m => m.map((x, j) => (j === i ? e.target.checked : x)))} />
            Este tema me importa especialmente
          </label>
          <div className="nav">
            <button className="btn link" type="button" onClick={() => answer(null)}>Saltar</button>
            <button className="btn" type="button" disabled={i === 0} onClick={() => go(i - 1)}>Anterior</button>
            <button className="btn primary" type="button" onClick={() => go(i + 1)}>{i === Q.length - 1 ? "Ver resultado" : "Siguiente"}</button>
          </div>
        </div>
      </div>
      <Metodo />
    </section>
  );
}

function Metodo() {
  return (
    <div className="sheet method">
      <h3>Cómo se calcula</h3>
      <p>Cada partido tiene una posición de −2 a +2, o un «—» si no hay posición conocida (esa pregunta no cuenta para él). Las respuestas «Neutral» no cuentan. El 50 % es lo que saldría por azar: así no ganan ventaja los partidos con posiciones tibias. Hacen falta 8 respuestas no neutrales. <a href="/metodologia">Metodología completa</a>.</p>
    </div>
  );
}
