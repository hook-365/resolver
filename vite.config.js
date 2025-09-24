import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      'resolver.hook.technology',
      '.hook.technology' // Allow all subdomains
    ]
  }
})
