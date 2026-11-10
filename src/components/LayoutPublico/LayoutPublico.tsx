"use client";

import { useRef, useState } from "react";
import { proyecto } from "../../config/proyecto";
import { usePreferencias } from "../../context/PreferenciasContext";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SaltarContenido from "../SaltarContenido/SaltarContenido";
import GestorCookies from "../GestorCookies/GestorCookies";
import type { ReactNode } from "react";
import type { TipoCuenta } from "../../types";
import "./LayoutPublico.css";
export default function LayoutPublico({
  destino,
  etiqueta,
  descripcion,
  onCuenta,
  children,
  inicioDestino = "#contenido",
}: {
  destino: string;
  etiqueta: string;
  descripcion: string;
  onCuenta: (tipo: TipoCuenta) => void;
  children: ReactNode;
  inicioDestino?: string;
}) {
  const {
    idioma,
    changeLanguage,
    textos,
    errorTextos,
    recargarTextos,
    consentimiento,
    restablecerConsentimiento,
  } = usePreferencias();
  const [cookiesAbiertas, setCookiesAbiertas] = useState(false);
  const [permitirCookies, setPermitirCookies] = useState(false);
  const disparador = useRef<HTMLElement | null>(null);
  function abrirCookies() {
    setPermitirCookies(consentimiento === "aceptado");
    disparador.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setCookiesAbiertas(true);
  }
  function cerrarCookies() {
    setCookiesAbiertas(false);
    disparador.current?.focus();
  }
  function configurarCookies() {
    setCookiesAbiertas(false);
    restablecerConsentimiento();
  }
  return (
    <div className={`landing ${proyecto.id}`}>
      {errorTextos && (
        <p className="error-traducciones" role="alert">
          {textos.comun.errorTraducciones}
          <button type="button" onClick={recargarTextos}>
            {textos.comun.reintentar}
          </button>
        </p>
      )}
      <SaltarContenido texto={textos.interfaz.saltar} />
      <Navbar
        nombre={proyecto.nombre}
        tipo={proyecto.id}
        idioma={idioma}
        onChangeLanguage={changeLanguage}
        textos={textos}
        destino={destino}
        etiqueta={etiqueta}
        inicioDestino={inicioDestino}
        onCuenta={onCuenta}
      />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Footer
        nombre={proyecto.nombre}
        tipo={proyecto.id}
        textos={textos}
        descripcion={descripcion}
        destino={destino}
        inicioDestino={inicioDestino}
        onCuenta={onCuenta}
        onAbrirCookies={abrirCookies}
        onConfigurarCookies={configurarCookies}
      />
      <GestorCookies
        abierto={cookiesAbiertas}
        permitir={permitirCookies}
        onCambiar={setPermitirCookies}
        onAbrir={abrirCookies}
        onCerrar={cerrarCookies}
      />
    </div>
  );
}
