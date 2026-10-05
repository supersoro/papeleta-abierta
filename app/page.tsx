"use client";
import { useEffect, useState } from "react";
import { Buscador } from "@/components/Buscador";
import { Test } from "@/components/Test";
import { Partidos, Temas } from "@/components/Partidos";

const TABS = [
  ["buscar", "Pregunta"],
  ["test", "Test de afinidad"],
  ["partidos", "Partidos"],
  ["temas", "Por tema"],
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
        <div className="eyebrow"><span>Elecciones generales · Congreso de los Diputados</span><span>350 escaños · fecha límite 22-08-2027</span></div>
        <h1>Papeleta<br />Abierta</h1>
        <p className="lede">Pregunta qué propone cada partido, haz el test de afinidad o consulta sus programas por tema. Todo con su fuente.</p>
      </header>

      <p className="notice"><strong>Versión de prueba.</strong> Las generales aún no están convocadas y ningún partido ha publicado su programa para 2027. Se usan los programas del 23J de 2023 (Podemos: europeas de 2024) y votaciones y decisiones de 2024 a 2026. Se actualizarán con los programas definitivos.</p>

      <nav className="tabs" role="tablist" aria-label="Secciones">
        {TABS.map(([id, label]) => (
          <button key={id} className="tab" role="tab" type="button" aria-selected={tab === id} onClick={() => select(id)}>{label}</button>
        ))}
      </nav>

      {tab === "buscar" && <Buscador />}
      {tab === "test" && <Test />}
      {tab === "partidos" && <Partidos />}
      {tab === "temas" && <Temas />}

      <footer>Partidos incluidos: los cinco con presencia estatal en todas las circunscripciones. Los que solo se presentan en algunas comunidades (ERC, Junts, PNV, EH Bildu, BNG, CC) y SALF se añadirán cuando publiquen programa. Los resúmenes están redactados por Papeleta Abierta; consulta siempre el programa original.</footer>
    </div>
  );
}
