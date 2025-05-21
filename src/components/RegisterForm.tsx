// src/components/RegisterForm.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface Props {
  setToken?: (token: string) => void;
}

export default function RegisterForm({ setToken }: Props) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      // ADAPTADO: usa la URL real del backend
      const res = await fetch("https://work-swhn.onrender.com/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      // Manejo de respuesta no-JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Error inesperado: " + text);
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");
      // Si el backend devuelve un token, lo puedes guardar (opcional)
      if (setToken && data.token) {
        setToken(data.token);
        localStorage.setItem("authTokenVioTech", data.token);
      }
      window.location.href = "/login"; // Redirige tras registro exitoso
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          Crear cuenta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="nombre">
              Nombre completo
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 transition"
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
              Correo electrónico
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 transition"
              type="email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 transition"
              type="password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="confirm-password">
              Confirmar contraseña
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 transition"
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded transition">{error}</p>}
          <button
            type="submit"
            className="w-full bg-violet-600 dark:bg-violet-700 text-white py-2 rounded hover:bg-violet-700 dark:hover:bg-violet-800 transition"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?
            <a href="/login" className="text-violet-600 dark:text-violet-400 ml-1 hover:underline">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
