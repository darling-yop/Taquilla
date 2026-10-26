// Reemplaza {llaves} en un texto: "Próximamente en {ciudad}" → "... Manizales"
function plantilla(texto = "", valores = {}) {
  return texto.replace(/\{(\w+)\}/g, (m, clave) => valores[clave] ?? m);
}

export function construirContenido(datos, textos, idioma, ciudad) {
  const { destacados, proximos, categorias } = datos;
  const ingles = idioma === "en";

  const inicio = textos?.paginas?.inicio;
  const nombres = textos?.general?.categorias ?? {};
  const conteo = inicio?.categorias?.eventos;

  const nombresCategoria = Object.fromEntries(
    categorias.map((c) => [c.id, nombres[c.id] ?? c.nombre]),
  );

  return {
    categorias: {
      titulo: nombres.todas ?? "",
      items: categorias.map((c) => ({
        clave: c.id,
        nombre: nombresCategoria[c.id],
        conteo: plantilla(c.eventos === 1 ? conteo?.uno : conteo?.otro, {
          cantidad: c.eventos,
        }),
      })),
    },
    etiquetas: {
      desde: textos?.componentes?.precio?.desde ?? (ingles ? "From" : "Desde"),
      verEvento:
        inicio?.tarjeta?.botones?.verEvento ??
        (ingles ? "View event" : "Ver evento"),
      verTodos: textos?.general?.acciones?.verTodos ?? (ingles ? "See all" : "Ver todos"),
    },
    nombresCategoria,
    destacados: {
      id: "destacados",
      titulo: inicio?.destacados?.titulo ?? "",
      subtitulo: inicio?.destacados?.subtitulo ?? "",
      eventos: destacados,
    },
    proximos: {
      id: "proximos",
      titulo: plantilla(inicio?.proximos?.titulo, { ciudad }),
      subtitulo: inicio?.proximos?.subtitulo ?? "",
      eventos: proximos,
    },
  };
}