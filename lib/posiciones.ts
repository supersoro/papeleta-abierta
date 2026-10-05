import afirmacionesData from "../data/afirmaciones.json";
import posicionesData from "../data/posiciones.json";
import type { Afirmacion, EstadoPosicion, NivelEvidencia, Posicion } from "./modelo-datos";
import { NIVEL_TEXTO } from "./modelo-datos";
export type { Posicion };

export const ORDER = ["PP", "PSOE", "VOX", "SUMAR", "POD", "ERC", "JUNTS", "BILDU", "PNV", "BNG", "CC", "UPN"] as const;
export type OrderId = (typeof ORDER)[number];

export const AFIRMACIONES = afirmacionesData as Afirmacion[];
const TODAS = posicionesData as Posicion[];

function versionRank(v: string) {
  const m = v.match(/20\d{2}/);
  return m ? Number(m[0]) : 0;
}

/** Versión más reciente de cada par afirmación–partido. Los registros viejos se conservan. */
export function posicionesVigentes(): Posicion[] {
  const map = new Map<string, Posicion>();
  for (const p of TODAS) {
    const k = `${p.afirmacion}:${p.partido}`;
    const prev = map.get(k);
    if (!prev || versionRank(p.version) >= versionRank(prev.version)) map.set(k, p);
  }
  return [...map.values()];
}

const VIGENTES = posicionesVigentes();
const BY_KEY = new Map(VIGENTES.map(p => [`${p.afirmacion}:${p.partido}`, p]));

export function posicionDe(afirmacion: string, partido: string): Posicion | undefined {
  return BY_KEY.get(`${afirmacion}:${partido}`);
}

export function valorDe(afirmacion: string, partido: string): number | null {
  const p = posicionDe(afirmacion, partido);
  return p ? p.valor : null;
}

export function posicionesDePartido(partido: string): Posicion[] {
  return VIGENTES.filter(p => p.partido === partido);
}

export function versionLabel(version: string) {
  if (version === "generales-2026") return "Programa 2026";
  if (version === "generales-2023") return "Programa / legislatura 2023-2026";
  return version;
}

export type Question = {
  id: string;
  t: string;
  s: string;
  c: string;
  p: (number | null)[];
  src: string;
  revisar?: boolean;
};

function srcOf(id: string) {
  const first = ORDER.map(pid => posicionDe(id, pid)).find(p => p?.fuente?.titulo);
  return first?.fuente?.titulo || first?.interpretacion || "";
}

export const QUESTIONS: Question[] = AFIRMACIONES.map(a => {
  const rows = ORDER.map(pid => posicionDe(a.id, pid));
  return {
    id: a.id,
    t: a.tema,
    s: a.enunciado,
    c: a.contexto,
    p: rows.map(r => (r ? r.valor : null)),
    src: srcOf(a.id),
    revisar: rows.some(r => r && r.estado !== "revisada"),
  };
});

export type StatsPosiciones = {
  total: number;
  porNivel: Record<NivelEvidencia, number>;
  porEstado: Record<EstadoPosicion, number>;
  sinPosicion: number;
  conCita: number;
  revisadas: number;
};

export function statsPosiciones(): StatsPosiciones {
  const porNivel: Record<NivelEvidencia, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  const porEstado: Record<EstadoPosicion, number> = { pendiente: 0, con_cita: 0, revisada: 0, en_disputa: 0 };
  let sinPosicion = 0;
  let conCita = 0;
  for (const p of VIGENTES) {
    if (p.valor == null) sinPosicion++;
    else if (p.nivel) porNivel[p.nivel]++;
    porEstado[p.estado]++;
    if (p.texto) conCita++;
  }
  return { total: VIGENTES.length, porNivel, porEstado, sinPosicion, conCita, revisadas: porEstado.revisada };
}

export function nivelTexto(nivel: NivelEvidencia | null) {
  if (!nivel) return "";
  return nivel === "E" ? "Inferencia nuestra: no hay propuesta explícita" : NIVEL_TEXTO[nivel];
}

export const TEMA_TOPIC: Record<string, string> = {
  Trabajo: "trabajo",
  Impuestos: "impuestos",
  Vivienda: "vivienda",
  "Inmigración": "inmigracion",
  Sociedad: "sociedad",
  Memoria: "sociedad",
  Territorio: "territorio",
  Energía: "energia",
  Clima: "energia",
  Educación: "educacion",
  Sanidad: "sanidad",
  Justicia: "justicia",
  Instituciones: "justicia",
  Defensa: "exterior",
  Exterior: "exterior",
};

export function afirmacionesDeTopic(topic: string): Afirmacion[] {
  return AFIRMACIONES.filter(a => TEMA_TOPIC[a.tema] === topic);
}
