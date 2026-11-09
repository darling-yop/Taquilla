import { useEffect, useState } from "react";
import { consultar } from "../services/api";

interface RespuestaLista<T> {
  datos: T[];
}

interface EstadoRecurso<T> {
  ruta: string | null;
  datos: T[] | null;
  error: Error | null;
  cargando: boolean;
}

export function useRecurso<T>(
  ruta: string | null,
  adaptar: (valor: unknown) => T,
) {
  const [estado, setEstado] = useState<EstadoRecurso<T>>({
    ruta: null,
    datos: null,
    error: null,
    cargando: true,
  });
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    if (!ruta) return;
    const controlador = new AbortController();
    let vigente = true;
    consultar<RespuestaLista<unknown>>(ruta, { signal: controlador.signal })
      .then((respuesta) => {
        if (!respuesta || !Array.isArray(respuesta.datos)) {
          throw new Error(
            "La respuesta de la API no contiene una lista de datos.",
          );
        }
        const datos = respuesta.datos.map(adaptar);
        if (vigente) setEstado({ ruta, datos, error: null, cargando: false });
      })
      .catch((error: Error) => {
        if (vigente && error.name !== "AbortError")
          setEstado({ ruta, datos: null, error, cargando: false });
      });
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [ruta, intento, adaptar]);
  const actual =
    estado.ruta === ruta
      ? estado
      : { ruta, datos: null, error: null, cargando: Boolean(ruta) };
  function recargar() {
    if (ruta) setEstado({ ruta, datos: null, error: null, cargando: true });
    setIntento((valor) => valor + 1);
  }
  return { ...actual, recargar };
}
