# Taquilla

Taquilla es una aplicación web académica para explorar eventos. Usa Next.js
con App Router, React, TypeScript y CSS.

## Requisitos

- Node.js 20.9 o posterior
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la dirección local que indique Next.js en la terminal.

## Variables de entorno

La URL base de la API se configura con `NEXT_PUBLIC_API_URL`. Copia
`.env.example` a `.env.local` para personalizarla en tu equipo:

```env
NEXT_PUBLIC_API_URL=https://yanethm-taquilla-api.fly.dev/api/v1
```

La URL tiene un valor predeterminado para que el proyecto funcione sin
configuración adicional. Esta variable es pública porque las solicitudes se
hacen desde el navegador; no pongas secretos ni credenciales en variables
`NEXT_PUBLIC_*`.

## Verificaciones

```bash
npm run build
npm run lint
npm run format:check
npm run typecheck
```

## Funcionalidades

- Inicio bilingüe (español e inglés), con selector de idioma.
- Búsqueda y filtros de eventos por texto, ciudad, fecha y categoría.
- Secciones de eventos destacados y de Manizales.
- Diálogo con el detalle de cada evento y acceso a cuenta informativo.
- Preferencias de cookies para consentimiento y persistencia opcional del idioma.
- Diseño adaptable con estilos globales y variables de diseño.

El catálogo usado por la página está en `src/data/catalogo.ts`. La migración
conserva los datos y la lógica que ya existían. El servicio HTTP está definido
en `src/services/api.ts`; la página de inicio actual no solicita eventos a ese
servicio. El flujo de compra y el acceso real a cuentas no están implementados.

## Estructura

- `src/app/`: layout raíz, metadatos, fuente global y página de inicio.
- `src/components/`: componentes de interfaz y sus hojas de estilo.
- `src/context/`: preferencias de idioma y consentimiento.
- `src/hooks/`: estado para filtros, detalles y carga de recursos.
- `src/services/`: solicitudes HTTP y almacenamiento de preferencias en cookies.
- `src/data/`: catálogo y textos de interfaz.
- `src/styles/`: tokens de diseño y estilos globales.
- `src/types.ts`: tipos compartidos de eventos, filtros y detalles.

TypeScript está configurado con `strict: true`; los alias `@/` apuntan a `src/`.
