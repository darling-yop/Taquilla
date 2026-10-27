
const OPCIONES_FECHA = ["hoy", "finDeSemana", "mes", "rango"];

export default function FiltrosExplorar({
  t,
  filtros,
  categorias,
  ciudades,
  hayFiltros,
  onCambiar,
  onLimpiar,
}) {
  return (
    <aside className="filtros" aria-label={t.filtros}>
      <div className="filtros-cabecera">
        <h2 className="filtros-titulo">{t.filtros}</h2>

        {hayFiltros && (
          <button
            type="button"
            className="filtros-limpiar"
            onClick={onLimpiar}
          >
            {t.limpiar}
          </button>
        )}
      </div>

      <fieldset className="filtros-grupo">
        <legend>{t.categoria}</legend>

        <label className="filtros-opcion">
          <input
            type="radio"
            name="categoria"
            value=""
            checked={!filtros.categoria}
            onChange={() => onCambiar({ categoria: undefined })}
          />
          <span>{t.todasCategorias}</span>
        </label>

        {categorias.map(({ clave, nombre }) => (
          <label key={clave} className="filtros-opcion">
            <input
              type="radio"
              name="categoria"
              value={clave}
              checked={filtros.categoria === clave}
              onChange={() => onCambiar({ categoria: clave })}
            />
            <span>{nombre}</span>
          </label>
        ))}
      </fieldset>

      <div
        className="filtros-grupo"
        role="group"
        aria-labelledby="filtro-fecha-titulo"
      >
        <p id="filtro-fecha-titulo" className="filtros-etiqueta">
          {t.fecha}
        </p>

        <div className="filtros-pildoras">
          {OPCIONES_FECHA.map((clave) => (
            <button
              key={clave}
              type="button"
              className="pildora"
              aria-pressed={filtros.fecha === clave}
              onClick={() =>
                onCambiar({
                  fecha: filtros.fecha === clave ? undefined : clave,
                  desde: undefined,
                  hasta: undefined,
                })
              }
            >
              {t.fechas?.[clave]}
            </button>
          ))}
        </div>

        {filtros.fecha === "rango" && (
          <div className="filtros-rango">
            <label>
              <span>{t.desde}</span>
              <input
                type="date"
                value={filtros.desde ?? ""}
                max={filtros.hasta || undefined}
                onChange={(e) =>
                  onCambiar({ desde: e.target.value || undefined })
                }
              />
            </label>

            <label>
              <span>{t.hasta}</span>
              <input
                type="date"
                value={filtros.hasta ?? ""}
                min={filtros.desde || undefined}
                onChange={(e) =>
                  onCambiar({ hasta: e.target.value || undefined })
                }
              />
            </label>
          </div>
        )}
      </div>

      <div className="filtros-grupo">
        <label className="filtros-etiqueta" htmlFor="filtro-ciudad">
          {t.ciudad}
        </label>

        <select
          id="filtro-ciudad"
          className="filtros-select"
          value={filtros.ciudad ?? ""}
          onChange={(e) =>
            onCambiar({ ciudad: e.target.value || undefined })
          }
        >
          <option value="">{t.todasCiudades}</option>

          {ciudades.map(({ nombre }) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
