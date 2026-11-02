import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: 'js',
    emptyOutDir: false,
    lib: {
      entry: 'src/mountReactComponents.jsx',
      name: 'MediCareReact',
      formats: ['iife'],
      fileName: () => 'react-components.bundle.js'
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  }
});
