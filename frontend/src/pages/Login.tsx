import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate, type Location } from "react-router";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { authClient, signIn, useSession } from "../lib/auth-client";
import { AuthShell } from "../components/AuthShell";
import { Icon } from "../components/Icon";

const inputClass =
  "rounded-xl border border-zinc-300 bg-white px-3 py-2.5 focus:border-brand-600 focus:outline-none aria-invalid:border-red-500";

export const Login = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";
  const oauthError = new URLSearchParams(location.search).get("error");
  const mustLinkGithub = oauthError === "account_not_linked";

  // !isSubmitting: mientras onSubmit sigue (ej. vinculando GitHub) no redirigir por la sesion nueva.
  if (session && !isSubmitting) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (credentials: LoginFormValues) => {
    // Better Auth no tira excepcion: devuelve { data, error }. Si sale bien setea la cookie.
    const { error } = await signIn.email(credentials);
    if (error) {
      const message =
        error.status === 401 ? "Email o contraseña incorrectos" : (error.message ?? "No se pudo iniciar sesion");
      setError("root.server", { message });
      return;
    }
    if (mustLinkGithub) {
      // La contraseña prueba que la cuenta es suya: recien ahora es seguro vincular GitHub.
      const { error: linkError } = await authClient.linkSocial({ provider: "github", callbackURL: from });
      if (linkError) setError("root.server", { message: linkError.message ?? "No se pudo vincular GitHub" });
      return;
    }
    navigate(from, { replace: true });
  };

  // OAuth: redirige a GitHub; al volver, Better Auth crea la sesion y manda al callbackURL.
  const handleGithub = () => signIn.social({ provider: "github", callbackURL: from, errorCallbackURL: "/login" });

  return (
    <AuthShell title="Iniciar sesion" subtitle="Ingresa con tu email o con tu cuenta de GitHub.">
      {oauthError && (
        <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          {mustLinkGithub
            ? "Ya tenes una cuenta con ese email. Ingresa tu contraseña para vincular GitHub."
            : "No se pudo iniciar sesion con GitHub."}
        </p>
      )}

      <button
        type="button"
        onClick={handleGithub}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 font-medium text-white transition hover:bg-zinc-700"
      >
        <Icon name="github" size={20} />
        Entrar con GitHub
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-zinc-400">
        <span className="h-px flex-1 bg-zinc-200" />o con tu email<span className="h-px flex-1 bg-zinc-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            aria-invalid={!!errors.email}
            {...register("email")}
            className={inputClass}
          />
          {errors.email && <span className="text-xs font-normal text-red-600">{errors.email.message}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
            className={inputClass}
          />
          {errors.password && <span className="text-xs font-normal text-red-600">{errors.password.message}</span>}
        </label>
        {errors.root?.server && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {errors.root.server.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-zinc-950 py-2.5 font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : mustLinkGithub ? "Ingresar y vincular GitHub" : "Ingresar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿No tenes cuenta?{" "}
        <Link to="/register" className="font-semibold text-zinc-950 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
};
