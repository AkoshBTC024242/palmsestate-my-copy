// vite.config.js - UPDATED FOR BETTER CHUNK SPLITTING
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group chunks more intelligently
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@stripe')) {
              return 'vendor-stripe';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
          
          // Group page chunks
          if (id.includes('/pages/')) {
            if (id.includes('/dashboard/') || id.includes('/admin/')) {
              return 'chunk-dashboard';
            }
            if (id.includes('/pages/Home') || id.includes('/pages/Properties')) {
              return 'chunk-public-main';
            }
            return 'chunk-pages';
          }
          
          // Group components
          if (id.includes('/components/')) {
            return 'chunk-components';
          }
          
          // Group contexts
          if (id.includes('/contexts/')) {
            return 'chunk-contexts';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Lower warning limit to catch large chunks
    reportCompressedSize: true,
  },
  server: {
    host: true,
    port: 3000,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@supabase/supabase-js',
    ],
    force: true,
  },
});
