// Base común de Papeleta Abierta: la usan el glosario, el comparador, el test y el buscador.
// Para corregir una propuesta o una posición, edita este archivo.

export type PartyId = "PP" | "PSOE" | "VOX" | "SUMAR" | "POD";
export type Party = { id: PartyId; name: string; full: string; color: string; lead: string; seats: string; family: string; desc: string; src: string; url: string };
export type TopicKey = "trabajo" | "impuestos" | "vivienda" | "pensiones" | "inmigracion" | "sociedad" | "territorio" | "energia" | "educacion" | "sanidad" | "justicia" | "exterior";
export type Question = { t: string; s: string; c: string; p: [number, number, number, number, number]; src: string };

export const PARTIES: Party[] =[
 {id:"PP",name:"PP",full:"Partido Popular",color:"var(--pp)",lead:"Alberto Núñez Feijóo",seats:"137 escaños (2023)",family:"Centroderecha. Partido Popular Europeo.",
  desc:"Partido conservador y liberal, primera fuerza en 2023. Lidera la oposición.",
  src:"Programa 23J 2023 (365 medidas)",url:"https://www.pp.es/actualidad/articulos/programa-electoral-propone-365-medidas-reconstruccion-economica-social-e/"},
 {id:"PSOE",name:"PSOE",full:"Partido Socialista Obrero Español",color:"var(--psoe)",lead:"Pedro Sánchez",seats:"121 escaños (2023)",family:"Centroizquierda. Socialistas Europeos.",
  desc:"Partido socialdemócrata. Gobierna en coalición con Sumar desde 2023.",
  src:"Programa 23J 2023",url:"https://www.psoe.es/media-content/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023.pdf"},
 {id:"VOX",name:"Vox",full:"Vox",color:"var(--vox)",lead:"Santiago Abascal",seats:"33 escaños (2023)",family:"Derecha radical. Patriotas por Europa.",
  desc:"Partido nacionalista español y conservador, centrado en inmigración, unidad territorial y soberanía.",
  src:"Programa 23J 2023",url:"https://www.voxespana.es/programa/programa-electoral-vox"},
 {id:"SUMAR",name:"Sumar",full:"Sumar",color:"var(--sumar)",lead:"Por designar (Yolanda Díaz no repetirá)",seats:"31 escaños (2023, incluía a Podemos)",family:"Izquierda. Coalición de IU, Más Madrid, Comuns y otros.",
  desc:"Plataforma de izquierda y ecologista. Socio minoritario del Gobierno de coalición.",
  src:"Programa 23J 2023",url:"https://movimientosumar.es/programa-electoral-23j/"},
 {id:"POD",name:"Podemos",full:"Podemos",color:"var(--podemos)",lead:"Irene Montero",seats:"4 diputados en el Grupo Mixto (salió de Sumar en 2023)",family:"Izquierda. La Izquierda Europea.",
  desc:"Partido de izquierda. Concurrió dentro de Sumar en 2023 y ahora se presenta por separado.",
  src:"Programa europeas 2024 y posiciones públicas",url:"https://podemos.info/wp-content/uploads/2024/05/Programa-PODEMOS-elecciones-europeas-2024.pdf"}
];

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
 }
};

