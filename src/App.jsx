import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

function leerSeccion() {
  return window.location.hash.slice(1) || "explorar";
}

function App() {
  // Idiom por defecto español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [consulta, setConsulta] = useState("explorar");
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);
  console.log(datos);

  const ingles = idioma === "en";
  const titulo =
    activo === "favoritos"
      ? datos.textos?.navbar.botones.favoritos
      : datos.textos?.navbar.enlaces[activo];

  //Va a sincronizar el estado del componente con el hash de la URL
  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
      setConsulta("");
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function buscar(valor) {
    setConsulta(valor);
    setActivo("conciertos");
    //window.history es el que da acceso al historial de la pestaña
    window.history.replaceState(null, "", "#conciertos");
  }

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        texto={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
      <main className="contenedor demo-contenido"></main>
      <p>{ingles ? "English content" : "Contenido en español"}</p>
      <p>{titulo ?? (ingles ? "Navegation" : "Navegacion")}</p>
      <p role="status">
        {consulta
          ? `${ingles ? "Search submitted" : "Busqueda enviada"}: ${consulta}`
          : ingles
            ? "Select a link"
            : "Selecciona un enlace"}
      </p>
      <p>
        
        {ingles
          ? "This example loads navegation Labels from the API "
          : "Este ejemplo carga los tecrtos del menu desde la API"}
      </p>
    </>
  );
}

export default App;
