import { Instrument_Sans } from "next/font/google";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { PreferenciasProvider } from "../context/PreferenciasContext";
import { proyecto } from "../config/proyecto";
import "./../styles/tokens.css";
import "./../styles/base.css";

const fuente = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fuente-instrument-sans",
  display: "swap",
});

export const metadata = {
  title: "Taquilla · Inicio",
  description: "Explora conciertos, teatro, deportes y festivales.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const valorConsentimiento = cookieStore.get(
    `${proyecto.id}_consentimiento`,
  )?.value;
  const consentimiento =
    valorConsentimiento === "aceptado" || valorConsentimiento === "rechazado"
      ? valorConsentimiento
      : null;
  const idioma =
    consentimiento === "aceptado" &&
    cookieStore.get(`${proyecto.id}_idioma`)?.value === "en"
      ? "en"
      : "es";

  return (
    <html lang={idioma} className={fuente.variable}>
      <body>
        <PreferenciasProvider
          initialConsentimiento={consentimiento}
          initialIdioma={idioma}
        >
          {children}
        </PreferenciasProvider>
      </body>
    </html>
  );
}