// p: [PP, PSOE, VOX, SUMAR, POD] en escala -2..+2  ·  src: referencia de la codificación
export const QUESTIONS: Question[] =[
 {t:"Trabajo",s:"La jornada laboral máxima debe bajar por ley a 37,5 horas semanales sin reducir el salario.",c:"El Congreso rechazó el proyecto en septiembre de 2025 con los votos de PP, Vox, Junts y UPN.",p:[-1,2,-2,2,2],src:"Votación enmiendas a la totalidad, 10-09-2025; programas 2023"},
 {t:"Impuestos",s:"Hay que bajar el IRPF a las rentas medias y bajas aunque se recaude menos.",c:"Afecta a los tramos del impuesto sobre la renta que paga la mayoría de asalariados.",p:[2,0,2,-1,-1],src:"Programas 23J 2023"},
 {t:"Impuestos",s:"Deben mantenerse los impuestos especiales a las grandes fortunas y a los beneficios de bancos y energéticas.",c:"Gravámenes aprobados desde 2022; el PP y Vox prometieron suprimirlos.",p:[-2,2,-2,2,2],src:"Programas 23J 2023; votaciones Congreso 2022-2024"},
 {t:"Impuestos",s:"El impuesto de sucesiones y donaciones debería bajar o eliminarse en toda España.",c:"Hoy lo regulan las comunidades autónomas y varía mucho entre ellas.",p:[2,-1,2,-2,-2],src:"Programas 23J 2023"},
 {t:"Vivienda",s:"El Estado debe poder limitar el precio del alquiler en las zonas con precios tensionados.",c:"La Ley de Vivienda de 2023 lo permite si la comunidad autónoma lo solicita.",p:[-2,1,-2,2,2],src:"Ley 12/2023 y su tramitación; programas 2023"},
 {t:"Vivienda",s:"Las viviendas ocupadas ilegalmente deben poder desalojarse en un plazo de 24 a 48 horas.",c:"Propuestas de desalojo exprés debatidas en el Congreso varias veces desde 2023.",p:[2,0,2,-1,-2],src:"Programas 2023; proposiciones de ley PP y Vox"},
 {t:"Inmigración",s:"La regularización extraordinaria de inmigrantes aprobada en 2026 fue una medida acertada.",c:"Real Decreto de enero de 2026, pactado por el Gobierno con Podemos; Vox y gobiernos autonómicos del PP la han recurrido.",p:[-1,2,-2,2,2],src:"RD 316/2026; recursos de Vox y CC. AA. del PP"},
 {t:"Inmigración",s:"Hay que priorizar la expulsión de los inmigrantes en situación irregular.",c:"Incluye repatriaciones y endurecer el arraigo.",p:[1,-1,2,-2,-2],src:"Programas 2023; iniciativas de Vox 2026"},
 {t:"Sociedad",s:"Debe mantenerse la ley de eutanasia tal como está.",c:"Aprobada en 2021; PP y Vox la recurrieron al Tribunal Constitucional, que la avaló.",p:[-1,2,-2,2,2],src:"LO 3/2021; recursos ante el TC"},
 {t:"Sociedad",s:"El aborto debe estar garantizado en la sanidad pública e incluso protegido en la Constitución.",c:"El Gobierno propuso en 2025 incluir el derecho al aborto en la Constitución.",p:[0,2,-2,2,2],src:"Propuesta de reforma constitucional 2025; programas 2023"},
 {t:"Sociedad",s:"Debe mantenerse la ley que permite cambiar el sexo registral por autodeterminación.",c:"Ley 4/2023, conocida como ley trans.",p:[-2,1,-2,2,2],src:"Ley 4/2023; programas 2023"},
 {t:"Memoria",s:"La Ley de Memoria Democrática debería derogarse.",c:"Aprobada en 2022; PP y Vox anunciaron su derogación.",p:[1,-2,2,-2,-2],src:"Ley 20/2022; programas 2023"},
 {t:"Territorio",s:"La ley de amnistía para los encausados del procés fue una medida acertada.",c:"Aprobada en 2024 como parte de los acuerdos de investidura.",p:[-2,2,-2,2,2],src:"LO 1/2024 y su votación"},
 {t:"Territorio",s:"Debería permitirse un referéndum pactado sobre la independencia de Cataluña.",c:"La Constitución no lo contempla hoy.",p:[-2,-2,-2,0,2],src:"Programas 2023; declaraciones públicas"},
 {t:"Territorio",s:"Cataluña debería tener un sistema de financiación propio que le permita recaudar sus impuestos.",c:"La llamada financiación singular acordada entre PSC y ERC en 2024.",p:[-2,1,-2,1,1],src:"Acuerdo PSC-ERC 2024; declaraciones públicas"},
 {t:"Territorio",s:"El Estado debería recuperar competencias autonómicas como educación o sanidad.",c:"Hoy las gestionan las comunidades autónomas.",p:[-1,-2,2,-2,-2],src:"Programas 23J 2023"},
 {t:"Energía",s:"Las centrales nucleares deberían seguir funcionando más allá del calendario de cierre previsto.",c:"El plan vigente prevé cerrar las centrales entre 2027 y 2035.",p:[2,-1,2,-2,-2],src:"PNIEC; programas 2023; debate tras el apagón de 2025"},
 {t:"Clima",s:"Hay que acelerar la transición ecológica aunque suponga costes a corto plazo.",c:"Incluye renovables, movilidad eléctrica y limitar combustibles fósiles.",p:[0,2,-2,2,2],src:"Programas 23J 2023"},
 {t:"Educación",s:"El dinero público debe priorizar la escuela pública aunque se reduzcan los conciertos.",c:"Los colegios concertados son privados financiados con fondos públicos.",p:[-2,1,-2,2,2],src:"Programas 2023; LOMLOE"},
 {t:"Sanidad",s:"La sanidad pública debería apoyarse más en la privada para reducir las listas de espera.",c:"Conciertos con clínicas privadas para operaciones y pruebas.",p:[1,-1,1,-2,-2],src:"Programas 23J 2023"},
 {t:"Justicia",s:"Los jueces deberían elegir a la mayoría de los miembros del Consejo General del Poder Judicial.",c:"Hoy los elige el Parlamento; lo reclama también la Comisión Europea.",p:[2,-1,2,-2,-2],src:"Programas 2023; renovación CGPJ 2024"},
 {t:"Instituciones",s:"Debería celebrarse un referéndum para elegir entre monarquía y república.",c:"",p:[-2,-1,-2,1,2],src:"Programas 2023; declaraciones públicas"},
 {t:"Defensa",s:"España debe aumentar el gasto en defensa hasta al menos el 2 % del PIB.",c:"Compromiso con la OTAN; España alcanzó esa cifra en 2025 y rechazó el objetivo del 5 %.",p:[2,1,1,-1,-2],src:"Cumbre OTAN 2025; declaraciones públicas"},
 {t:"Exterior",s:"España debe aplicar un embargo comercial y de armas a Israel por la guerra en Gaza.",c:"El Gobierno reconoció a Palestina en 2024 y aprobó un embargo de armas en 2025.",p:[-1,1,-2,2,2],src:"Reconocimiento 28-05-2024; embargo de armas 2025"}
];

export const topicName = (k: string) => (TOPICS.find(t => t[0] === k) || [k, k])[1];
export const partyById = (id: string) => PARTIES.find(p => p.id === id);
