const ZONA = "America/Bogota";
const LOCALES = { es: "es-CO", en: "en-US" };
const PRESETS = ["hoy", "finDeSemana", "mes"];

// en-CA da el formato AAAA-MM-DD
const formatoDia = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function diaLocal(fecha) {
  return formatoDia.format(fecha);
}

function sumarDias(dia, n) {
  const fecha = new Date(`${dia}T12:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + n);
  return fecha.toISOString().slice(0, 10);
}

function rangoPreset(preset, ahora = new Date()) {
  const hoy = diaLocal(ahora);

  if (preset === "hoy") return { desde: hoy, hasta: hoy };

  if (preset === "mes") {
    const [anio, mes] = hoy.split("-").map(Number);
    const ultimo = new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10);
    return { desde: hoy, hasta: ultimo };
  }

  // Fin de semana = sábado y domingo. Si hoy es domingo, solo hoy.
  const diaSemana = new Date(`${hoy}T12:00:00Z`).getUTCDay();
  if (diaSemana === 0) return { desde: hoy, hasta: hoy };
  const sabado = sumarDias(hoy, 6 - diaSemana);
  return { desde: sabado, hasta: sumarDias(sabado, 1) };
}

// Devuelve { desde, hasta } o null si no hay filtro de fecha activo
export function rangoDeFiltros({ fecha, desde, hasta } = {}) {
  if (fecha === "rango") {
    return desde || hasta ? { desde: desde || null, hasta: hasta || null } : null;
  }
  return PRESETS.includes(fecha) ? rangoPreset(fecha) : null;
}

export function filtrarPorFecha(eventos, { desde, hasta }) {
  return eventos.filter((evento) => {
    const dia = diaLocal(new Date(evento.fecha));
    return (!desde || dia >= desde) && (!hasta || dia <= hasta);
  });
}

export function formatearDiaCorto(dia, idioma) {
  return new Date(`${dia}T12:00:00Z`).toLocaleDateString(
    LOCALES[idioma] ?? LOCALES.es,
    { day: "numeric", month: "short", timeZone: "UTC" },
  );
}