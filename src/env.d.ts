// frontend/src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BACKEND_API_URL: string; // Declara tu variable aquí
  // ...puedes añadir otras variables PUBLIC_ que uses
  
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
