import { consultar } from "./api";
import { adaptarEventoInicio } from "./inicio";
import type { Evento } from "../types";

interface RespuestaCatalogo {
  datos: unknown[];
  paginacion: {
    paginas: number;
  };
}

function rutaPagina(ruta: string, pagina: number): string {
  const [recurso, consulta = ""] = ruta.split("?");
  const parametros = new URLSearchParams(consulta);
  parametros.set("pagina", String(pagina));
  return `${recurso}?${parametros.toString()}`;
}

function validarRespuesta(respuesta: RespuestaCatalogo): void {
  if (
    !respuesta ||
    !Array.isArray(respuesta.datos) ||
    !Number.isInteger(respuesta.paginacion?.paginas) ||
    respuesta.paginacion.paginas < 1
  ) {
    throw new Error("La respuesta de la API no contiene una página válida.");
  }
}

export async function consultarCatalogo(
  ruta: string,
  signal: AbortSignal,
): Promise<Evento[]> {
  const primera = await consultar<RespuestaCatalogo>(ruta, { signal });
  validarRespuesta(primera);

  const paginasRestantes = await Promise.all(
    Array.from({ length: primera.paginacion.paginas - 1 }, (_, indice) =>
      consultar<RespuestaCatalogo>(rutaPagina(ruta, indice + 2), {
        signal,
      }).then((respuesta) => {
        validarRespuesta(respuesta);
        return respuesta.datos;
      }),
    ),
  );
  return [primera.datos, ...paginasRestantes].flat().map(adaptarEventoInicio);
}
