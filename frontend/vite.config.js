import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Optimize dev server performance
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation library
          'framer-motion': ['framer-motion'],
          // Chart library (heavy)
          'charts': ['recharts'],
          // PDF generation (heavy, only loaded when needed)
          'pdf': ['html2canvas', 'jspdf', 'html2pdf.js'],
          // Excel library
          'xlsx': ['xlsx']
        }
      }
    },
    // Optimize build performance
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'recharts'],
    exclude: ['html2canvas', 'jspdf', 'html2pdf.js']
  }
});

