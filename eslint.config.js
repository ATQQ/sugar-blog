// eslint.config.js
import antfu from '@antfu/eslint-config'

// TODO DDL 迭代
export default antfu({
},
{
  ignores: [
    'packages/theme/*.js',
    'packages/blogpress/case/bad/*.md'
  ]
},
{
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/extensions': 'off',
    'quotes': [
      'warn',
      'single',
    ],
    'semi': [
      'warn',
      'never',
    ],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-restricted-syntax': 'off',
    'no-bitwise': 'off',
    'camelcase': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-undef': 'off',
    'no-shadow': 'off',
    'max-len': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-use-before-define': 'off',
    'no-continue': 'off',
    'no-extend-native': 'warn',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'non-null-expression': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    'ts/comma-dangle': 'off',
    'curly': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'ts/no-var-requires': 'off',
    'ts/no-require-imports': 'off',
    'ts/ban-ts-comment': 'off',
    'vue/prefer-import-from-vue': 'off',
    'jsdoc/no-types': 'off',
    'no-template-curly-in-string': 'off',
    'use-isnan': 'warn',
    'unicorn/prefer-number-properties': 'off',
    'no-unneeded-ternary': 'off',
    'vue/require-component-is': 'off'
  },
}
)
