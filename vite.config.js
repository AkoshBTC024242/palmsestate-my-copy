import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Enable fast refresh
      fastRefresh: true,
      // Remove problematic babel configuration
      babel: {
        // Remove the problematic plugin
      },
    }),
  ],
  build: {
    // Optimize build output
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          supabase: ['@supabase/supabase-js'],
          charts: ['apexcharts', 'react-apexcharts'],
          forms: ['react-hook-form', 'zod'],
        },
        // Add content hash for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
      },
    },
    // Disable source maps in production to reduce size
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 1500,
  },
  server: {
    // Development server optimization
    host: true,
    port: 3000,
    open: true,
    cors: true,
    // Enable HMR (Hot Module Replacement)
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@supabase/supabase-js',
      'axios',
      'apexcharts',
    ],
    // Force dependency pre-bundling
    force: true,
  },
  // Resolve configuration to prevent missing module errors
  resolve: {
    alias: {
      // Add any necessary aliases here
    },
  },
});
