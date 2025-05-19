// src/components/HeaderSession.tsx
import { useEffect, useState } from "react";

export default function HeaderSession() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName);

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      setUserName(localStorage.getItem("userName"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  if (userName) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-violet-700 dark:text-violet-300">
          {userName}
        </span>
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }
  return (
    <>
      <a
        href="/login"
        className="hidden sm:inline-flex btn-primary px-6 py-2 rounded-lg font-semibold text-base transition"
      >
        Inicia sesión
      </a>
      <a
        href="/registro"
        className="hidden sm:inline-flex ml-2 px-6 py-2 rounded-lg font-semibold text-base bg-violet-50 dark:bg-violet-900 text-violet-700 dark:text-violet-200 hover:bg-violet-100 dark:hover:bg-violet-800 transition"
      >
        Registro
      </a>
    </>
  );
}
