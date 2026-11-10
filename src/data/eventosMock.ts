import type { CategoriaEvento } from "../types";

export interface EventoListado {
  id: string;
  nombre: string;
  categoria: CategoriaEvento;
  fecha: string;
  lugar: string;
  ciudad: string;
  precio: number;
  arte: number;
}

export const categoriasMock: {
  id: CategoriaEvento;
  cantidad: number;
}[] = [
  { id: "Conciertos", cantidad: 42 },
  { id: "Teatro", cantidad: 18 },
  { id: "Deportes", cantidad: 12 },
  { id: "Festivales", cantidad: 9 },
  { id: "Comedia", cantidad: 7 },
  { id: "Familiares", cantidad: 11 },
];

export const eventosMock: EventoListado[] = [
  {
    id: "noche-de-salsa-brava",
    nombre: "Noche de Salsa Brava",
    categoria: "Conciertos",
    fecha: "2026-11-14T20:00:00-05:00",
    lugar: "Teatro Aurora",
    ciudad: "Manizales",
    precio: 95000,
    arte: 0,
  },
  {
    id: "festival-niebla-2026",
    nombre: "Festival Niebla 2026",
    categoria: "Festivales",
    fecha: "2026-11-20T16:00:00-05:00",
    lugar: "Parque del Bosque",
    ciudad: "Manizales",
    precio: 140000,
    arte: 1,
  },
  {
    id: "la-casa-de-los-relojes",
    nombre: "La casa de los relojes",
    categoria: "Teatro",
    fecha: "2026-11-21T19:30:00-05:00",
    lugar: "Teatro Aurora",
    ciudad: "Manizales",
    precio: 60000,
    arte: 2,
  },
  {
    id: "clasico-montana-vs-rio",
    nombre: "Clásico Montaña vs. Río",
    categoria: "Deportes",
    fecha: "2026-11-22T17:00:00-05:00",
    lugar: "Estadio Norte",
    ciudad: "Pereira",
    precio: 45000,
    arte: 3,
  },
  {
    id: "sinfonica-bajo-las-estrellas",
    nombre: "Sinfónica bajo las estrellas",
    categoria: "Conciertos",
    fecha: "2026-11-27T19:00:00-05:00",
    lugar: "Auditorio Mayor",
    ciudad: "Bogotá",
    precio: 80000,
    arte: 4,
  },
  {
    id: "risas-sin-filtro",
    nombre: "Risas sin filtro",
    categoria: "Comedia",
    fecha: "2026-11-28T20:00:00-05:00",
    lugar: "Sala La Tertulia",
    ciudad: "Medellín",
    precio: 55000,
    arte: 5,
  },
];
