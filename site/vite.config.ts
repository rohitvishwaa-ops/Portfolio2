import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Local servers must never let the browser reuse an old page: a cached index.html kept showing stale builds.
const noStore = { 'Cache-Control': 'no-store' }

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
  },
  server: { headers: noStore },
  preview: { headers: noStore },
  build: {
    // The lazy-loaded Three.js chunk is ~1.1 MB (~280 KB gzipped) by nature; it loads after the page text,
    // so the default 500 KB warning is expected noise for this one chunk.
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules[\\/](three|@react-three|postprocessing)/.test(id)) return 'three'
        },
      },
    },
  },
})
