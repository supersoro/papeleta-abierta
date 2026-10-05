"use client";
import { useState } from "react";
import { PARTIES, TOPICS, KB, programaNota, type PartyId } from "@/lib/data";
import { Dot } from "./Dot";

export function Partidos() {
  const [cur, setCur] = useState<PartyId>("PP");
  const p = PARTIES.find(x => x.id === cur)!;
  return (
    <section className="sheet" role="tabpanel">
      <div className="plist" role="group" aria-label="Elige partido">
        {PARTIES.map(x => (
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
        <p className="small"><span className="badge badge-res">{programaNota(p)}</span> · los textos mezclan programa y votaciones posteriores · <a className="ext" href={p.url} target="_blank" rel="noopener">Ver programa original</a></p>
        <div className="topiclist">
          {TOPICS.map(([k, l]) => (
            <div className="trow" key={k}>
              <span className="tl">{l}</span>
              <p>{KB[p.id][k] || <em className="small">Sin propuesta recogida sobre este tema.</em>}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Temas() {
  const [k, setK] = useState(TOPICS[0][0]);
  const [sel, setSel] = useState<PartyId[]>(() => PARTIES.map(p => p.id));
  const toggle = (id: PartyId) => {
    setSel(cur => {
      if (cur.includes(id)) return cur.length <= 2 ? cur : cur.filter(x => x !== id);
      return [...cur, id];
    });
  };
  const shown = PARTIES.filter(p => sel.includes(p.id));

  return (
    <section className="sheet" role="tabpanel">
      <div>
        <h2>Compárame</h2>
        <p className="lede" style={{ marginTop: 6 }}>Elige al menos dos partidos y un tema. Los textos son resúmenes de Papeleta Abierta: mezclan programa electoral y, cuando aplica, votaciones posteriores.</p>
      </div>
      <div className="compare-controls">
        <div>
          <p className="ans-k">Partidos</p>
          <div className="plist" role="group" aria-label="Partidos a comparar">
            {PARTIES.map(x => (
              <button key={x.id} className="pbtn" type="button" aria-pressed={sel.includes(x.id)} onClick={() => toggle(x.id)}>
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
      <div className="answers">
        {shown.map(p => (
          <article key={p.id} className={`ans ${KB[p.id][k] ? "" : "none"}`}>
            <p className="ans-k">Partido</p>
            <h3><Dot color={p.color} />{p.name}</h3>
            <p className="ans-k">Propuesta</p>
            <p>{KB[p.id][k] || "No hay propuesta recogida sobre este tema."}</p>
            <div className="src">
              <p className="ans-k">Fuente</p>
              <ul>
                <li>
                  <span className="badge badge-res">{programaNota(p)}</span>
                  <a href={p.url} target="_blank" rel="noopener">{p.src}</a>
                </li>
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
