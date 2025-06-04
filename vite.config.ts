import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/configurations': path.resolve(__dirname, './src/configurations'),
        '@/constants': path.resolve(__dirname, './src/constants'),
        '@/services': path.resolve(__dirname, './src/services'),
        '@/modules': path.resolve(__dirname, './src/modules'),
        '@/routers': path.resolve(__dirname, './src/routers'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/types': path.resolve(__dirname, './src/types'),
      },
  },
})
