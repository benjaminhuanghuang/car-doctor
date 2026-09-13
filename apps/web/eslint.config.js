import react from '@car-doctor/config/eslint/react';

export default [
  ...react,
  {
    // Node-run config files and the Playwright e2e suite need Node globals (process, etc.).
    files: ['playwright.config.ts', 'vite.config.ts', 'vitest.config.ts', 'e2e/**/*.ts'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', __dirname: 'readonly' },
    },
  },
];
