import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',  // or you can specify your local IP like '192.168.x.x'
    port: 3000,       // or any port of your choice
    strictPort: true  // Ensures the server doesn't try another port if the specified one is taken
  }
})

