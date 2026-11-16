import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { enquiriesPlugin } from './server/vite-enquiries.js';
import { heroPreloads } from './src/heroImages.js';

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), tailwindcss(), enquiriesPlugin(), {
    name: 'hero-preload',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      handler(_html, context) {
        const pathname = new URL(context.originalUrl || '/', 'http://localhost').pathname;
        const route = pathname === '/' ? '/' : pathname.replace(/\/+$/, '') + '/';
        return heroPreloads(route).map(attrs => ({tag:'link',attrs,injectTo:'head-prepend'}));
      },
    },
  }],
});
