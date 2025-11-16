import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/reserve': 'http://localhost:3000',
      '/checkin': 'http://localhost:3000',
      '/reservation': { target: 'http://localhost:3000', changeOrigin: true }
    }
  }
})
