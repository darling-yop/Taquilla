import type { Categoria, CategoriaEvento, Evento } from "../types";

interface Registro {
  [clave: string]: unknown;
}

const categoriasPorId: Record<string, CategoriaEvento> = {
  conciertos: "Conciertos",
  teatro: "Teatro",
  deportes: "Deportes",
  festivales: "Festivales",
  comedia: "Comedia",
  familiares: "Familiares",
};

function esRegistro(valor: unknown): valor is Registro {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function texto(registro: Registro, clave: string): string {
  const valor = registro[clave];
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error(
      `El campo "${clave}" no es válido en la respuesta de eventos.`,
    );
  }
  return valor;
}

function colorAfiche(afiche: Registro, clave: string): string | undefined {
  const valor = afiche[clave];
  return typeof valor === "string" && /^#[\da-f]{6}$/i.test(valor)
    ? valor
    : undefined;
}

function categoriaValida(valor: string): CategoriaEvento {
  const categoria = categoriasPorId[valor.toLowerCase()];
  if (!categoria) {
    throw new Error(
      `La categoría "${valor}" no está soportada por la interfaz.`,
    );
  }
  return categoria;
}

function obtenerFechaLocal(fecha: string): string {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    throw new Error("La fecha de un evento recibida de la API no es válida.");
  }
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const valor = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)?.value;
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

export function adaptarEventoInicio(valor: unknown): Evento {
  if (!esRegistro(valor) || !esRegistro(valor.recinto)) {
    throw new Error("La API devolvió un evento con una estructura no válida.");
  }

  const recinto = valor.recinto;
  const afiche = esRegistro(valor.afiche) ? valor.afiche : {};
  const fecha = texto(valor, "fecha");
  const fechaEvento = new Date(fecha);
  const horario = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(fechaEvento);
  const categoria = categoriaValida(texto(valor, "categoria"));
  const precio = valor.precioDesde;
  if (typeof precio !== "number" || !Number.isFinite(precio)) {
    throw new Error("La API devolvió un precio no válido para un evento.");
  }

  return {
    id: texto(valor, "id"),
    slug: texto(valor, "slug"),
    nombre: texto(valor, "titulo"),
    categoria,
    etiqueta: categoria,
    fecha: obtenerFechaLocal(fecha),
    horario,
    lugar: texto(recinto, "nombre"),
    ciudad: texto(recinto, "ciudad"),
    precio,
    arte: 0,
    color1: colorAfiche(afiche, "color1"),
    color2: colorAfiche(afiche, "color2"),
  };
}

export function adaptarCategoriaInicio(valor: unknown): Categoria {
  if (!esRegistro(valor)) {
    throw new Error(
      "La API devolvió una categoría con una estructura no válida.",
    );
  }

  const categoria = categoriaValida(texto(valor, "id"));
  const cantidad = valor.eventos;
  if (typeof cantidad !== "number" || !Number.isFinite(cantidad)) {
    throw new Error("La API devolvió un conteo no válido para una categoría.");
  }

  return {
    id: categoria,
    nombre: texto(valor, "nombre"),
    eventos: cantidad,
  };
}

export function adaptarCiudadInicio(valor: unknown): string {
  if (!esRegistro(valor)) {
    throw new Error("La API devolvió una ciudad con una estructura no válida.");
  }
  return texto(valor, "nombre");
}
