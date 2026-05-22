import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function manualChunks(id: string) {
  if (!id.includes('node_modules')) {
    return undefined
  }

  if (id.includes('@mui') || id.includes('@emotion')) {
    return 'vendor-mui'
  }

  return 'vendor-core'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
})
