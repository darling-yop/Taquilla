import { textosCookies as cookiesEn } from "./translations/en";
import { textosCookies as cookiesEs } from "./translations/es";
import { textosCabecera as cabeceraEn } from "./translations/en";
import { textosCabecera as cabeceraEs } from "./translations/es";

export const interfaz = {
  es: {
    ...cookiesEs,
    ...cabeceraEs,
    inicio: cabeceraEs.headerInicio,
    ingresar: cabeceraEs.headerIngresar,
    registro: cabeceraEs.headerCrearCuenta,
    abrirMenu: cabeceraEs.headerAbrirMenu,
    cerrarMenu: cabeceraEs.headerCerrarMenu,
    navegacion: cabeceraEs.headerNavegacion,
    idioma: cabeceraEs.headerIdioma,
    accesibilidad: {
      abrir: cabeceraEs.headerAbrirAccesibilidad,
      titulo: "Accesibilidad",
      descripcion: "Ajusta la visualización para facilitar la lectura.",
      tamanoTexto: "Tamaño del texto",
      normal: "Normal",
      grande: "Grande",
      muyGrande: "Muy grande",
      altoContraste: "Alto contraste",
      subrayarEnlaces: "Subrayar enlaces",
      reducirMovimiento: "Reducir animaciones",
      restablecer: "Restablecer ajustes",
      cerrar: "Cerrar panel",
      error: "No se pudieron guardar los ajustes en este navegador.",
    },
    buscar: cabeceraEs.headerBuscar,
    explora: cabeceraEs.headerExplorar,
    cuenta: "Tu cuenta",
    academico: "Proyecto académico",
    saltar: "Saltar al contenido",
  },
  en: {
    ...cookiesEn,
    ...cabeceraEn,
    inicio: cabeceraEn.headerInicio,
    ingresar: cabeceraEn.headerIngresar,
    registro: cabeceraEn.headerCrearCuenta,
    abrirMenu: cabeceraEn.headerAbrirMenu,
    cerrarMenu: cabeceraEn.headerCerrarMenu,
    navegacion: cabeceraEn.headerNavegacion,
    idioma: cabeceraEn.headerIdioma,
    accesibilidad: {
      abrir: cabeceraEn.headerAbrirAccesibilidad,
      titulo: "Accessibility",
      descripcion: "Adjust the display to make reading easier.",
      tamanoTexto: "Text size",
      normal: "Normal",
      grande: "Large",
      muyGrande: "Extra large",
      altoContraste: "High contrast",
      subrayarEnlaces: "Underline links",
      reducirMovimiento: "Reduce animations",
      restablecer: "Reset settings",
      cerrar: "Close panel",
      error: "Settings could not be saved in this browser.",
    },
    buscar: cabeceraEn.headerBuscar,
    explora: cabeceraEn.headerExplorar,
    cuenta: "Your account",
    academico: "Academic project",
    saltar: "Skip to content",
  },
};

export type Idioma = keyof typeof interfaz;
export type TextosInterfaz = (typeof interfaz)[Idioma];
