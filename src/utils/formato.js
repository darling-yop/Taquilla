const LOCALES = { es: "es-CO", en: "en-US" };
const ZONA = "America/Bogota";

export function formatearFecha(iso, idioma) {
  const fecha = new Date(iso);
  const locale = LOCALES[idioma] ?? LOCALES.es;

  const dia = fecha.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: ZONA,
  });

  const hora = fecha.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: ZONA,
  });

  return `${dia} · ${hora}`;
}

export function formatearPrecio(valor, idioma) {
  return new Intl.NumberFormat(LOCALES[idioma] ?? LOCALES.es, {
    style: "currency",
    currency: "COP",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(valor);
}