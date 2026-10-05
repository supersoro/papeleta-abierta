import type { Party, PartyId, TopicKey } from "./data";

export type ProvinciaId = string;
export type Provincia = { id: ProvinciaId; name: string; seats: number };
export type Comunidad = { name: string; provincias: Provincia[] };

export const COMUNIDADES: Comunidad[] = [
  { name: "Andalucía", provincias: [
    { id: "almeria", name: "Almería", seats: 6 }, { id: "cadiz", name: "Cádiz", seats: 9 },
    { id: "cordoba", name: "Córdoba", seats: 6 }, { id: "granada", name: "Granada", seats: 7 },
    { id: "huelva", name: "Huelva", seats: 5 }, { id: "jaen", name: "Jaén", seats: 5 },
    { id: "malaga", name: "Málaga", seats: 11 }, { id: "sevilla", name: "Sevilla", seats: 12 },
  ]},
  { name: "Aragón", provincias: [
    { id: "huesca", name: "Huesca", seats: 3 }, { id: "teruel", name: "Teruel", seats: 3 },
    { id: "zaragoza", name: "Zaragoza", seats: 7 },
  ]},
  { name: "Asturias", provincias: [{ id: "asturias", name: "Asturias", seats: 7 }] },
  { name: "Illes Balears", provincias: [{ id: "balears", name: "Illes Balears", seats: 8 }] },
  { name: "Canarias", provincias: [
    { id: "las-palmas", name: "Las Palmas", seats: 8 },
    { id: "tenerife", name: "Santa Cruz de Tenerife", seats: 7 },
  ]},
  { name: "Cantabria", provincias: [{ id: "cantabria", name: "Cantabria", seats: 5 }] },
  { name: "Castilla-La Mancha", provincias: [
    { id: "albacete", name: "Albacete", seats: 4 }, { id: "ciudad-real", name: "Ciudad Real", seats: 5 },
    { id: "cuenca", name: "Cuenca", seats: 3 }, { id: "guadalajara", name: "Guadalajara", seats: 3 },
    { id: "toledo", name: "Toledo", seats: 6 },
  ]},
  { name: "Castilla y León", provincias: [
    { id: "avila", name: "Ávila", seats: 3 }, { id: "burgos", name: "Burgos", seats: 4 },
    { id: "leon", name: "León", seats: 4 }, { id: "palencia", name: "Palencia", seats: 3 },
    { id: "salamanca", name: "Salamanca", seats: 4 }, { id: "segovia", name: "Segovia", seats: 3 },
    { id: "soria", name: "Soria", seats: 2 }, { id: "valladolid", name: "Valladolid", seats: 5 },
    { id: "zamora", name: "Zamora", seats: 3 },
  ]},
  { name: "Cataluña", provincias: [
    { id: "barcelona", name: "Barcelona", seats: 32 }, { id: "girona", name: "Girona", seats: 6 },
    { id: "lleida", name: "Lleida", seats: 4 }, { id: "tarragona", name: "Tarragona", seats: 6 },
  ]},
  { name: "Comunitat Valenciana", provincias: [
    { id: "alicante", name: "Alicante/Alacant", seats: 12 }, { id: "castellon", name: "Castellón/Castelló", seats: 5 },
    { id: "valencia", name: "Valencia/València", seats: 16 },
  ]},
  { name: "Extremadura", provincias: [
    { id: "badajoz", name: "Badajoz", seats: 5 }, { id: "caceres", name: "Cáceres", seats: 4 },
  ]},
  { name: "Galicia", provincias: [
    { id: "coruna", name: "A Coruña", seats: 8 }, { id: "lugo", name: "Lugo", seats: 4 },
    { id: "ourense", name: "Ourense", seats: 4 }, { id: "pontevedra", name: "Pontevedra", seats: 7 },
  ]},
  { name: "Madrid", provincias: [{ id: "madrid", name: "Madrid", seats: 37 }] },
  { name: "Murcia", provincias: [{ id: "murcia", name: "Murcia", seats: 10 }] },
  { name: "Navarra", provincias: [{ id: "navarra", name: "Navarra", seats: 5 }] },
  { name: "País Vasco", provincias: [
    { id: "araba", name: "Araba/Álava", seats: 4 }, { id: "bizkaia", name: "Bizkaia", seats: 8 },
    { id: "gipuzkoa", name: "Gipuzkoa", seats: 6 },
  ]},
  { name: "La Rioja", provincias: [{ id: "rioja", name: "La Rioja", seats: 4 }] },
  { name: "Ceuta", provincias: [{ id: "ceuta", name: "Ceuta", seats: 1 }] },
  { name: "Melilla", provincias: [{ id: "melilla", name: "Melilla", seats: 1 }] },
];

