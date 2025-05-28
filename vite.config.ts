import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        [env.VITE_API_BASE_URL || '/api']: {
          target: env.VITE_API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL || '/api'}`), '')
        }
      }
    }
  }
})
