// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default({
  server: {
    proxy: {
      '/api': 'https://foodapp-733a.onrender.com'
    },
  },
  plugins: [
    tailwindcss(),
    react()
  ],
})
