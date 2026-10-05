import { topicFromQuery } from "./data";

export type AskKind = "normal" | "voto_sin_tema" | "valoracion" | "jailbreak";

const VALUE_RE = /\b(peor|peores|mejor|mejores|bueno|buena|buenos|buenas|malo|mala|malos|malas|m[aá]s|menos)\b/gi;
const VOTE_RE = /\b(a qui[eé]n voto|a qui[eé]n debo votar|qui[eé]n me representa|qu[eé] partido es el (mejor|peor)|el mejor partido|el peor partido|cu[aá]l es el mejor|cu[aá]l es el peor|solo lo bueno|s[oó]lo lo bueno|solo lo malo|s[oó]lo lo malo)\b/gi;
const ID_RE = /\b(izquierda|izquierdas|derecha|derechas)\b/gi;

function fold(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function retrieveQuery(q: string) {
  const cleaned = q.replace(VOTE_RE, " ").replace(VALUE_RE, " ").replace(ID_RE, " ").replace(/\s+/g, " ").trim();
  return cleaned.length >= 4 ? cleaned : q;
}

export function classifyAsk(q: string): { kind: AskKind; tema: string | null } {
  const n = fold(q);
  if (/ignora (tus |las |todas (tus |las )?)?(instrucciones|reglas)|olvida (tus |las )?(instrucciones|reglas)|ignore (your |the |all )?(instructions|rules)|actua como|eres ahora|system prompt|revela (tus |el )?prompt|nuevas instrucciones/.test(n)) {
    return { kind: "jailbreak", tema: null };
  }
  const tema = topicFromQuery(retrieveQuery(q)) || topicFromQuery(q);
  const identidad = /soy de (la )?(izquierda|derecha|izquierdas|derechas)|si soy de (la )?(izquierda|derecha)|votante de (izquierda|derecha)|persona de (izquierda|derecha)/.test(n);
  const voto = /a quien voto|a quien debo votar|quien me representa|que partido (voto|elijo|debo votar)/.test(n) || identidad;
  const valor = /\b(mejor|peor|mejores|peores)\b/.test(n) || /cual es el (mejor|peor)|quien tiene (la |el )?(mejor|peor)/.test(n);
  if ((voto || identidad) && !tema) return { kind: "voto_sin_tema", tema: null };
  if (valor && tema) return { kind: "valoracion", tema };
  if (voto && tema) return { kind: "valoracion", tema };
  return { kind: "normal", tema };
}
