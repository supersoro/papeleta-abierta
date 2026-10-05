// Base común de Papeleta Abierta: la usan el glosario, el comparador, el test y el buscador.
// Para corregir una propuesta o una posición, edita este archivo.

import { REGIONAL_KB, REGIONAL_PARTIES, partyIdsFor } from "./partidos-regionales";
import { QUESTIONS as QUESTIONS_2026 } from "./posiciones";
export { QUESTIONS_2026 as QUESTIONS };
export { partyIdsFor, COMUNIDADES, PROVINCIAS, STATE_IDS, extraIds, resolveProvincia } from "./partidos-regionales";

export type PartyId = "PP" | "PSOE" | "VOX" | "SUMAR" | "POD" | "ERC" | "JUNTS" | "BILDU" | "PNV" | "BNG" | "CC" | "UPN";
export type Party = { id: PartyId; name: string; full: string; color: string; lead: string; seats: string; family: string; desc: string; src: string; url: string; programaYear: number };

export const ELECTION = {
  iso: "2026-11-29",
  label: "29 de noviembre de 2026",
  campaign: "13 al 27 de noviembre",
  reflection: "28 de noviembre",
  pollBanFrom: "24 de noviembre",
  boe: "6 de octubre",
};
export type TopicKey = "trabajo" | "impuestos" | "vivienda" | "pensiones" | "inmigracion" | "sociedad" | "territorio" | "energia" | "educacion" | "sanidad" | "justicia" | "exterior";
export type { Question } from "./posiciones";

export const PARTIES: Party[] =[
 {id:"PP",name:"PP",full:"Partido Popular",color:"var(--pp)",lead:"Alberto Núñez Feijóo",seats:"137 escaños (2023)",family:"Centroderecha. Partido Popular Europeo.",
  desc:"Partido conservador y liberal, primera fuerza en 2023. Lidera la oposición.",
  src:"Programa 23J 2023 (365 medidas)",url:"https://www.pp.es/actualidad/articulos/programa-electoral-propone-365-medidas-reconstruccion-economica-social-e/",programaYear:2023},
 {id:"PSOE",name:"PSOE",full:"Partido Socialista Obrero Español",color:"var(--psoe)",lead:"Pedro Sánchez",seats:"121 escaños (2023)",family:"Centroizquierda. Socialistas Europeos.",
  desc:"Partido socialdemócrata. Gobierna en coalición con Sumar desde 2023.",
  src:"Programa 23J 2023",url:"https://www.psoe.es/media-content/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023.pdf",programaYear:2023},
 {id:"VOX",name:"Vox",full:"Vox",color:"var(--vox)",lead:"Santiago Abascal",seats:"33 escaños (2023)",family:"Derecha radical. Patriotas por Europa.",
  desc:"Partido nacionalista español y conservador, centrado en inmigración, unidad territorial y soberanía.",
  src:"Programa 23J 2023",url:"https://www.voxespana.es/programa/programa-electoral-vox",programaYear:2023},
 {id:"SUMAR",name:"Sumar",full:"Sumar",color:"var(--sumar)",lead:"Por designar (listas aún no presentadas)",seats:"31 escaños (2023, incluía a Podemos)",family:"Izquierda. Coalición de IU, Más Madrid, Comuns y otros.",
  desc:"Plataforma de izquierda y ecologista. Socio minoritario del Gobierno de coalición. Encabezamiento de estas elecciones, pendiente de las listas.",
  src:"Programa 23J 2023",url:"https://movimientosumar.es/programa-electoral-23j/",programaYear:2023},
 {id:"POD",name:"Podemos",full:"Podemos",color:"var(--podemos)",lead:"Irene Montero",seats:"4 diputados en el Grupo Mixto (salió de Sumar en 2023)",family:"Izquierda. La Izquierda Europea.",
  desc:"Partido de izquierda. Concurrió dentro de Sumar en 2023; en estas elecciones se presenta por separado, a falta de coaliciones.",
  src:"Programa europeas 2024 y posiciones públicas",url:"https://podemos.info/wp-content/uploads/2024/05/Programa-PODEMOS-elecciones-europeas-2024.pdf",programaYear:2024},
 ...REGIONAL_PARTIES
];

