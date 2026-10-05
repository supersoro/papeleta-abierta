import historialData from "@/data/historial.json";
import type { Votacion } from "./modelo-datos";
export type { Votacion };

export const HISTORIAL = historialData as Votacion[];

function fold(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Solo se publican votaciones verificadas y con enlace al registro oficial. */
export function historialPublico(): Votacion[] {
  return HISTORIAL.filter(h => h.verificada && !!h.fuente);
}

export function votoTexto(v?: string) {
  if (v === "si") return "a favor";
  if (v === "no") return "en contra";
  if (v === "abstencion") return "se abstuvo";
  if (v === "ausente") return "no votó";
  return null;
}

export function historialPara(opts: { tema?: string | null; query?: string }) {
  const pub = historialPublico();
  if (!pub.length) return [];
  const q = fold(opts.query || "");
  const tema = opts.tema || "";
  return pub.filter(h => {
    const title = fold(h.titulo);
    const keys = [h.id, h.titulo].join(" ");
    const hitQuery = q && (title.split(/\s+/).filter(w => w.length > 5).some(w => q.includes(w)) ||
      (q.includes("amnistia") && title.includes("amnistia")) ||
      (q.includes("jornada") && title.includes("jornada")) ||
      ((q.includes("inmigr") || q.includes("delegacion")) && fold(keys).includes("inmigr")));
    const hitTema = tema && h.temas.includes(tema);
    return hitQuery || (hitTema && hitQuery);
  });
}

export function historialDePartido(partido: string): Votacion[] {
  return historialPublico().filter(h => h.votos[partido]);
}
