export type Escala = 2 | 1 | 0 | -1 | -2 | null;
export type NivelEvidencia = "A" | "B" | "C" | "D" | "E";
export type EstadoPosicion = "pendiente" | "con_cita" | "revisada" | "en_disputa";

export type Fuente = {
  titulo: string | null;
  url: string | null;
  pagina: number | null;
  fecha: string | null;
};

export type Posicion = {
  afirmacion: string;
  partido: string;
  version: string;
  valor: number | null;
  nivel: NivelEvidencia | null;
  fuente: Fuente | null;
  texto: string | null;
  interpretacion: string | null;
  estado: EstadoPosicion;
  revisores: string[];
  ultima_revision: string | null;
};

export type Afirmacion = {
  id: string;
  tema: string;
  enunciado: string;
  contexto: string;
  version_texto: number;
};

export type VotoLegislatura = "si" | "no" | "abstencion" | "ausente";

export type Votacion = {
  id: string;
  titulo: string;
  fecha: string | null;
  camara: string;
  fuente: string | null;
  resultado: string;
  votos: Partial<Record<string, VotoLegislatura | string>>;
  verificada: boolean;
  temas: string[];
};

export type Correccion = {
  id: string;
  fecha: string;
  afirmacion: string;
  partido: string;
  valor_anterior: number | null;
  valor_nuevo: number | null;
  motivo: string;
};

export type AvisoError = {
  id: string;
  fecha: string;
  partido: string;
  afirmacion: string;
  que: string;
  fuente: string;
  email?: string;
};

export const NIVEL_TEXTO: Record<NivelEvidencia, string> = {
  A: "Programa electoral de estas elecciones.",
  B: "Programa electoral anterior u otro documento oficial del partido.",
  C: "Votación parlamentaria inequívoca.",
  D: "Declaración oficial de su líder, portavoz o cabeza de lista.",
  E: "Inferencia nuestra: no hay propuesta explícita.",
};

export const ESTADO_TEXTO: Record<EstadoPosicion, string> = {
  pendiente: "pendiente",
  con_cita: "con cita",
  revisada: "revisada",
  en_disputa: "en disputa",
};
