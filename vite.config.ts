import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        projetDetail: 'projet-detail.html'
      }
    }
  },
  server: {
    port: 3000
  }
});