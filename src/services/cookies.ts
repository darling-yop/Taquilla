import { proyecto } from "../config/proyecto";

const nombre = (clave: string) => `${proyecto.id}_${clave}`;

export function leerCookie(clave: string) {
  const prefijo = `${nombre(clave)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((valor) => valor.startsWith(prefijo));
  try {
    return cookie ? decodeURIComponent(cookie.slice(prefijo.length)) : null;
  } catch {
    return null;
  }
}

export function guardarCookie(clave: string, valor: string) {
  document.cookie = `${nombre(clave)}=${encodeURIComponent(valor)}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  if (leerCookie(clave) !== valor) throw new Error("cookie_no_guardada");
}

export function borrarCookie(clave: string) {
  document.cookie = `${nombre(clave)}=; Path=/; Max-Age=0; SameSite=Lax`;
  if (leerCookie(clave) !== null) throw new Error("cookie_no_borrada");
}
