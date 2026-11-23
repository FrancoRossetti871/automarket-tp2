// Imagen del auto. Si tiene imageUrl la muestra; si no (o si la URL falla) dibuja un banner
// con degradado segun la marca, asi el catalogo nunca queda con huecos vacios.
import { useState } from "react";

const palettes: [string, string][] = [
  ["#1e3a8a", "#3b82f6"],
  ["#7c2d12", "#f97316"],
  ["#14532d", "#22c55e"],
  ["#4c1d95", "#a855f7"],
  ["#0f172a", "#64748b"],
  ["#831843", "#ec4899"],
  ["#134e4a", "#14b8a6"],
  ["#713f12", "#eab308"],
];

const paletteFor = (brand: string): [string, string] => {
  let hash = 0;
  for (const char of brand.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
};

interface CarVisualProps {
  brand: string;
  modelName: string;
  imageUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CarVisual = ({ brand, modelName, imageUrl, className = "", size = "md" }: CarVisualProps) => {
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={`${brand} ${modelName}`}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const [from, to] = paletteFor(brand);
  const iconSize = size === "sm" ? "w-8" : size === "lg" ? "w-40" : "w-24";

  return (
    <div
      role="img"
      aria-label={`${brand} ${modelName}`}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {size !== "sm" && (
        <span className="absolute -bottom-3 left-3 text-5xl font-black tracking-tight text-white/10 uppercase select-none sm:text-6xl">
          {brand}
        </span>
      )}
      <svg viewBox="0 0 64 32" className={`${iconSize} text-white/90 drop-shadow`} fill="currentColor" aria-hidden="true">
        <path d="M6 22l3-8c.7-1.8 2.4-3 4.3-3h21.1c1.6 0 3.1.8 4 2.1L43 18l10 1.6c2.9.5 5 3 5 5.9V27a1 1 0 0 1-1 1h-4.1a5 5 0 0 0-9.8 0H20.9a5 5 0 0 0-9.8 0H7a1 1 0 0 1-1-1v-5zm10-1h10v-6.5h-9.2c-.5 0-.9.3-1.1.8L16 21zm13 0h11l-3.2-5.2c-.4-.5-1-.8-1.6-.8H29v6zM16 31a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm32 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
      </svg>
    </div>
  );
};
