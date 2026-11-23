import express, { Request, Response } from "express";
// dotenv primero: lib/auth.ts lee las variables de entorno apenas se importa.
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import apiRouter from "./routes/index.js";
import { connectMongoDB } from "./config/db.js";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Sin cors: el front llama a /api en su mismo origen (proxy de Vite en local,
// rewrite del Static Site en Render), asi que la cookie de sesion es first-party.

// Better Auth ANTES de express.json(): su handler lee el body crudo del request.
// "*splat" es la sintaxis de comodin de Express 5.
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api", apiRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Cualquier otra ruta de la API que no exista -> 404 en JSON.
app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

async function startServer(): Promise<void> {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`[server] escuchando en el puerto ${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("[server] no se pudo iniciar:", error);
  process.exit(1);
});
