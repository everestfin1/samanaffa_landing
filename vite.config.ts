import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        routesDirectory: 'app',
        routeFileIgnorePattern: '(^|/)(page\\.tsx$|.*\\/page\\.tsx$|route\\.ts$|.*\\/route\\.ts$)',
      },
    }),
    viteReact(),
  ],
})
