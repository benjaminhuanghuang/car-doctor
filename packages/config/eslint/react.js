import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * Shared flat-config preset for the Vite + React web app.
 * Consumers spread it and append their own ignores.
 */
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // @react-three/fiber's JSX intrinsics aren't typed under React 19 yet, so a
      // file-level escape hatch is allowed as long as it explains itself.
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-nocheck': 'allow-with-description', minimumDescriptionLength: 10 },
      ],
    },
  },
  {
    // shadcn/ui components are generated; they export helper variants alongside
    // the component and use empty prop interfaces by design.
    files: ['**/components/ui/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
);
