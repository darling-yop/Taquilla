import { useState } from "react";
import { normalizar } from "../data/catalogo";
import type { Evento, FiltrosEventos } from "../types";

export function useEventos(eventos: Evento[]) {
  const [filtros, setFiltros] = useState<FiltrosEventos | null>(null);
  const resultados = eventos.filter(
    (evento) =>
      !filtros ||
      ((!filtros.consulta ||
        normalizar(evento.nombre).includes(normalizar(filtros.consulta))) &&
        (!filtros.ciudad || evento.ciudad === filtros.ciudad) &&
        (!filtros.fecha || evento.fecha === filtros.fecha) &&
        (!filtros.categoria || evento.categoria === filtros.categoria)),
  );
  function buscar(valores: FiltrosEventos) {
    setFiltros(valores);
    document.getElementById("eventos")?.scrollIntoView({ block: "start" });
  }
  return {
    filtros,
    resultados,
    buscar,
    setFiltros,
    filtrarCategoria: (categoria: FiltrosEventos["categoria"]) => {
      if (categoria) buscar({ categoria });
    },
  };
}
