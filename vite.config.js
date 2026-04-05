import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : globalThis.process?.env.APP_BASE_PATH || '/moneypath/',
  plugins: [react()],
  server: {
    port: 5173,
  },
}))
