"use client";
import { useState } from "react";
import { PARTIES, TOPICS, programaNota, type PartyId } from "@/lib/data";
import { AFIRMACIONES, afirmacionesDeTopic, posicionDe } from "@/lib/posiciones";
import { historialDePartido, votoTexto } from "@/lib/historial";
import { useProvincia, useVisibleParties } from "./Provincia";
import { PosicionVista } from "./PosicionVista";
import { AvisoError } from "./AvisoError";
import { Dot } from "./Dot";

const TEMAS = [...new Set(AFIRMACIONES.map(a => a.tema))];

export function Partidos() {
  const { provincia, setOpen } = useProvincia();
  const [all, setAll] = useState(false);
  const list = useVisibleParties(all);
  const [cur, setCur] = useState<PartyId>(list[0]?.id || "PP");
  const p = PARTIES.find(x => x.id === cur) || list[0];
  if (!p) return null;
  const votos = historialDePartido(p.id);
  return (
    <section className="sheet" role="tabpanel">
      <div className="row">
        {!provincia && <p className="small">Cinco partidos estatales. <button className="btn link" type="button" onClick={() => setOpen(true)}>Elige provincia</button> para ver también los de tu circunscripción.</p>}
        <label className="weight">
          <input type="checkbox" checked={all} onChange={e => setAll(e.target.checked)} />
          Ver todos los partidos
        </label>
      </div>
      <div className="plist" role="group" aria-label="Elige partido">
        {list.map(x => (
          <button key={x.id} className="pbtn" type="button" aria-pressed={x.id === cur} onClick={() => setCur(x.id)}>
            <Dot color={x.color} />{x.name}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}><Dot color={p.color} size={14} />{p.full}</h2>
          <p className="lede" style={{ marginTop: 6 }}>{p.desc}</p>
        </div>
        <dl className="facts">
          <div><dt>Líder / candidatura</dt><dd>{p.lead}</dd></div>
          <div><dt>Representación</dt><dd>{p.seats}</dd></div>
          <div><dt>Espacio</dt><dd>{p.family}</dd></div>
        </dl>
        <p className="small"><span className="badge badge-res">{programaNota(p)}</span> · <a className="ext" href={p.url} target="_blank" rel="noopener">Ver programa original</a></p>
        <h3>Qué propone</h3>
        <div className="topiclist">
          {TEMAS.map(tema => {
            const rows = AFIRMACIONES.filter(a => a.tema === tema);
            return (
              <div className="trow trow-pos" key={tema}>
                <span className="tl">{tema}</span>
                <div>
                  {rows.map(a => {
                    const pos = posicionDe(a.id, p.id);
                    return (
                      <div key={a.id} className="pos-item">
                        <p className="pos-enun">{a.enunciado}</p>
                        <PosicionVista pos={pos} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {votos.length > 0 && (
          <div>
            <h3>Qué ha votado (2023-2026)</h3>
            <ul className="hist-list">
              {votos.map(h => (
                <li key={h.id}>
                  {votoTexto(h.votos[p.id])} · {h.titulo}{h.fecha ? ` (${h.fecha})` : ""} · <a href={h.fuente!} target="_blank" rel="noopener">Registro oficial</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <AvisoError partido={p.id} />
      </div>
    </section>
  );
}

export function Temas() {
  const { provincia, setOpen } = useProvincia();
  const [all, setAll] = useState(false);
  const available = useVisibleParties(all);
  const [k, setK] = useState(TOPICS[0][0]);
  const [sel, setSel] = useState<PartyId[]>([]);
  const chosen = sel.length ? sel.filter(id => available.some(p => p.id === id)) : available.map(p => p.id);
  const shown = available.filter(p => chosen.includes(p.id));
  const afirmaciones = afirmacionesDeTopic(k);
  const toggle = (id: PartyId) => {
    setSel(cur => {
      const base = cur.length ? cur : available.map(p => p.id);
      if (base.includes(id)) return base.length <= 2 ? base : base.filter(x => x !== id);
      return [...base, id];
    });
  };

  return (
    <section className="sheet" role="tabpanel">
      <div>
        <h2>Compárame</h2>
        <p className="lede" style={{ marginTop: 6 }}>Elige al menos dos partidos y un tema. Cada posición sale de afirmaciones.json y posiciones.json, con su nivel de evidencia.</p>
      </div>
      <div className="row">
        {!provincia && <p className="small">Cinco partidos estatales. <button className="btn link" type="button" onClick={() => setOpen(true)}>Elige provincia</button></p>}
        <label className="weight">
          <input type="checkbox" checked={all} onChange={e => setAll(e.target.checked)} />
          Ver todos los partidos
        </label>
      </div>
      <div className="compare-controls">
        <div>
          <p className="ans-k">Partidos</p>
          <div className="plist" role="group" aria-label="Partidos a comparar">
            {available.map(x => (
              <button key={x.id} className="pbtn" type="button" aria-pressed={chosen.includes(x.id)} onClick={() => toggle(x.id)}>
                <Dot color={x.color} />{x.name}
              </button>
            ))}
          </div>
        </div>
        <label className="small" htmlFor="topicsel" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Tema
          <select id="topicsel" value={k} onChange={e => setK(e.target.value as typeof k)}>
            {TOPICS.map(([key, l]) => <option key={key} value={key}>{l}</option>)}
          </select>
        </label>
      </div>
      {afirmaciones.map(a => (
        <div key={a.id} className="compare-afirm">
          <h3>{a.enunciado}</h3>
          {a.contexto && <p className="small">{a.contexto}</p>}
          <div className="answers">
            {shown.map(p => {
              const pos = posicionDe(a.id, p.id);
              return (
                <article key={p.id} className={`ans ${pos?.valor == null ? "none" : ""}`}>
                  <p className="ans-k">Partido</p>
                  <h3><Dot color={p.color} />{p.name}</h3>
                  <p className="ans-k">Qué propone</p>
                  <PosicionVista pos={pos} />
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
