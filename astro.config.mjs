import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import alpinejs from '@astrojs/alpinejs';
import react from '@astrojs/react'; // <<--- AGREGA ESTA LÍNEA

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),      // <<--- Y ESTA LÍNEA
    alpinejs()
  ]
});