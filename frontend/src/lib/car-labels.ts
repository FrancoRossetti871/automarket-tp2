// Textos en castellano para los valores que se guardan "en codigo" en la base.
import type { BodyType, Fuel, Traction, Transmission } from "../types/car";

export const transmissionLabels: Record<Transmission, string> = {
  manual: "Manual",
  automatica: "Automatica",
};

export const fuelLabels: Record<Fuel, string> = {
  nafta: "Nafta",
  diesel: "Diesel",
  hibrido: "Hibrido",
  electrico: "Electrico",
  gnc: "GNC",
};

export const bodyTypeLabels: Record<BodyType, string> = {
  sedan: "Sedan",
  hatchback: "Hatchback",
  suv: "SUV",
  pickup: "Pick-up",
  coupe: "Coupe",
  utilitario: "Utilitario",
};

export const tractionLabels: Record<Traction, string> = {
  "4x2": "4x2",
  "4x4": "4x4",
};
