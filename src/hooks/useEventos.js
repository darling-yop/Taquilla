import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buscarEventos,
  pedirCategorias,
  pedirDestacados,
  pedirProximos,
} from "../services/eventosService.js";
import { construirContenido } from "../services/contenidoEventos.js";

const VACIO = { destacados: [], proximos: [], categorias: [] };

export function useEventos(textos, idioma, ciudad = "Manizales") {
  const [datos, setDatos] = useState(VACIO);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);
  const [resultados, setResultados] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [cargandoResultados, setCargandoResultados] = useState(false);
  const [errorResultados, setErrorResultados] = useState(null);
  const [filtros, setFiltros] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();
    const { signal } = controlador;

    setCargando(true);
    setError(null);

    // allSettled: si falla una petición, las otras siguen mostrándose
    Promise.allSettled([
      pedirDestacados(signal),
      pedirProximos(ciudad, signal),
      pedirCategorias(signal),
    ]).then(([destacados, proximos, categorias]) => {
      if (signal.aborted) return;

      setDatos({
        destacados: destacados.value ?? [],
        proximos: proximos.value ?? [],
        categorias: categorias.value ?? [],
      });

      const fallo = [destacados, proximos, categorias].find(
        (resultado) => resultado.status === "rejected",
      );
      if (fallo) setError(fallo.reason);
      setCargando(false);
    });

    return () => controlador.abort();
  }, [ciudad, intento]);

  useEffect(() => {
    if (filtros === null) {
      setResultados([]);
      setPaginacion(null);
      setCargandoResultados(false);
      setErrorResultados(null);
      return;
    }

    const controlador = new AbortController();
    setCargandoResultados(true);
    setErrorResultados(null);

    buscarEventos(filtros, controlador.signal)
      .then((resultado) => {
        if (controlador.signal.aborted) return;
        setResultados(resultado.eventos);
        setPaginacion(resultado.paginacion);
      })
      .catch((errorConsulta) => {
        if (controlador.signal.aborted) return;
        setErrorResultados(errorConsulta);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargandoResultados(false);
      });

    return () => controlador.abort();
  }, [filtros]);

  const cargarResultados = useCallback((nuevosFiltros = {}) => {
    setFiltros(nuevosFiltros);
  }, []);

  const cambiarPagina = useCallback((pagina) => {
    setFiltros((actuales) => (actuales ? { ...actuales, pagina } : actuales));
  }, []);

  const limpiarResultados = useCallback(() => {
    setFiltros(null);
  }, []);

  const contenido = useMemo(
    () => construirContenido(datos, textos, idioma, ciudad),
    [datos, textos, idioma, ciudad],
  );

  return {
    ...contenido,
    cargando,
    error,
    recargar: () => setIntento((n) => n + 1),
    resultados,
    paginacion,
    cargandoResultados,
    errorResultados,
    cargarResultados,
    cambiarPagina,
    filtrosResultados: filtros,
    limpiarResultados,
  };
}