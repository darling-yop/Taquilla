"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { TextosInterfaz } from "../../data/interfaz";
import Button from "../Button/Button";
import "./PanelAccesibilidad.css";

type TamanoTexto = "normal" | "grande" | "muy-grande";

interface AjustesAccesibilidad {
  tamanoTexto: TamanoTexto;
  altoContraste: boolean;
  subrayarEnlaces: boolean;
  reducirMovimiento: boolean;
}

const claveAlmacenamiento = "taquilla_accesibilidad";
const ajustesIniciales: AjustesAccesibilidad = {
  tamanoTexto: "normal",
  altoContraste: false,
  subrayarEnlaces: false,
  reducirMovimiento: false,
};

function validarAjustes(valor: unknown): AjustesAccesibilidad {
  if (typeof valor !== "object" || valor === null) return ajustesIniciales;
  const datos = valor as Partial<AjustesAccesibilidad>;
  return {
    tamanoTexto:
      datos.tamanoTexto === "grande" || datos.tamanoTexto === "muy-grande"
        ? datos.tamanoTexto
        : "normal",
    altoContraste: datos.altoContraste === true,
    subrayarEnlaces: datos.subrayarEnlaces === true,
    reducirMovimiento: datos.reducirMovimiento === true,
  };
}

function aplicarAjustes(ajustes: AjustesAccesibilidad) {
  const raiz = document.documentElement;
  raiz.dataset.tamanoTexto = ajustes.tamanoTexto;
  raiz.dataset.altoContraste = String(ajustes.altoContraste);
  raiz.dataset.subrayarEnlaces = String(ajustes.subrayarEnlaces);
  raiz.dataset.reducirMovimiento = String(ajustes.reducirMovimiento);
}

export default function PanelAccesibilidad({
  textos,
}: {
  textos: TextosInterfaz;
}) {
  const [abierto, setAbierto] = useState(false);
  const [ajustes, setAjustes] =
    useState<AjustesAccesibilidad>(ajustesIniciales);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const botonAbrir = useRef<HTMLButtonElement>(null);
  const id = useId();
  const t = textos.accesibilidad;

  useEffect(() => {
    let vigente = true;
    queueMicrotask(() => {
      if (!vigente) return;
      try {
        const guardado = window.localStorage.getItem(claveAlmacenamiento);
        const valores = guardado
          ? validarAjustes(JSON.parse(guardado))
          : ajustesIniciales;
        setAjustes(valores);
        aplicarAjustes(valores);
      } catch {
        setError(true);
        aplicarAjustes(ajustesIniciales);
      }
      setCargado(true);
    });
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    if (abierto && dialogo.current && !dialogo.current.open) {
      dialogo.current.showModal();
    } else if (!abierto && dialogo.current?.open) {
      dialogo.current.close();
    }
  }, [abierto]);

  function guardarAjustes(siguientes: AjustesAccesibilidad) {
    setAjustes(siguientes);
    aplicarAjustes(siguientes);
    try {
      window.localStorage.setItem(
        claveAlmacenamiento,
        JSON.stringify(siguientes),
      );
      setError(false);
    } catch {
      setError(true);
    }
  }

  function cambiarBooleano(
    clave: "altoContraste" | "subrayarEnlaces" | "reducirMovimiento",
    valor: boolean,
  ) {
    guardarAjustes({ ...ajustes, [clave]: valor });
  }

  function cerrar() {
    setAbierto(false);
    botonAbrir.current?.focus();
  }

  return (
    <>
      <Button
        variant="icon"
        buttonRef={botonAbrir}
        aria-label={t.abrir}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto(true)}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="5.5" r="2" />
          <path d="M4.5 9.5h15M12 9.5v5.5m0 0L7.5 20m4.5-5 4.5 5" />
        </svg>
      </Button>
      <dialog
        ref={dialogo}
        id={id}
        className="panel-accesibilidad"
        aria-labelledby={`${id}-titulo`}
        onClose={() => setAbierto(false)}
        onClick={(evento) => {
          if (evento.target === dialogo.current) cerrar();
        }}
      >
        <div className="panel-accesibilidad-cabecera">
          <div>
            <h2 id={`${id}-titulo`}>{t.titulo}</h2>
            <p>{t.descripcion}</p>
          </div>
          <button
            type="button"
            className="panel-accesibilidad-cerrar"
            aria-label={t.cerrar}
            onClick={cerrar}
          >
            ×
          </button>
        </div>
        <fieldset className="ajuste-tamano">
          <legend>{t.tamanoTexto}</legend>
          <div className="opciones-tamano">
            {(
              [
                ["normal", t.normal],
                ["grande", t.grande],
                ["muy-grande", t.muyGrande],
              ] as const
            ).map(([valor, etiqueta]) => (
              <button
                type="button"
                key={valor}
                aria-pressed={ajustes.tamanoTexto === valor}
                onClick={() =>
                  guardarAjustes({ ...ajustes, tamanoTexto: valor })
                }
              >
                {etiqueta}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="ajustes-accesibilidad">
          {(
            [
              ["altoContraste", t.altoContraste],
              ["subrayarEnlaces", t.subrayarEnlaces],
              ["reducirMovimiento", t.reducirMovimiento],
            ] as const
          ).map(([clave, etiqueta]) => (
            <label key={clave}>
              <span>{etiqueta}</span>
              <input
                type="checkbox"
                checked={ajustes[clave]}
                onChange={(evento) =>
                  cambiarBooleano(clave, evento.target.checked)
                }
              />
            </label>
          ))}
        </div>
        {error && (
          <p className="error-accesibilidad" role="alert">
            {t.error}
          </p>
        )}
        <button
          type="button"
          className="restablecer-accesibilidad"
          onClick={() => guardarAjustes(ajustesIniciales)}
          disabled={!cargado}
        >
          {t.restablecer}
        </button>
      </dialog>
    </>
  );
}
