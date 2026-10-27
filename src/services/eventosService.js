import { filtrarPorFecha, rangoDeFiltros } from "../utils/fechas.js";
const API = "https://yanethm-taquilla-api.fly.dev/api/v1";

async function pedir(ruta, signal) {
  const respuesta = await fetch(`${API}${ruta}`, { signal });

  if (!respuesta.ok) {
    throw new Error(`${ruta} respondió ${respuesta.status}`);
  }

  const json = await respuesta.json();
  return json.datos ?? [];
}

// Convierte un evento de la API a la forma que usan los componentes
export function adaptarEvento(e) {
  return {
    id: e.id,
    slug: e.slug,
    categoria: e.categoria,
    nombre: e.titulo,
    recinto: e.recinto?.nombre ?? "",
    lugar: [e.recinto?.nombre, e.recinto?.ciudad].filter(Boolean).join(", "),
    fecha: e.fecha,
    precio: e.precioDesde,
    colores: [e.afiche?.color1 ?? "#a79fd0", e.afiche?.color2 ?? "#c4909a"],
    agotado: e.disponibilidad?.agotado ?? false,
  };
}

export const pedirDestacados = (signal) =>
  pedir("/eventos/destacados", signal).then((lista) => lista.map(adaptarEvento));

export const pedirCategorias = (signal) => pedir("/categorias", signal);

export const pedirCiudades = (signal) => pedir("/ciudades", signal);

export const pedirProximos = (ciudad, signal) =>
  pedir(
    `/eventos?ciudad=${encodeURIComponent(ciudad)}&porPagina=4`,
    signal,
  ).then((lista) => lista.map(adaptarEvento));

  const POR_PAGINA = 12;
// AJUSTAR: si la API rechaza 50, baja a 12. El código funciona con cualquier valor que acepte.
const POR_PAGINA_TODOS = 50;

async function pedirPagina(filtros, pagina, porPagina, signal) {
  const parametros = new URLSearchParams({
    pagina: String(pagina),
    porPagina: String(porPagina),
  });

  if (filtros.categoria) parametros.set("categoria", filtros.categoria);
  if (filtros.ciudad) parametros.set("ciudad", filtros.ciudad);
  if (filtros.q) parametros.set("q", filtros.q);

  const respuesta = await fetch(`${API}/eventos?${parametros}`, { signal });
  if (!respuesta.ok) {
    throw new Error(`/eventos respondió ${respuesta.status}`);
  }

  const json = await respuesta.json();
  return {
    eventos: (json.datos ?? []).map(adaptarEvento),
    paginacion: json.paginacion ?? null,
  };
}

export async function buscarEventos(filtros = {}, signal) {
  const rango = rangoDeFiltros(filtros);
  const pagina = Number(filtros.pagina ?? 1);

  // Sin filtro de fecha: la API pagina por nosotros
  if (!rango) return pedirPagina(filtros, pagina, POR_PAGINA, signal);

  // La API no filtra por fecha: se piden todas las páginas del resto de
  // filtros, se filtra por día aquí y se vuelve a paginar.
  const primera = await pedirPagina(filtros, 1, POR_PAGINA_TODOS, signal);
  const totalPaginas = primera.paginacion?.paginas ?? 1;

  const restantes = await Promise.all(
    Array.from({ length: totalPaginas - 1 }, (_, i) =>
      pedirPagina(filtros, i + 2, POR_PAGINA_TODOS, signal),
    ),
  );

  const filtrados = filtrarPorFecha(
    [primera, ...restantes].flatMap((p) => p.eventos),
    rango,
  ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const actual = Math.min(pagina, paginas);

  return {
    eventos: filtrados.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA),
    paginacion: { pagina: actual, paginas, total: filtrados.length },
  };
}

export async function pedirDetalleEvento(slug, signal) {
  const respuesta = await fetch(
    `${API}/eventos/${encodeURIComponent(slug)}`,
    { signal },
  );

  if (!respuesta.ok) {
    throw new Error(`/eventos/${slug} respondió ${respuesta.status}`);
  }

  return respuesta.json();
}