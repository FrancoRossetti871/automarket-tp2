import { z } from "zod";
import { BODY_TYPES, FUELS, TRACTIONS, TRANSMISSIONS } from "../models/Car.js";

const currentYear = new Date().getFullYear();

export const ALLOWED_CAR_SORT_FIELDS = ["createdAt", "brand", "year", "price", "entryDate", "horsepower"] as const;

// Listado: los filtros llegan como query string (?page=1&limit=6&search=ford&used=true&fuel=diesel),
// por eso se usa z.coerce para convertir los textos a numero.
export const listCarsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(9),
  sortBy: z.enum(ALLOWED_CAR_SORT_FIELDS).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().min(1).max(80).optional(),
  used: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  fuel: z.enum(FUELS).optional(),
  transmission: z.enum(TRANSMISSIONS).optional(),
  bodyType: z.enum(BODY_TYPES).optional(),
  // Solo lo respeta el backend si quien consulta es admin (ver controller).
  includeInactive: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
});

export const createCarSchema = z.object({
  brand: z.string({ error: "La marca es obligatoria" }).trim().min(1, "La marca es obligatoria").max(60),
  modelName: z.string({ error: "El modelo es obligatorio" }).trim().min(1, "El modelo es obligatorio").max(80),
  year: z
    .number({ error: "El año debe ser un numero" })
    .int("El año debe ser un numero entero")
    .min(1950, "El año minimo es 1950")
    .max(currentYear + 1, `El año maximo es ${currentYear + 1}`),
  price: z.number({ error: "El precio debe ser un numero" }).min(0, "El precio no puede ser negativo"),
  mileage: z.number({ error: "El kilometraje debe ser un numero" }).int().min(0, "El kilometraje no puede ser negativo").optional(),
  // Acepta "2026-11-23" o un ISO completo y lo convierte a Date.
  entryDate: z.coerce.date({ error: "La fecha de ingreso no es valida" }),
  used: z.boolean({ error: "El campo usado debe ser verdadero o falso" }).optional(),
  // Ficha tecnica (todo opcional: el modelo tiene defaults)
  engine: z.string().trim().max(60, "El motor no puede superar los 60 caracteres").optional(),
  horsepower: z.number({ error: "La potencia debe ser un numero" }).int().min(0).max(2000, "La potencia maxima es 2000 CV").optional(),
  transmission: z.enum(TRANSMISSIONS, { error: "Transmision no valida (manual o automatica)" }).optional(),
  fuel: z.enum(FUELS, { error: `Combustible no valido (${FUELS.join(", ")})` }).optional(),
  bodyType: z.enum(BODY_TYPES, { error: `Carroceria no valida (${BODY_TYPES.join(", ")})` }).optional(),
  traction: z.enum(TRACTIONS, { error: "Traccion no valida (4x2 o 4x4)" }).optional(),
  doors: z.number({ error: "Las puertas deben ser un numero" }).int().min(2, "Minimo 2 puertas").max(5, "Maximo 5 puertas").optional(),
  color: z.string().trim().max(40, "El color no puede superar los 40 caracteres").optional(),
  features: z
    .array(z.string().trim().min(1).max(80, "Cada item de equipamiento admite hasta 80 caracteres"))
    .max(20, "Maximo 20 items de equipamiento")
    .optional(),
  description: z.string().trim().max(500, "La descripcion no puede superar los 500 caracteres").optional(),
  // Imagen opcional: vacio, una URL externa (https://...) o una ruta servida por el front (/cars/foto.jpg)
  imageUrl: z
    .union([
      z.literal(""),
      z.url({ error: "La URL de la imagen no es valida" }).max(500),
      z.string().regex(/^\/[\w\-./]+$/, "La ruta de la imagen no es valida").max(200),
    ])
    .optional(),
  active: z.boolean().optional(),
});

export const updateCarSchema = createCarSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Hay que enviar al menos un campo para modificar",
});

export type ListCarsInput = z.infer<typeof listCarsSchema>;
export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
