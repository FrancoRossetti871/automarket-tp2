// Capa de servicio: logica de negocio y acceso a Mongo. El controller solo traduce HTTP <-> servicio.
import { QueryFilter } from "mongoose";
import Car, { ICarDocument } from "../models/Car.js";
import { escapeRegex } from "../lib/escape-regex.js";
import { CreateCarInput, ListCarsInput, UpdateCarInput } from "../schemas/car.schema.js";
import { Paginated } from "../types/pagination.types.js";

function buildFilter({ search, used, fuel, transmission, bodyType, includeInactive }: ListCarsInput): QueryFilter<ICarDocument> {
  const filter: QueryFilter<ICarDocument> = {};
  if (!includeInactive) filter.active = true;
  if (used !== undefined) filter.used = used;
  if (fuel) filter.fuel = fuel;
  if (transmission) filter.transmission = transmission;
  if (bodyType) filter.bodyType = bodyType;
  if (search) {
    const safe = escapeRegex(search);
    filter.$or = [
      { brand: { $regex: safe, $options: "i" } },
      { modelName: { $regex: safe, $options: "i" } },
      { engine: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
    ];
  }
  return filter;
}

export async function listCars(input: ListCarsInput): Promise<Paginated<ICarDocument>> {
  const { page, limit, sortBy, sortOrder } = input;
  const filter = buildFilter(input);

  const [data, total] = await Promise.all([
    Car.find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Car.countDocuments(filter),
  ]);

  return { data, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

export function findCarById(id: string): Promise<ICarDocument | null> {
  return Car.findById(id);
}

export function createCar(input: CreateCarInput): Promise<ICarDocument> {
  return Car.create(input);
}

export function updateCar(id: string, input: UpdateCarInput): Promise<ICarDocument | null> {
  return Car.findByIdAndUpdate(id, input, { new: true, runValidators: true });
}

// Baja logica: el registro queda en la base con active = false.
export function softDeleteCar(id: string): Promise<ICarDocument | null> {
  return Car.findByIdAndUpdate(id, { active: false }, { new: true });
}

// Baja fisica: el registro se borra de la base.
export function hardDeleteCar(id: string): Promise<ICarDocument | null> {
  return Car.findByIdAndDelete(id);
}
