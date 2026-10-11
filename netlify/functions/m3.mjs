import { getStore } from "@netlify/blobs";

// Guarda y entrega, tal cual llegan, los trabajos de los docentes.
// El contenido llega CIFRADO desde el navegador: el servidor no puede leerlo.
export default async (req) => {
  const store = getStore("m3-trabajos");
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^[0-9a-f]{64}$/.test(id)) return new Response("id invalido", { status: 400 });

  if (req.method === "GET") {
    const v = await store.get(id, { type: "text" });
    if (v === null || v === undefined) return new Response("", { status: 404 });
    return new Response(v, { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  if (req.method === "PUT") {
    const body = await req.text();
    if (body.length > 600000) return new Response("demasiado grande", { status: 413 });
    await store.set(id, body);
    return new Response("ok", { headers: { "cache-control": "no-store" } });
  }
  return new Response("metodo no permitido", { status: 405 });
};

export const config = { path: "/api/m3" };
