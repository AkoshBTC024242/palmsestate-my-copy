// vite.config.js - FIXED VERSION
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Set the correct root directory
  root: '.',
  
  // Explicitly set public directory for static assets
  publicDir: 'public',
  
  build: {
    // Don't hash the main index.html
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Don't hash entry files
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep index.html as plain filename
          if (assetInfo.name === 'index.html') {
            return '[name][extname]';
          }
          // Hash other assets
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Don't empty the output directory (preserve manually added files)
    emptyOutDir: false,
  },
  
  server: {
    host: true,
    port: 3000,
  },
});