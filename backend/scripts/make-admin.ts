// Convierte un usuario ya registrado en admin (el primer admin no se puede crear desde la app).
// Uso: npm run make-admin -- admin@autos.com
import "dotenv/config";
import { MongoClient } from "mongodb";

async function main(): Promise<void> {
  const email = process.argv[2]?.trim().toLowerCase();
  const uri = process.env.MONGODB_URI;

  if (!email) throw new Error("Indica el email: npm run make-admin -- admin@autos.com");
  if (!uri) throw new Error("Falta MONGODB_URI en el .env");

  const client = new MongoClient(uri);
  await client.connect();

  // Better Auth guarda los usuarios en la coleccion "user".
  const result = await client.db().collection("user").updateOne({ email }, { $set: { role: "admin" } });

  if (result.matchedCount === 0) {
    console.log(`[make-admin] no existe un usuario con email ${email}. Registralo primero desde la app.`);
  } else {
    console.log(`[make-admin] ${email} ahora es admin.`);
  }

  await client.close();
}

main().catch((error: unknown) => {
  console.error("[make-admin] error:", error);
  process.exit(1);
});
