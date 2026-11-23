export const formatPrice = (value: number): string =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export const formatKm = (value: number): string => `${value.toLocaleString("es-AR")} km`;

// La fecha llega como ISO en UTC: se muestra en UTC para que no "corra" un dia por la zona horaria.
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-AR", { timeZone: "UTC" });
