/**
 * lint-staged runs on the files being committed.
 *
 * ESLint uses flat config resolved from the CWD, so each package's staged files
 * are linted via `pnpm --filter <pkg> exec` to pick up that package's own
 * eslint.config. Prettier is config-location-agnostic and runs once from the root.
 * (apps/mobile is linted by `expo lint`, not plain eslint, so it's Prettier-only here.)
 */
const eslintFix = (pkg) => (files) =>
  `pnpm --filter ${pkg} exec eslint --fix --no-warn-ignored ${files.map((f) => `"${f}"`).join(' ')}`;

export default {
  'apps/backend/**/*.ts': eslintFix('@car-doctor/backend'),
  'apps/web/**/*.{ts,tsx}': eslintFix('car-doctor-web'),
  'packages/shared/**/*.ts': eslintFix('@car-doctor/shared'),
  '*.{ts,tsx,js,jsx,mjs,cjs,json,css,yml,yaml}': 'prettier --write',
};
