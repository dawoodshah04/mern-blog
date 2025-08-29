import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  server: mode === "development" ? {
    proxy: {
      '/api': {
        target: 'http://localhost:5000' || 'https://mern-blog-production-336f.up.railway.app',
        changeOrigin: true,
      },
    }
  } : undefined,

  plugins: [react()],
  optimizeDeps: {
    include: ["react-quill"]
  }
}));
