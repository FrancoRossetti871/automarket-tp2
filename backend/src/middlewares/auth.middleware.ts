// Protege rutas: Better Auth lee la cookie de sesion y la busca en Mongo.
import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { SessionUser, UserRole } from "../types/auth.types.js";

// Devuelve el usuario logueado o null (no corta el request). Lo usan las rutas publicas
// que muestran mas datos si quien consulta es admin.
export async function getSessionUser(req: Request): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  return session?.user ?? null;
}

// 401 si no hay sesion.
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getSessionUser(req);

    if (!user) {
      res.status(401).json({ error: "Sesion requerida" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[auth] error leyendo la sesion:", error);
    res.status(500).json({ error: "No se pudo verificar la sesion" });
  }
}

// 403 si el rol no esta permitido. Siempre va DESPUES de authMiddleware.
export function requireRole(...rolesPermitidos: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Sesion requerida" });
      return;
    }

    if (!rolesPermitidos.includes(req.user.role as UserRole)) {
      res.status(403).json({ error: "No tenes permisos para realizar esta accion" });
      return;
    }

    next();
  };
}
