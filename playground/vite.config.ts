import { defineConfig } from 'vite';

// Permite servir o playground atras da borda local (hosts *.localhost) e HMR via bind mount em contêiner.
export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['.localhost'],
    watch: process.env.VITE_USE_POLLING ? { usePolling: true, interval: 200 } : undefined,
  },
  preview: {
    host: true,
    allowedHosts: ['.localhost'],
  },
});
