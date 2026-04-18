import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  
  plugins: [vue()],

 
  resolve: {
    alias: {
     
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },


  css: {
    preprocessorOptions: {
      scss: {
       
        additionalData: `@import "@/scss/main.scss";`
      }
    }
  },

 
  test: {
    globals: true,
    environment: 'jsdom',
    // Esto ayuda a que Vitest ignore archivos de imagen/css durante los tests
    transformMode: {
      web: [/\.[jt]sx$/]
    }
  },

  
  server: {
    port: 5173,
    open: true
  }
})
