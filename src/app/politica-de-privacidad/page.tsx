"use client";

import LayoutPublico from "../../components/LayoutPublico/LayoutPublico";
import DialogoDetalle from "../../components/DialogoDetalle/DialogoDetalle";
import { useDetalle } from "../../hooks/useDetalle";
import { usePreferencias } from "../../context/PreferenciasContext";
import "./PoliticaPrivacidad.css";

export default function PoliticaPrivacidadPage() {
  const { textos } = usePreferencias();
  const { detalle, setDetalle, abrirCuenta } = useDetalle(textos);
  const politica = textos.interfaz;

  return (
    <LayoutPublico
      destino="/explorar"
      etiqueta={textos.interfaz.explora}
      descripcion={textos.pie.descripcion}
      onCuenta={abrirCuenta}
    >
      <article
        className="ancho-home politica-privacidad"
        aria-label={politica.ariaPolitica}
      >
        <h1>{politica.politica}</h1>
        <p>{politica.politicaDescripcion}</p>
        <section>
          <h2>{politica.politicaNecesarias}</h2>
          <p>{politica.politicaNecesariasTexto}</p>
        </section>
        <section>
          <h2>{politica.politicaPreferencias}</h2>
          <p>{politica.politicaPreferenciasTexto}</p>
        </section>
      </article>
      <DialogoDetalle detalle={detalle} onCerrar={() => setDetalle(null)} />
    </LayoutPublico>
  );
}
