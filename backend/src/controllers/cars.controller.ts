// Controller = capa HTTP: lee req, llama al service y traduce el resultado a status + JSON.
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import * as carsService from "../services/cars.service.js";
import { CreateCarInput, UpdateCarInput, listCarsSchema } from "../schemas/car.schema.js";
import { getSessionUser } from "../middlewares/auth.middleware.js";

// GET /api/cars?page=1&limit=9&search=ford&used=true
// Publico. Los dados de baja (active=false) solo se incluyen si lo pide un admin (?includeInactive=true).
export async function listCars(req: Request, res: Response): Promise<void> {
  const parsed = listCarsSchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      error: "Los filtros enviados no son validos",
      details: z.flattenError(parsed.error).fieldErrors,
    });
    return;
  }

  try {
    const input = parsed.data;
    if (input.includeInactive) {
      const user = await getSessionUser(req);
      if (user?.role !== "admin") input.includeInactive = false;
    }
    res.status(200).json(await carsService.listCars(input));
  } catch (error) {
    console.error("[cars] error al listar:", error);
    res.status(500).json({ error: "No se pudieron obtener los autos" });
  }
}

// GET /api/cars/:id
export async function getCarById(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "El id enviado no es valido" });
    return;
  }

  try {
    const car = await carsService.findCarById(id);

    if (!car) {
      res.status(404).json({ error: "Auto no encontrado" });
      return;
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("[cars] error al buscar por id:", error);
    res.status(500).json({ error: "No se pudo obtener el auto" });
  }
}

// POST /api/cars (admin) -> 201
export async function createCar(req: Request<{}, {}, CreateCarInput>, res: Response): Promise<void> {
  try {
    res.status(201).json(await carsService.createCar(req.body));
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }

    console.error("[cars] error al crear:", error);
    res.status(500).json({ error: "No se pudo crear el auto" });
  }
}

// PUT / PATCH /api/cars/:id (admin)
export async function updateCar(req: Request<{ id: string }, {}, UpdateCarInput>, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "El id enviado no es valido" });
    return;
  }

  try {
    const updatedCar = await carsService.updateCar(id, req.body);

    if (!updatedCar) {
      res.status(404).json({ error: "Auto no encontrado" });
      return;
    }

    res.status(200).json(updatedCar);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }

    console.error("[cars] error al modificar:", error);
    res.status(500).json({ error: "No se pudo modificar el auto" });
  }
}

// DELETE /api/cars/:id (admin)
// Por defecto hace baja logica (active=false) y devuelve 200 con el auto.
// Con ?hard=true hace baja fisica (lo borra de la base) y devuelve 204.
export async function deleteCar(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;
  const hard = req.query.hard === "true";

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "El id enviado no es valido" });
    return;
  }

  try {
    const car = hard ? await carsService.hardDeleteCar(id) : await carsService.softDeleteCar(id);

    if (!car) {
      res.status(404).json({ error: "Auto no encontrado" });
      return;
    }

    if (hard) {
      res.status(204).send();
      return;
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("[cars] error al eliminar:", error);
    res.status(500).json({ error: "No se pudo eliminar el auto" });
  }
}
