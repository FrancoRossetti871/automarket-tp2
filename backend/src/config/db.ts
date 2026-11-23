import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Falta la variable MONGODB_URI. Revisa tu archivo .env (ver .env.example).");
  }

  return uri;
}

export async function connectMongoDB(): Promise<void> {
  const uri = getMongoUri();

  mongoose.connection.on("connected", () => {
    console.log("[mongodb] conexion establecida");
  });

  mongoose.connection.on("error", (error: Error) => {
    console.error("[mongodb] error de conexion:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[mongodb] conexion perdida");
  });

  await mongoose.connect(uri);
}

export async function disconnectMongoDB(): Promise<void> {
  await mongoose.connection.close();
  console.log("[mongodb] conexion cerrada");
}
