import Link from "next/link";
import correccionesData from "@/data/correcciones.json";
import { AFIRMACIONES } from "@/lib/posiciones";
import { PARTIES } from "@/lib/data";
import type { Correccion } from "@/lib/modelo-datos";

export const metadata = {
  title: "Correcciones · Papeleta Abierta",
  description: "Registro público de cambios en las posiciones atribuidas a los partidos.",
};

const fmt = (v: number | null) => (v == null ? "—" : v > 0 ? `+${v}` : String(v));

export default function Correcciones() {
  const rows = [...(correccionesData as Correccion[])].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return (
    <div className="wrap">
      <header>
        <p className="brand"><Link href="/">Papeleta Abierta</Link></p>
        <p className="eyebrow">Registro de correcciones</p>
      </header>
      <section className="sheet method">
        <h1 className="ask-title">Correcciones</h1>
        <p>Cada cambio en las posiciones publicadas se anota aquí, con fecha y motivo. Para avisar de un error, usa «¿Ves un error?» junto a cada dato.</p>
        {rows.length === 0 ? (
          <p className="small">Aún no hay correcciones publicadas.</p>
        ) : (
          <ol className="corr-list">
            {rows.map(c => {
              const a = AFIRMACIONES.find(x => x.id === c.afirmacion);
              const p = PARTIES.find(x => x.id === c.partido);
              return (
                <li key={c.id}>
                  <p><strong>{c.fecha.slice(0, 10)}</strong> · {p?.name || c.partido} · {a?.enunciado || c.afirmacion}</p>
                  <p className="small">{fmt(c.valor_anterior)} → {fmt(c.valor_nuevo)}. {c.motivo}</p>
                </li>
              );
            })}
          </ol>
        )}
      </section>
      <p className="small"><Link href="/">Volver al inicio</Link> · <Link href="/metodologia">Metodología</Link></p>
    </div>
  );
}
