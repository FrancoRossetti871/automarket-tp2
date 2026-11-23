// Middleware generico: valida req.body contra un schema de Zod. Si falla, responde 400 con el detalle por campo.
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      res.status(400).json({
        error: "Los datos enviados no son validos",
        details: z.flattenError(result.error).fieldErrors,
      });
      return;
    }

    // Reemplaza el body por la version parseada (con defaults y tipos ya convertidos).
    req.body = result.data;
    next();
  };
}
