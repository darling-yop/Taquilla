"use client";

import { useEffect, useId, useRef, useState } from "react";
import Marca from "../Marca/Marca";
import MenuMovil from "../MenuMovil/MenuMovil";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma";
import PanelAccesibilidad from "../PanelAccesibilidad/PanelAccesibilidad";
import Button from "../Button/Button";
import type { Idioma } from "../../data/interfaz";
import type { TipoCuenta } from "../../types";
import type { TextosAplicacion } from "../../data/textos";
import "./Navbar.css";
export default function Navbar({
  nombre,
  tipo,
  idioma,
  onChangeLanguage,
  textos,
  destino,
  etiqueta,
  inicioDestino = "#contenido",
  buscarDestino = "#buscador-eventos",
  onCuenta,
}: {
  nombre: string;
  tipo: string;
  idioma: Idioma;
  onChangeLanguage: (idioma: Idioma) => void;
  textos: TextosAplicacion;
  destino: string;
  etiqueta: string;
  inicioDestino?: string;
  buscarDestino?: string;
  onCuenta: (tipo: TipoCuenta) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const t = textos.interfaz;

  useEffect(() => {
    const escritorio = window.matchMedia("(min-width: 641px)");
    function cerrarEnEscritorio(evento: MediaQueryListEvent) {
      if (evento.matches) setAbierto(false);
    }

    escritorio.addEventListener("change", cerrarEnEscritorio);
    return () => escritorio.removeEventListener("change", cerrarEnEscritorio);
  }, []);

  function cerrarMenu() {
    setAbierto(false);
  }

  function abrirCuenta(tipoCuenta: TipoCuenta) {
    cerrarMenu();
    onCuenta(tipoCuenta);
  }

  return (
    <header
      className="cabecera-home"
      onKeyDown={(evento) => {
        if (evento.key === "Escape" && abierto) {
          setAbierto(false);
          boton.current?.focus();
        }
      }}
    >
      <div className="ancho-home fila-cabecera">
        <Marca nombre={nombre} tipo={tipo} ariaLabel={textos.logoAria} />
        <Button
          variant="outline"
          type="button"
          className="ingreso-movil"
          onClick={() => abrirCuenta("ingresar")}
        >
          {t.headerIngresar}
        </Button>
        <MenuMovil
          abierto={abierto}
          onAlternar={() => setAbierto((valor) => !valor)}
          menuId={id}
          botonRef={boton}
          textos={t}
        />
        <nav
          id={id}
          className={`menu-home ${abierto ? "abierto" : ""}`}
          aria-label={t.navegacion}
        >
          <a
            href={inicioDestino}
            aria-current={inicioDestino === "#contenido" ? "page" : undefined}
            onClick={cerrarMenu}
          >
            {t.inicio}
          </a>
          <a href={destino} onClick={cerrarMenu}>
            {etiqueta}
          </a>
          <div className="acciones-home">
            {tipo === "taquilla" && (
              <a
                className="buscar-cabecera"
                href={buscarDestino}
                onClick={cerrarMenu}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4 4" />
                </svg>
                <span>{t.headerBuscar}</span>
              </a>
            )}
            <PanelAccesibilidad textos={textos.interfaz} />
            <SelectorIdioma
              idioma={idioma}
              onChangeLanguage={onChangeLanguage}
              textos={t}
            />
            <Button
              variant="outline"
              type="button"
              className="ingresar-home"
              onClick={() => abrirCuenta("ingresar")}
            >
              {t.headerIngresar}
            </Button>
            <Button
              variant="primary"
              type="button"
              className="crear-cuenta-home"
              onClick={() => abrirCuenta("registro")}
            >
              {t.headerCrearCuenta}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
