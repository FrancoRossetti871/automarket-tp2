// Carga autos de ejemplo para que la vista publica no este vacia.
// Uso: npm run seed  (solo inserta si la coleccion esta vacia; con --force la vacia antes)
// Las fotos estan en frontend/public/cars (ver creditos en el README).
import "dotenv/config";
import { connectMongoDB, disconnectMongoDB } from "../src/config/db.js";
import Car from "../src/models/Car.js";

const cars = [
  { brand: "Toyota", modelName: "Corolla XEI", year: 2022, price: 28500000, mileage: 35000, entryDate: "2026-09-10", used: true, description: "Unico dueño, service oficial al dia.", imageUrl: "/cars/toyota-corolla.jpg" },
  { brand: "Volkswagen", modelName: "Amarok V6", year: 2024, price: 52000000, mileage: 12000, entryDate: "2026-10-02", used: true, description: "Pick-up 4x4 automatica, impecable.", imageUrl: "/cars/vw-amarok.jpg" },
  { brand: "Fiat", modelName: "Cronos Drive", year: 2026, price: 21900000, mileage: 0, entryDate: "2026-11-05", used: false, description: "0 km, entrega inmediata.", imageUrl: "/cars/fiat-cronos.png" },
  { brand: "Ford", modelName: "Ranger XLT", year: 2023, price: 45000000, mileage: 28000, entryDate: "2026-08-21", used: true, description: "Caja manual, cubiertas nuevas.", imageUrl: "/cars/ford-ranger.png" },
  { brand: "Chevrolet", modelName: "Onix Premier", year: 2026, price: 24300000, mileage: 0, entryDate: "2026-11-12", used: false, description: "0 km, version tope de gama.", imageUrl: "/cars/chevrolet-onix.png" },
  { brand: "Renault", modelName: "Sandero Stepway", year: 2020, price: 15800000, mileage: 61000, entryDate: "2026-07-15", used: true, description: "Ideal primer auto, muy economico.", imageUrl: "/cars/renault-stepway.png" },
  { brand: "Peugeot", modelName: "208 Allure", year: 2025, price: 23500000, mileage: 8000, entryDate: "2026-10-28", used: true, description: "Practicamente nuevo, con garantia.", imageUrl: "/cars/peugeot-208.png" },
  { brand: "Honda", modelName: "HR-V EXL", year: 2021, price: 31200000, mileage: 47000, entryDate: "2026-09-30", used: true, description: "SUV automatica, techo solar.", imageUrl: "/cars/honda-hrv.webp" },
  { brand: "Toyota", modelName: "Hilux SRX", year: 2026, price: 58900000, mileage: 0, entryDate: "2026-11-18", used: false, description: "0 km 4x4 automatica.", imageUrl: "/cars/toyota-hilux.png" },
  { brand: "Volkswagen", modelName: "Gol Trend", year: 2018, price: 11500000, mileage: 89000, entryDate: "2026-06-11", used: true, description: "Motor y caja perfectos.", imageUrl: "/cars/vw-gol.png" },
];

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
