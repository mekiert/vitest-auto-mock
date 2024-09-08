/// <reference types="vite" />

import { defineConfig, } from 'vite';
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({
    outDir: 'build',
    strictOutput: true,
    exclude: [
      '**/__tests__/**',
      'setup-tests.ts'
    ]
  })],
  resolve: {
    alias: {
      src: '/src'
    }
  },
  build: {
    lib: {
      entry: [
        'src/index.ts',
        'src/plugin/index.ts'
      ],
      formats: ['es', 'cjs'],
      fileName: (format, name) => {
        const extension = format === 'es' ? 'js' : 'cjs';
        return `${name}.${extension}`;
      }
    },
    outDir: 'build',
    rollupOptions: {
      output: {
        preserveModules: true
      },
      external: [
        'vite',
        'vitest',
        'vitest/config',
        'rollup'
      ]
    }
  }
});
