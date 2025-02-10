import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you (and all other Quasar project
     * relevant folders and files).
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    // ignores: []
  },

  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,

  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  // https://github.com/vuejs/eslint-config-typescript
  ...defineConfigWithVueTs(
    /**
     * https://eslint.vuejs.org
     *
     * pluginVue.configs.base
     *   -> Settings and rules to enable correct ESLint parsing.
     * pluginVue.configs[ 'flat/essential']
     *   -> base, plus rules to prevent errors or unintended behavior.
     * pluginVue.configs["flat/strongly-recommended"]
     *   -> Above, plus rules to considerably improve code readability and/or dev experience.
     * pluginVue.configs["flat/recommended"]
     *   -> Above, plus rules to enforce subjective community defaults to ensure consistency.
     */
    pluginVue.configs['flat/essential'],
    // Optional: extend additional configurations from typescript-eslint'.
    // Supports all the configurations in
    // https://typescript-eslint.io/users/configs#recommended-configurations
    // We STRONGLY RECOMMEND you to start with `recommended` or `recommendedTypeChecked`.
    vueTsConfigs.recommendedTypeChecked,
  ),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly', // BEX related
      },
    },

    // add your custom rules here
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'warn',
      eqeqeq: ['error', 'always'],
      'no-prototype-builtins': 'off',
      'prefer-promise-reject-errors': 'off',

      'no-console':
        process.env.NODE_ENV === 'production'
          ? [
              'warn',
              {
                allow: ['error', 'warn', 'info'], // Allow console.error and console.warn
              },
            ]
          : 'off',

      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  {
    files: ['src-pwa/custom-service-worker.ts'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  prettierSkipFormatting,
]
