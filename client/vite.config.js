import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
      // '/api': 'https://domra-tech-production-3f20.up.railway.app' // Forward all requests starting with /api
    }
    // proxy: {
    //   "/api":{
    //     target: 'https://domra-tech-production-3f20.up.railway.app', 
    //     changeOrigin: true, 
    //     secure: false
    //   }
    // }
    
  }
})
