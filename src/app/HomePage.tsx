"use client";

import { useRouter } from "next/navigation";
import LayoutPublico from "../components/LayoutPublico/LayoutPublico";
import HeroTaquilla from "../components/HeroTaquilla/HeroTaquilla";
import BuscadorEventos from "../components/BuscadorEventos/BuscadorEventos";
import CategoriasEventos from "../components/CategoriasEventos/CategoriasEventos";
import SeccionEventos from "../components/SeccionEventos/SeccionEventos";
import AficheEvento from "../components/AficheEvento/AficheEvento";
import DialogoDetalle from "../components/DialogoDetalle/DialogoDetalle";
import { usePreferencias } from "../context/PreferenciasContext";
import { useDetalle } from "../hooks/useDetalle";
import { useEventos } from "../hooks/useEventos";
import { dinero } from "../data/catalogo";
import { useRecurso } from "../hooks/useRecurso";
import {
  adaptarCategoriaInicio,
  adaptarEventoInicio,
} from "../services/inicio";
import type { Evento } from "../types";

export default function HomePage() {
  const router = useRouter();
  const { idioma, textos } = usePreferencias();
  const en = idioma === "en";
  const { detalle, setDetalle, abrirCuenta } = useDetalle(textos);
  const destacadosRecurso = useRecurso(
    "/eventos/destacados",
    adaptarEventoInicio,
  );
  const categoriasRecurso = useRecurso("/categorias", adaptarCategoriaInicio);
  const manizalesRecurso = useRecurso(
    "/eventos?ciudad=Manizales&porPagina=4",
    adaptarEventoInicio,
  );
  const eventos = destacadosRecurso.datos ?? [];
  const categorias = categoriasRecurso.datos ?? [];
  const eventosManizales = manizalesRecurso.datos ?? [];
  const { filtros, resultados, setFiltros, filtrarCategoria } =
    useEventos(eventos);
  function explorar(filtros: {
    consulta?: string;
    ciudad?: string;
    fecha?: string;
  }) {
    const parametros = new URLSearchParams();
    if (filtros.consulta?.trim()) {
      parametros.set("q", filtros.consulta.trim());
    }
    if (filtros.ciudad) parametros.set("ciudad", filtros.ciudad);
    if (filtros.fecha) parametros.set("fecha", filtros.fecha);
    parametros.set("pagina", "1");
    router.push(`/explorar?${parametros.toString()}`);
  }
  function abrirEvento(evento: Evento) {
    setDetalle({
      titulo: evento.nombre,
      descripcion: `${evento.horario} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />
          <p>{dinero(evento.precio)} COP</p>
          <small>{textos.inicio.eventoEjemplo}</small>
        </div>
      ),
      cerrar: textos.comun.cerrar,
    });
  }
  return (
    <LayoutPublico
      destino="/explorar"
      etiqueta={textos.interfaz.explora}
      descripcion={textos.pie.descripcion}
      onCuenta={abrirCuenta}
    >
      <HeroTaquilla
        destacado={eventos[0] ?? null}
        cargandoDestacado={destacadosRecurso.cargando}
        errorDestacado={destacadosRecurso.error}
        onReintentarDestacado={destacadosRecurso.recargar}
        abrirEvento={abrirEvento}
        setFiltros={setFiltros}
        filtrarCategoria={filtrarCategoria}
      >
        <BuscadorEventos
          key={JSON.stringify(filtros)}
          en={en}
          eventos={eventos}
          onBuscar={explorar}
          filtrosAplicados={filtros}
        />
      </HeroTaquilla>
      <div className="ancho-home">
        <CategoriasEventos
          categorias={categorias}
          filtros={filtros}
          filtrarCategoria={filtrarCategoria}
          cargando={categoriasRecurso.cargando}
          error={categoriasRecurso.error}
          onReintentar={categoriasRecurso.recargar}
        />
        <SeccionEventos
          id="eventos"
          en={en}
          titulo={
            filtros
              ? textos.inicio.resultadosBusqueda
              : textos.inicio.destacados
          }
          descripcion={
            filtros
              ? textos.inicio.resultados.replace(
                  "{cantidad}",
                  String(resultados.length),
                )
              : textos.inicio.descripcionDestacados
          }
          eventos={filtros ? resultados : eventos.slice(0, 4)}
          onAbrir={abrirEvento}
          cargando={destacadosRecurso.cargando}
          error={destacadosRecurso.error}
          onReintentar={destacadosRecurso.recargar}
        />
        {!filtros && (
          <SeccionEventos
            id="eventos-ciudad"
            en={en}
            titulo={textos.inicio.manizales}
            descripcion={textos.inicio.descripcionManizales}
            eventos={eventosManizales}
            onAbrir={abrirEvento}
            cargando={manizalesRecurso.cargando}
            error={manizalesRecurso.error}
            onReintentar={manizalesRecurso.recargar}
          />
        )}
      </div>
      <DialogoDetalle detalle={detalle} onCerrar={() => setDetalle(null)} />
    </LayoutPublico>
  );
}
