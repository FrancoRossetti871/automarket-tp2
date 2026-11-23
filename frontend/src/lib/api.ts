import axios from "axios";

// Ruta relativa: mismo origen que el front, el navegador manda la cookie de sesion solo.
// En local la resuelve el proxy de Vite; en Render, el rewrite /api/* del Static Site.
export const api = axios.create({
  baseURL: "/api",
});

// Los errores del backend vienen como { error: "...", details?: { campo: [mensajes] } }.
export const getErrorMessage = (err: unknown): string => {
  if (typeof err === "string") return err;
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; details?: Record<string, string[]> } | undefined;
    const details = data?.details ? Object.values(data.details).flat().join(". ") : "";
    if (data?.error) return details ? `${data.error}: ${details}` : data.error;
    return err.message;
  }
  return "Error desconocido";
};
