# Momento III · PTAFI 3.0 — versión para Netlify

Cada docente guarda y recupera su propio trabajo desde cualquier equipo, **sin cuenta de Claude**, con su **código DANE + un PIN personal**. Los datos viajan y se guardan **cifrados** (AES-GCM, clave derivada del DANE y el PIN en el navegador): quien administre el sitio no puede leerlos y nadie los recibe.

## Archivos
- `index.html` — la aplicación completa.
- `netlify/functions/m3.mjs` — función que guarda y entrega los registros (usa Netlify Blobs).
- `netlify.toml` y `package.json` — configuración.

## Publicar en Netlify (con GitHub)
1. Cree un repositorio en GitHub y suba **todo el contenido de esta carpeta** (conservando `netlify/functions/`).
2. En Netlify: *Add new site → Import an existing project* y elija ese repositorio.
3. Deje vacío el comando de compilación. Directorio de publicación: `.`
4. Pulse *Deploy*. Netlify detecta la función por `netlify.toml`; Blobs no necesita configuración adicional.
5. Compruebe: abra la dirección del sitio, ingrese con datos y un PIN, escriba algo, y desde otro navegador use «Recuperar mi trabajo» con el mismo DANE y PIN.

## Notas importantes
- **Si un docente olvida su PIN, el trabajo no se puede recuperar** (está cifrado). Pídales un PIN de 6 o más caracteres, mejor con letras y números, y distinto entre tutores de una misma institución.
- Un PIN corto o fácil de adivinar debilita la protección: el código DANE es público.
- Revise los límites de uso de su plan de Netlify según el número de docentes.
- Los PDF se generan en el navegador de cada docente; no pasan por el servidor.
