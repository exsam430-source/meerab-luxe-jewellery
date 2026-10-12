import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'ui-libs': ['swiper', 'framer-motion'],
          'auth-libs': ['@react-oauth/google', 'jwt-decode'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 5173,
    // ✅ THIS IS THE KEY — proxy /api to backend
    proxy: {
      '/api': {
        target: 'https://meerabluxejewellers.rbjewellry.pk/api/',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})