export function programaNota(p: Party) {
  if (p.id === "POD") return "Programa europeas 2024 · pendiente el de estas elecciones";
  if (p.id === "UPN") return "Programa foral 2023-2027 · no hubo de generales 2023";
  if (p.id === "CC") return "Programa autonómico 2023-2027 · no hay de generales 2023";
  return "Programa 23J 2023 · pendiente el de estas elecciones";
}

export function partiesFor(provincia?: string | null): Party[] {
  const ids = new Set(partyIdsFor(provincia));
  return PARTIES.filter(p => ids.has(p.id));
}

export const TOPICS: [TopicKey, string][] =[
 ["trabajo","Trabajo y salarios"],["impuestos","Impuestos"],["vivienda","Vivienda"],["pensiones","Pensiones"],
 ["inmigracion","Inmigración"],["sociedad","Derechos y sociedad"],["territorio","Modelo territorial"],
 ["energia","Energía y clima"],["educacion","Educación"],["sanidad","Sanidad"],["justicia","Justicia e instituciones"],["exterior","Exterior y defensa"]
];

export const KB: Record<PartyId, Record<TopicKey, string>> ={
 PP:{
  trabajo:"Prioriza el diálogo social y las bonificaciones a la contratación. Votó contra la ley de jornada de 37,5 horas por aprobarse sin acuerdo con la patronal.",
  impuestos:"Bajar el IRPF a las rentas medias y bajas y deflactarlo con la inflación. Suprimir el impuesto temporal a las grandes fortunas y se opone a los gravámenes a banca y energéticas. Apoya bonificar sucesiones y donaciones.",
  vivienda:"Aumentar la oferta liberando suelo y con avales públicos para la entrada de jóvenes. Rechaza los topes al alquiler de la Ley de Vivienda. Propone una ley contra la okupación con desalojos rápidos.",
  pensiones:"Mantener la revalorización con el IPC y facilitar compatibilizar pensión y trabajo.",
  inmigracion:"Defiende una inmigración ordenada vinculada a contratos en origen y más control de fronteras. Rechazó la regularización extraordinaria de 2026, recurrida por varias comunidades del PP.",
  sociedad:"Acepta la ley de plazos del aborto avalada por el Constitucional. Recurrió la ley de eutanasia y prioriza los cuidados paliativos. Propone reformar la ley trans y derogar la Ley de Memoria Democrática para sustituirla por una ley de concordia.",
  territorio:"Se opone a la amnistía y a la financiación singular de Cataluña. Defiende el Estado autonómico con un nuevo modelo de financiación pactado entre todas las comunidades.",
  energia:"Prolongar la vida de las centrales nucleares. Transición ecológica compatible con la industria y el campo.",
  educacion:"Libertad de elección de centro y apoyo a la escuela concertada. Garantizar la enseñanza en castellano en todo el territorio.",
  sanidad:"Plan de choque contra las listas de espera, con colaboración público-privada cuando haga falta, y tarjeta sanitaria única.",
  justicia:"Que los jueces elijan a la mayoría del CGPJ y reforzar la independencia de la Fiscalía y otros organismos.",
  exterior:"Cumplir los compromisos con la OTAN y aumentar el gasto en defensa. Apoyo a Ucrania."
 },
 PSOE:{
  trabajo:"Seguir subiendo el salario mínimo hasta el 60 % del salario medio y mantener la reforma laboral de 2021. Apoya reducir la jornada a 37,5 horas sin rebaja salarial.",
  impuestos:"Mantener el impuesto a las grandes fortunas y los gravámenes a banca y energéticas, con rebajas selectivas para rentas bajas.",
  vivienda:"Aplicar la Ley de Vivienda de 2023, que permite limitar el alquiler en zonas tensionadas, y crear un gran parque público de alquiler asequible. Avales públicos para la primera vivienda de jóvenes.",
  pensiones:"Revalorización con el IPC fijada por ley y subida de las pensiones mínimas y no contributivas.",
  inmigracion:"El Gobierno aprobó en 2026 una regularización extraordinaria pactada con Podemos. Defiende vías legales de entrada y el Pacto Europeo de Migración.",
  sociedad:"Aprobó las leyes de eutanasia, ley trans y Memoria Democrática. Propuso en 2025 incluir el derecho al aborto en la Constitución.",
  territorio:"Defiende la amnistía aprobada en 2024 y una financiación singular para Cataluña acordada con ERC. Rechaza un referéndum de autodeterminación.",
  energia:"Mantener el calendario de cierre nuclear entre 2027 y 2035 y acelerar las renovables para cumplir los objetivos climáticos.",
  educacion:"Desarrollo de la LOMLOE, más becas, impulso de la FP y universalizar la educación de 0 a 3 años.",
  sanidad:"Reforzar la sanidad pública, con más inversión en atención primaria, salud mental y salud bucodental.",
  justicia:"Pactó con el PP en 2024 la renovación del CGPJ con mediación europea y el compromiso de estudiar una reforma del sistema de elección.",
  exterior:"Reconoció a Palestina en 2024 y aprobó un embargo de armas a Israel en 2025. Alcanzó el 2 % del PIB en defensa y rechazó el objetivo OTAN del 5 %."
 },
 VOX:{
  trabajo:"Bajar cotizaciones y cargas a autónomos y empresas. Votó contra la ley de jornada de 37,5 horas.",
  impuestos:"Simplificar el IRPF con menos tramos y tipos más bajos, y suprimir los impuestos de sucesiones, donaciones y patrimonio.",
  vivienda:"Derogar la Ley de Vivienda, desalojo de okupas en 24 horas y prioridad para españoles en el acceso a vivienda pública.",
  pensiones:"Revalorizar con el IPC y subir las pensiones más bajas.",
  inmigracion:"Expulsión de los inmigrantes en situación irregular, endurecer el acceso a la nacionalidad y aplicar la prioridad nacional en ayudas. Recurrió la regularización de 2026 ante el Supremo.",
  sociedad:"Derogar las leyes de eutanasia, trans, Memoria Democrática y violencia de género, que sustituiría por una ley de violencia intrafamiliar. Restringir el aborto.",
  territorio:"Devolver al Estado competencias como educación, sanidad y justicia, y proponía ilegalizar los partidos que promuevan la independencia. Contrario a la amnistía.",
  energia:"Contrario a la Agenda 2030 y al Pacto Verde Europeo. Mantener las centrales nucleares.",
  educacion:"Cheque escolar para elegir centro, autorización de los padres para actividades sobre valores (\"pin parental\") y castellano como lengua vehicular.",
  sanidad:"Tarjeta sanitaria única nacional y que el Estado recupere la gestión sanitaria. Apoya la colaboración con la sanidad privada.",
  justicia:"Que los jueces elijan al CGPJ y endurecer el Código Penal, incluida la prisión permanente revisable.",
  exterior:"Más gasto en defensa y una UE de naciones soberanas. Apoyo a Israel."
 },
 SUMAR:{
  trabajo:"Reducir la jornada a 37,5 horas por ley como paso hacia las 32 horas, y seguir subiendo el salario mínimo.",
  impuestos:"Impuesto permanente a las grandes fortunas y una herencia universal de 20.000 euros para jóvenes financiada con impuestos a los grandes patrimonios.",
  vivienda:"Limitar el alquiler, frenar la compra especulativa de vivienda por grandes fondos y ampliar el parque público.",
  pensiones:"Revalorización con el IPC y subir las pensiones mínimas y no contributivas.",
  inmigracion:"Apoya la regularización extraordinaria y vías legales y seguras de entrada.",
  sociedad:"Defiende las leyes de eutanasia, trans y Memoria Democrática, y garantizar el aborto en la sanidad pública.",
  territorio:"Defiende una España plurinacional, votó a favor de la amnistía y apoya la financiación singular. Su programa no incluye un referéndum de autodeterminación.",
  energia:"Cerrar las nucleares según el calendario y acelerar la transición ecológica y el transporte público.",
  educacion:"Priorizar la escuela pública, gratuidad de 0 a 3 años y reducir progresivamente los conciertos.",
  sanidad:"Blindar la sanidad pública, revertir privatizaciones e incluir la atención dental.",
  justicia:"Mantener la elección parlamentaria del CGPJ con mayorías amplias.",
  exterior:"Ruptura comercial y embargo de armas con Israel. Reticente a aumentar el gasto militar."
 },
 POD:{
  trabajo:"Reducir la jornada laboral avanzando hacia la semana de cuatro días y subir el salario mínimo.",
  impuestos:"Hacer permanentes los impuestos a las grandes fortunas y a los beneficios extraordinarios de banca y energéticas.",
  vivienda:"Prohibir que los fondos de inversión compren vivienda, limitar el alquiler y ampliar la vivienda pública.",
  pensiones:"",
  inmigracion:"Pactó con el PSOE la regularización extraordinaria de 2026. Se opone al Pacto Europeo de Migración.",
  sociedad:"Impulsó la ley trans desde el Ministerio de Igualdad. Defiende el aborto, la eutanasia y la Memoria Democrática.",
  territorio:"Defiende una España plurinacional y un referéndum pactado en Cataluña. Votó a favor de la amnistía.",
  energia:"Transición ecológica acelerada y cierre de las centrales nucleares.",
  educacion:"Defensa de la escuela pública frente a la concertada.",
  sanidad:"Sanidad cien por cien pública y fin de las externalizaciones.",
  justicia:"Contraria a que los jueces elijan al CGPJ. Denuncia la persecución judicial a la izquierda.",
  exterior:"Contra el aumento del gasto militar y crítica con la OTAN. Romper relaciones con Israel."
 },
 ...REGIONAL_KB
};

