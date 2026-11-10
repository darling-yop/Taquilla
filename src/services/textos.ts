import { interfaz } from "../data/interfaz";
import type { Idioma } from "../data/interfaz";
import type { TextosAplicacion } from "../data/textos";
import type { CategoriaEvento } from "../types";
import { consultar } from "./api";

interface Registro {
  [clave: string]: unknown;
}

interface RespuestaTextos {
  idioma: string;
  textos: unknown;
}

const nombresCategoria: Record<CategoriaEvento, string> = {
  Conciertos: "conciertos",
  Teatro: "teatro",
  Deportes: "deportes",
  Festivales: "festivales",
  Comedia: "comedia",
  Familiares: "familiares",
};

function esRegistro(valor: unknown): valor is Registro {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function obtener(valor: unknown, ruta: string, alternativo: string): string {
  const resultado = ruta.split(".").reduce<unknown>((actual, clave) => {
    return esRegistro(actual) ? actual[clave] : undefined;
  }, valor);
  return typeof resultado === "string" && resultado.trim()
    ? resultado
    : alternativo;
}

function interpolar(texto: string, valores: Record<string, string>): string {
  return Object.entries(valores).reduce(
    (resultado, [clave, valor]) => resultado.replaceAll(`{${clave}}`, valor),
    texto,
  );
}

export function adaptarTextos(
  respuesta: RespuestaTextos,
  idioma: Idioma,
): TextosAplicacion {
  if (
    respuesta.idioma !== idioma ||
    !esRegistro(respuesta.textos) ||
    !esRegistro(respuesta.textos.navbar) ||
    !esRegistro(respuesta.textos.paginas)
  ) {
    throw new Error(
      "La API devolvió traducciones incompletas o de otro idioma.",
    );
  }

  const api = respuesta.textos;
  const t = (ruta: string, alternativo: string) =>
    obtener(api, ruta, alternativo);
  const local = interfaz[idioma];
  const categoriaFallback: Record<CategoriaEvento, string> = {
    Conciertos: idioma === "en" ? "Concerts" : "Conciertos",
    Teatro: idioma === "en" ? "Theatre" : "Teatro",
    Deportes: idioma === "en" ? "Sports" : "Deportes",
    Festivales: idioma === "en" ? "Festivals" : "Festivales",
    Comedia: idioma === "en" ? "Comedy" : "Comedia",
    Familiares: idioma === "en" ? "Family" : "Familiares",
  };
  const valorCategoria = (categoria: CategoriaEvento) =>
    t(
      `general.categorias.${nombresCategoria[categoria]}`,
      categoriaFallback[categoria],
    );
  const textosInterfaz = {
    ...local,
    explora: local.explora,
    cuenta: t("footer.columnas.cuenta.titulo", local.cuenta),
    saltar: t("general.aria.saltarAlContenido", local.saltar),
  };

  const categorias = Object.fromEntries(
    (Object.keys(nombresCategoria) as CategoriaEvento[]).map((categoria) => [
      categoria,
      valorCategoria(categoria),
    ]),
  ) as Record<CategoriaEvento, string>;

  const home = "paginas.inicio";
  const explore = "paginas.explorar";
  const states = "estados";

  return {
    interfaz: textosInterfaz,
    logoAria: t(
      "navbar.logo.aria",
      idioma === "en"
        ? "Taquilla, go to the home page"
        : "Taquilla, ir al inicio",
    ),
    idiomas: {
      es: t("idioma.es", "Español"),
      en: t("idioma.en", "English"),
    },
    categorias,
    inicio: {
      tituloSeo: t(
        `${home}.seo.titulo`,
        idioma === "en"
          ? "Taquilla · Concerts, theatre, sports and festivals"
          : "Taquilla · Conciertos, teatro, deportes y festivales",
      ),
      descripcionSeo: t(
        `${home}.seo.descripcion`,
        idioma === "en"
          ? "Search events by category, date or city and see all their details."
          : "Busca eventos por categoría, fecha o ciudad y consulta todos sus detalles.",
      ),
      temporada: t(
        `${home}.hero.etiquetas.temporada`,
        "Temporada nov – dic 2026",
      ),
      titulo: t(
        `${home}.hero.titulo`,
        idioma === "en"
          ? "Your next night starts here"
          : "Tu próxima noche empieza aquí",
      ),
      subtitulo: t(
        `${home}.hero.subtitulo`,
        idioma === "en"
          ? "Concerts, theatre, sports and festivals. Search by category, date or city and discover each event."
          : "Conciertos, teatro, deportes y festivales. Busca por categoría, fecha o ciudad y consulta cada evento.",
      ),
      populares: t(
        `${home}.hero.buscador.populares`,
        idioma === "en" ? "Popular:" : "Populares:",
      ),
      buscador: {
        que: t(
          `${home}.hero.buscador.etiquetas.que`,
          idioma === "en" ? "What" : "Qué",
        ),
        donde: t(
          `${home}.hero.buscador.etiquetas.donde`,
          idioma === "en" ? "Where" : "Dónde",
        ),
        cuando: t(
          `${home}.hero.buscador.etiquetas.cuando`,
          idioma === "en" ? "When" : "Cuándo",
        ),
        eventoArtista: t(
          `${home}.hero.buscador.placeholders.que`,
          idioma === "en" ? "Event or artist" : "Evento o artista",
        ),
        todasCiudades: t(
          "general.categorias.todas",
          idioma === "en" ? "All cities" : "Todas las ciudades",
        ),
        cualquierFecha: t(
          `${home}.hero.buscador.placeholders.cuando`,
          idioma === "en" ? "Any date" : "Cualquier fecha",
        ),
        buscar: t(
          `${home}.hero.buscador.botones.buscar`,
          idioma === "en" ? "Search" : "Buscar",
        ),
        aria: t(
          "navbar.buscador.aria",
          idioma === "en" ? "Find events" : "Buscar eventos",
        ),
        categorias:
          idioma === "en" ? "Event categories" : "Categorías de eventos",
        cargarCategorias:
          idioma === "en"
            ? "Loading event categories"
            : "Cargando categorías de eventos",
        eventos: t(
          `${home}.categorias.eventos.otro`,
          idioma === "en" ? "{cantidad} events" : "{cantidad} eventos",
        ),
        evento: t(
          `${home}.categorias.eventos.uno`,
          idioma === "en" ? "{cantidad} event" : "{cantidad} evento",
        ),
        destacado: t(
          `${home}.hero.destacado.etiqueta`,
          idioma === "en" ? "Featured" : "Destacado",
        ),
        desde: t(
          `${home}.hero.destacado.desde`,
          idioma === "en" ? "From {precio}" : "Desde {precio}",
        ),
        verEvento: t(
          `${home}.hero.destacado.botones.verEvento`,
          idioma === "en" ? "View event" : "Ver evento",
        ),
      },
      destacados: t(
        `${home}.destacados.titulo`,
        idioma === "en" ? "Featured events" : "Eventos destacados",
      ),
      descripcionDestacados: t(
        `${home}.destacados.subtitulo`,
        idioma === "en"
          ? "Explore our event selection"
          : "Explora nuestra selección de eventos",
      ),
      resultadosBusqueda:
        idioma === "en" ? "Search results" : "Resultados de búsqueda",
      resultados: t(
        `${explore}.resultadosCorto.otro`,
        idioma === "en" ? "{cantidad} results" : "{cantidad} resultados",
      ),
      manizales: interpolar(
        t(
          `${home}.proximos.titulo`,
          idioma === "en" ? "Events in {ciudad}" : "Eventos en {ciudad}",
        ),
        { ciudad: "Manizales" },
      ),
      descripcionManizales: t(
        `${home}.proximos.subtitulo`,
        idioma === "en"
          ? "Discover events in your city"
          : "Descubre los eventos de tu ciudad",
      ),
      cargarDestacados: t(
        `${states}.cargando.indicador`,
        idioma === "en" ? "Loading featured events…" : "Cargando destacados…",
      ),
      errorDestacados: t(
        `${states}.error.texto`,
        idioma === "en"
          ? "We couldn't load featured events."
          : "No pudimos cargar los eventos destacados.",
      ),
      sinDestacados:
        idioma === "en"
          ? "There are no featured events right now."
          : "No hay eventos destacados por ahora.",
      errorCategorias: t(
        `${states}.error.texto`,
        idioma === "en"
          ? "We couldn't load event categories."
          : "No pudimos cargar las categorías de eventos.",
      ),
      eventoEjemplo:
        idioma === "en"
          ? "Sample event. Tickets are not for sale."
          : "Evento de ejemplo. No hay venta de entradas.",
    },
    explorar: {
      eyebrow: t(
        `${explore}.filtros.titulo`,
        idioma === "en" ? "Filters" : "Filtros",
      ),
      titulo: t(
        `${explore}.seo.titulo`,
        idioma === "en"
          ? "Explore events · Taquilla"
          : "Explorar eventos · Taquilla",
      ),
      tituloSeo: t(
        `${explore}.seo.titulo`,
        idioma === "en"
          ? "Explore events · Taquilla"
          : "Explorar eventos · Taquilla",
      ),
      descripcionSeo: t(
        `${explore}.seo.descripcion`,
        idioma === "en"
          ? "Filter events by category, date, city and price."
          : "Filtra eventos por categoría, fecha, ciudad y precio.",
      ),
      descripcion: t(
        `${explore}.seo.descripcion`,
        idioma === "en"
          ? "Filter events by category, date, city and price."
          : "Filtra eventos por categoría, fecha, ciudad y precio.",
      ),
      filtroAria: idioma === "en" ? "Filter events" : "Filtrar eventos",
      tituloFiltros: t(
        `${explore}.filtros.titulo`,
        idioma === "en" ? "Filters" : "Filtros",
      ),
      eventoArtista: t(
        `${home}.hero.buscador.etiquetas.que`,
        idioma === "en" ? "Event or artist" : "Evento o artista",
      ),
      buscarEventos: t(
        `${home}.hero.buscador.placeholders.que`,
        idioma === "en" ? "Search events" : "Buscar eventos",
      ),
      categoria: t(
        `${explore}.filtros.categoria`,
        idioma === "en" ? "Category" : "Categoría",
      ),
      todasCategorias: t(
        "general.categorias.todas",
        idioma === "en" ? "All categories" : "Todas las categorías",
      ),
      ciudad: t(
        `${explore}.filtros.ciudad`,
        idioma === "en" ? "City" : "Ciudad",
      ),
      todasCiudades: t(
        "general.categorias.todas",
        idioma === "en" ? "All cities" : "Todas las ciudades",
      ),
      fecha: t(
        `${explore}.filtros.fecha.titulo`,
        idioma === "en" ? "Date" : "Fecha",
      ),
      hoy: idioma === "en" ? "Today" : "Hoy",
      esteFinDeSemana: idioma === "en" ? "This weekend" : "Este fin de semana",
      esteMes: idioma === "en" ? "This month" : "Este mes",
      elegirFechas: idioma === "en" ? "Choose dates" : "Elegir fechas",
      fechaInicio: idioma === "en" ? "Start date" : "Fecha de inicio",
      fechaFin: idioma === "en" ? "End date" : "Fecha de fin",
      precio: idioma === "en" ? "Price" : "Precio",
      precioMinimo: idioma === "en" ? "Minimum price" : "Precio mínimo",
      precioMaximo: idioma === "en" ? "Maximum price" : "Precio máximo",
      filtrosActivos: idioma === "en" ? "Active filters" : "Filtros activos",
      orden: t(
        `${explore}.orden.etiqueta`,
        idioma === "en" ? "Sort by:" : "Ordenar por:",
      ),
      ordenFecha: t(
        `${explore}.orden.opciones.fecha`,
        idioma === "en" ? "Soonest date" : "Fecha más próxima",
      ),
      ordenPrecio: t(
        `${explore}.orden.opciones.precio`,
        idioma === "en" ? "Lowest price" : "Precio más bajo",
      ),
      ordenPrecioMayor: idioma === "en" ? "Highest price" : "Precio más alto",
      ordenPopularidad: t(
        `${explore}.orden.opciones.popularidad`,
        idioma === "en" ? "Most popular" : "Más populares",
      ),
      aplicar: t(
        `${explore}.filtros.botones.verResultados`,
        idioma === "en" ? "Apply filters" : "Aplicar filtros",
      ),
      limpiar: t(
        `${explore}.filtros.botones.limpiar`,
        idioma === "en" ? "Clear" : "Limpiar",
      ),
      tituloResultados: idioma === "en" ? "Events" : "Eventos",
      cargando: t(
        `${states}.cargando.indicador`,
        idioma === "en" ? "Loading events…" : "Cargando eventos…",
      ),
      resultadoUno: t(
        `${explore}.resultadosCorto.uno`,
        idioma === "en" ? "{cantidad} event" : "{cantidad} evento",
      ),
      resultados: t(
        `${explore}.resultadosCorto.otro`,
        idioma === "en" ? "{cantidad} events" : "{cantidad} eventos",
      ),
      errorOpciones:
        idioma === "en"
          ? "Some filter options couldn't be loaded."
          : "No se pudieron cargar algunas opciones de filtro.",
      reintentarCategorias:
        idioma === "en" ? "Retry categories" : "Reintentar categorías",
      reintentarCiudades:
        idioma === "en" ? "Retry cities" : "Reintentar ciudades",
      errorCatalogo: t(
        `${states}.error.texto`,
        idioma === "en"
          ? "We couldn't load the catalog. Check your connection and try again."
          : "No pudimos cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.",
      ),
      sinResultados: t(
        `${explore}.vacio.titulo`,
        idioma === "en" ? "No events found" : "No encontramos eventos",
      ),
      sinResultadosDescripcion: t(
        `${explore}.vacio.texto`,
        idioma === "en"
          ? "Try changing or clearing your filters."
          : "Prueba cambiando o limpiando los filtros.",
      ),
      navPaginas: t(
        "componentes.paginacion.aria.etiqueta",
        idioma === "en" ? "Event pages" : "Páginas de eventos",
      ),
      anterior: t(
        `${explore}.paginacion.anterior`,
        idioma === "en" ? "Previous" : "Anterior",
      ),
      siguiente: t(
        `${explore}.paginacion.siguiente`,
        idioma === "en" ? "Next" : "Siguiente",
      ),
      pagina: idioma === "en" ? "Page" : "Página",
      de: idioma === "en" ? "of" : "de",
      reintentar: t(
        `${states}.error.botones.reintentar`,
        idioma === "en" ? "Try again" : "Reintentar",
      ),
    },
    comun: {
      desde: t(`${home}.tarjeta.desde`, idioma === "en" ? "From" : "Desde"),
      verEvento: t(
        `${home}.tarjeta.botones.verEvento`,
        idioma === "en" ? "View event" : "Ver evento",
      ),
      cargandoEventos: t(
        `${states}.cargando.indicador`,
        idioma === "en" ? "Loading events" : "Cargando eventos",
      ),
      errorEventos: t(
        `${states}.error.texto`,
        idioma === "en"
          ? "We couldn't load events. Check your connection and try again."
          : "No pudimos cargar los eventos. Revisa tu conexión e inténtalo de nuevo.",
      ),
      reintentar: t(
        `${states}.error.botones.reintentar`,
        idioma === "en" ? "Try again" : "Reintentar",
      ),
      noEncontrados: t(
        `${explore}.vacio.titulo`,
        idioma === "en" ? "No events found" : "No encontramos eventos",
      ),
      probarOtraBusqueda: t(
        `${explore}.vacio.texto`,
        idioma === "en" ? "Try another search." : "Prueba con otra búsqueda.",
      ),
      cerrar: t(
        "general.aria.cerrarDialogo",
        idioma === "en" ? "Close" : "Cerrar",
      ),
      errorTraducciones:
        idioma === "en"
          ? "Translations could not be loaded. Showing local text."
          : "No se pudieron cargar las traducciones. Se muestran textos locales.",
    },
    pie: {
      descripcion: t(
        "footer.lema",
        idioma === "en"
          ? "Concerts, theatre, sports and festivals in one place."
          : "Conciertos, teatro, deportes y festivales en un solo lugar.",
      ),
      explorar: t("footer.columnas.explora.titulo", local.explora),
      cuenta: t("footer.columnas.cuenta.titulo", local.cuenta),
      inicio: t("footer.columnas.explora.enlaces.inicio", local.inicio),
      eventos: t(
        "footer.columnas.explora.enlaces.explorar",
        idioma === "en" ? "Explore events" : "Explorar eventos",
      ),
      ingresar: t("footer.columnas.cuenta.enlaces.ingresar", local.ingresar),
      registro: t("footer.columnas.cuenta.enlaces.crearCuenta", local.registro),
      derechos: interpolar(
        t("footer.legal.derechos", `© {anio} Taquilla · ${local.academico}`),
        { anio: String(new Date().getFullYear()) },
      ),
    },
    cuenta: {
      ingresar: t(
        "paginas.ingresar.formulario.titulo",
        idioma === "en" ? "Log in" : "Iniciar sesión",
      ),
      registro: t(
        "paginas.registro.formulario.titulo",
        idioma === "en" ? "Create an account" : "Crear cuenta",
      ),
      descripcionIngresar:
        idioma === "en"
          ? "Account access is not available yet. You can explore the public catalogue without signing in."
          : "El acceso a cuentas aún no está disponible. Puedes explorar el catálogo público sin iniciar sesión.",
      descripcionRegistro:
        idioma === "en"
          ? "Account access is not available yet. You can explore the public catalogue without signing in."
          : "El acceso a cuentas aún no está disponible. Puedes explorar el catálogo público sin iniciar sesión.",
      continuar: t(
        "general.acciones.continuar",
        idioma === "en" ? "Continue exploring" : "Seguir explorando",
      ),
    },
  };
}

export async function obtenerTextos(
  idioma: Idioma,
  signal: AbortSignal,
): Promise<TextosAplicacion> {
  const respuesta = await consultar<RespuestaTextos>(
    `/textos?idioma=${idioma}`,
    { signal },
  );
  return adaptarTextos(respuesta, idioma);
}

export function textosAlternativos(idioma: Idioma): TextosAplicacion {
  return adaptarTextos({ idioma, textos: { navbar: {}, paginas: {} } }, idioma);
}

export function formatearTexto(
  plantilla: string,
  valores: Record<string, string>,
): string {
  return interpolar(plantilla, valores);
}
