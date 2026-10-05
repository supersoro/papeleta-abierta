import Link from "next/link";
import { ELECTION, PARTIES, programaNota } from "@/lib/data";
import { AFIRMACIONES, QUESTIONS, ORDER, statsPosiciones, posicionDe } from "@/lib/posiciones";
import { NIVEL_TEXTO, type NivelEvidencia } from "@/lib/modelo-datos";
import { PosicionVista } from "@/components/PosicionVista";
import programas from "@/data/programas.json";

export const metadata = {
  title: "Metodología · Papeleta Abierta",
  description: "De dónde salen los datos, cómo se asignan las posiciones y cómo se calcula la afinidad.",
};

const NIVELES: NivelEvidencia[] = ["A", "B", "C", "D", "E"];

export default function Metodologia() {
  const s = statsPosiciones();
  return (
    <div className="wrap">
      <header>
        <p className="brand"><Link href="/">Papeleta Abierta</Link></p>
        <p className="eyebrow">Metodología · elecciones del {ELECTION.label}</p>
      </header>

      <section className="sheet method">
        <h1 className="ask-title">Metodología</h1>
        <p>Papeleta Abierta no recomienda a quién votar. Recoge lo que proponen los partidos y lo que han votado, enlaza cada dato a su fuente y permite compararlos. El test de afinidad es una herramienta más sobre esa misma base.</p>
      </section>

      <section className="sheet method">
        <h2>De dónde salen los datos</h2>
        <p>Usamos dos tipos de información y nunca los mezclamos.</p>
        <p><strong>Propuestas.</strong> Lo que cada partido dice que hará, según su programa electoral. Hasta que los partidos publiquen sus programas para el 29 de noviembre usamos los de las generales de 2023 (Podemos concurrió dentro de Sumar, así que usamos su programa de las europeas de 2024). Cada vez que se publique un programa nuevo lo incorporaremos y conservaremos el anterior, para que se pueda ver qué ha cambiado.</p>
        <p><strong>Historial.</strong> Lo que cada partido ha votado en el Congreso durante la legislatura 2023-2026. Si un programa no dice nada sobre un tema, la web lo indica así y, aparte, muestra cómo votó ese partido. Nunca usamos una votación para rellenar en silencio lo que falta en un programa. Las votaciones solo se publican cuando están verificadas y enlazadas al registro oficial.</p>
      </section>

      <section className="sheet method">
        <h2>Cómo asignamos la posición de cada partido</h2>
        <p>Cada afirmación del test tiene una posición por partido en esta escala:</p>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Valor</th><th style={{ textAlign: "left" }}>Significado</th></tr></thead>
            <tbody>
              <tr><td>+2</td><td className="q">Apoyo explícito: propone o ha votado exactamente esta medida, o una más ambiciosa en el mismo sentido.</td></tr>
              <tr><td>+1</td><td className="q">Apoyo parcial o condicionado: la apoya con matices, en una versión más limitada o con condiciones.</td></tr>
              <tr><td>0</td><td className="q">Posición ambigua o intermedia: hay textos o votos en ambos sentidos, o se abstuvo de forma deliberada.</td></tr>
              <tr><td>−1</td><td className="q">Oposición parcial o condicionada: la rechaza en su forma actual pero acepta una versión distinta.</td></tr>
              <tr><td>−2</td><td className="q">Oposición explícita: la rechaza en su programa, ha votado en contra o defiende la contraria.</td></tr>
              <tr><td>—</td><td className="q">Sin posición conocida: no hay evidencia suficiente. La pregunta no cuenta para ese partido.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Junto a cada posición indicamos de qué tipo de evidencia sale, de más a menos sólida:</p>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Nivel</th><th style={{ textAlign: "left" }}>Evidencia</th></tr></thead>
            <tbody>
              {NIVELES.map(n => (
                <tr key={n}><td>{n}</td><td className="q">{NIVEL_TEXTO[n]}{n === "E" ? " Siempre se señala." : ""}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Cada posición enlaza a su fuente, cita el texto que la respalda y dice en qué estado está: pendiente de cita, con cita, revisada o en disputa.</p>
      </section>

      <section className="sheet">
        <h2>Estado actual de las posiciones</h2>
        <p>Cifras calculadas de <code>posiciones.json</code>, no escritas a mano: {s.total} posiciones vigentes. {s.porNivel.C} de nivel C, {s.porNivel.B} de nivel B, {s.porNivel.D} de nivel D, {s.porNivel.E} de nivel E y {s.sinPosicion} sin posición. {s.conCita} tienen cita literal. {s.revisadas} revisadas, {s.porEstado.pendiente} pendientes, {s.porEstado.con_cita} con cita, {s.porEstado.en_disputa} en disputa.</p>
        <p className="small">Hoy la mayoría están pendientes de cita y de revisión. Esta tabla muestra exactamente cuáles.</p>
        <div className="tablewrap" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Afirmación</th>
                {PARTIES.map(p => <th key={p.id}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {AFIRMACIONES.map(a => (
                <tr key={a.id}>
                  <td className="q">{a.enunciado}</td>
                  {PARTIES.map(p => (
                    <td key={p.id}><PosicionVista pos={posicionDe(a.id, p.id)} compact /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sheet method">
        <h2>Cómo se calcula la afinidad</h2>
        <p>Para cada afirmación comparamos tu respuesta con la posición del partido. La coincidencia es 1 menos la distancia entre ambas dividida entre 4:</p>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Tú</th><th>Partido</th><th>Coincidencia</th></tr></thead>
            <tbody>
              <tr><td>+2</td><td>+2</td><td>100 %</td></tr>
              <tr><td>+2</td><td>+1</td><td>75 %</td></tr>
              <tr><td>+2</td><td>0</td><td>50 %</td></tr>
              <tr><td>+2</td><td>−1</td><td>25 %</td></tr>
              <tr><td>+2</td><td>−2</td><td>0 %</td></tr>
            </tbody>
          </table>
        </div>
        <p>La <strong>coincidencia bruta</strong> es la media de esas cifras, contando doble las afirmaciones que marques como importantes. No cuentan tus respuestas «Neutral» ni las afirmaciones en las que el partido no tiene posición conocida.</p>
        <p><strong>Corrección por posiciones moderadas.</strong> Si respondieras al azar, un partido con posiciones moderadas (+1, 0, −1) obtendría de media un 62,5 % de coincidencia, y uno con posiciones claras (+2, −2), un 50 %. Sin corregirlo, el test favorecería a los partidos más tibios ante respuestas poco definidas. Por eso calculamos también una <strong>coincidencia calibrada</strong>, que vale 50 % cuando tu coincidencia es la que obtendrías al azar con ese partido y 100 % cuando coincides en todo:</p>
        <ul>
          <li>si la bruta (B) está por encima de lo esperado al azar (E): calibrada = 50 % + 50 % × (B − E) / (1 − E)</li>
          <li>si está por debajo: calibrada = 50 % × B / E</li>
        </ul>
        <p><strong>La afinidad que mostramos es la media de la bruta y la calibrada.</strong></p>
        <p>Ejemplo: coincides un 80 % con dos partidos. El primero tiene todas sus posiciones en +2 o −2 (E = 50 %) y el segundo en +1 o −1 (E = 62,5 %). La calibrada es del 80 % para el primero y del 73 % para el segundo, así que la afinidad mostrada es del 80 % y del 77 %. Coincidir con un partido de posiciones claras dice más que coincidir con uno de posiciones intermedias.</p>
        <p>No mostramos resultado si das menos de 8 respuestas distintas de «Neutral».</p>
        <p><strong>Comprobación de sesgo.</strong> Antes de cada cambio simulamos miles de personas que responden al azar, que dicen «sí» o «no» a todo, o que piensan como cada partido con discrepancias. El resultado se obtiene con <code>npm run audit</code>.</p>
      </section>

      <section className="sheet method">
        <h2>Cómo están redactadas las afirmaciones</h2>
        <p>Cada afirmación enuncia una medida concreta tal como la defienden quienes la proponen, sin añadir consecuencias ni premisas. La mitad están formuladas de forma que estar de acuerdo acerca a partidos de izquierda y la otra mitad a partidos de derecha, para que la tendencia a responder «sí» no favorezca a ningún bloque. Hay {QUESTIONS.length} afirmaciones. Orden de partidos: {ORDER.join(", ")}.</p>
      </section>

      <section className="sheet method">
        <h2>Qué no hace esta web</h2>
        <ul>
          <li>No recomienda a quién votar ni valora qué propuesta es mejor.</li>
          <li>No guarda tus respuestas al test: se calculan en tu dispositivo.</li>
          <li>No guarda tus preguntas al buscador.</li>
          <li>Papeleta Abierta no publica resultados agregados de las respuestas de sus usuarios.</li>
        </ul>
      </section>

      <section className="sheet method">
        <h2>Errores y correcciones</h2>
        <p>Junto a cada dato hay un enlace «¿Ves un error?». Revisamos todos los avisos y publicamos cada cambio en el <Link href="/correcciones">registro de correcciones</Link>, con su fecha y su motivo.</p>
      </section>

      <section className="sheet">
        <h2>Programas que usamos</h2>
        <p className="small">Hasta que cada partido publique el de 2026, el buscador usa estos textos.</p>
        <ul>
          {(programas as { party: string; title: string; url: string; pdf: string | null }[]).map(p => {
            const party = PARTIES.find(x => x.id === p.party);
            return (
              <li key={p.party}>
                <strong>{party?.name || p.party}</strong> · {p.title} · <a href={p.url} target="_blank" rel="noopener">{p.pdf ? "PDF / ficha" : "ficha"}</a>
                {party ? ` · ${programaNota(party)}` : ""}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="small"><Link href="/">Volver al inicio</Link></p>
    </div>
  );
}
