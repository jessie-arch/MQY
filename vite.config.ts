import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  css:{
    modules:{
      generateScopedName:'[name]_[local]_[hash:base64:5]'
    }
  },
  plugins: [
    react(),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
      logger:true
    })
  ],
})
