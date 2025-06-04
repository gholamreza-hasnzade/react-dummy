import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
      {
        find: "@/assets",
        replacement: resolve(__dirname, "./src/assets"),
      },
      {
        find: "@/components",
        replacement: resolve(__dirname, "./src/components"),
      },
      {
        find: "@/configurations",
        replacement: resolve(__dirname, "./src/configurations"),
      },
      {
        find: "@/constants",
        replacement: resolve(__dirname, "./src/constants"),
      },
      {
        find: "@/services",
        replacement: resolve(__dirname, "./src/services"),
      },
      {
        find: "@/modules",
        replacement: resolve(__dirname, "./src/modules"),
      },
      {
        find: "@/routers",
        replacement: resolve(__dirname, "./src/routers"),
      },
    ],
  },
})
