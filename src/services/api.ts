import { proyecto } from "../config/proyecto";

interface ErrorRespuesta {
  codigo?: string;
  campos?: Record<string, string>;
  mensaje?: string;
}

interface DatosRespuesta {
  error?: ErrorRespuesta;
}

export class ErrorApi extends Error {
  codigo?: string;
  campos?: Record<string, string>;

  constructor(
    mensaje: string,
    codigo?: string,
    campos?: Record<string, string>,
  ) {
    super(mensaje);
    this.name = "ErrorApi";
    this.codigo = codigo;
    this.campos = campos;
  }
}

export async function consultar<T = unknown>(
  ruta: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<T> {
  const respuesta = await fetch(`${proyecto.api}${ruta}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  const datos: unknown = await respuesta.json();
  if (!respuesta.ok) {
    const cuerpo = datos as DatosRespuesta;
    throw new ErrorApi(
      cuerpo.error?.mensaje || `HTTP ${respuesta.status}`,
      cuerpo.error?.codigo,
      cuerpo.error?.campos,
    );
  }
  return datos as T;
}
