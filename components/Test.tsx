"use client";
import { useEffect, useState } from "react";
import { PARTIES, QUESTIONS as Q } from "@/lib/data";
import { Dot } from "./Dot";

type Ans = number | null | undefined; // undefined = sin responder, null = saltada
const OPTS: [number, string][] = [[-2, "Muy en desacuerdo"], [-1, "En desacuerdo"], [0, "Neutral"], [1, "De acuerdo"], [2, "Muy de acuerdo"]];
const KEY = "papeleta-test";
const fmt = (v: Ans) => (v === undefined || v === null ? "—" : v > 0 ? `+${v}` : String(v));

function joinEs(xs: string[]) {
  if (xs.length === 1) return xs[0];
  return xs.slice(0, -1).join(", ") + " y " + xs[xs.length - 1];
}

export function explainAffinity(ans: Ans[]) {
  const topics = [...new Set(Q.map(q => q.t))];
  const coincide: string[][] = PARTIES.map(() => []);
  const discrepa: string[][] = PARTIES.map(() => []);
  for (const topic of topics) {
    PARTIES.forEach((_, k) => {
      let agree = 0, disagree = 0, n = 0;
      Q.forEach((q, j) => {
        if (q.t !== topic) return;
        const a = ans[j];
        if (a === undefined || a === null) return;
        n++;
        const d = Math.abs(a - q.p[k]);
        if (d === 0) agree++;
        if (d >= 3) disagree++;
      });
      if (!n) return;
      if (agree >= 1 && agree >= disagree) coincide[k].push(topic);
      else if (disagree >= 1 && disagree > agree) discrepa[k].push(topic);
    });
  }
  const take = (xs: string[]) => xs.slice(0, 2);
  const rank = (rows: string[][], prep: string) =>
    PARTIES.map((p, k) => ({ p, topics: take(rows[k]) }))
      .filter(x => x.topics.length)
      .sort((a, b) => b.topics.length - a.topics.length)
      .slice(0, 3)
      .map(x => `${prep} ${x.p.name} en ${joinEs(x.topics)}`);
  const withBits = rank(coincide, "con");
  const againstBits = rank(discrepa, "de");
  const parts = [
    withBits.length ? `Coincides ${withBits.join("; ")}` : "",
    againstBits.length ? `discrepas especialmente ${againstBits.join("; ")}` : "",
  ].filter(Boolean);
  if (!parts.length) return "";
  const text = parts.join(". ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export function affinity(ans: Ans[], imp: boolean[]) {
  return PARTIES.map((p, k) => {
    let num = 0, den = 0;
    Q.forEach((q, j) => {
      const a = ans[j];
      if (a === undefined || a === null) return;
      const w = imp[j] ? 2 : 1;
      num += w * (1 - Math.abs(a - q.p[k]) / 4);
      den += w;
    });
    return { ...p, pct: den ? Math.round((100 * num) / den) : 0 };
  }).sort((a, b) => b.pct - a.pct);
}

export function Test() {
  const [ans, setAns] = useState<Ans[]>(() => Q.map(() => undefined));
  const [imp, setImp] = useState<boolean[]>(() => Q.map(() => false));
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [grow, setGrow] = useState(false);
  const [ready, setReady] = useState(false);

  // Las respuestas solo se guardan en el navegador del usuario
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
    setAns(a => a.map((x, j) => (j === i ? v : x)));
    setTimeout(() => go(i + 1), v === null ? 0 : 180);
  };
  const q = Q[i];
  const answered = ans.filter(a => a !== undefined && a !== null).length;

  if (done) {
    const r = affinity(ans, imp);
    const why = explainAffinity(ans);
    const nImp = imp.filter(Boolean).length;
    return (
      <section role="tabpanel" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="sheet">
          <div className="row">
            <h2>Tu afinidad con cada partido</h2>
            <button className="btn" type="button" onClick={() => { setAns(Q.map(() => undefined)); setImp(Q.map(() => false)); setI(0); setDone(false); }}>Repetir test</button>
          </div>
          {answered === 0 ? <p className="small">No has respondido ninguna pregunta. Repite el test para ver tu resultado.</p> : <>
            {why && <p className="why">{why}</p>}
            <p className="small">Afinidad global sobre {answered} de {Q.length} respuestas{nImp ? `, con ${nImp} temas marcados como importantes` : ""}.{answered < 10 ? " Con pocas respuestas el resultado es poco fiable." : ""} No dice a quién votar: solo mide la distancia entre tus respuestas y la posición de cada partido. El resultado queda en tu navegador; no publicamos sondeos ni totales de quienes hacen el test (la LOREG lo prohíbe desde el 24 de noviembre).</p>
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
              <p className="small" style={{ marginTop: 8 }}>Escala: −2 muy en desacuerdo · 0 neutral · +2 muy de acuerdo. Sombreado: coincides con ese partido.</p>
              <div className="tablewrap" style={{ marginTop: 8 }}>
                <table>
                  <thead><tr><th style={{ textAlign: "left" }}>Afirmación</th><th>Tú</th>{PARTIES.map(p => <th key={p.id}>{p.name}</th>)}</tr></thead>
                  <tbody>
                    {Q.map((qq, j) => (
                      <tr key={j}>
                        <td className="q">{qq.s}{imp[j] && <strong> (×2)</strong>}</td>
                        <td className="you"><span className="cell">{fmt(ans[j])}</span></td>
                        {qq.p.map((v, k) => <td key={k}><span className={`cell ${ans[j] === v ? "match" : ""}`}>{fmt(v)}</span></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>}
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
      <p>Cada partido tiene una posición de −2 a +2 en cada afirmación. Para cada respuesta medimos la distancia entre tu posición y la del partido: misma posición suma el 100 %, el extremo opuesto suma 0 %. Los temas marcados como importantes cuentan el doble y las preguntas saltadas no cuentan. Tus respuestas no salen de tu navegador.</p>
    </div>
  );
}
