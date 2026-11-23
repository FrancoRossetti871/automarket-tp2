import { z } from "zod";
import type { Car } from "../types/car";

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

export const emptyCar: CarFormValues = {
  brand: "",
  modelName: "",
  year: currentYear,
  price: 0,
  mileage: 0,
  entryDate: new Date().toISOString().slice(0, 10),
  used: false,
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
  description: car.description ?? "",
  imageUrl: car.imageUrl ?? "",
  active: car.active,
});
