"use client";
import { useEffect, useState } from "react";
import { Buscador } from "@/components/Buscador";
import { Test } from "@/components/Test";
import { Partidos, Temas } from "@/components/Partidos";
import { ELECTION } from "@/lib/data";

const TABS = [
  ["buscar", "Preguntar"],
  ["test", "Test"],
  ["partidos", "Partidos"],
  ["temas", "Comparar"],
] as const;
type Tab = (typeof TABS)[number][0];

function daysToVote() {
  const target = Date.UTC(2026, 10, 29);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

function Countdown() {
  const [d, setD] = useState<number | null>(null);
  useEffect(() => { setD(daysToVote()); }, []);
  if (d == null) return <span>29 de noviembre</span>;
  if (d > 1) return <span>{d} días · 29 de noviembre</span>;
  if (d === 1) return <span>Mañana se vota</span>;
  if (d === 0) return <span>Hoy se vota</span>;
  return <span>Elecciones celebradas</span>;
}

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
        <div className="eyebrow"><span>Elecciones generales · 29 de noviembre</span><span><Countdown /></span></div>
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
        <summary>Programas de 2023 · pendientes los de estas elecciones</summary>
        <p>Sánchez convocó el 5 de octubre las generales para el {ELECTION.label}, tras tumbar el Congreso dos decretos de vivienda. El decreto de disolución se publica en el BOE el {ELECTION.boe}.</p>
        <ul>
          <li>Hasta que cada partido publique su programa de 2026, el buscador usa los del 23J de 2023 (Podemos: europeas de 2024), con aviso en cada ficha.</li>
          <li>Campaña prevista del {ELECTION.campaign}; {ELECTION.reflection}, jornada de reflexión.</li>
          <li>El test y «qué ocurrió en la legislatura» recogen leyes y votaciones de 2023 a 2026. No publicamos resultados agregados del test (la LOREG prohíbe sondeos desde el {ELECTION.pollBanFrom}).</li>
          <li>Las listas se presentan en los días siguientes a la convocatoria: candidaturas y posibles coaliciones se actualizarán entonces.</li>
        </ul>
        <p>Cuando un partido publique su programa de estas elecciones, se sustituye el de 2023. Los resúmenes los redacta Papeleta Abierta; la fuente original manda.</p>
      </details>

      <footer>Partidos incluidos: los cinco con presencia estatal en todas las circunscripciones. Los que solo se presentan en algunas comunidades (ERC, Junts, PNV, EH Bildu, BNG, CC) y SALF se añadirán cuando confirmen candidatura y programa. Consulta siempre el programa original.</footer>
    </div>
  );
}
