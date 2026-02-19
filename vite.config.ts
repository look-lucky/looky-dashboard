import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/external-api/data-go-kr': {
        target: 'http://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/external-api\/data-go-kr/, ''),
        secure: false,
      },
    },
  },
})
