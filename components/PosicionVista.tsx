"use client";
import { ESTADO_TEXTO } from "@/lib/modelo-datos";
import { nivelTexto, versionLabel, type Posicion } from "@/lib/posiciones";
import { AvisoError } from "./AvisoError";

export function fmtValor(v: number | null | undefined) {
  return v === undefined || v === null ? "—" : v > 0 ? `+${v}` : String(v);
}

export function PosicionVista({ pos, compact = false }: { pos?: Posicion; compact?: boolean }) {
  if (!pos || pos.valor == null) {
    return (
      <div className="pos">
        <span className="cell">—</span>
        <span className="small">Sin posición conocida</span>
        {pos && <AvisoError partido={pos.partido} afirmacion={pos.afirmacion} />}
      </div>
    );
  }
  const nivel = pos.nivel;
  const eText = nivel === "E" ? nivelTexto("E") : "";
  return (
    <div className="pos">
      <div className="pos-head">
        <span className="cell">{fmtValor(pos.valor)}</span>
        {nivel && <span className={`badge nivel-${nivel}`} title={nivelTexto(nivel)}>{nivel}{nivel === "E" && !compact ? ` · ${eText}` : ""}</span>}
        <span className="badge">{ESTADO_TEXTO[pos.estado]}</span>
      </div>
      {nivel === "E" && compact && <p className="small">{eText}</p>}
      <details>
        <summary>Fuente e interpretación</summary>
        <p className="small">{versionLabel(pos.version)}</p>
        {pos.fuente?.titulo && (
          <p className="small">
            {pos.fuente.url ? <a href={pos.fuente.url} target="_blank" rel="noopener">{pos.fuente.titulo}</a> : pos.fuente.titulo}
            {pos.fuente.pagina ? ` · p. ${pos.fuente.pagina}` : ""}
            {pos.fuente.fecha ? ` · ${pos.fuente.fecha}` : ""}
          </p>
        )}
        {pos.texto ? <blockquote className="cita-lit">{pos.texto}</blockquote> : <p className="small">Aún no hay cita literal.</p>}
        {pos.interpretacion && <p className="small">{pos.interpretacion}</p>}
        <AvisoError partido={pos.partido} afirmacion={pos.afirmacion} />
      </details>
    </div>
  );
}
