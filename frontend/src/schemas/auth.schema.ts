import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, { error: "El email es obligatorio" }).pipe(
    z.email({ error: "El email no tiene un formato valido" }),
  ),
  password: z.string().min(1, { error: "La contraseña es obligatoria" }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "El nombre debe tener al menos 2 caracteres" })
      .max(80, { error: "El nombre no puede superar los 80 caracteres" }),
    email: z.string().trim().min(1, { error: "El email es obligatorio" }).pipe(
      z.email({ error: "El email no tiene un formato valido" }),
    ),
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string().min(1, { error: "Repeti la contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
