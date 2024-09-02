import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';
import react from '@vitejs/plugin-react';
import vitestAutoMockPlugin from './src/plugin';

export default mergeConfig(viteConfig, defineConfig({
  plugins: [react(), vitestAutoMockPlugin()],
  test: {
    globals: true,
    watch: false,
    environment: "jsdom"
  }
}));
