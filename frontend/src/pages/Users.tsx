// Ruta privada por rol "/admin/usuarios" (opcional del TP): listar usuarios y cambiar su rol.
// Usa los endpoints del plugin admin de Better Auth (solo responden si la sesion es admin).
import { useCallback, useEffect, useState } from "react";
import { authClient, useSession } from "../lib/auth-client";
import type { UserRole } from "../types/auth";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
}

export const Users = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await authClient.admin.listUsers({ query: { limit: 100 } });
    if (error) setError(error.message ?? "No se pudieron cargar los usuarios");
    else setUsers(data.users as AdminUser[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (user: AdminUser, role: UserRole) => {
    setError(null);
    const { error } = await authClient.admin.setRole({ userId: user.id, role });
    if (error) {
      setError(error.message ?? "No se pudo cambiar el rol");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)));
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-zinc-900">Usuarios y roles</h2>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-zinc-500">Cargando usuarios...</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white shadow-sm">
          {users.map((user) => {
            const isMe = user.id === session?.user.id;
            return (
              <li key={user.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-medium text-zinc-900">
                    {user.name} {isMe && <span className="text-xs text-zinc-400">(vos)</span>}
                  </p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
                <select
                  value={user.role ?? "user"}
                  disabled={isMe}
                  onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                  className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                  aria-label={`Rol de ${user.name}`}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