export const PROVINCIAS: Provincia[] = COMUNIDADES.flatMap(c => c.provincias);

const EXTRA: Record<string, PartyId[]> = {
  barcelona: ["ERC", "JUNTS"], girona: ["ERC", "JUNTS"], lleida: ["ERC", "JUNTS"], tarragona: ["ERC", "JUNTS"],
  araba: ["BILDU", "PNV"], bizkaia: ["BILDU", "PNV"], gipuzkoa: ["BILDU", "PNV"],
  navarra: ["BILDU", "UPN"],
  coruna: ["BNG"], lugo: ["BNG"], ourense: ["BNG"], pontevedra: ["BNG"],
  "las-palmas": ["CC"], tenerife: ["CC"],
};

export const STATE_IDS: PartyId[] = ["PP", "PSOE", "VOX", "SUMAR", "POD"];

function fold(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Acepta el id, el nombre o mayúsculas/tildes: «Barcelona», «barcelona», «Álava». */
export function resolveProvincia(input?: string | null): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (EXTRA[raw]) return raw;
  const n = fold(raw).replace(/[\s/_]+/g, " ").trim();
  const found = PROVINCIAS.find(p => {
    const id = fold(p.id);
    const name = fold(p.name);
    const parts = name.split(/[/,]/).map(s => s.trim()).filter(Boolean);
    return id === n.replace(/\s+/g, "-") || id === n || name === n || parts.includes(n);
  });
  return found?.id ?? null;
}

export function extraIds(provincia?: string | null): PartyId[] {
  const id = resolveProvincia(provincia);
  if (!id) return [];
  return EXTRA[id] || [];
}

export function partyIdsFor(provincia?: string | null): PartyId[] {
  return [...STATE_IDS, ...extraIds(provincia)];
}

export const REGIONAL_PARTIES: Party[] = [
  { id: "ERC", name: "ERC", full: "Esquerra Republicana de Catalunya", color: "var(--erc)",
    lead: "Por confirmar (en 2023, Gabriel Rufián)", seats: "7 escaños (2023)",
    family: "Izquierda independentista catalana.",
    desc: "Partido republicano e independentista. Apoyó la investidura de 2023 a cambio de la amnistía y la financiación singular.",
    src: "Programa 23J 2023", url: "https://static.esquerra.cat/uploads/20230905/e2023-programa.pdf", programaYear: 2023 },
  { id: "JUNTS", name: "Junts", full: "Junts per Catalunya", color: "var(--junts)",
    lead: "Por confirmar (en 2023, Míriam Nogueras)", seats: "7 escaños (2023)",
    family: "Centroderecha independentista catalana.",
    desc: "Partido independentista liderado por Carles Puigdemont. Apoyó la investidura de 2023 y rompió con el Gobierno en 2025.",
    src: "Programa 23J 2023", url: "https://img.beteve.cat/wp-content/uploads/2023/07/programa-junts-per-catalunya-eleccions-generals-2023.pdf", programaYear: 2023 },
  { id: "BILDU", name: "EH Bildu", full: "Euskal Herria Bildu", color: "var(--bildu)",
    lead: "Por confirmar (en 2023, Mertxe Aizpurua)", seats: "6 escaños (2023)",
    family: "Izquierda independentista vasca.",
    desc: "Coalición de izquierda independentista del País Vasco y Navarra. Apoyó la investidura de 2023.",
    src: "Programa 23J 2023", url: "https://ehbildu.eus/", programaYear: 2023 },
  { id: "PNV", name: "PNV", full: "Partido Nacionalista Vasco (EAJ-PNV)", color: "var(--pnv)",
    lead: "Por confirmar (en 2023, Aitor Esteban)", seats: "5 escaños (2023)",
    family: "Centro nacionalista vasco, democristiano.",
    desc: "Partido nacionalista vasco que gobierna Euskadi. Apoyó la investidura de 2023.",
    src: "Programa 23J 2023 «Con voz propia»", url: "https://www.eaj-pnv.eus/es/documentos/20945/con-voz-propia-programa-electoral-23-j", programaYear: 2023 },
  { id: "BNG", name: "BNG", full: "Bloque Nacionalista Galego", color: "var(--bng)",
    lead: "Por confirmar (en 2023, Néstor Rego)", seats: "1 escaño (2023)",
    family: "Izquierda nacionalista gallega.",
    desc: "Partido nacionalista y de izquierda de Galicia. Apoyó la investidura de 2023.",
    src: "Programa xerais 2023", url: "https://www.bng.gal/media/bnggaliza/files/2023/07/05/23_bng_xerais_programa.pdf", programaYear: 2023 },
  { id: "CC", name: "CC", full: "Coalición Canaria", color: "var(--cc)",
    lead: "Por confirmar (en 2023, Cristina Valido)", seats: "1 escaño (2023)",
    family: "Centro nacionalista canario.",
    desc: "Partido nacionalista canario que preside el Gobierno de Canarias. Apoyó la investidura de 2023 con un acuerdo propio.",
    src: "Programas 2023 y posiciones públicas", url: "https://coalicioncanaria.org/programas-electorales/", programaYear: 2023 },
  { id: "UPN", name: "UPN", full: "Unión del Pueblo Navarro", color: "var(--upn)",
    lead: "Por confirmar (en 2023, Alberto Catalán)", seats: "1 escaño (2023)",
    family: "Centroderecha regionalista navarra.",
    desc: "Partido regionalista y foralista de Navarra. Votó en contra de la investidura de 2023.",
    src: "Programa foral 2023-2027 y posiciones públicas", url: "https://www.upn.org/", programaYear: 2023 },
];

