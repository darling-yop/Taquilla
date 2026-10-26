import { useState } from "react";
import {
  crearCuenta,
  iniciarSesion,
  reenviarVerificacion,
  verificarCorreo,
} from "../services/cuentaService.js";
import "../styles/Acciones.css";

export default function Cuenta({ tipo, textos, idioma, onLogin }) {
  const ingles = idioma === "en";
  const registro = tipo === "crearCuenta";
  const pagina = textos?.paginas?.[registro ? "registro" : "ingresar"];
  const formulario = pagina?.formulario;
  const campos = textos?.formularios?.campos;
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [erroresCampo, setErroresCampo] = useState({});
  const [aviso, setAviso] = useState("");
  const [verificacion, setVerificacion] = useState(null);
  const [codigo, setCodigo] = useState("");

  const etiqueta = (clave, alternativa) => campos?.[clave]?.label ?? alternativa;
  const textoError = (errorConsulta) => {
    const mensaje =
      textos?.errores?.[errorConsulta.codigo] ?? errorConsulta.message;
    return mensaje?.replace(
      "{segundos}",
      errorConsulta.retryAfter ?? "",
    ) ?? (ingles ? "Something went wrong. Try again." : "Ocurrió un error.");
  };

  async function enviar(evento) {
    evento.preventDefault();
    setCargando(true);
    setError("");
    setErroresCampo({});
    setAviso("");

    const datos = new FormData(evento.currentTarget);
    const correo = String(datos.get("correo")).trim();
    const clave = String(datos.get("clave"));

    try {
      if (registro) {
        if (clave !== datos.get("confirmar")) {
          setErroresCampo({
            confirmar: ingles
              ? "Passwords do not match."
              : "Las contraseñas no coinciden.",
          });
          return;
        }
        if (!datos.get("terminos")) {
          setError(
            ingles
              ? "Accept the terms to continue."
              : "Debes aceptar los términos para continuar.",
          );
          return;
        }

        const respuesta = await crearCuenta({
          nombre: String(datos.get("nombre")).trim(),
          correo,
          clave,
        });
        onLogin?.(respuesta.usuario);
        setVerificacion({
          correo,
          codigoDePrueba: respuesta.verificacion?.codigoDePrueba,
        });
      } else {
        const respuesta = await iniciarSesion({ correo, clave });
        onLogin?.(respuesta.usuario);
        setAviso(
          ingles
            ? `Signed in${respuesta.usuario?.nombre ? ` as ${respuesta.usuario.nombre}` : ""}.`
            : `Sesión iniciada${respuesta.usuario?.nombre ? ` como ${respuesta.usuario.nombre}` : ""}.`,
        );
      }
    } catch (errorConsulta) {
      setError(textoError(errorConsulta));
      setErroresCampo(errorConsulta.campos ?? {});
    } finally {
      setCargando(false);
    }
  }

  async function confirmarCorreo(evento) {
    evento.preventDefault();
    setCargando(true);
    setError("");
    setAviso("");

    try {
      await verificarCorreo({ correo: verificacion.correo, codigo });
      setAviso(
        ingles
          ? "Email verified. You can now sign in."
          : "Correo verificado. Ya puedes ingresar.",
      );
      setVerificacion(null);
    } catch (errorConsulta) {
      setError(textoError(errorConsulta));
    } finally {
      setCargando(false);
    }
  }

  async function reenviarCodigo() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await reenviarVerificacion({
        correo: verificacion.correo,
      });
      setVerificacion((actual) => ({
        ...actual,
        codigoDePrueba: respuesta.codigoDePrueba,
      }));
      setAviso(
        ingles
          ? "A new verification code was generated."
          : "Se generó un nuevo código de verificación.",
      );
    } catch (errorConsulta) {
      setError(textoError(errorConsulta));
    } finally {
      setCargando(false);
    }
  }

  if (verificacion) {
    return (
      <main className="vista-accion" id="explorar">
        <section className="formulario-cuenta" aria-labelledby="cuenta-titulo">
          <h1 id="cuenta-titulo">
            {ingles ? "Verify your email" : "Verifica tu correo"}
          </h1>
          <p>{verificacion.correo}</p>
          {verificacion.codigoDePrueba && (
            <p role="status">
              {ingles ? "Test code:" : "Código de prueba:"}{" "}
              <strong>{verificacion.codigoDePrueba}</strong>
            </p>
          )}
          <form onSubmit={confirmarCorreo}>
            <label>
              {ingles ? "Verification code" : "Código de verificación"}
              <input
                name="codigo"
                value={codigo}
                onChange={(evento) => setCodigo(evento.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={cargando}>
              {ingles ? "Verify email" : "Verificar correo"}
            </button>
          </form>
          <button type="button" onClick={reenviarCodigo} disabled={cargando}>
            {ingles ? "Send a new code" : "Enviar otro código"}
          </button>
          {error && <p role="alert">{error}</p>}
          {aviso && <p role="status">{aviso}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="vista-accion" id="explorar">
      <section className="formulario-cuenta" aria-labelledby="cuenta-titulo">
        <h1 id="cuenta-titulo">
          {formulario?.titulo ??
            (registro
              ? ingles
                ? "Create your account"
                : "Crear cuenta"
              : ingles
                ? "Sign in"
                : "Ingresar")}
        </h1>
        {formulario?.subtitulo && <p>{formulario.subtitulo}</p>}

        <form onSubmit={enviar}>
          {registro && (
            <label>
              {etiqueta("nombreCompleto", ingles ? "Full name" : "Nombre completo")}
              <input
                name="nombre"
                autoComplete="name"
                minLength="2"
                maxLength="80"
                required
              />
              {erroresCampo.nombre && <span>{erroresCampo.nombre}</span>}
            </label>
          )}
          <label>
            {etiqueta("correo", ingles ? "Email" : "Correo electrónico")}
            <input
              name="correo"
              type="email"
              autoComplete="email"
              required
            />
            {erroresCampo.correo && <span>{erroresCampo.correo}</span>}
          </label>
          <label>
            {etiqueta("clave", ingles ? "Password" : "Contraseña")}
            <input
              name="clave"
              type="password"
              autoComplete={registro ? "new-password" : "current-password"}
              minLength="8"
              maxLength="72"
              required
            />
            {erroresCampo.clave && <span>{erroresCampo.clave}</span>}
          </label>
          {registro && (
            <>
              <label>
                {ingles ? "Confirm password" : "Confirmar contraseña"}
                <input
                  name="confirmar"
                  type="password"
                  autoComplete="new-password"
                  minLength="8"
                  maxLength="72"
                  required
                />
                {erroresCampo.confirmar && (
                  <span>{erroresCampo.confirmar}</span>
                )}
              </label>
              <label className="terminos-cuenta">
                <input name="terminos" type="checkbox" required />
                {formulario?.etiquetas?.terminos ??
                  (ingles
                    ? "I accept the terms and privacy policy."
                    : "Acepto los términos y la política de privacidad.")}
              </label>
            </>
          )}
          {error && <p role="alert">{error}</p>}
          {aviso && <p role="status">{aviso}</p>}
          <button type="submit" disabled={cargando}>
            {cargando
              ? ingles
                ? "Please wait…"
                : "Espera…"
              : formulario?.botones?.[registro ? "crearCuenta" : "ingresar"] ??
                (registro
                  ? ingles
                    ? "Create account"
                    : "Crear cuenta"
                  : ingles
                    ? "Sign in"
                    : "Ingresar")}
          </button>
        </form>
        <a href={registro ? "#ingresar" : "#crearCuenta"}>
          {registro
            ? ingles
              ? "Already have an account? Sign in"
              : "¿Ya tienes cuenta? Ingresar"
            : ingles
              ? "Create an account"
              : "Crear una cuenta"}
        </a>
      </section>
    </main>
  );
}
