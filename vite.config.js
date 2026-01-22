// vite.config.js - CORRECT CONFIGURATION
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Important: Root directory
  root: '.',
  
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    
    // Don't hash the entry HTML file
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Keep index.html without hash
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: ({ name }) => {
          // Don't hash index.html
          if (name === 'index.html') {
            return '[name][extname]';
          }
          // Hash other assets
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  
  server: {
    host: true,
    port: 3000,
    open: true
  }
});
