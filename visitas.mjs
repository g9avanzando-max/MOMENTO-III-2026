import { getStore } from "@netlify/blobs";

// Contador anónimo de uso. No guarda nombres, instituciones ni códigos: solo conteos.
const EVENTOS = ["visita", "ingreso", "docente", "pdf"];
const hoy = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
const vacio = () => ({ total: {}, dias: {} });

export default async (req) => {
  const store = getStore("m3-estadisticas");
  const url = new URL(req.url);

  if (req.method === "POST") {
    const e = url.searchParams.get("e");
    if (!EVENTOS.includes(e)) return new Response("evento invalido", { status: 400 });
    const d = (await store.get("stats", { type: "json" })) || vacio();
    d.total[e] = (d.total[e] || 0) + 1;
    const k = hoy();
    d.dias[k] = d.dias[k] || {};
    d.dias[k][e] = (d.dias[k][e] || 0) + 1;
    await store.setJSON("stats", d);
    return new Response(e === "visita" ? JSON.stringify({ n: d.total[e] }) : "ok", {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }

  if (req.method === "GET") {
    if (url.searchParams.get("public") === "1") {
      const t = ((await store.get("stats", { type: "json" })) || vacio()).total;
      return new Response(
        JSON.stringify({ visita: t.visita || 0, ingreso: t.ingreso || 0, docente: t.docente || 0, pdf: t.pdf || 0 }),
        { headers: { "content-type": "application/json", "cache-control": "no-store" } }
      );
    }
    const clave = process.env.STATS_KEY;
    if (!clave || url.searchParams.get("key") !== clave) {
      return new Response("no autorizado", { status: 401 });
    }
    const d = (await store.get("stats", { type: "json" })) || vacio();
    return new Response(JSON.stringify(d), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  return new Response("metodo no permitido", { status: 405 });
};

export const config = { path: "/api/visitas" };
