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

export async function buscarEventos(filtros = {}, signal) {
  const parametros = new URLSearchParams({
    pagina: String(filtros.pagina ?? 1),
    porPagina: "12",
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