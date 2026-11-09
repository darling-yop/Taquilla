import { Suspense } from "react";
import type { ReactNode } from "react";
import ExplorarPage from "./ExplorarPage";

export const metadata = {
  title: "Explorar eventos · Taquilla",
  description: "Busca y filtra eventos en Taquilla.",
};

function CargandoExploracion(): ReactNode {
  return (
    <main className="ancho-home estado-exploracion" aria-busy="true">
      <p role="status">Cargando eventos…</p>
    </main>
  );
}

export default function PaginaExplorar() {
  return (
    <Suspense fallback={<CargandoExploracion />}>
      <ExplorarPage />
    </Suspense>
  );
}
