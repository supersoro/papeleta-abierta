// Test de afinidad · versión 29-N (12 partidos). Sustituye por completo a las preguntas anteriores.
// p: posición de cada partido en el orden de ORDER, escala -2 (muy en contra) … +2 (muy a favor).
// null = el partido no tiene posición conocida: esa pregunta no cuenta para él (no es lo mismo que 0, neutral).
// src: base de la codificación. revisar: true = codificación con menos respaldo documental, prioritaria para la revisión experta.
// Cálculo recomendado: las respuestas «Neutral» del usuario NO cuentan (ver CAMBIOS.md).

export const ORDER = ["PP", "PSOE", "VOX", "SUMAR", "POD", "ERC", "JUNTS", "BILDU", "PNV", "BNG", "CC", "UPN"] as const;

export type Question = { id: string; t: string; s: string; c: string; p: (number | null)[]; src: string; revisar?: boolean };

export const QUESTIONS: Question[] = [
  // ── Trabajo e impuestos
  { id: "jornada", t: "Trabajo", s: "La jornada laboral máxima debe bajar por ley a 37,5 horas semanales sin reducir el salario.",
    c: "El Congreso tumbó el proyecto en septiembre de 2025 con los votos de PP, Vox, Junts y UPN.",
    p: [-1, 2, -2, 2, 2, 2, -1, 2, 1, 2, null, -1], src: "Votación de enmiendas a la totalidad, 10-09-2025; programas 2023", revisar: false },
  { id: "irpf", t: "Impuestos", s: "Hay que bajar el IRPF a las rentas medias y bajas aunque se recaude menos.",
    c: "Afecta a los tramos que paga la mayoría de asalariados.",
    p: [2, 0, 2, -1, -1, -1, 1, -1, 0, -1, 1, 1], src: "Programas 23J 2023", revisar: true },
  { id: "grandes-fortunas", t: "Impuestos", s: "Deberían suprimirse los impuestos especiales a las grandes fortunas y a los beneficios de bancos y energéticas.",
    c: "Gravámenes aprobados desde 2022. En 2025 Junts y PNV no apoyaron prorrogar el de las energéticas.",
    p: [2, -2, 2, -2, -2, -2, 1, -2, 1, -2, null, 2], src: "Programas 2023; votaciones Congreso 2022-2025", revisar: true },
  { id: "sucesiones", t: "Impuestos", s: "El impuesto de sucesiones y donaciones debería bajar o eliminarse en toda España.",
    c: "Hoy lo regulan las comunidades autónomas; País Vasco y Navarra tienen su propio sistema foral.",
    p: [2, -1, 2, -2, -2, -1, 0, -2, null, -2, 1, 1], src: "Programas 23J 2023", revisar: true },

  // ── Vivienda
  { id: "alquiler", t: "Vivienda", s: "Las administraciones deben poder limitar el precio del alquiler en las zonas con precios tensionados.",
    c: "La Ley de Vivienda de 2023 lo permite si la comunidad lo solicita; Cataluña y el País Vasco lo aplican.",
    p: [-2, 1, -2, 2, 2, 2, -1, 2, 1, 2, -1, -2], src: "Ley 12/2023 y su tramitación; aplicación autonómica", revisar: false },
  { id: "okupacion", t: "Vivienda", s: "Las viviendas ocupadas ilegalmente deben poder desalojarse en un plazo de 24 a 48 horas.",
    c: "Propuestas de desalojo exprés debatidas en el Congreso desde 2023, entre ellas de PP, Vox, Junts y PNV.",
    p: [2, 0, 2, -1, -2, -1, 2, -2, 1, -2, 1, 2], src: "Proposiciones de ley 2023-2025; programas 2023", revisar: true },
  { id: "turisticos", t: "Vivienda", s: "Las comunidades y ayuntamientos deberían poder seguir concediendo licencias de pisos turísticos sin nuevas limitaciones estatales.",
    c: "Debate sobre el peso de la vivienda turística en el precio del alquiler; Canarias y Cataluña han aprobado leyes propias.",
    p: [1, -1, 1, -2, -2, -1, 1, -2, 0, -2, null, 1], src: "Leyes autonómicas 2024-2025; declaraciones públicas", revisar: true },

  // ── Inmigración
  { id: "regularizacion", t: "Inmigración", s: "La regularización extraordinaria de inmigrantes aprobada en 2026 fue una medida acertada.",
    c: "Real Decreto de enero de 2026, pactado por el Gobierno con Podemos; Vox y gobiernos autonómicos del PP la han recurrido.",
    p: [-1, 2, -2, 2, 2, 2, -1, 2, 1, 2, null, -1], src: "RD 316/2026; recursos ante el Supremo", revisar: true },
  { id: "expulsiones", t: "Inmigración", s: "Hay que priorizar la expulsión de los inmigrantes en situación irregular.",
    c: "Incluye más repatriaciones y endurecer el arraigo.",
    p: [1, -1, 2, -2, -2, -2, 1, -2, -1, -2, null, 1], src: "Programas 2023; iniciativas parlamentarias 2026", revisar: true },
  { id: "competencias-inmigracion", t: "Inmigración", s: "Las comunidades autónomas deberían poder gestionar competencias de inmigración, como el control de permisos.",
    c: "En septiembre de 2025 el Congreso rechazó delegar competencias de inmigración en Cataluña con los votos de PP, Vox y Podemos.",
    p: [-2, 1, -2, 1, -2, 1, 2, 1, 2, 1, 2, -1], src: "Votación de la ley orgánica de delegación, 2025", revisar: true },

  // ── Derechos y sociedad
  { id: "eutanasia", t: "Sociedad", s: "La ley de eutanasia debería derogarse o restringirse.",
    c: "Aprobada en 2021; PP y Vox la recurrieron al Tribunal Constitucional, que la avaló.",
    p: [1, -2, 2, -2, -2, -2, -2, -2, -2, -2, null, 2], src: "LO 3/2021 y su votación; recursos ante el TC", revisar: false },
  { id: "aborto", t: "Sociedad", s: "El derecho al aborto debería protegerse en la Constitución.",
    c: "El Gobierno propuso en 2025 incluirlo en la Constitución.",
    p: [-1, 2, -2, 2, 2, 2, 1, 2, 1, 2, null, -2], src: "Propuesta de reforma constitucional 2025", revisar: true },
  { id: "trans", t: "Sociedad", s: "Debe mantenerse la ley que permite cambiar el sexo registral por autodeterminación.",
    c: "Ley 4/2023, conocida como ley trans.",
    p: [-2, 1, -2, 2, 2, 2, 1, 2, 1, 2, null, -2], src: "Ley 4/2023 y su votación", revisar: true },
  { id: "violencia-genero", t: "Sociedad", s: "La ley integral de violencia de género debería sustituirse por una ley de violencia intrafamiliar.",
    c: "Propuesta de Vox; el resto de partidos apoya el Pacto de Estado contra la Violencia de Género.",
    p: [-1, -2, 2, -2, -2, -2, -2, -2, -2, -2, -2, -1], src: "Programa Vox 2023; Pacto de Estado", revisar: false },
  { id: "memoria", t: "Memoria", s: "La Ley de Memoria Democrática debería derogarse.",
    c: "Aprobada en 2022; PP y Vox anunciaron su derogación.",
    p: [1, -2, 2, -2, -2, -2, -1, -2, -2, -2, null, 1], src: "Ley 20/2022 y su votación; programas 2023", revisar: false },

  // ── Modelo territorial
  { id: "amnistia", t: "Territorio", s: "La ley de amnistía para los encausados del procés fue una medida acertada.",
    c: "Aprobada en 2024 por 177 votos a favor y 172 en contra.",
    p: [-2, 2, -2, 2, 2, 2, 2, 2, 2, 2, -1, -2], src: "LO 1/2024 y su votación", revisar: false },
  { id: "referendum-cat", t: "Territorio", s: "Debería permitirse un referéndum pactado sobre la independencia de Cataluña.",
    c: "La Constitución no lo contempla hoy.",
    p: [-2, -2, -2, 0, 2, 2, 2, 2, 1, 2, -1, -2], src: "Programas 2023; declaraciones públicas", revisar: true },
  { id: "financiacion", t: "Territorio", s: "Cataluña debería recaudar y gestionar todos sus impuestos, como el País Vasco y Navarra.",
    c: "La llamada financiación singular acordada entre PSC y ERC en 2024.",
    p: [-2, 1, -2, 1, 1, 2, 2, 2, 1, 1, null, -1], src: "Acuerdo PSC-ERC 2024; programas 2023", revisar: true },
  { id: "independencia", t: "Territorio", s: "Cataluña, el País Vasco o Galicia deberían poder llegar a ser Estados independientes.",
    c: "Distinto del referéndum: pregunta por el objetivo, no por el procedimiento.",
    p: [-2, -2, -2, -1, -1, 2, 2, 2, 0, 1, -1, -2], src: "Estatutos y programas 2023 de cada partido", revisar: true },
  { id: "recentralizar", t: "Territorio", s: "El Estado debería recuperar competencias autonómicas como educación o sanidad.",
    c: "Hoy las gestionan las comunidades autónomas.",
    p: [-1, -2, 2, -2, -2, -2, -2, -2, -2, -2, -2, -1], src: "Programas 23J 2023", revisar: false },
  { id: "concierto", t: "Territorio", s: "Deberían mantenerse el concierto económico vasco y el convenio navarro.",
    c: "Sistemas forales por los que País Vasco y Navarra recaudan sus propios impuestos.",
    p: [2, 2, -2, 1, 1, 1, 1, 2, 2, 1, 1, 2], src: "Programas 2023; Constitución, disposición adicional primera", revisar: true },
  { id: "lengua-empleo", t: "Territorio", s: "Las comunidades con lengua propia deben poder exigirla para acceder a empleos públicos.",
    c: "Afecta al catalán, euskera, gallego y valenciano.",
    p: [-1, 1, -2, 1, 1, 2, 2, 2, 2, 2, null, -2], src: "Programas 2023; legislación autonómica", revisar: true },

  // ── Energía y clima
  { id: "nucleares", t: "Energía", s: "Las centrales nucleares deberían seguir funcionando más allá del calendario de cierre previsto.",
    c: "El plan vigente prevé cerrarlas entre 2027 y 2035.",
    p: [2, -1, 2, -2, -2, -1, 1, -2, null, -2, null, 1], src: "PNIEC; votaciones 2025 tras el apagón", revisar: true },
  { id: "transicion", t: "Clima", s: "Hay que frenar las normas climáticas que encarecen la energía, el transporte o el campo.",
    c: "Incluye objetivos de renovables, zonas de bajas emisiones y fin de los coches de combustión.",
    p: [0, -2, 2, -2, -2, -2, -1, -2, -1, -2, -1, 0], src: "Programas 23J 2023", revisar: true },

  // ── Servicios públicos
  { id: "concertada", t: "Educación", s: "El dinero público debe priorizar la escuela pública aunque se reduzcan los conciertos.",
    c: "Los colegios concertados son privados financiados con fondos públicos.",
    p: [-2, 1, -2, 2, 2, 1, -1, 2, -1, 2, null, -2], src: "Programas 2023; LOMLOE", revisar: true },
  { id: "sanidad-privada", t: "Sanidad", s: "La sanidad pública debería apoyarse más en la privada para reducir las listas de espera.",
    c: "Conciertos con clínicas privadas para operaciones y pruebas.",
    p: [1, -1, 1, -2, -2, -1, 1, -2, 0, -2, null, 1], src: "Programas 23J 2023", revisar: true },

  // ── Instituciones
  { id: "cgpj", t: "Justicia", s: "El Parlamento debe seguir eligiendo a los miembros del Consejo General del Poder Judicial.",
    c: "La alternativa es que los jueces elijan a la mayoría, como recomienda la Comisión Europea.",
    p: [-2, 1, -2, 2, 2, 2, 1, 2, 0, 2, null, -2], src: "Programas 2023; renovación del CGPJ en 2024", revisar: true },
  { id: "monarquia", t: "Instituciones", s: "La monarquía parlamentaria es la forma de Estado adecuada para España.",
    c: "",
    p: [2, 1, 2, -1, -2, -2, -2, -2, 0, -2, 1, 2], src: "Programas 2023; declaraciones públicas", revisar: true },

  // ── Exterior y defensa
  { id: "defensa", t: "Defensa", s: "España debe aumentar el gasto en defensa hasta al menos el 2 % del PIB.",
    c: "Compromiso con la OTAN; España alcanzó esa cifra en 2025 y rechazó el objetivo del 5 %.",
    p: [2, 1, 1, -1, -2, -1, 1, -2, 1, -2, 1, 2], src: "Cumbre de la OTAN 2025; declaraciones públicas", revisar: true },
  { id: "ucrania", t: "Exterior", s: "España debe seguir enviando ayuda militar a Ucrania.",
    c: "España ha enviado material militar a Ucrania desde 2022.",
    p: [2, 2, 1, 0, -2, 1, 2, -1, 2, -1, 2, 2], src: "Votaciones y declaraciones 2022-2026", revisar: true },
  { id: "israel", t: "Exterior", s: "España debe aplicar un embargo comercial y de armas a Israel por la guerra en Gaza.",
    c: "El Gobierno reconoció a Palestina en 2024 y aprobó un embargo de armas en 2025.",
    p: [-1, 1, -2, 2, 2, 2, 0, 2, 1, 2, null, -1], src: "Reconocimiento 28-05-2024; embargo de armas 2025", revisar: true },
  { id: "ue", t: "Exterior", s: "La Unión Europea debería tener más competencias, aunque los Estados pierdan parte de su soberanía.",
    c: "Por ejemplo en defensa, política fiscal o migración.",
    p: [1, 2, -2, 1, -1, 1, 1, 0, 2, -1, 1, 1], src: "Programas europeos 2024; declaraciones públicas", revisar: true },
];
