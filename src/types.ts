import type { ReactNode } from "react";

export type CategoriaEvento =
  | "Conciertos"
  | "Teatro"
  | "Deportes"
  | "Festivales"
  | "Comedia"
  | "Familiares";

export interface Evento {
  nombre: string;
  categoria: CategoriaEvento;
  etiqueta: string;
  fecha: string;
  horario: string;
  lugar: string;
  ciudad: string;
  precio: number;
  arte: number;
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
