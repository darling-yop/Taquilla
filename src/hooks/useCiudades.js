 import { useEffect, useState } from "react";
import { pedirCiudades } from "../services/eventosService.js";

export function useCiudades() {
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    const controlador = new AbortController();

    pedirCiudades(controlador.signal)
      .then(setCiudades)
      // Si falla, el selector solo ofrece "Todas las ciudades"
      .catch(() => {});

    return () => controlador.abort();
  }, []);

  return ciudades;
}