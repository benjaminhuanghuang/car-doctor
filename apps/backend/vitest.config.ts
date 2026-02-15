import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    globalSetup: ['./tests/globalSetup.ts'],
    // Automatically clean up after each test to ensure isolation
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 30000,
  },
  plugins: [],
});
