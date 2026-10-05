// Ingesta de programas electorales → data/chunks.json
// Uso: npm run ingest
// Para cada programa de data/programas.json usa el PDF local (campo "file") si existe;
// si no, lo descarga desde "pdf". Extrae el texto página a página y lo trocea.

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { extractText, getDocumentProxy } from "unpdf";

const CHUNK = 1100;   // caracteres por fragmento
const OVERLAP = 200;  // solape entre fragmentos de la misma página

const exists = p => access(p).then(() => true, () => false);
const programas = JSON.parse(await readFile("data/programas.json", "utf8"));
await mkdir("data/pdfs", { recursive: true });

const chunks = [];
for (const prog of programas) {
  let bytes;
  if (await exists(prog.file)) {
    bytes = new Uint8Array(await readFile(prog.file));
  } else if (prog.pdf) {
    process.stdout.write(`Descargando ${prog.party}… `);
    let res;
    try { res = await fetch(prog.pdf, { headers: { "user-agent": "Mozilla/5.0 PapeletaAbierta/0.1" } }); }
    catch (e) { console.warn(`ERROR de red (${e.cause?.code || e.message}). Descárgalo a mano en ${prog.file}`); continue; }
    if (!res.ok) { console.warn(`ERROR ${res.status}. Descárgalo a mano en ${prog.file}`); continue; }
    bytes = new Uint8Array(await res.arrayBuffer());
    if (String.fromCharCode(...bytes.slice(0, 4)) !== "%PDF") {
      console.warn(`la web devolvió una página en vez del PDF (protección antibots). Descárgalo desde el navegador y guárdalo como ${prog.file}`);
      continue;
    }
    await writeFile(prog.file, bytes);
    console.log("ok");
  } else {
    console.warn(`⚠ ${prog.party}: no hay PDF. Descárgalo desde ${prog.url} y guárdalo como ${prog.file}`);
    continue;
  }

  const pdf = await getDocumentProxy(bytes);
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  let n = 0;
  text.forEach((raw, i) => {
    const page = i + 1;
    const clean = raw.replace(/\s+/g, " ").trim();
    if (clean.length < 80) return; // portadas, páginas en blanco
    for (let start = 0; start < clean.length; start += CHUNK - OVERLAP) {
      const piece = clean.slice(start, start + CHUNK);
      if (piece.length < 80) break;
      chunks.push({ id: `${prog.party}-${page}-${n++}`, party: prog.party, page, text: piece });
    }
  });
  console.log(`${prog.party}: ${totalPages} páginas → ${n} fragmentos`);
}

await writeFile("data/chunks.json", JSON.stringify(chunks));
console.log(`\nGuardado data/chunks.json con ${chunks.length} fragmentos.`);
