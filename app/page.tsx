"use client";
import { useEffect, useState } from "react";
import { Buscador } from "@/components/Buscador";
import { Test } from "@/components/Test";
import { Partidos, Temas } from "@/components/Partidos";
import { ProvinciaDialog, ProvinciaLabel, ProvinciaProvider } from "@/components/Provincia";
import { ELECTION } from "@/lib/data";

const TABS = [
  ["buscar", "Preguntar"],
  ["temas", "Comparar"],
  ["partidos", "Partidos"],
  ["test", "Test"],
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
    const apply = (id: string) => {
      if (TABS.some(t => t[0] === id)) setTab(id as Tab);
    };
    const onHash = () => apply(location.hash.slice(1));
    const onGo = (e: Event) => apply((e as CustomEvent<string>).detail);
    onHash();
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    window.addEventListener("papeleta:tab", onGo);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      window.removeEventListener("papeleta:tab", onGo);
    };
  }, []);
  const select = (t: Tab) => { setTab(t); history.replaceState(null, "", `#${t}`); };

  return (
    <ProvinciaProvider>
    <div className="wrap">
      <ProvinciaDialog />
      <header>
        <div className="eyebrow"><span>Elecciones generales · 29 de noviembre</span><span><Countdown /></span><ProvinciaLabel /></div>
        <p className="brand">Papeleta Abierta</p>
      </header>

      <nav className="tabs" role="tablist" aria-label="Qué puedes hacer">
        {TABS.map(([id, label]) => (
          <button key={id} className={`tab${id === "test" ? " quiet" : ""}`} role="tab" type="button" aria-selected={tab === id} onClick={() => select(id)}>{label}</button>
        ))}
      </nav>

      {tab === "buscar" && <Buscador />}
      {tab === "temas" && <Temas />}
      {tab === "partidos" && <Partidos />}
      {tab === "test" && <Test />}

      <details className="fineprint">
        <summary>Programas de 2023 · pendientes los de estas elecciones</summary>
        <p>Sánchez convocó el 5 de octubre las generales para el {ELECTION.label}, tras tumbar el Congreso dos decretos de vivienda. El decreto de disolución se publica en el BOE el {ELECTION.boe}.</p>
        <ul>
          <li>Hasta que cada partido publique su programa de 2026, el buscador usa los del 23J de 2023 (Podemos: europeas de 2024), con aviso en cada ficha.</li>
          <li>Campaña prevista del {ELECTION.campaign}; {ELECTION.reflection}, jornada de reflexión.</li>
          <li>Papeleta Abierta no publica resultados agregados de las respuestas de sus usuarios.</li>
          <li>Las listas se presentan en los días siguientes a la convocatoria: candidaturas y posibles coaliciones se actualizarán entonces.</li>
        </ul>
        <p>Cuando un partido publique su programa de estas elecciones, se añaden esos registros y se conservan los de 2023. Los resúmenes los redacta Papeleta Abierta; la fuente original manda.</p>
      </details>

      <footer>Los partidos estatales aparecen en todas las circunscripciones. ERC, Junts, EH Bildu, PNV, BNG, CC y UPN, solo donde se presentan. Las candidaturas de 2026 figuran como «por confirmar» hasta las listas (21-26 de octubre; definitivas el 3 de noviembre). <a href="/metodologia">Metodología</a> · <a href="/correcciones">Correcciones</a>. Consulta siempre el programa original.</footer>
    </div>
    </ProvinciaProvider>
  );
}
