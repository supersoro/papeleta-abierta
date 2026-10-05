"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { COMUNIDADES, PROVINCIAS, partiesFor } from "@/lib/data";

const KEY = "papeleta-provincia";
type Ctx = {
  provincia: string | null;
  ready: boolean;
  setProvincia: (id: string | null) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};
const ProvinciaCtx = createContext<Ctx>({
  provincia: null, ready: false, setProvincia: () => {}, open: false, setOpen: () => {},
});

export function useProvincia() {
  return useContext(ProvinciaCtx);
}

/** Partidos de la provincia, o los cinco estatales si aún no hay elección. */
export function useVisibleParties(showAll = false) {
  const { provincia } = useProvincia();
  if (showAll) {
    const ids = new Set<string>();
    const out = [];
    for (const p of ["madrid", "barcelona", "navarra", "bizkaia", "coruna", "las-palmas"]) {
      for (const x of partiesFor(p)) {
        if (!ids.has(x.id)) { ids.add(x.id); out.push(x); }
      }
    }
    return out;
  }
  return partiesFor(provincia);
}

export function ProvinciaProvider({ children }: { children: React.ReactNode }) {
  const [provincia, setProv] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v && PROVINCIAS.some(p => p.id === v)) setProv(v);
      else setOpen(true);
    } catch { setOpen(true); }
    setReady(true);
  }, []);

  const setProvincia = (id: string | null) => {
    setProv(id);
    try {
      if (id) localStorage.setItem(KEY, id);
      else localStorage.removeItem(KEY);
    } catch {}
    setOpen(false);
  };

  return (
    <ProvinciaCtx.Provider value={{ provincia, ready, setProvincia, open, setOpen }}>
      {children}
    </ProvinciaCtx.Provider>
  );
}

export function ProvinciaLabel() {
  const { provincia, setOpen } = useProvincia();
  const name = PROVINCIAS.find(p => p.id === provincia)?.name;
  return (
    <button className="btn link where" type="button" onClick={() => setOpen(true)}>
      {name ? `Votas en ${name}` : "¿Dónde votas?"}
    </button>
  );
}

export function ProvinciaDialog() {
  const { open, setOpen, provincia, setProvincia } = useProvincia();
  const [abroad, setAbroad] = useState(false);
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-labelledby="prov-title" aria-modal="true">
      <div className="modal-card">
        <h2 id="prov-title">¿Dónde votas?</h2>
        <p className="lede">El test, el buscador y la comparativa muestran los partidos que se presentan en tu circunscripción. Se guarda solo en este navegador.</p>
        {!abroad ? (
          <>
            <label className="small" htmlFor="prov-sel">Provincia
              <select id="prov-sel" defaultValue={provincia || ""} onChange={e => { if (e.target.value) setProvincia(e.target.value); }}>
                <option value="" disabled>Elige una provincia</option>
                {COMUNIDADES.map(c => (
                  <optgroup key={c.name} label={c.name}>
                    {c.provincias.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <button className="btn link" type="button" onClick={() => setAbroad(true)}>Voto desde el extranjero</button>
          </>
        ) : (
          <>
            <p className="small">Si vives fuera, votas en la provincia donde estás inscrito en el censo (la de tu último domicilio en España, o la que figure en tu inscripción consular). Elige esa provincia:</p>
            <label className="small" htmlFor="prov-sel-ext">Provincia de inscripción
              <select id="prov-sel-ext" defaultValue="" onChange={e => { if (e.target.value) setProvincia(e.target.value); }}>
                <option value="" disabled>Elige una provincia</option>
                {COMUNIDADES.map(c => (
                  <optgroup key={c.name} label={c.name}>
                    {c.provincias.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <button className="btn link" type="button" onClick={() => setAbroad(false)}>Volver</button>
          </>
        )}
        {provincia && <button className="btn" type="button" onClick={() => setOpen(false)}>Cerrar</button>}
      </div>
    </div>
  );
}
