import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 3000,
    proxy: {
      '/api/admin': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
      '/api/kyc': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
      '/api/payments': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      start: {
        entry: 'src/start.ts',
      },
      router: {
        routesDirectory: 'app',
        routeFileIgnorePattern: '(^|/)(page\\.tsx$|.*\\/page\\.tsx$|route\\.ts$|.*\\/route\\.ts$|columns\\.tsx$|queries\\.ts$)',
      },
    }),
    viteReact(),
  ],
})
