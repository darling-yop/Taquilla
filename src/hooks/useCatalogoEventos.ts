import { useEffect, useState } from "react";
import { consultarCatalogo } from "../services/catalogoEventos";
import type { Evento } from "../types";

interface EstadoCatalogo {
  ruta: string | null;
  datos: Evento[] | null;
  error: Error | null;
  cargando: boolean;
}

export function useCatalogoEventos(ruta: string) {
  const [estado, setEstado] = useState<EstadoCatalogo>({
    ruta: null,
    datos: null,
    error: null,
    cargando: true,
  });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;
    consultarCatalogo(ruta, controlador.signal)
      .then((datos) => {
        if (vigente) setEstado({ ruta, datos, error: null, cargando: false });
      })
      .catch((error: Error) => {
        if (vigente && error.name !== "AbortError") {
          setEstado({ ruta, datos: null, error, cargando: false });
        }
      });
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [ruta, intento]);

  const actual =
    estado.ruta === ruta
      ? estado
      : { ruta, datos: null, error: null, cargando: true };

  function recargar() {
    setEstado({ ruta, datos: null, error: null, cargando: true });
    setIntento((valor) => valor + 1);
  }

  return { ...actual, recargar };
}
