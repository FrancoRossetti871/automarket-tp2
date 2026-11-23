// Misma forma que ICar en el backend (backend/src/models/Car.ts). El JSON no trae tipos: los declaramos a mano.
export const TRANSMISSIONS = ["manual", "automatica"] as const;
export const FUELS = ["nafta", "diesel", "hibrido", "electrico", "gnc"] as const;
export const BODY_TYPES = ["sedan", "hatchback", "suv", "pickup", "coupe", "utilitario"] as const;
export const TRACTIONS = ["4x2", "4x4"] as const;

export type Transmission = (typeof TRANSMISSIONS)[number];
export type Fuel = (typeof FUELS)[number];
export type BodyType = (typeof BODY_TYPES)[number];
export type Traction = (typeof TRACTIONS)[number];

export interface Car {
  _id: string;
  brand: string;
  modelName: string;
  year: number;
  price: number;
  mileage: number;
  entryDate: string;
  used: boolean;
  engine: string;
  horsepower: number;
  transmission: Transmission;
  fuel: Fuel;
  bodyType: BodyType;
  traction: Traction;
  doors: number;
  color: string;
  features: string[];
  description: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Lo que se manda al backend al crear / editar.
export type CarPayload = Omit<Car, "_id" | "createdAt" | "updatedAt">;

// Envelope de los listados paginados del backend: { data, meta }.
export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CarsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  used?: "true" | "false";
  fuel?: Fuel;
  transmission?: Transmission;
  bodyType?: BodyType;
  sortBy?: "createdAt" | "brand" | "year" | "price" | "entryDate" | "horsepower";
  sortOrder?: "asc" | "desc";
  includeInactive?: "true";
}
