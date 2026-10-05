"use client";
import { useEffect, useState } from "react";
import { Buscador } from "@/components/Buscador";
import { Test } from "@/components/Test";
import { Partidos, Temas } from "@/components/Partidos";

const TABS = [
  ["buscar", "Preguntar"],
  ["test", "Test"],
  ["partidos", "Partidos"],
  ["temas", "Comparar"],
] as const;
type Tab = (typeof TABS)[number][0];

export default function Home() {
  const [tab, setTab] = useState<Tab>("buscar");

  useEffect(() => {
    const h = location.hash.slice(1);
    if (TABS.some(t => t[0] === h)) setTab(h as Tab);
  }, []);
  const select = (t: Tab) => { setTab(t); history.replaceState(null, "", `#${t}`); };

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow"><span>Elecciones generales · Congreso</span><span>350 escaños · tope 22-08-2027</span></div>
        <p className="brand">Papeleta Abierta</p>
      </header>

      <nav className="tabs" role="tablist" aria-label="Qué puedes hacer">
        {TABS.map(([id, label]) => (
          <button key={id} className="tab" role="tab" type="button" aria-selected={tab === id} onClick={() => select(id)}>{label}</button>
        ))}
      </nav>

      {tab === "buscar" && <Buscador />}
      {tab === "test" && <Test />}
      {tab === "partidos" && <Partidos />}
      {tab === "temas" && <Temas />}

      <details className="fineprint">
        <summary>Versión de prueba · programas de 2023</summary>
        <p>Las generales de 2027 no están convocadas y no hay programas nuevos. Esta versión usa:</p>
        <ul>
          <li>Programas del 23J de 2023 de PP, PSOE, Vox y Sumar, indexados página a página.</li>
          <li>Programa de Podemos para las europeas de 2024 (concurrió dentro de Sumar en 2023).</li>
          <li>En el test y en «qué ocurrió en la legislatura»: leyes y votaciones de 2023 a 2026 (Ley de Vivienda, amnistía, regularización, jornada de 37,5 h, renovación del CGPJ, embargo de armas, etc.).</li>
        </ul>
        <p>Cuando se publiquen los programas de 2027 se sustituirán estos textos. Los resúmenes los redacta Papeleta Abierta; la fuente original manda.</p>
      </details>

      <footer>Partidos incluidos: los cinco con presencia estatal en todas las circunscripciones. Los que solo se presentan en algunas comunidades (ERC, Junts, PNV, EH Bildu, BNG, CC) y SALF se añadirán cuando publiquen programa. Los resúmenes están redactados por Papeleta Abierta; consulta siempre el programa original.</footer>
    </div>
  );
}
