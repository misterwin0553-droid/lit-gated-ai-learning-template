import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

export default defineConfig({
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.browser': true
  },
  optimizeDeps: {
    include: [
      '@lit-protocol/lit-node-client',
      '@lit-protocol/encryption',
      '@lit-protocol/constants',
      '@lit-protocol/auth-helpers'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        browserLit: resolve(__dirname, 'browser-lit.html')
      },
      plugins: [rollupNodePolyFill()]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
