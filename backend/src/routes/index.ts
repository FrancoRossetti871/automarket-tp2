// Junta los routers de cada recurso. Las entidades nuevas se montan aca, no en server.ts.
import { Router } from "express";
import carsRouter from "./cars.routes.js";

const router = Router();

router.use("/cars", carsRouter);

export default router;
