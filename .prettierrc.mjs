/**
 * Prettier Configuration
 * @see https://prettier.io/docs/en/options.html
 *
 * This config works with ESLint:
 * - Prettier handles code formatting (indentation, line breaks, quotes, etc.)
 * - ESLint handles code quality checks (unused variables, naming conventions, etc.)
 * - eslint-config-prettier disables ESLint rules that conflict with Prettier
 */
export default {
  printWidth: 100, // default 80
  tabWidth: 2, // default
  // indent lines with tabs instead of spaces
  useTabs: false, // default
  // print semicolons at the ends of statement
  semi: true, // default
  singleQuote: true, // default false
  // quote the properties in objects
  quoteProps: 'as-needed', // default
  // use double quotes instead of single quotes in JSX
  jsxSingleQuote: false, // default
  trailingComma: 'all', // default 'es5'
  // print spaces between brackets in object literals
  bracketSpacing: true, // default
  // include parentheses around a sole arrow function parameter
  arrowParens: 'always', // default
  // the format range is entire file
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  // markdown wrap standard match the printWidth
  proseWrap: 'preserve',
  // respect the default value of CSS display property
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
};
