import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    react()
  ],
  optimizeDeps: {
    exclude: ['@babylonjs/havok'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@building': path.resolve(__dirname, 'src/modules/building'),
      '@character': path.resolve(__dirname, 'src/modules/character'),
      '@dice': path.resolve(__dirname, 'src/modules/dice'),
      '@event': path.resolve(__dirname, 'src/modules/event'),
      '@gamecore': path.resolve(__dirname, 'src/modules/gamecore'),
      '@inventory': path.resolve(__dirname, 'src/modules/inventory'),
      '@map': path.resolve(__dirname, 'src/modules/map'),
      '@object': path.resolve(__dirname, 'src/modules/object'),
      '@sport': path.resolve(__dirname, 'src/modules/sport'),
      '@tournament': path.resolve(__dirname, 'src/modules/tournement'),
    }
  },
  // add the public folder to the build
  base: './',
  build: {
    outDir: 'build',
    assetsDir: 'public',
  },
})
