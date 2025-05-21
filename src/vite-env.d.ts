// frontend/src/vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Añade aquí TODAS las variables de entorno que uses con el prefijo VITE_
  readonly VITE_API_URL: string;
  // Ejemplo de otra variable:
  // readonly VITE_ANOTHER_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
