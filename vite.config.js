// vite.config.js - UPDATED WITH HTML SUPPORT
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
    }),
  ],
  
  // Add this to handle HTML file imports
  assetsInclude: ['**/*.html'],
  
  // Optional: Define custom HTML loader
  // This will allow you to import HTML files as strings
  resolve: {
    alias: {
      // Optional: You can create an alias for your email templates
      '@emails': '/src/email'
    }
  },
  
  // Configure build optimizations
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
          
          // Group lib files (including email services)
          if (id.includes('/lib/')) {
            return 'chunk-lib';
          }
          
          // Group email templates separately
          if (id.includes('/email/') && id.includes('.html')) {
            return 'chunk-emails';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Handle different asset types
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (/\.(css)$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(html)$/.test(assetInfo.name)) {
            return 'assets/emails/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash].[ext]';
        },
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
    chunkSizeWarningLimit: 1000,
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
    exclude: ['**/*.html'], // Exclude HTML files from dependency optimization
  },
  
  // Add this custom transform for HTML files
  esbuild: {
    loader: {
      '.html': 'text'
    }
  }
});
