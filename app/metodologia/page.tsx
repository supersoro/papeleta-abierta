import Link from "next/link";
import { ELECTION, PARTIES, programaNota } from "@/lib/data";
import { QUESTIONS, ORDER } from "@/lib/test-2026";
import { stanceOf } from "@/lib/afinidad";
import programas from "@/data/programas.json";

const fmt = (v: number | null | undefined) => (v == null ? "—" : v > 0 ? `+${v}` : String(v));

export const metadata = {
  title: "Metodología · Papeleta Abierta",
  description: "Cómo se calcula la afinidad, de dónde salen las posiciones y qué programas se usan.",
};

export default function Metodologia() {
  const revisar = QUESTIONS.filter(q => q.revisar).length;
  return (
    <div className="wrap">
      <header>
        <p className="brand"><Link href="/">Papeleta Abierta</Link></p>
        <p className="eyebrow">Metodología · elecciones del {ELECTION.label}</p>
      </header>

      <section className="sheet method">
        <h1 className="ask-title">Cómo se calcula</h1>
        <p>El test no recomienda voto. Mide la distancia entre tus respuestas y la posición que hemos asignado a cada partido.</p>
        <ul>
          <li>Las respuestas «Neutral» no cuentan. Tampoco las preguntas en las que un partido no tiene posición conocida (aparecen como —).</li>
          <li>El 50 % es el azar: restamos lo que un partido obtendría si respondieras al azar, para que no ganen los que tienen posiciones más tibias.</li>
          <li>No mostramos resultado con menos de 8 respuestas no neutrales.</li>
        </ul>
        <p>Los temas marcados como importantes cuentan el doble. Tus respuestas no salen de tu navegador.</p>
      </section>

      <section className="sheet">
        <h2>Qué no hace esta web</h2>
        <ul>
          <li>No recomienda a quién votar.</li>
          <li>No guarda tus respuestas ni tus preguntas en un servidor.</li>
          <li>No publica resultados agregados del test. La LOREG lo prohíbe desde el {ELECTION.pollBanFrom}.</li>
        </ul>
      </section>

      <section className="sheet">
        <h2>Posiciones del test</h2>
        <p className="small">{QUESTIONS.length} afirmaciones. {revisar} pendientes de revisión experta. Escala −2 a +2. Orden: {ORDER.join(", ")}.</p>
        <div className="tablewrap" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Afirmación</th>
                {PARTIES.map(p => <th key={p.id}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {QUESTIONS.map((q, i) => (
                <tr key={i}>
                  <td className="q">{q.s}{q.revisar ? <span className="small"> · revisar</span> : ""}</td>
                  {PARTIES.map(p => {
                    const v = stanceOf(q, p.id);
                    return <td key={p.id}><span className={`cell${q.revisar ? " match" : ""}`}>{fmt(v)}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small" style={{ marginTop: 10 }}>Cada fila tiene su fuente en el código del test (programas, votaciones y declaraciones). Las casillas sombreadas están pendientes de revisión por politólogos de distinta orientación.</p>
      </section>

      <section className="sheet">
        <h2>Programas que usamos</h2>
        <p className="small">Hasta que cada partido publique el de 2026, el buscador usa estos textos.</p>
        <ul>
          {(programas as { party: string; title: string; url: string; pdf: string | null }[]).map(p => {
            const party = PARTIES.find(x => x.id === p.party);
            return (
              <li key={p.party}>
                <strong>{party?.name || p.party}</strong> · {p.title} · <a href={p.url} target="_blank" rel="noopener">{p.pdf ? "PDF / ficha" : "ficha"}</a>
                {party ? ` · ${programaNota(party)}` : ""}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="small"><Link href="/">Volver al inicio</Link></p>
    </div>
  );
}
