import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const apiProxy = {
  '/api': {
    target: `http://127.0.0.1:${process.env.API_PORT ?? 3001}`,
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: apiProxy,
    // The API writes vocabulary data here; watching it would trigger a full page reload on every save.
    watch: { ignored: ['**/data/**'] },
  },
  preview: { proxy: apiProxy },
})