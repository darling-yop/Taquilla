import type { ReactNode } from "react";

export type CategoriaEvento =
  | "Conciertos"
  | "Teatro"
  | "Deportes"
  | "Festivales"
  | "Comedia"
  | "Familiares";

export interface Evento {
  id: string;
  slug: string;
  nombre: string;
  categoria: CategoriaEvento;
  etiqueta: string;
  fecha: string;
  horario: string;
  lugar: string;
  ciudad: string;
  precio: number;
  arte: number;
  color1?: string;
  color2?: string;
}

export interface Categoria {
  id: CategoriaEvento;
  nombre: string;
  eventos: number;
}

export interface FiltrosEventos {
  consulta?: string;
  ciudad?: string;
  fecha?: string;
  categoria?: CategoriaEvento;
}

export interface Detalle {
  titulo: string;
  descripcion?: string;
  contenido?: ReactNode;
  cerrar?: string;
}

export type TipoCuenta = "ingresar" | "registro";
