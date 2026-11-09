const apiPorDefecto = "https://yanethm-taquilla-api.fly.dev/api/v1";
const apiConfigurada = process.env.NEXT_PUBLIC_API_URL?.trim();

export const proyecto = {
  id: "taquilla",
  nombre: "taquilla",
  api: (apiConfigurada || apiPorDefecto).replace(/\/+$/, ""),
};
