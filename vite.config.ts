import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  base: '/markdown/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          codemirror: [
            '@codemirror/state',
            '@codemirror/view',
            '@codemirror/lang-markdown',
            '@codemirror/language',
            '@codemirror/commands',
            '@codemirror/autocomplete',
            '@codemirror/search',
          ],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-slug', 'rehype-raw'],
          highlightjs: ['highlight.js'],
        },
      },
    },
  },
})
