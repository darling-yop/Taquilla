"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LayoutPublico from "../../components/LayoutPublico/LayoutPublico";
import EventGrid from "../../components/EventGrid/EventGrid";
import FilterChips from "../../components/FilterChips/FilterChips";
import SortSelect from "../../components/SortSelect/SortSelect";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import DialogoDetalle from "../../components/DialogoDetalle/DialogoDetalle";
import AficheEvento from "../../components/AficheEvento/AficheEvento";
import { useDetalle } from "../../hooks/useDetalle";
import { usePreferencias } from "../../context/PreferenciasContext";
import { categoriasMock, eventosMock } from "../../data/eventosMock";
import type { EventoListado } from "../../data/eventosMock";
import type { EventSort } from "../../components/SortSelect/SortSelect";
import "./ExplorarPage.css";
import { formatearTexto } from "../../services/textos";

const categoriasPredeterminadas = ["conciertos", "festivales"];
const categoriasValidas = categoriasMock.map(({ id }) => id.toLowerCase());
const periodoPredeterminado = "fin-semana";
const precioMinimoPredeterminado = 30000;
const precioMaximoPredeterminado = 150000;

function parametrosActualizados(
  actuales: URLSearchParams,
  cambios: Record<string, string>,
) {
  const siguientes = new URLSearchParams(actuales);
  Object.entries(cambios).forEach(([clave, valor]) => {
    if (valor) siguientes.set(clave, valor);
    else siguientes.delete(clave);
  });
  siguientes.set("filtros", "personalizados");
  return siguientes;
}

