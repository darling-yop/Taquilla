import { useState } from "react";
import type { Detalle, TipoCuenta } from "../types";
import type { TextosAplicacion } from "../data/textos";

export function useDetalle(textos: TextosAplicacion) {
  const [detalle, setDetalle] = useState<Detalle | null>(null);
  function abrirCuenta(tipo: TipoCuenta) {
    setDetalle({
      titulo:
        tipo === "registro" ? textos.cuenta.registro : textos.cuenta.ingresar,
      descripcion:
        tipo === "registro"
          ? textos.cuenta.descripcionRegistro
          : textos.cuenta.descripcionIngresar,
      cerrar: textos.cuenta.continuar,
    });
  }
  return { detalle, setDetalle, abrirCuenta };
}
