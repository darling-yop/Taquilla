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
- Traducciones de navegación y pantallas obtenidas desde `/textos?idioma=es|en`;
  el selector guarda la preferencia del idioma entre visitas.
- Listado adaptable en `/explorar` con seis eventos de muestra, tarjetas,
  chips de filtros removibles y ordenamiento por fecha o precio.
- Secciones de eventos destacados y de Manizales.
- Diálogo con el detalle de cada evento y acceso a cuenta informativo.
- Preferencias de cookies con aviso en la primera visita, aceptar/rechazar,
  configuración de la cookie opcional de idioma y persistencia de la decisión.
- Panel de accesibilidad con tamaño de texto, alto contraste, subrayado de
  enlaces y reducción de animaciones; sus ajustes se conservan en el navegador.
- Diseño adaptable con estilos globales y variables de diseño.

La página de inicio obtiene eventos destacados, categorías y eventos de
Manizales desde la API. `/explorar` presenta seis eventos mock definidos en
`src/data/eventosMock.ts` para reproducir la referencia visual; los filtros
activos y el orden elegido se conservan en la URL. Las traducciones del
servicio y sus textos alternativos están en `src/services/textos.ts`. El idioma
elegido se persiste en el almacenamiento local para mantener la interfaz al
navegar o recargar; la cookie de idioma solo se guarda cuando se aceptan las
preferencias opcionales. Si falla la API de textos, se muestran textos locales
y aparece una opción de reintento. Las solicitudes HTTP y los estados de carga
están en `src/services/api.ts` y los hooks bajo `src/hooks/`. `src/data/catalogo.ts`
contiene utilidades de formato y búsqueda. El flujo de compra y el acceso real a
cuentas no están implementados.

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
