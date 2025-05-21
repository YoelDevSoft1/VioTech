// src/components/HeaderSession.tsx
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_USERNAME_KEY } from '../constants'; // Ajusta la ruta

export default function HeaderSession() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const updateAuthState = () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    const name = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    
    if (token) {
      setIsAuthenticated(true);
      setUserName(name);
      // console.log("HeaderSession: Estado actualizado a AUTENTICADO. Usuario:", name);
    } else {
      setIsAuthenticated(false);
      setUserName(null);
      // console.log("HeaderSession: Estado actualizado a NO AUTENTICADO.");
    }
  };

  useEffect(() => {
    updateAuthState(); // Al montar

    // Escuchar evento personalizado para cambios de auth en la misma pestaña
    const handleAuthChangeFromSameTab = (event?: CustomEvent) => {
      // console.log("HeaderSession: Evento 'authChanged' detectado.", event?.detail);
      updateAuthState();
    };
    window.addEventListener("authChanged", handleAuthChangeFromSameTab as EventListener);
    
    // Escuchar evento 'storage' para cambios en otras pestañas
    window.addEventListener("storage", updateAuthState);

    return () => {
      window.removeEventListener("authChanged", handleAuthChangeFromSameTab as EventListener);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    console.log("HeaderSession: Ejecutando handleLogout.");
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
    
    window.dispatchEvent(new CustomEvent("authChanged", { detail: { isAuthenticated: false } }));
    console.log("HeaderSession: Token/userName eliminados. Evento authChanged disparado. Redirigiendo a /login.");
    window.location.href = "/login";
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-x-3 sm:gap-x-4">
        {userName && (
          <a 
            href="/dashboard" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hidden md:block"
            title="Ir a mi panel"
          >
            Hola, <span className="font-semibold">{userName.split(' ')[0]}</span> {/* Solo primer nombre */}
          </a>
        )}
        <a
          href="/dashboard"
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-300 font-semibold text-sm transition-colors"
          title="Mi Panel de Control"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 hidden sm:inline" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Mi Panel
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-sm"
          title="Cerrar Sesión"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 hidden sm:inline" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href="/login"
        className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors
                   text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-primary-500/10"
      >
        Iniciar sesión
      </a>
      <a
        href="/registro"
        className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow
                   bg-primary-600 hover:bg-primary-700 text-white
                   dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        Regístrate
      </a>
    </div>
  );
}
