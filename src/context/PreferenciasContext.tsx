"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { guardarCookie, borrarCookie } from "../services/cookies";
import { proyecto } from "../config/proyecto";
import { obtenerTextos, textosAlternativos } from "../services/textos";
import type { TextosAplicacion } from "../data/textos";

type Consentimiento = "aceptado" | "rechazado" | null;
type Idioma = "es" | "en";

interface Preferencias {
  idioma: Idioma;
  cambiarIdioma: (valor: Idioma) => void;
  consentimiento: Consentimiento;
  preferenciasCargadas: boolean;
  guardarConsentimiento: (permitir: boolean) => boolean;
  error: boolean;
  textos: TextosAplicacion;
  textosCargando: boolean;
  errorTextos: boolean;
  recargarTextos: () => void;
}

const PreferenciasContext = createContext<Preferencias | null>(null);

export function PreferenciasProvider({
  children,
  initialConsentimiento = null,
  initialIdioma = "es",
}: {
  children: ReactNode;
  initialConsentimiento?: Consentimiento;
  initialIdioma?: Idioma;
}) {
  const pathname = usePathname() ?? "";
  const [consentimiento, setConsentimiento] = useState(initialConsentimiento);
  const [idioma, setIdioma] = useState(initialIdioma);
  const [error, setError] = useState(false);
  const [preferenciasCargadas, setPreferenciasCargadas] = useState(false);
  const [textosPorIdioma, setTextosPorIdioma] = useState<
    Partial<Record<Idioma, TextosAplicacion>>
  >({});
  const [erroresTextos, setErroresTextos] = useState<
    Partial<Record<Idioma, boolean>>
  >({});
  const [intentoTextos, setIntentoTextos] = useState(0);
  const textos = useMemo(
    () => textosPorIdioma[idioma] ?? textosAlternativos(idioma),
    [idioma, textosPorIdioma],
  );
  const textosCargando = !textosPorIdioma[idioma] && !erroresTextos[idioma];
  const errorTextos = Boolean(erroresTextos[idioma]);
  useEffect(() => {
    let vigente = true;
    let falloAlLeer = false;
    let consentimientoLocal: Consentimiento = null;
    let idiomaLocal: Idioma | null = null;

    try {
      const valor = window.localStorage.getItem(
        `${proyecto.id}_consentimiento`,
      );
      if (valor === "aceptado" || valor === "rechazado") {
        consentimientoLocal = valor;
      }
      const idiomaGuardado = window.localStorage.getItem(
        `${proyecto.id}_idioma`,
      );
      if (idiomaGuardado === "en" || idiomaGuardado === "es") {
        idiomaLocal = idiomaGuardado;
      }
    } catch {
      falloAlLeer = true;
    }

    const consentimientoFinal = consentimientoLocal ?? initialConsentimiento;
    const idiomaFinal = idiomaLocal ?? initialIdioma;

    try {
      if (consentimientoFinal) {
        window.localStorage.setItem(
          `${proyecto.id}_consentimiento`,
          consentimientoFinal,
        );
      }
    } catch {
      falloAlLeer = true;
    }
    try {
      if (consentimientoFinal) {
        guardarCookie("consentimiento", consentimientoFinal);
      }
      if (consentimientoFinal === "aceptado") {
        guardarCookie("idioma", idiomaFinal);
      }
    } catch {
      falloAlLeer = true;
    }
    queueMicrotask(() => {
      if (!vigente) return;
      setConsentimiento(consentimientoFinal);
      setIdioma(idiomaFinal);
      setError(falloAlLeer);
      setPreferenciasCargadas(true);
    });
    return () => {
      vigente = false;
    };
  }, [initialConsentimiento, initialIdioma]);
  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;
    obtenerTextos(idioma, controlador.signal)
      .then((textosApi) => {
        if (vigente) {
          setTextosPorIdioma((actual) => ({ ...actual, [idioma]: textosApi }));
          setErroresTextos((actual) => ({ ...actual, [idioma]: false }));
        }
      })
      .catch((error: unknown) => {
        if (
          vigente &&
          !(error instanceof Error && error.name === "AbortError")
        ) {
          setErroresTextos((actual) => ({ ...actual, [idioma]: true }));
        }
      });
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [idioma, intentoTextos]);

  useEffect(() => {
    document.documentElement.lang = idioma;
    const esExplorar = pathname.startsWith("/explorar");
    document.title = esExplorar
      ? textos.explorar.tituloSeo
      : textos.inicio.tituloSeo;
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="description"]')
      .forEach((descripcion) => {
        descripcion.content = esExplorar
          ? textos.explorar.descripcionSeo
          : textos.inicio.descripcionSeo;
      });
  }, [idioma, pathname, textos]);
  function cambiarIdioma(valor: Idioma) {
    setIdioma(valor);
    try {
      window.localStorage.setItem(`${proyecto.id}_idioma`, valor);
      if (consentimiento === "aceptado") {
        guardarCookie("idioma", valor);
      }
      setError(false);
    } catch {
      setError(true);
    }
  }
  function guardarConsentimiento(permitir: boolean) {
    const valor = permitir ? "aceptado" : "rechazado";
    setConsentimiento(valor);
    setPreferenciasCargadas(true);
    let guardado = false;
    let falloAlGuardar = false;
    try {
      window.localStorage.setItem(`${proyecto.id}_consentimiento`, valor);
      guardado = true;
    } catch {
      falloAlGuardar = true;
    }
    try {
      guardarCookie("consentimiento", valor);
      guardado = true;
    } catch {
      falloAlGuardar = true;
    }
    if (permitir) {
      try {
        window.localStorage.setItem(`${proyecto.id}_idioma`, idioma);
        guardarCookie("idioma", idioma);
      } catch {
        falloAlGuardar = true;
      }
    } else {
      try {
        borrarCookie("idioma");
      } catch {
        falloAlGuardar = true;
      }
    }
    setError(falloAlGuardar);
    if (guardado) {
      setConsentimiento(valor);
      setPreferenciasCargadas(true);
    }
    return guardado;
  }
  return (
    <PreferenciasContext.Provider
      value={{
        idioma,
        cambiarIdioma,
        consentimiento,
        preferenciasCargadas,
        guardarConsentimiento,
        error,
        textos,
        textosCargando,
        errorTextos,
        recargarTextos: () => setIntentoTextos((valor) => valor + 1),
      }}
    >
      {children}
    </PreferenciasContext.Provider>
  );
}

export function usePreferencias() {
  const valor = useContext(PreferenciasContext);
  if (!valor) throw new Error("PreferenciasProvider requerido");
  return valor;
}
