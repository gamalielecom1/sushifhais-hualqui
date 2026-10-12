# Sushi Fhais Hualqui — Registro

Landing page para capturar registros gratuitos (nombre, teléfono, correo y
cumpleaños) antes del lanzamiento. Guarda cada registro en una Google Sheet.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Google Apps Script como backend (sin servidor propio) para escribir en Sheets

## Poner en marcha

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Configura Google Sheets:
   - Crea una Google Sheet nueva.
   - Ve a **Extensiones > Apps Script**.
   - Borra el contenido por defecto y pega el código de [`apps-script/Code.gs`](apps-script/Code.gs).
   - Guarda y haz clic en **Implementar > Nueva implementación**.
   - Tipo: **Aplicación web**. Ejecutar como: **Yo**. Acceso: **Cualquier usuario**.
   - Copia la URL que te entrega (termina en `/exec`).

3. Crea tu archivo de entorno local:

   ```bash
   cp .env.local.example .env.local
   ```

   Y pega la URL del paso anterior en `NEXT_PUBLIC_SHEETS_ENDPOINT`.

4. Corre el proyecto en desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Deploy

Recomendado: [Vercel](https://vercel.com).

1. Sube este proyecto a un repositorio de GitHub.
2. Importa el repo en Vercel.
3. Agrega la variable de entorno `NEXT_PUBLIC_SHEETS_ENDPOINT` en la configuración del proyecto en Vercel (Settings > Environment Variables).
4. Deploy.

## Estructura

```
app/            Páginas (App Router de Next.js)
components/     Componentes React (formulario de registro)
apps-script/    Código de Google Apps Script para conectar con Sheets
```
