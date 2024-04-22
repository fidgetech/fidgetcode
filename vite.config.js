import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      student: "/src/components/student",
      teacher: "/src/components/teacher",
      shared: "/src/components/shared",
      hooks: "/src/hooks",
      contexts: "/src/contexts",
      lib: "/src/lib",
      services: "/src/services",
      utils: "/src/utils",
      themes: "/src/themes",
    },
  },
})
