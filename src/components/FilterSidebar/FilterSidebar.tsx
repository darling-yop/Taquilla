"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { CategoriaEvento } from "../../types";
import type { Idioma } from "../../data/interfaz";
import type { TextosAplicacion } from "../../data/textos";
import { categoriasMock } from "../../data/eventosMock";
import "./FilterSidebar.css";

const ciudades = ["Manizales", "Pereira", "Bogotá", "Medellín"];
const precioMinimo = 30000;
const precioMaximo = 150000;
const pasoPrecio = 10000;

export default function FilterSidebar({
  categorias,
  periodo,
  ciudad,
  minimo,
  maximo,
  textos,
  nombresCategoria,
  idioma,
  onCategoria,
  onPeriodo,
  onCiudad,
  onPrecio,
  onLimpiar,
}: {
  categorias: string[];
  periodo: string;
  ciudad: string;
  minimo: number;
  maximo: number;
  textos: TextosAplicacion["explorar"];
  nombresCategoria: Record<CategoriaEvento, string>;
  idioma: Idioma;
  onCategoria: (categoria: string, seleccionado: boolean) => void;
  onPeriodo: (periodo: string) => void;
  onCiudad: (ciudad: string) => void;
  onPrecio: (minimo: number, maximo: number) => void;
  onLimpiar: () => void;
}) {
  const [rango, setRango] = useState({ minimo, maximo });
  const moneda = new Intl.NumberFormat(idioma === "en" ? "en-CO" : "es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
  const porcentajeMinimo =
    ((rango.minimo - precioMinimo) / (precioMaximo - precioMinimo)) * 100;
  const porcentajeMaximo =
    ((rango.maximo - precioMinimo) / (precioMaximo - precioMinimo)) * 100;
  const estiloRango = {
    "--rango-inicio": `${porcentajeMinimo}%`,
    "--rango-fin": `${porcentajeMaximo}%`,
  } as CSSProperties;

  function confirmarRango() {
    onPrecio(rango.minimo, rango.maximo);
  }

  return (
    <aside className="filter-sidebar" aria-label={textos.filtroAria}>
      <div className="filter-sidebar-header">
        <h2>{textos.tituloFiltros}</h2>
        <button type="button" onClick={onLimpiar}>
          {textos.limpiar}
        </button>
      </div>

      <fieldset className="filter-sidebar-section category-section">
        <legend>{textos.categoria}</legend>
        {categoriasMock.map(({ id, cantidad }) => {
          const valor = id.toLowerCase();
          return (
            <label className="filter-category" key={id}>
              <input
                type="checkbox"
                checked={categorias.includes(valor)}
                onChange={(event) => onCategoria(valor, event.target.checked)}
              />
              <span>{nombresCategoria[id]}</span>
              <small>{cantidad}</small>
            </label>
          );
        })}
      </fieldset>

      <fieldset className="filter-sidebar-section date-section">
        <legend>{textos.fecha}</legend>
        <div className="date-pills">
          {(
            [
              ["hoy", textos.hoy],
              ["fin-semana", textos.esteFinDeSemana],
              ["mes", textos.esteMes],
              ["personalizado", textos.elegirFechas],
            ] as const
          ).map(([valor, etiqueta]) => (
            <button
              type="button"
              key={valor}
              aria-pressed={periodo === valor}
              onClick={() => onPeriodo(periodo === valor ? "" : valor)}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="filter-sidebar-section city-section">
        <span>{textos.ciudad}</span>
        <select
          value={ciudad}
          onChange={(event) => onCiudad(event.target.value)}
        >
          <option value="">{textos.todasCiudades}</option>
          {ciudades.map((opcion) => (
            <option value={opcion} key={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="filter-sidebar-section price-section">
        <legend>{textos.precio}</legend>
        <div className="dual-range" style={estiloRango}>
          <div className="dual-range-track" />
          <input
            type="range"
            min={precioMinimo}
            max={precioMaximo}
            step={pasoPrecio}
            value={rango.minimo}
            aria-label={textos.precioMinimo}
            onChange={(event) =>
              setRango((actual) => ({
                ...actual,
                minimo: Math.min(Number(event.target.value), actual.maximo),
              }))
            }
            onPointerUp={confirmarRango}
            onKeyUp={confirmarRango}
          />
          <input
            type="range"
            min={precioMinimo}
            max={precioMaximo}
            step={pasoPrecio}
            value={rango.maximo}
            aria-label={textos.precioMaximo}
            onChange={(event) =>
              setRango((actual) => ({
                ...actual,
                maximo: Math.max(Number(event.target.value), actual.minimo),
              }))
            }
            onPointerUp={confirmarRango}
            onKeyUp={confirmarRango}
          />
        </div>
        <div className="price-labels">
          <output>{moneda.format(rango.minimo).replace(/\s+/g, " ")}</output>
          <output>{moneda.format(rango.maximo).replace(/\s+/g, " ")}</output>
        </div>
      </fieldset>
    </aside>
  );
}
