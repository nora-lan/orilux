import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    reportCompressedSize: false,
    minify: false,
    rollupOptions: {
      maxParallelFileOps: 2,
      input: { home: 'index.html', community: 'community/index.html', article: 'community/article/index.html', account: 'account/index.html' },
    },
  },
})
