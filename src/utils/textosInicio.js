import { formatearFecha, formatearPrecio } from "./formato.js";

export function adaptarInicio(textos, { idioma = "es", evento } = {}) {
  const p = textos?.paginas?.inicio;
  if (!p) return undefined;

  const buscador = p.hero?.buscador;
  const destacado = p.hero?.destacado;
  const temporada = "nov – dic 2026";

  return {
    badge: p.hero?.etiquetas?.temporada?.replace("{temporada}", temporada),
    titulo: p.hero?.titulo,
    descripcion: p.hero?.subtitulo,
    buscador: {
      aria: textos.navbar?.buscador?.aria,
      que: buscador?.etiquetas?.que,
      quePlaceholder: buscador?.placeholders?.que,
      donde: buscador?.etiquetas?.donde,
      cuando: buscador?.etiquetas?.cuando,
      cuandoPlaceholder: buscador?.placeholders?.cuando,
      boton: buscador?.botones?.buscar,
    },
    populares: {
      etiqueta: buscador?.populares,
      items: Object.values(p.busquedasPopulares?.etiquetas ?? {}),
    },
    // Solo se agrega si hay evento; si no, Inicio usa su respaldo
    ...(evento && {
      destacado: {
        etiqueta: destacado?.etiqueta ?? textos.componentes?.destacado,
        titulo: evento.nombre,
        slug: evento.slug,
        colores: evento.colores,
        lugar: `${formatearFecha(evento.fecha, idioma)} · ${evento.recinto}`,
        precio: destacado?.desde?.replace(
          "{precio}",
          formatearPrecio(evento.precio, idioma),
        ),
        boton:
          destacado?.botones?.verEvento ??
          (idioma === "en" ? "View event" : "Ver evento"),
      },
    }),
  };
}