"use client";

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
  const { idioma } = usePreferencias();
  const en = idioma === "en";
  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);
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
  const { filtros, resultados, buscar, setFiltros, filtrarCategoria } =
    useEventos(eventos);
  function abrirEvento(evento: Evento) {
    setDetalle({
      titulo: evento.nombre,
      descripcion: `${evento.horario} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />
          <p>{dinero(evento.precio)} COP</p>
          <small>
            {en
              ? "Sample event. Tickets are not for sale."
              : "Evento de ejemplo. No hay venta de entradas."}
          </small>
        </div>
      ),
      cerrar: en ? "Close" : "Cerrar",
    });
  }
  return (
    <LayoutPublico
      destino="#eventos"
      etiqueta={en ? "Explore" : "Explorar"}
      descripcion={
        en
          ? "Concerts, theatre, sports and festivals in one place."
          : "Conciertos, teatro, deportes y festivales en un solo lugar."
      }
      onCuenta={abrirCuenta}
    >
      <HeroTaquilla
        en={en}
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
          onBuscar={buscar}
          filtrosAplicados={filtros}
        />
      </HeroTaquilla>
      <div className="ancho-home">
        <CategoriasEventos
          categorias={categorias}
          filtros={filtros}
          en={en}
          filtrarCategoria={filtrarCategoria}
          cargando={categoriasRecurso.cargando}
          error={categoriasRecurso.error}
          onReintentar={categoriasRecurso.recargar}
        />
        <SeccionEventos
          id="eventos"
          titulo={
            filtros
              ? en
                ? "Search results"
                : "Resultados de búsqueda"
              : en
                ? "Featured events"
                : "Eventos destacados"
          }
          descripcion={
            filtros
              ? `${resultados.length} ${en ? "results" : "resultados"}`
              : en
                ? "Explore our event selection"
                : "Explora nuestra selección de eventos"
          }
          eventos={filtros ? resultados : eventos.slice(0, 4)}
          en={en}
          onAbrir={abrirEvento}
          onVerTodos={() => buscar({})}
          cargando={destacadosRecurso.cargando}
          error={destacadosRecurso.error}
          onReintentar={destacadosRecurso.recargar}
        />
        {!filtros && (
          <SeccionEventos
            id="eventos-ciudad"
            titulo={en ? "Events in Manizales" : "Eventos en Manizales"}
            descripcion={
              en
                ? "Discover events in your city"
                : "Descubre los eventos de tu ciudad"
            }
            eventos={eventosManizales}
            en={en}
            onAbrir={abrirEvento}
            onVerTodos={() => buscar({ ciudad: "Manizales" })}
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
