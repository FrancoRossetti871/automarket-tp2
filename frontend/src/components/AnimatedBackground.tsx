// Fondo de la app: gris muy claro con una luz suave arriba y una textura de puntos casi imperceptible.
// Es estatico a proposito: la sobriedad es parte de la identidad de la marca.
export const AnimatedBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-zinc-50" />
    <div className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(ellipse_at_top,rgb(228_228_231/0.9),transparent_70%)]" />
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage: "radial-gradient(rgb(113 113 122 / 0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "linear-gradient(to bottom, black, transparent 60%)",
      }}
    />
  </div>
);
