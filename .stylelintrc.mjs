/** @type {import('stylelint').Config} */
export default {
  extends: [
    // Standard CSS rules
    'stylelint-config-standard',
    // Standard SCSS rules
    'stylelint-config-standard-scss',
    // Disable rules that conflict with Prettier
    'stylelint-config-prettier-scss',
  ],
  plugins: ['stylelint-order'],
  rules: {
    // CSS properties alphabetical order (set to warn for gradual fixing)
    'order/properties-alphabetical-order': [
      true,
      {
        severity: 'warning',
      },
    ],

    // Allow universal selectors (needed in some scenarios)
    'selector-max-universal': 2,

    // Allow ID selectors (may be needed in legacy code)
    'selector-max-id': 1,

    // Allow deeper nesting levels (React components may need this)
    'max-nesting-depth': 4,

    // Allow shorthand property overrides
    'declaration-block-no-shorthand-property-overrides': true,

    // Class naming convention: allow kebab-case and camelCase (common in CSS Modules)
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$|^[a-z][a-zA-Z0-9]*(__[a-zA-Z0-9]+)?(--[a-zA-Z0-9]+)?$',
      {
        message: 'Class names should use kebab-case, camelCase or BEM naming convention',
      },
    ],

    // SCSS rules - support Tailwind CSS directives
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'config',
          'source',
          'theme',
          'utility',
        ],
      },
    ],

    // Support Tailwind @import position
    'no-invalid-position-at-import-rule': null,

    // Relax empty line rules for CSS variables and comments
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'comment-whitespace-inside': null,
    'rule-empty-line-before': null,

    // Relax color format rules (allow rgba, etc.)
    'color-hex-length': null,
    'color-function-alias-notation': null,

    // Allow mixed case keywords
    'value-keyword-case': null,

    // Allow vendor-prefixed at-rules
    'at-rule-no-vendor-prefix': null,

    // Allow empty source files (some components may have empty style placeholders)
    'no-empty-source': null,

    // Disable some overly strict rules
    'alpha-value-notation': null,
    'color-function-notation': null,
    'font-family-name-quotes': null,

    // Allow CSS variables from MUI and other libraries
    'custom-property-pattern': null,

    // Allow unknown pseudo-classes and pseudo-elements (third-party libraries may use them)
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local', 'export'],
      },
    ],

    // Allow vendor prefixes (should be handled by autoprefixer, but needed in some cases)
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
  },
  overrides: [
    {
      // For CSS Modules
      files: ['**/*.module.css', '**/*.module.scss'],
      rules: {
        'selector-class-pattern': null,
      },
    },
  ],
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.min.css'],
};
