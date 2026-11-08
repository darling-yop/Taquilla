# Taquilla

Taquilla es una aplicación web académica para explorar eventos. Presenta eventos destacados y próximos, permite buscar y filtrar el catálogo, consultar el detalle de un evento y utilizar formularios de cuenta conectados a una API.

## Tecnologías

- React 19
- Vite 8
- JavaScript con módulos ES
- CSS
- `fetch` para las solicitudes HTTP

El proyecto no declara un router, una biblioteca de componentes, TypeScript, un linter ni una biblioteca de pruebas.

## Requisitos

- Node.js y npm instalados. El repositorio no fija sus versiones.

## Instalación y ejecución

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

Vite muestra en la terminal la dirección local para abrir en el navegador.

Para comprobar la compilación de producción:

```bash
npx vite build
```

El comando de compilación anterior fue ejecutado durante la revisión y terminó correctamente. `package.json` no define un script `build`, y el script `test` es un marcador que termina con error; no hay una suite de pruebas configurada.

## Funcionalidades implementadas

- Inicio con textos bilingües (español e inglés), buscador y evento destacado.
- Listado de eventos destacados, próximos y categorías obtenidos de la API.
- Búsqueda por texto, ciudad y categoría, con paginación.
- Exploración del catálogo con filtros por categoría, ciudad y fecha. Los rangos y fechas predefinidas se filtran en el cliente porque el servicio no envía parámetros de fecha al endpoint de eventos.
- Vista de detalle de evento, con recinto, fecha, localidades, precios y disponibilidad, según los datos recibidos.
- Formularios para ingresar, crear una cuenta, verificar el correo y solicitar otro código de verificación.
- Consulta de sesión al iniciar la aplicación y cierre de sesión.
- Navegación interna basada en fragmentos de URL (`#...`), implementada en `App.jsx`.
- Interfaz adaptable mediante hojas de estilo CSS y variables de diseño.

La API actual no ofrece una operación de compra; el detalle informa que la compra no está disponible. La aplicación tampoco implementa favoritos ni preferencias persistentes de idioma o consentimiento. Hay textos relativos a preferencias de cookies en `src/data/interfaz.js`, pero ese archivo no se integra en el flujo de la aplicación.

## Arquitectura

La aplicación organiza el código por tipo de responsabilidad:

- **`src/components/`**: vistas y piezas de interfaz. Los componentes reciben datos y acciones mediante props; algunos, como `Explorar` y `DetalleEvento`, también coordinan hooks o solicitudes para sus vistas.
- **`src/services/`**: acceso a la API, adaptación de eventos al formato usado por la interfaz y preparación de contenido.
- **`src/hooks/`**: estado y efectos para cargar textos, eventos y ciudades.
- **`src/utils/`**: funciones de formato, cálculo de rangos de fecha y destinos compartidos.
- **`src/config/`**: valores identificadores del proyecto y una URL de API declarada.
- **`src/data/`**: datos de interfaz bilingües; `catalogo.js` está vacío en el estado revisado.
- **`src/context/`**: contiene datos de muestra en `PreferenciasContext.jsx`; actualmente no declara un Context de React ni está conectado al flujo principal.
- **`src/styles/` y `src/App.css`**: tokens, estilos globales y estilos de áreas de la interfaz.
- **`src/App.jsx`**: composición principal, resolución de rutas por hash y coordinación de estado entre las pantallas.
- **`src/main.jsx`**: montaje de React en el elemento `#root`.
- **`index.html`**: documento HTML de entrada de Vite.
- **`vite.config.js`**: configuración de Vite y su plugin de React.

### Estructura relevante

```text
.
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── App.css
    ├── main.jsx
    ├── components/
    ├── config/
    ├── context/
    ├── data/
    ├── hooks/
    ├── services/
    ├── styles/
    └── utils/
```

## Datos y API

La aplicación realiza solicitudes HTTP con `fetch`. El código usa la base `https://yanethm-taquilla-api.fly.dev/api/v1`; la URL aparece definida por separado en los servicios de eventos, cuenta y textos. Los endpoints invocados son:

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/textos?idioma=es` o `/textos?idioma=en` | Textos de interfaz remotos |
| `GET` | `/eventos/destacados` | Eventos destacados |
| `GET` | `/eventos?ciudad=...&porPagina=4` | Eventos próximos de la ciudad seleccionada por defecto |
| `GET` | `/categorias` | Categorías y conteos |
| `GET` | `/ciudades` | Opciones del filtro de ciudad |
| `GET` | `/eventos?pagina=...&porPagina=...` | Catálogo paginado; puede incluir `categoria`, `ciudad` y `q` |
| `GET` | `/eventos/{slug}` | Detalle de un evento |
| `POST` | `/sesion` | Iniciar sesión |
| `GET` | `/sesion` | Consultar la sesión actual |
| `DELETE` | `/sesion` | Cerrar sesión |
| `POST` | `/usuarios` | Crear una cuenta |
| `POST` | `/verificacion` | Verificar correo |
| `POST` | `/verificacion/reenviar` | Solicitar otro código de verificación |

Las solicitudes de cuenta envían credenciales con `credentials: "include"`. Los datos de evento recibidos se adaptan en `eventosService.js` antes de pasarlos a los componentes.

Esta tabla describe las solicitudes definidas en el código; no constituye una garantía de disponibilidad del servidor ni una especificación completa del backend.

## Configuración y datos estáticos

- `src/config/proyecto.js` declara el identificador, nombre y URL de API del proyecto.
- La URL efectiva usada por `src/hooks/useTextos.js`, `src/services/eventosService.js` y `src/services/cuentaService.js` está escrita directamente en esos archivos; no se lee desde `proyecto.js` ni desde variables `VITE_*` o un archivo `.env`.
- El idioma inicial es español y el cambio a inglés se conserva en el estado de React durante la sesión actual de la página; no se guarda en `localStorage`.
- Hay textos de respaldo en algunos componentes para ciertos estados o cuando faltan textos remotos.
- `src/data/interfaz.js` contiene textos para español e inglés, incluidos textos de preferencias que no se usan actualmente.
- `src/context/PreferenciasContext.jsx` contiene un catálogo de muestra, pero no se importa en el flujo principal.
- La temporada del texto de inicio tiene un valor fijo en `src/utils/textosInicio.js`.
- Los colores base y tipografía están en `src/styles/tokens.css`; la fuente Inter se solicita a Google Fonts desde CSS.

## Límites observados

- Los formularios de cuenta se conectan a los endpoints descritos, pero no existe flujo de compra de entradas.
- Las fechas no se envían como filtros al endpoint del catálogo; el filtrado por fecha se realiza en el cliente después de recuperar páginas de eventos.
- `App.jsx` concentra el enrutamiento por hash y buena parte de la coordinación entre vistas.
- `useCiudades` no expone un estado de carga o error y descarta silenciosamente un fallo de carga.
- La configuración y la base de API están duplicadas, y hay datos de muestra y textos que no forman parte del flujo actual.
- No se encontró una configuración de pruebas automatizadas.
