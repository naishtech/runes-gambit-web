import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/runes-gambit-web/',
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'utils': ['./src/utils/random.js', './src/utils/storage.js']
        }
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500
  },
  preview: {
    port: 4173,
    strictPort: true
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true
  }
})