export const topicName = (k: string) => (TOPICS.find(t => t[0] === k) || [k, k])[1];
export const partyById = (id: string) => PARTIES.find(p => p.id === id);

export type Hecho = { hecho: string; src: string };

// Hechos de la legislatura 2023–2026: no son programa. Se muestran aparte en el buscador.
export const LEGISLATURA: Partial<Record<TopicKey, Hecho[]>> = {
  trabajo: [
    { hecho: "El Congreso rechazó en septiembre de 2025 el proyecto de jornada de 37,5 horas, con los votos de PP, Vox, Junts y UPN.", src: "Votación de enmiendas a la totalidad, 10-09-2025" },
    { hecho: "Sigue vigente la reforma laboral de 2021 y el SMI se ha ido actualizando por decreto.", src: "RDL 32/2021; reales decretos del SMI 2023-2026" },
  ],
  impuestos: [
    { hecho: "Los gravámenes temporales a banca, energéticas y grandes fortunas se han prorrogado desde 2022. PP y Vox votaron en contra y prometieron suprimirlos.", src: "Leyes y prorrogas 2022-2024; programas 2023" },
  ],
  vivienda: [
    { hecho: "La Ley 12/2023 permite limitar el alquiler en zonas tensionadas si lo pide la comunidad. Varias comunidades del PP no la aplican.", src: "Ley 12/2023 y su aplicación autonómica" },
    { hecho: "El Bono Alquiler Joven y los avales ICO se han mantenido o ampliado durante la legislatura.", src: "Plan Estatal de Vivienda; convenios ICO" },
    { hecho: "El 2 de octubre de 2026 el Congreso tumbó dos decretos de vivienda (votos de PP, Vox y Junts). El 5 de octubre Sánchez convocó elecciones para el 29 de noviembre.", src: "Votación Congreso 2-10-2026; declaración institucional 5-10-2026" },
  ],
  pensiones: [
    { hecho: "La revalorización con el IPC quedó fijada por ley y se ha aplicado cada año de la legislatura.", src: "Ley 21/2021 y reales decretos anuales" },
  ],
  inmigracion: [
    { hecho: "El Gobierno aprobó en 2026 una regularización extraordinaria pactada con Podemos (RD 316/2026). Vox y varias comunidades del PP la han recurrido.", src: "RD 316/2026; recursos ante el Supremo" },
  ],
  sociedad: [
    { hecho: "El Constitucional avaló la ley de eutanasia, recurrida por PP y Vox. En 2025 el Gobierno propuso incluir el aborto en la Constitución.", src: "LO 3/2021; propuesta de reforma 2025" },
    { hecho: "Sigue en vigor la Ley 4/2023 (ley trans) y la Ley 20/2022 de Memoria Democrática. PP y Vox han anunciado su reforma o derogación.", src: "Ley 4/2023; Ley 20/2022" },
  ],
  territorio: [
    { hecho: "La ley de amnistía se aprobó en 2024 (LO 1/2024) como parte de la investidura. PP y Vox votaron en contra.", src: "LO 1/2024 y su votación" },
    { hecho: "PSC y ERC acordaron en 2024 una financiación singular para Cataluña. El PP se opone a un modelo no multilateral.", src: "Acuerdo PSC-ERC 2024" },
  ],
  energia: [
    { hecho: "El plan vigente prevé el cierre nuclear entre 2027 y 2035. Tras el apagón de 2025 se reabrió el debate sobre prorrogar las centrales.", src: "PNIEC; debate parlamentario 2025" },
  ],
  educacion: [
    { hecho: "Sigue en vigor la LOMLOE. El Gobierno ha incrementado becas y plazas de FP y de 0 a 3 años.", src: "LOMLOE; PGE 2023-2026" },
  ],
  sanidad: [
    { hecho: "Se han ampliado algunas coberturas (salud bucodental, salud mental) sin una ley estatal de listas de espera.", src: "Cartera de servicios SNS 2023-2026" },
  ],
  justicia: [
    { hecho: "PP y PSOE renovaron el CGPJ en 2024 con mediación europea y el compromiso de estudiar el sistema de elección.", src: "Renovación CGPJ 2024" },
  ],
  exterior: [
    { hecho: "España reconoció a Palestina en mayo de 2024 y aprobó un embargo de armas a Israel en 2025.", src: "Reconocimiento 28-05-2024; embargo 2025" },
    { hecho: "Alcanzó el 2 % del PIB en defensa en 2025 y el Gobierno rechazó el objetivo OTAN del 5 %.", src: "Cumbre OTAN 2025" },
  ],
};

