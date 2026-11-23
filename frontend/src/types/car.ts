// Misma forma que ICar en el backend (backend/src/models/Car.ts). El JSON no trae tipos: los declaramos a mano.
export interface Car {
  _id: string;
  brand: string;
  modelName: string;
  year: number;
  price: number;
  mileage: number;
  entryDate: string;
  used: boolean;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  includeInactive?: "true";
}
