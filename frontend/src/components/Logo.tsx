import { Link } from "react-router";

interface LogoProps {
  light?: boolean;
  size?: "md" | "lg";
}

export const Logo = ({ light = false, size = "md" }: LogoProps) => (
  <Link to="/" className="group flex items-center gap-3" aria-label="AutoMarket, ir al inicio">
    <img
      src="/logo.png"
      alt=""
      width={size === "lg" ? 48 : 40}
      height={size === "lg" ? 48 : 40}
      className={`rounded-xl bg-black object-cover shadow-md ring-1 transition duration-300 group-hover:shadow-lg ${
        size === "lg" ? "h-12 w-12" : "h-10 w-10"
      } ${light ? "ring-white/15" : "ring-black/10"}`}
    />
    <span className="leading-none">
      <span className={`block text-[17px] font-semibold tracking-[0.18em] uppercase ${light ? "text-white" : "text-zinc-950"}`}>
        AutoMarket
      </span>
      <span className={`mt-1 block text-[10px] font-medium tracking-[0.3em] uppercase ${light ? "text-zinc-400" : "text-zinc-500"}`}>
        Concesionaria
      </span>
    </span>
  </Link>
);