export const REGIONAL_KB: Record<"ERC" | "JUNTS" | "BILDU" | "PNV" | "BNG" | "CC" | "UPN", Record<TopicKey, string>> = {
  ERC: {
    trabajo: "Defiende un marco catalán de relaciones laborales. Apoyó la reducción de jornada a 37,5 horas y las subidas del salario mínimo.",
    impuestos: "Fiscalidad progresiva y que la Agencia Tributaria de Catalunya recaude todos los impuestos.",
    vivienda: "Limitar el alquiler, como ya se aplica en Cataluña, ampliar la vivienda pública y frenar las compras especulativas.",
    pensiones: "Revalorización de las pensiones con el IPC.",
    inmigracion: "Acogida y vías legales de entrada. Apoyó la regularización extraordinaria.",
    sociedad: "Apoya las leyes de eutanasia, aborto, ley trans y Memoria Democrática.",
    territorio: "Referéndum de autodeterminación pactado. Impulsó la amnistía y la financiación singular acordada con el PSC.",
    energia: "Transición a renovables y cierre de las nucleares según el calendario.",
    educacion: "Escuela pública y modelo de inmersión lingüística en catalán.",
    sanidad: "Más financiación para la sanidad pública catalana.",
    justicia: "Contraria a que los jueces elijan al CGPJ. Denuncia la judicialización del conflicto catalán.",
    exterior: "Embargo a Israel y oficialidad del catalán en la Unión Europea.",
  },
  JUNTS: {
    trabajo: "Defiende a autónomos y pymes. Votó contra la ley de 37,5 horas por imponerse sin compensaciones para las pequeñas empresas.",
    impuestos: "Bajar la presión fiscal a pymes, autónomos y clases medias, y que Cataluña recaude todos sus impuestos.",
    vivienda: "Más oferta de vivienda y seguridad jurídica para los propietarios. Impulsó reformas contra la okupación y la multirreincidencia.",
    pensiones: "",
    inmigracion: "Que Cataluña tenga competencias plenas de inmigración y que la acogida se vincule al aprendizaje del catalán.",
    sociedad: "Votó a favor de la ley de eutanasia.",
    territorio: "Autodeterminación de Cataluña, aplicación íntegra de la amnistía y soberanía fiscal.",
    energia: "Transición energética compatible con la industria. Apoyó en 2025 iniciativas para revisar el cierre de las nucleares.",
    educacion: "Inmersión lingüística en catalán y apoyo a la escuela concertada.",
    sanidad: "Gestión catalana del sistema sanitario, con su red de centros públicos y concertados.",
    justicia: "Denuncia la persecución judicial al independentismo.",
    exterior: "Europeísta. Oficialidad del catalán en la Unión Europea.",
  },
  BILDU: {
    trabajo: "Marco vasco de relaciones laborales, salario mínimo propio y reducción de jornada.",
    impuestos: "Fiscalidad más progresiva desde el concierto y el convenio, con más impuestos a las grandes fortunas.",
    vivienda: "Limitar el alquiler, ampliar la vivienda pública y frenar la especulación.",
    pensiones: "Equiparar la pensión mínima al salario mínimo.",
    inmigracion: "Regularización y acogida. Apoyó la regularización extraordinaria.",
    sociedad: "Apoya las leyes de eutanasia, aborto, ley trans y Memoria Democrática, y la derogación de la ley mordaza.",
    territorio: "Derecho a decidir de Euskal Herria. Votó a favor de la amnistía.",
    energia: "Transición ecológica y rechazo a la energía nuclear.",
    educacion: "Escuela pública y euskaldun.",
    sanidad: "Sanidad pública sin privatizaciones.",
    justicia: "Contraria a que los jueces elijan al CGPJ.",
    exterior: "Embargo a Israel y crítica con la OTAN.",
  },
  PNV: {
    trabajo: "Marco vasco de relaciones laborales con prioridad de los convenios vascos.",
    impuestos: "Defensa del concierto económico, por el que Euskadi recauda y gestiona sus impuestos.",
    vivienda: "Euskadi tiene la competencia y aplica su propia ley de vivienda, incluidas zonas tensionadas.",
    pensiones: "Transferencia a Euskadi de la gestión del régimen económico de la Seguridad Social.",
    inmigracion: "Competencias vascas en acogida e integración.",
    sociedad: "Votó a favor de la eutanasia y de la Memoria Democrática.",
    territorio: "Reconocimiento nacional de Euskadi y cumplimiento íntegro del Estatuto de Gernika, con las transferencias pendientes. Votó a favor de la amnistía.",
    energia: "Transición industrial con hidrógeno verde y renovables.",
    educacion: "Sistema educativo vasco con red pública y concertada.",
    sanidad: "Defensa de la gestión vasca de Osakidetza.",
    justicia: "",
    exterior: "Europeísta. Oficialidad del euskera en la Unión Europea.",
  },
  BNG: {
    trabajo: "Marco gallego de relaciones laborales y subida del salario mínimo.",
    impuestos: "Que Galicia recaude sus impuestos con un sistema propio, y fiscalidad progresiva.",
    vivienda: "Limitar el alquiler y ampliar la vivienda pública.",
    pensiones: "Pensiones mínimas suficientes y revalorización con el IPC.",
    inmigracion: "Acogida y vías legales de entrada.",
    sociedad: "Apoya las leyes de eutanasia, aborto, ley trans y Memoria Democrática.",
    territorio: "Reconocimiento de Galicia como nación con derecho a decidir y nuevas transferencias, como la autopista AP-9.",
    energia: "Soberanía energética gallega y una tarifa eléctrica propia, al ser Galicia excedentaria en energía.",
    educacion: "Escuela pública y en gallego.",
    sanidad: "Sanidad pública sin privatizaciones.",
    justicia: "Contrario a que los jueces elijan al CGPJ.",
    exterior: "Embargo a Israel y crítica con la OTAN.",
  },
  CC: {
    trabajo: "",
    impuestos: "Defensa del Régimen Económico y Fiscal (REF) de Canarias.",
    vivienda: "Respuesta a la emergencia habitacional en las islas y regulación propia de la vivienda vacacional.",
    pensiones: "Subida de las pensiones no contributivas.",
    inmigracion: "Reparto obligatorio entre comunidades de los menores migrantes no acompañados y más implicación de la Unión Europea en la ruta canaria.",
    sociedad: "",
    territorio: "Cumplimiento de la agenda canaria: Estatuto de 2018 y REF. Votó en contra de la amnistía.",
    energia: "Transición energética adaptada a sistemas insulares y autoconsumo.",
    educacion: "",
    sanidad: "",
    justicia: "",
    exterior: "Estatus de región ultraperiférica en la UE y relación con África.",
  },
  UPN: {
    trabajo: "Votó contra la ley de reducción de jornada a 37,5 horas.",
    impuestos: "Defensa del Convenio Económico de Navarra y bajada de impuestos.",
    vivienda: "",
    pensiones: "",
    inmigracion: "",
    sociedad: "Votó en contra de la ley de eutanasia.",
    territorio: "Navarra como comunidad foral propia dentro de España: rechaza su integración en Euskadi y se opuso a la amnistía.",
    energia: "",
    educacion: "Libertad de elección de centro y rechazo a exigir el euskera para el empleo público en toda Navarra.",
    sanidad: "",
    justicia: "",
    exterior: "",
  },
};
