// frontend/src/components/LoginForm.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_USERNAME_KEY } from '../constants'; // Asumiendo que ajustaste la ruta

interface Props {
  setTokenGlobal?: (token: string | null) => void;
}

interface LoginResponse {
  token: string;
  nombre: string;
  error?: string;
  message?: string;
}

type ErrorState = string | null;

export default function LoginForm({ setTokenGlobal }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorState>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("LOGIN_FORM: Iniciando handleSubmit...");

    try {
      // ESTA LÍNEA ES LA IMPORTANTE:
      const backendBaseUrl = import.meta.env.PUBLIC_BACKEND_API_URL || "http://localhost:4000";
      // Si PUBLIC_BACKEND_API_URL está definida en tu .env del frontend, se usará esa.
      // Si no, usará "http://localhost:4000" como fallback.

      const loginUrl = `${backendBaseUrl}/api/auth/login`;
      console.log("LOGIN_FORM: Enviando solicitud a URL:", loginUrl); // <--- VERIFICA ESTE LOG

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("LOGIN_FORM: Respuesta recibida del backend, status:", res.status);

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error("LOGIN_FORM: Respuesta no es JSON. Texto:", text);
        throw new Error(`Error de respuesta del servidor: ${res.status} - ${text}`);
      }

      const data: LoginResponse = await res.json();
      console.log("LOGIN_FORM: Datos JSON de la respuesta:", data);

      if (!res.ok || !data.token) {
        const errorMessage = data.error || data.message || "Error al iniciar sesión (credenciales o respuesta inválida)";
        console.error("LOGIN_FORM: Error en la respuesta del backend:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`LOGIN_FORM: Guardando token en localStorage con clave '${LOCAL_STORAGE_TOKEN_KEY}', valor:`, data.token);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      
      console.log(`LOGIN_FORM: Guardando nombre en localStorage con clave '${LOCAL_STORAGE_USERNAME_KEY}', valor:`, data.nombre);
      localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, data.nombre);
      
      const verificationToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      console.log(`LOGIN_FORM: VERIFICACIÓN INMEDIATA - Token leído:`, verificationToken ? 'Sí' : 'No');

      if (setTokenGlobal) {
        setTokenGlobal(data.token);
        console.log("LOGIN_FORM: Función setTokenGlobal llamada.");
      }
      
      window.dispatchEvent(new CustomEvent("authChanged", { detail: { isAuthenticated: true, userName: data.nombre } }));
      console.log("LOGIN_FORM: Evento 'authChanged' disparado.");

      console.log("LOGIN_FORM: Redirigiendo a /dashboard...");
      window.location.href = "/dashboard";

    } catch (err: any) {
      let errorMessage = "Error desconocido durante el inicio de sesión.";
      if (err instanceof Error) { errorMessage = err.message; }
      setError(errorMessage);
      console.error("LOGIN_FORM: Catch - Error durante el login:", err);
    } finally {
      setLoading(false);
      console.log("LOGIN_FORM: handleSubmit finalizado.");
    }
  };

  // El JSX del return no cambia, lo omito por brevedad pero es el mismo que me diste.
  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-8 md:py-12">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-12 max-w-lg w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Bienvenido a VioTech
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para acceder a tu panel.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
              type="email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
              type="password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-500/20 p-3 rounded-md transition-opacity duration-300 font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando Sesión...
              </>
            ) : "Iniciar Sesión"}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{' '}
            <a href="/registro" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
