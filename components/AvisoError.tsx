"use client";
import { useState } from "react";
import { PARTIES } from "@/lib/data";
import { AFIRMACIONES } from "@/lib/posiciones";

type Props = {
  partido?: string;
  afirmacion?: string;
  label?: string;
};

export function AvisoError({ partido = "", afirmacion = "", label = "¿Ves un error?" }: Props) {
  const [open, setOpen] = useState(false);
  const [p, setP] = useState(partido);
  const [a, setA] = useState(afirmacion);
  const [que, setQue] = useState("");
  const [fuente, setFuente] = useState("");
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  function openForm() {
    setP(partido);
    setA(afirmacion);
    setOpen(true);
    setOk(false);
    setErr("");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErr("");
    try {
      const r = await fetch("/api/aviso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partido: p, afirmacion: a, que, fuente, email, consentimiento: consent }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) setErr(data.error || "No se pudo enviar.");
      else { setOk(true); setQue(""); setFuente(""); setEmail(""); setConsent(false); }
    } catch {
      setErr("No hay conexión.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button className="btn link error-link" type="button" onClick={openForm}>{label}</button>
      {open && (
        <div className="modal" role="dialog" aria-labelledby="aviso-title" aria-modal="true">
          <div className="modal-card">
            <h2 id="aviso-title">¿Ves un error?</h2>
            {ok ? (
              <>
                <p>Gracias. Revisamos todos los avisos y publicamos cada cambio en el <a href="/correcciones">registro de correcciones</a>.</p>
                <button className="btn" type="button" onClick={() => setOpen(false)}>Cerrar</button>
              </>
            ) : (
              <form className="aviso-form" onSubmit={send}>
                <label className="small">Partido
                  <select value={p} onChange={e => setP(e.target.value)}>
                    <option value="">No estoy seguro</option>
                    {PARTIES.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                </label>
                <label className="small">Afirmación o dato
                  <select value={a} onChange={e => setA(e.target.value)}>
                    <option value="">No estoy seguro</option>
                    <option value="buscador">Una respuesta del buscador</option>
                    {AFIRMACIONES.map(x => <option key={x.id} value={x.id}>{x.enunciado}</option>)}
                  </select>
                </label>
                <label className="small">Qué está mal
                  <textarea required minLength={8} maxLength={1200} rows={4} value={que} onChange={e => setQue(e.target.value)} />
                </label>
                <label className="small">Fuente alternativa (opcional)
                  <input type="url" value={fuente} onChange={e => setFuente(e.target.value)} placeholder="https://…" />
                </label>
                <label className="small">Correo (opcional, solo para responderte)
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                {email && (
                  <label className="weight">
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                    Consiento que uséis este correo solo para responder a este aviso.
                  </label>
                )}
                {err && <p className="err">{err}</p>}
                <div className="row">
                  <button className="btn" type="button" onClick={() => setOpen(false)}>Cancelar</button>
                  <button className="btn primary" type="submit" disabled={sending}>Enviar aviso</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