export default function ExplorarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parametros = useMemo(
    () => new URLSearchParams(searchParams?.toString()),
    [searchParams],
  );
  const { idioma, textos } = usePreferencias();
  const en = idioma === "en";
  const { detalle, setDetalle, abrirCuenta } = useDetalle(textos);
  const esPersonalizado = parametros.get("filtros") === "personalizados";
  const categorias = useMemo(
    () =>
      parametros.has("categoria")
        ? (parametros.get("categoria") ?? "")
            .split(",")
            .filter((categoria) => categoriasValidas.includes(categoria))
        : esPersonalizado
          ? []
          : categoriasPredeterminadas,
    [esPersonalizado, parametros],
  );
  const periodo = parametros.has("periodo")
    ? (parametros.get("periodo") ?? "")
    : esPersonalizado
      ? ""
      : periodoPredeterminado;
  const ciudad = parametros.has("ciudad")
    ? (parametros.get("ciudad") ?? "")
    : esPersonalizado
      ? ""
      : "Manizales";
  const minimo = Number(parametros.get("precioMin"));
  const maximo = Number(parametros.get("precioMax"));
  const precioMinimo =
    Number.isSafeInteger(minimo) &&
    minimo >= precioMinimoPredeterminado &&
    minimo <= precioMaximoPredeterminado
      ? minimo
      : precioMinimoPredeterminado;
  const precioMaximo =
    Number.isSafeInteger(maximo) &&
    maximo >= precioMinimo &&
    maximo <= precioMaximoPredeterminado
      ? maximo
      : precioMaximoPredeterminado;
  const orden = (["fecha", "precio", "precio-desc"] as const).includes(
    parametros.get("orden") as EventSort,
  )
    ? (parametros.get("orden") as EventSort)
    : "fecha";

  const eventos = useMemo(
    () =>
      eventosMock
        .filter(
          (evento) =>
            (categorias.length === 0 ||
              categorias.includes(evento.categoria.toLowerCase())) &&
            (!ciudad || evento.ciudad === ciudad) &&
            evento.precio >= precioMinimo &&
            evento.precio <= precioMaximo,
        )
        .sort((a, b) => {
          if (orden === "precio") return a.precio - b.precio;
          if (orden === "precio-desc") return b.precio - a.precio;
          return a.fecha.localeCompare(b.fecha);
        }),
    [categorias, ciudad, orden, precioMinimo, precioMaximo],
  );

  function cambiarFiltros(cambios: Record<string, string>) {
    const base = new URLSearchParams(parametros);
    if (!esPersonalizado) {
      if (!base.has("categoria")) {
        base.set("categoria", categoriasPredeterminadas.join(","));
      }
      if (!base.has("periodo")) {
        base.set("periodo", periodoPredeterminado);
      }
      if (!base.has("ciudad")) base.set("ciudad", "Manizales");
      if (!base.has("precioMin")) {
        base.set("precioMin", String(precioMinimoPredeterminado));
      }
      if (!base.has("precioMax")) {
        base.set("precioMax", String(precioMaximoPredeterminado));
      }
    }
    const siguientes = parametrosActualizados(base, cambios);
    const query = siguientes.toString();
    router.push(query ? `/explorar?${query}` : "/explorar");
  }

  function quitarCategoria(categoria: string) {
    cambiarFiltros({
      categoria: categorias.filter((actual) => actual !== categoria).join(","),
    });
  }

  function cambiarCategoria(categoria: string, seleccionado: boolean) {
    const siguientes = seleccionado
      ? [...categorias, categoria]
      : categorias.filter((actual) => actual !== categoria);
    cambiarFiltros({ categoria: siguientes.join(",") });
  }

  function abrirEvento(evento: EventoListado) {
    const fecha = new Intl.DateTimeFormat(en ? "en-CO" : "es-CO", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Bogota",
    }).format(new Date(evento.fecha));
    setDetalle({
      titulo: evento.nombre,
      descripcion: `${fecha} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />
          <p>
            {textos.comun.desde}{" "}
            {new Intl.NumberFormat(en ? "en-CO" : "es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            })
              .format(evento.precio)
              .replace(/\s+/g, " ")}
          </p>
        </div>
      ),
      cerrar: textos.comun.cerrar,
    });
  }

  const formateadorMoneda = new Intl.NumberFormat(en ? "en-CO" : "es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
  const chips = [
    ...categorias.map((categoria) => ({
      id: `categoria-${categoria}`,
      label:
        textos.categorias[
          categoriasMock.find(({ id }) => id.toLowerCase() === categoria)?.id ??
            "Conciertos"
        ],
      onRemove: () => quitarCategoria(categoria),
    })),
    ...(ciudad
      ? [
          {
            id: "ciudad",
            label: ciudad,
            onRemove: () => cambiarFiltros({ ciudad: "" }),
          },
        ]
      : []),
    ...(precioMinimo !== precioMinimoPredeterminado ||
    precioMaximo !== precioMaximoPredeterminado
      ? [
          {
            id: "precio",
            label: `${formateadorMoneda.format(precioMinimo).replace(/\s+/g, " ")} – ${formateadorMoneda.format(precioMaximo).replace(/\s+/g, " ")}`,
            onRemove: () =>
              cambiarFiltros({
                precioMin: String(precioMinimoPredeterminado),
                precioMax: String(precioMaximoPredeterminado),
              }),
          },
        ]
      : []),
    ...(periodo
      ? [
          {
            id: "periodo",
            label:
              periodo === "fin-semana"
                ? textos.explorar.esteFinDeSemana
                : periodo === "personalizado"
                  ? textos.explorar.elegirFechas
                  : periodo === "hoy"
                    ? textos.explorar.hoy
                    : textos.explorar.esteMes,
            onRemove: () => cambiarFiltros({ periodo: "" }),
          },
        ]
      : []),
  ];

  return (
    <LayoutPublico
      destino="/explorar"
      inicioDestino="/"
      buscarDestino="#resultados-explorar"
      etiqueta={textos.interfaz.explora}
      descripcion={textos.pie.descripcion}
      onCuenta={abrirCuenta}
    >
      <div className="ancho-home pagina-explorar">
        <header className="encabezado-explorar">
          <nav
            className="migas-explorar"
            aria-label={textos.interfaz.navegacion}
          >
            <Link href="/">{textos.interfaz.inicio}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{textos.explorar.titulo}</span>
          </nav>
          <h1>{textos.explorar.titulo.replace(" · Taquilla", "")}</h1>
          <p role="status" aria-live="polite">
            {formatearTexto(textos.explorar.resultados, {
              cantidad: String(eventos.length),
            })}
          </p>
        </header>

        <div className="exploracion-layout">
          <FilterSidebar
            key={parametros.toString()}
            categorias={categorias}
            periodo={periodo}
            ciudad={ciudad}
            minimo={precioMinimo}
            maximo={precioMaximo}
            textos={textos.explorar}
            nombresCategoria={textos.categorias}
            idioma={idioma}
            onCategoria={cambiarCategoria}
            onPeriodo={(valor) => cambiarFiltros({ periodo: valor })}
            onCiudad={(valor) => cambiarFiltros({ ciudad: valor })}
            onPrecio={(min, max) =>
              cambiarFiltros({
                precioMin: String(min),
                precioMax: String(max),
              })
            }
            onLimpiar={() => router.push("/explorar?filtros=personalizados")}
          />
          <section
            className="resultados-explorar"
            id="resultados-explorar"
            aria-label={textos.explorar.tituloResultados}
          >
            <div className="resultados-toolbar">
              <FilterChips
                filters={chips}
                removeLabel={textos.explorar.limpiar}
                ariaLabel={textos.explorar.filtrosActivos}
              />
              <SortSelect
                value={orden}
                label={textos.explorar.orden}
                options={[
                  { value: "fecha", label: textos.explorar.ordenFecha },
                  { value: "precio", label: textos.explorar.ordenPrecio },
                  {
                    value: "precio-desc",
                    label: textos.explorar.ordenPrecioMayor,
                  },
                ]}
                onChange={(valor) => cambiarFiltros({ orden: valor })}
              />
            </div>
            <EventGrid
              eventos={eventos}
              onVerEvento={abrirEvento}
              ariaLabel={textos.explorar.tituloResultados}
            />
          </section>
        </div>
      </div>
      <DialogoDetalle detalle={detalle} onCerrar={() => setDetalle(null)} />
    </LayoutPublico>
  );
}
