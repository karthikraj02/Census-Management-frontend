import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/vote': 'http://localhost:3000',
      '/data': 'http://localhost:3000',
      '/counts': 'http://localhost:3000',
      '/results': 'http://localhost:3000',
    },
  },
});
