// Imagen del auto. Si tiene imageUrl la muestra; si no (o si la URL falla) dibuja un banner
// grafito con el nombre de la marca, asi el catalogo nunca queda con huecos vacios.
import { useState } from "react";
import { Icon } from "./Icon";

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

  const iconSize = size === "sm" ? 18 : size === "lg" ? 96 : 56;

  return (
    <div
      role="img"
      aria-label={`${brand} ${modelName}`}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.12),transparent_60%)]" />
      {size !== "sm" && (
        <span className="absolute -bottom-3 left-3 text-5xl font-black tracking-tight text-white/[0.06] uppercase select-none sm:text-6xl">
          {brand}
        </span>
      )}
      <Icon name="car" size={iconSize} strokeWidth={1.25} className="text-zinc-400" />
    </div>
  );
};
