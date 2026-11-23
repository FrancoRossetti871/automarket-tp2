// Ruta publica "/register". Crea el usuario (siempre con rol "user") y Better Auth abre la sesion en el mismo paso.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { signUp, useSession } from "../lib/auth-client";
import { AuthShell } from "../components/AuthShell";

const fields = [
  { name: "name", label: "Nombre", type: "text", autoComplete: "name", placeholder: "Tu nombre" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "tu@email.com" },
  { name: "password", label: "Contraseña", type: "password", autoComplete: "new-password", placeholder: "Minimo 8 caracteres" },
  { name: "confirmPassword", label: "Repetir contraseña", type: "password", autoComplete: "new-password", placeholder: "Repeti la contraseña" },
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
    <AuthShell title="Crear cuenta" subtitle="Registrate para guardar tu sesion y explorar el catalogo.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {fields.map(({ name, label, type, autoComplete, placeholder }) => (
          <label key={name} className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            {label}
            <input
              type={type}
              autoComplete={autoComplete}
              placeholder={placeholder}
              aria-invalid={!!errors[name]}
              {...register(name)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 focus:border-brand-600 focus:outline-none aria-invalid:border-red-500"
            />
            {errors[name] && <span className="text-xs font-normal text-red-600">{errors[name]?.message}</span>}
          </label>
        ))}
        {errors.root?.server && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {errors.root.server.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-brand-600 py-2.5 font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tenes cuenta?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Ingresar
        </Link>
      </p>
    </AuthShell>
  );
};
