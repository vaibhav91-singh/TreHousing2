import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'https://trehousing2.onrender.com';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets so Hostinger subdirectories load correctly
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/media': {
        target: BACKEND_URL,
        changeOrigin: true,
      }
    }
  }
})
