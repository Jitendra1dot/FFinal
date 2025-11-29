import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/Finalproject/",
  build: {
    outDir: "dist",
  }
})
