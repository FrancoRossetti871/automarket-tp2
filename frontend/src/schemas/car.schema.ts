import { z } from "zod";
import { BODY_TYPES, FUELS, TRACTIONS, TRANSMISSIONS, type Car, type CarPayload } from "../types/car";

const currentYear = new Date().getFullYear();

// Validacion del lado del cliente. El backend vuelve a validar con su propio schema (nunca confiar en el front).
export const carSchema = z.object({
  brand: z.string().trim().min(1, { error: "La marca es obligatoria" }).max(60),
  modelName: z.string().trim().min(1, { error: "El modelo es obligatorio" }).max(80),
  year: z
    .number({ error: "Ingresa un año" })
    .int({ error: "El año debe ser entero" })
    .min(1950, { error: "El año minimo es 1950" })
    .max(currentYear + 1, { error: `El año maximo es ${currentYear + 1}` }),
  price: z.number({ error: "Ingresa un precio" }).min(0, { error: "El precio no puede ser negativo" }),
  mileage: z
    .number({ error: "Ingresa el kilometraje" })
    .int({ error: "El kilometraje debe ser entero" })
    .min(0, { error: "El kilometraje no puede ser negativo" }),
  entryDate: z.string().min(1, { error: "La fecha de ingreso es obligatoria" }),
  used: z.boolean(),
  // Ficha tecnica
  engine: z.string().trim().max(60, { error: "Maximo 60 caracteres" }),
  horsepower: z
    .number({ error: "Ingresa la potencia" })
    .int({ error: "La potencia debe ser entera" })
    .min(0, { error: "No puede ser negativa" })
    .max(2000, { error: "Maximo 2000 CV" }),
  transmission: z.enum(TRANSMISSIONS),
  fuel: z.enum(FUELS),
  bodyType: z.enum(BODY_TYPES),
  traction: z.enum(TRACTIONS),
  doors: z
    .number({ error: "Ingresa la cantidad de puertas" })
    .int()
    .min(2, { error: "Minimo 2 puertas" })
    .max(5, { error: "Maximo 5 puertas" }),
  color: z.string().trim().max(40, { error: "Maximo 40 caracteres" }),
  // En el form el equipamiento se escribe uno por linea; al guardar se convierte a lista (toCarPayload).
  featuresText: z
    .string()
    .refine((text) => splitFeatures(text).length <= 20, { error: "Maximo 20 items de equipamiento" })
    .refine((text) => splitFeatures(text).every((item) => item.length <= 80), {
      error: "Cada item admite hasta 80 caracteres",
    }),
  description: z.string().trim().max(500, { error: "Maximo 500 caracteres" }),
  // Vacio, URL externa (https://...) o ruta propia del front (/cars/foto.jpg)
  imageUrl: z.union([
    z.literal(""),
    z.url({ error: "Ingresa una URL valida (https://...) o una ruta como /cars/foto.jpg" }),
    z.string().regex(/^\/[\w\-./]+$/, { error: "Ingresa una URL valida (https://...) o una ruta como /cars/foto.jpg" }),
  ]),
  active: z.boolean(),
});

export type CarFormValues = z.infer<typeof carSchema>;

function splitFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const emptyCar: CarFormValues = {
  brand: "",
  modelName: "",
  year: currentYear,
  price: 0,
  mileage: 0,
  entryDate: new Date().toISOString().slice(0, 10),
  used: false,
  engine: "",
  horsepower: 0,
  transmission: "manual",
  fuel: "nafta",
  bodyType: "sedan",
  traction: "4x2",
  doors: 4,
  color: "",
  featuresText: "",
  description: "",
  imageUrl: "",
  active: true,
};

export const toCarFormValues = (car: Car): CarFormValues => ({
  brand: car.brand,
  modelName: car.modelName,
  year: car.year,
  price: car.price,
  mileage: car.mileage,
  entryDate: car.entryDate.slice(0, 10), // "2026-11-23T00:00:00.000Z" -> "2026-11-23" para el input date
  used: car.used,
  engine: car.engine ?? "",
  horsepower: car.horsepower ?? 0,
  transmission: car.transmission ?? "manual",
  fuel: car.fuel ?? "nafta",
  bodyType: car.bodyType ?? "sedan",
  traction: car.traction ?? "4x2",
  doors: car.doors ?? 4,
  color: car.color ?? "",
  featuresText: (car.features ?? []).join("\n"),
  description: car.description ?? "",
  imageUrl: car.imageUrl ?? "",
  active: car.active,
});

// Valores del form -> body que espera la API (features como lista).
export const toCarPayload = ({ featuresText, ...rest }: CarFormValues): CarPayload => ({
  ...rest,
  features: splitFeatures(featuresText),
});
