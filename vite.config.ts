import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  css:{
    modules:{
      generateScopedName:'[name]_[local]_[hash:base64:5]'
    }
  },
  plugins: [react()],
})
