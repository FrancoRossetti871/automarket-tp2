// Carga autos de ejemplo (con ficha tecnica completa) para que la vista publica no este vacia.
// Uso: npm run seed  (solo inserta si la coleccion esta vacia; con --force la vacia antes)
// Los datos estan en cars.seed.json y las fotos en frontend/public/cars (ver creditos en el README).
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectMongoDB, disconnectMongoDB } from "../src/config/db.js";
import Car from "../src/models/Car.js";

const cars = JSON.parse(readFileSync(new URL("./cars.seed.json", import.meta.url), "utf8")) as Record<string, unknown>[];

async function main(): Promise<void> {
  await connectMongoDB();
  const force = process.argv.includes("--force");
  const count = await Car.countDocuments();

  if (count > 0 && !force) {
    console.log(`[seed] ya hay ${count} autos cargados, no se inserta nada (usar --force para reemplazarlos).`);
  } else {
    if (force) await Car.deleteMany({});
    await Car.insertMany(cars);
    console.log(`[seed] se cargaron ${cars.length} autos de ejemplo.`);
  }

  await disconnectMongoDB();
}

main().catch((error: unknown) => {
  console.error("[seed] error:", error);
  process.exit(1);
});
