import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    restoreMocks: true,
    setupFiles: './src/setupTests.js',
  },
});
