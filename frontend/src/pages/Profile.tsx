// Ruta privada "/perfil": cualquier usuario logueado. ProtectedRoute garantiza que hay sesion.
import { useState } from "react";
import { authClient, useSession } from "../lib/auth-client";
import { Icon } from "../components/Icon";

export const Profile = () => {
  const { data: session } = useSession();
  const [linkError, setLinkError] = useState<string | null>(null);
  if (!session) return null;
  const { user } = session;
  const isAdmin = user.role === "admin";

  // Vincula GitHub a la cuenta de email (el usuario ya probo que es el dueño porque esta logueado).
  const handleLinkGithub = async () => {
    const { error } = await authClient.linkSocial({ provider: "github", callbackURL: "/perfil" });
    if (error) setLinkError(error.message ?? "No se pudo conectar GitHub");
  };

  return (
    <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="h-28 bg-gradient-to-br from-brand-700 via-brand-900 to-zinc-950" />
      <div className="px-6 pb-8 sm:px-8">
        <div className="-mt-10 flex items-end gap-4">
          {user.image ? (
            <img src={user.image} alt="" className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-zinc-900 text-3xl font-bold text-white shadow">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span
            className={`mb-1 rounded-full px-3 py-1 text-xs font-semibold ${
              isAdmin ? "bg-zinc-100 text-zinc-900" : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {isAdmin ? "Administrador" : "Usuario"}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">{user.name}</h1>
        <p className="text-zinc-500">{user.email}</p>

        <div className="mt-8 rounded-2xl border border-zinc-200 p-5">
          <h2 className="font-semibold text-zinc-900">Cuentas vinculadas</h2>
          <p className="mt-1 text-sm text-zinc-500">Conecta GitHub para ingresar sin contraseña.</p>
          <button
            type="button"
            onClick={handleLinkGithub}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            <Icon name="github" size={18} />
            Conectar GitHub
          </button>
          {linkError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {linkError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
