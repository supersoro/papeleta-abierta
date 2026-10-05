# Papeleta Abierta

Web de orientación de voto para las elecciones generales de España: buscador sobre los programas electorales con citas por página, test de afinidad, fichas de partidos y comparador por tema.

## Estructura

| Ruta | Qué contiene |
|---|---|
| `lib/data.ts` | Base común: partidos, temas, resúmenes de propuestas y preguntas del test con su posición por partido. **Es el único sitio donde se editan los contenidos.** |
| `data/programas.json` | Programas que se ingieren: título, enlace y PDF de cada partido. |
| `data/chunks.json` | Fragmentos de los programas con su página, generados por `npm run ingest`. Se sube al repositorio. |
| `scripts/ingest.mjs` | Lee los PDF, extrae el texto por página y genera `data/chunks.json`. |
| `lib/search.ts` | Búsqueda BM25 en memoria sobre los fragmentos. |
| `lib/ask.ts` | Envía a Claude los fragmentos relevantes de cada partido y valida las citas: las páginas salen siempre del índice, nunca del modelo. |
| `app/api/ask/route.ts` | Endpoint del buscador, con límites de uso. |
| `components/` | Las cuatro secciones de la web. |

## Puesta en marcha en local

```bash
npm install
cp .env.example .env.local   # y pega tu ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

## Cargar los programas

Algunas webs de partidos bloquean las descargas automáticas. Descarga cada PDF desde el navegador y guárdalo con estos nombres:

| Partido | Guardar como | Dónde descargarlo |
|---|---|---|
| PP | `data/pdfs/pp-2023.pdf` | pp.es → programa electoral generales 2023 |
| PSOE | `data/pdfs/psoe-2023.pdf` | https://www.psoe.es/media-content/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023.pdf |
| Vox | `data/pdfs/vox-2023.pdf` | Ya incluido en `data/chunks.json` |
| Sumar | `data/pdfs/sumar-2023.pdf` | https://movimientosumar.es/programa-electoral-23j/ |
| Podemos | `data/pdfs/podemos-2024.pdf` | https://podemos.info/wp-content/uploads/2024/05/Programa-PODEMOS-elecciones-europeas-2024.pdf |

Después:

```bash
npm run ingest                                   # regenera data/chunks.json
npm run test:search -- "precio del alquiler"     # comprueba qué fragmentos encuentra, sin gastar API
git add data/chunks.json && git commit -m "Actualiza programas" && git push
```

Si en `data/programas.json` añades el enlace directo al PDF en el campo `pdf`, las citas del buscador abrirán el PDF en la página exacta. Mientras un partido no tenga PDF cargado, el buscador responde sobre sus resúmenes de `lib/data.ts` y lo indica.

Cuando salgan los programas de 2027, sustituye los PDF y los enlaces en `data/programas.json`, vuelve a ejecutar la ingesta y revisa los resúmenes y posiciones de `lib/data.ts`.

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En vercel.com → *Add New Project* → importa el repositorio. Vercel detecta Next.js solo.
3. En *Environment Variables* añade `ANTHROPIC_API_KEY` y, si quieres, `RATE_LIMIT_PER_MINUTE` (5 por defecto) y `DAILY_LIMIT` (2.000 preguntas al día por defecto).
4. *Deploy*. Cada `git push` vuelve a desplegar.

Para producción, crea una base Upstash Redis gratuita (desde el Marketplace de Vercel) y añade `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`. Sin ella los límites se cuentan por instancia del servidor, lo que basta para pruebas pero no frena un uso abusivo.

Fija también un límite de gasto mensual en console.anthropic.com.

## Privacidad y normativa

- Las respuestas del test se calculan y guardan solo en el navegador del usuario (opiniones políticas: datos de categoría especial, art. 9 RGPD).
- El buscador no guarda las preguntas. Las IP solo se usan, como hash, para el límite por minuto.
- No publiques estadísticas agregadas de resultados: en los cinco días previos a la votación la LOREG prohíbe difundir sondeos.
