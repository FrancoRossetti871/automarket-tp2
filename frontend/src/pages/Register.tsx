// Ruta publica "/register". Crea el usuario (siempre con rol "user") y Better Auth abre la sesion en el mismo paso.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { signUp, useSession } from "../lib/auth-client";

const fields = [
  { name: "name", label: "Nombre", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "password", label: "Contraseña", type: "password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Repetir contraseña", type: "password", autoComplete: "new-password" },
] as const;

export const Register = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  if (session && !isSubmitting) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async ({ name, email, password }: RegisterFormValues) => {
    const { error } = await signUp.email({ name, email, password });
    if (error) {
      const message =
        error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
          ? "Ya existe una cuenta con ese email"
          : (error.message ?? "No se pudo crear la cuenta");
      setError("root.server", { message });
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
      <section className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link to="/" className="text-sm text-slate-500 underline">
          ← Volver al catalogo
        </Link>
        <h2 className="mt-2 mb-4 text-xl font-semibold text-slate-900">Crear cuenta</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
          {fields.map(({ name, label, type, autoComplete }) => (
            <label key={name} className="flex flex-col gap-1 text-sm text-slate-700">
              {label}
              <input
                type={type}
                autoComplete={autoComplete}
                aria-invalid={!!errors[name]}
                {...register(name)}
                className="rounded border border-slate-300 px-3 py-2 aria-invalid:border-red-500"
              />
              {errors[name] && <span className="text-xs text-red-600">{errors[name]?.message}</span>}
            </label>
          ))}
          {errors.root?.server && (
            <p role="alert" className="text-sm text-red-600">
              {errors.root.server.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-slate-900 py-2 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          ¿Ya tenes cuenta?{" "}
          <Link to="/login" className="font-medium text-slate-900 underline">
            Ingresar
          </Link>
        </p>
      </section>
    </main>
  );
};
