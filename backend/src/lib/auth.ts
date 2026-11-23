// Better Auth: registro, login, logout y sesiones.
// Guarda usuarios, sesiones y cuentas de GitHub en NUESTRO Mongo (colecciones user, session y account).
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable ${name}. Revisa tu archivo .env (ver .env.example).`);
  return value;
}

// Better Auth usa el driver nativo de Mongo. El cliente conecta solo en la primera consulta.
// Pasarlo como `client` habilita transacciones (Atlas es un replica set).
const client = new MongoClient(requireEnv("MONGODB_URI"));

// GitHub es opcional en local: si no hay credenciales, el login con email sigue funcionando.
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({
  // URL publica que ve el navegador: la del FRONT, porque /api llega al back a traves del proxy/rewrite.
  // El secret se lee solo de BETTER_AUTH_SECRET.
  baseURL: requireEnv("BETTER_AUTH_URL"),
  database: mongodbAdapter(client.db(), { client }),
  emailAndPassword: {
    enabled: true, // hashea la contraseña con scrypt; minimo 8 caracteres por defecto
  },
  socialProviders:
    githubClientId && githubClientSecret
      ? { github: { clientId: githubClientId, clientSecret: githubClientSecret } }
      : {},
  // Si alguien registrado con email+password entra con GitHub (mismo email), se unen las cuentas.
  account: {
    accountLinking: { trustedProviders: ["github"] },
  },
  // admin(): agrega user.role ("user" por defecto) y endpoints para listar usuarios y cambiar roles.
  plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] })],
});
