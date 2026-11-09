"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { guardarCookie, borrarCookie } from "../services/cookies";
import { proyecto } from "../config/proyecto";

type Consentimiento = "aceptado" | "rechazado" | null;
type Idioma = "es" | "en";

interface Preferencias {
  idioma: Idioma;
  cambiarIdioma: (valor: Idioma) => void;
  consentimiento: Consentimiento;
  preferenciasCargadas: boolean;
  guardarConsentimiento: (permitir: boolean) => boolean;
  error: boolean;
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
  const [consentimiento, setConsentimiento] = useState(initialConsentimiento);
  const [idioma, setIdioma] = useState(initialIdioma);
  const [error, setError] = useState(false);
  const [preferenciasCargadas, setPreferenciasCargadas] = useState(false);
  useEffect(() => {
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
      if (
        consentimientoLocal === "aceptado" &&
        window.localStorage.getItem(`${proyecto.id}_idioma`) === "en"
      ) {
        idiomaLocal = "en";
      }
    } catch {
      falloAlLeer = true;
    }

    const consentimientoFinal = consentimientoLocal ?? initialConsentimiento;
    const idiomaFinal =
      idiomaLocal ??
      (consentimientoFinal === "aceptado" ? initialIdioma : "es");

    try {
      if (consentimientoFinal) {
        window.localStorage.setItem(
          `${proyecto.id}_consentimiento`,
          consentimientoFinal,
        );
      }
      if (consentimientoFinal === "aceptado") {
        window.localStorage.setItem(`${proyecto.id}_idioma`, idiomaFinal);
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
    const frame = window.requestAnimationFrame(() => {
      setConsentimiento(consentimientoFinal);
      setIdioma(idiomaFinal);
      setError(falloAlLeer);
      setPreferenciasCargadas(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialConsentimiento, initialIdioma]);
  useEffect(() => {
    document.documentElement.lang = idioma;
    document.title = `${proyecto.nombre} · ${idioma === "en" ? "Home" : "Inicio"}`;
  }, [idioma]);
  function cambiarIdioma(valor: Idioma) {
    setIdioma(valor);
    try {
      if (consentimiento === "aceptado") {
        window.localStorage.setItem(`${proyecto.id}_idioma`, valor);
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
    try {
      if (permitir) {
        window.localStorage.setItem(`${proyecto.id}_idioma`, idioma);
        guardarCookie("idioma", idioma);
      } else {
        window.localStorage.removeItem(`${proyecto.id}_idioma`);
        borrarCookie("idioma");
      }
    } catch {
      falloAlGuardar = true;
    }
    setError(falloAlGuardar);
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
