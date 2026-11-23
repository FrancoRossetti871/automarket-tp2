// Mapeo (metodo HTTP + ruta) -> middlewares -> controller. Sin logica de negocio aca.
import { Router } from "express";
import { listCars, getCarById, createCar, updateCar, deleteCar } from "../controllers/cars.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { createCarSchema, updateCarSchema } from "../schemas/car.schema.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();
const onlyAdmin = [authMiddleware, requireRole("admin")];

// Lectura: publica
router.get("/", listCars);
router.get("/:id", getCarById);

// Escritura: solo admin (401 sin sesion, 403 si es user)
router.post("/", onlyAdmin, validateBody(createCarSchema), createCar);
router.put("/:id", onlyAdmin, validateBody(updateCarSchema), updateCar);
router.patch("/:id", onlyAdmin, validateBody(updateCarSchema), updateCar);
router.delete("/:id", onlyAdmin, deleteCar);

export default router;
