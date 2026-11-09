import type { CategoriaEvento } from "../types";

export const categoriasEn: Record<CategoriaEvento, string> = {
  Conciertos: "Concerts",
  Teatro: "Theatre",
  Deportes: "Sports",
  Festivales: "Festivals",
  Comedia: "Comedy",
  Familiares: "Family",
};
export const dinero = (valor: number) => `$${valor.toLocaleString("es-CO")}`;
export const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
