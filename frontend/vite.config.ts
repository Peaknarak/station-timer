import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/station-timer/',   // 👈 ต้องใส่เวลาจะ deploy GitHub Pages (ชื่อ repo)

  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
