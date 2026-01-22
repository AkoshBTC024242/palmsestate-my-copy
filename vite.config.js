// vite.config.js - WORKING VERSION WITH HTML IMPORTS
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Allow HTML imports as raw strings
  assetsInclude: ['**/*.html'],
  
  // Configure esbuild to handle HTML files
  esbuild: {
    loader: {
      '.html': 'text'
    }
  },
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      },
      // Handle external files
      external: [],
    },
    // CommonJS options for external dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  
  server: {
    host: true,
    port: 3000,
    open: true
  },
  
  // Resolve aliases if needed
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    exclude: ['**/*.html'], // Exclude HTML files from optimization
  },
});
