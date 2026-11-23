import { Link } from "react-router";

// Se muestra cuando un usuario logueado sin rol admin intenta entrar al panel.
export const Forbidden = () => {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold text-slate-900">403 — Sin permisos</h2>
      <p className="mt-2 text-slate-600">Necesitas rol de administrador para entrar a esta seccion.</p>
      <Link to="/" className="mt-2 inline-block text-slate-600 underline">
        Volver al catalogo
      </Link>
    </section>
  );
};