const TOPIC_HINTS: Record<TopicKey, string[]> = {
  trabajo: ["jornada", "salario", "smi", "empleo", "laboral", "autonomo"],
  impuestos: ["impuesto", "irpf", "fiscal", "fortuna", "sucesion", "hacienda", "tribut"],
  vivienda: ["vivienda", "alquiler", "okupa", "suelo", "inmobili", "hipotec"],
  pensiones: ["pension", "jubilacion", "ipc"],
  inmigracion: ["inmigr", "regulariz", "frontera", "extranjer", "asilo", "menas"],
  sociedad: ["aborto", "eutanasia", "trans", "memoria", "igualdad", "genero", "lgtbi"],
  territorio: ["amnistia", "catalu", "financiacion", "referendum", "independen", "autonom"],
  energia: ["nuclear", "energia", "clima", "renovable", "2030", "apagón", "apagon"],
  educacion: ["educacion", "escuela", "concertad", "lomloe", "universidad", "beca"],
  sanidad: ["sanidad", "salud", "lista de espera", "hospital", "medico"],
  justicia: ["cgpj", "jueces", "justicia", "fiscalia", "poder judicial"],
  exterior: ["otan", "defensa", "israel", "palestina", "ucrania", "gasto militar", "ue"],
};

function fold(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function topicFromQuery(q: string): TopicKey | null {
  const n = fold(q);
  let best: TopicKey | null = null;
  let score = 0;
  for (const [k, words] of Object.entries(TOPIC_HINTS) as [TopicKey, string[]][]) {
    const s = words.filter(w => n.includes(w)).length;
    if (s > score) { score = s; best = k; }
  }
  return score ? best : null;
}

const PARTY_ALIASES: [PartyId, string[]][] = [
  ["PP", ["\\bpp\\b", "partido popular"]],
  ["PSOE", ["psoe", "partido socialista"]],
  ["VOX", ["\\bvox\\b"]],
  ["SUMAR", ["\\bsumar\\b"]],
  ["POD", ["podemos"]],
  ["ERC", ["\\berc\\b", "esquerra"]],
  ["JUNTS", ["\\bjunts\\b"]],
  ["BILDU", ["bildu", "eh bildu"]],
  ["PNV", ["\\bpnv\\b", "eaj-pnv", "partido nacionalista vasco"]],
  ["BNG", ["\\bbng\\b", "bloque nacionalista"]],
  ["CC", ["coalicion canaria"]],
  ["UPN", ["\\bupn\\b", "union del pueblo navarro"]],
];

/** Partidos nombrados en la pregunta: se incluyen aunque no haya provincia. */
export function partiesNamedIn(q: string): PartyId[] {
  const n = fold(q);
  return PARTY_ALIASES.filter(([, als]) => als.some(a => new RegExp(a, "i").test(n))).map(([id]) => id);
}

export function partiesForQuery(provincia?: string | null, query?: string): Party[] {
  const base = partiesFor(provincia);
  const extra = (query ? partiesNamedIn(query) : []).filter(id => !base.some(p => p.id === id));
  return extra.length ? [...base, ...PARTIES.filter(p => extra.includes(p.id))] : base;
}
