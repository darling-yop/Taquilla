const API = "https://yanethm-taquilla-api.fly.dev/api/v1";

async function enviar(ruta, datos) {
  const respuesta = await fetch(`${API}${ruta}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const json = await respuesta.json();
  if (!respuesta.ok) {
    const error = new Error(json.error?.mensaje ?? `La solicitud respondió ${respuesta.status}`);
    error.codigo = json.error?.codigo;
    error.campos = json.error?.campos ?? {};
    error.retryAfter = respuesta.headers.get("Retry-After");
    throw error;
  }

  return json;
}

export const iniciarSesion = (datos) => enviar("/sesion", datos);
export const crearCuenta = (datos) => enviar("/usuarios", datos);
export const verificarCorreo = (datos) => enviar("/verificacion", datos);
export const reenviarVerificacion = (datos) =>
  enviar("/verificacion/reenviar", datos);

export async function consultarSesion() {
  const respuesta = await fetch(`${API}/sesion`, { credentials: "include" });
  if (respuesta.status === 401) return null;
  if (!respuesta.ok) {
    throw new Error(`/sesion respondió ${respuesta.status}`);
  }

  const json = await respuesta.json();
  return json.usuario ?? null;
}

export async function cerrarSesion() {
  const respuesta = await fetch(`${API}/sesion`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!respuesta.ok) {
    throw new Error(`DELETE /sesion respondió ${respuesta.status}`);
  }
}
