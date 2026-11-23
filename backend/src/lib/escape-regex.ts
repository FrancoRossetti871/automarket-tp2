// Escapa metacaracteres de regex para que un texto de busqueda no pueda inyectar su propia regex en $regex.
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
