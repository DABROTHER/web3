import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      baseUrl: 'src',
      '@': path.resolve(__dirname, 'src'),
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      fs: 'fs',
    },
  },
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
})
