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
  buscarDestino = "#buscador-eventos",
}: {
  destino: string;
  etiqueta: string;
  descripcion: string;
  onCuenta: (tipo: TipoCuenta) => void;
  children: ReactNode;
  inicioDestino?: string;
  buscarDestino?: string;
}) {
  const { idioma, cambiarIdioma, textos, errorTextos, recargarTextos } =
    usePreferencias();
  const [cookiesAbiertas, setCookiesAbiertas] = useState(false);
  const disparador = useRef<HTMLElement | null>(null);
  function abrirCookies() {
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
        onCambiarIdioma={cambiarIdioma}
        textos={textos}
        destino={destino}
        etiqueta={etiqueta}
        inicioDestino={inicioDestino}
        buscarDestino={buscarDestino}
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
      />
      <GestorCookies
        abierto={cookiesAbiertas}
        onAbrir={abrirCookies}
        onCerrar={cerrarCookies}
      />
    </div>
  );
}
