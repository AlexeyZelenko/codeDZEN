import globals from "globals";
import * as parser from "vue-eslint-parser";
import pluginVue from "eslint-plugin-vue";
import eslintPluginTypeScript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      '.nuxt/**',
      'dist/**',
      '.output/**',
      'node_modules/**',
      'coverage/**'
    ]
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        defineNuxtComponent: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtConfig: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        useRuntimeConfig: 'readonly',
        navigateTo: 'readonly',
        useFetch: 'readonly',
        useAsyncData: 'readonly',
        useAuthStore: 'readonly',
        useFileUpload: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        watch: 'readonly'
      }
    },
    plugins: {
      vue: pluginVue,
      "@typescript-eslint": eslintPluginTypeScript
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-setup-props-destructure": "error",
      "vue/no-mutating-props": "error",
      "no-undef": "off",
      "no-unused-vars": "off"
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        defineNuxtPlugin: 'readonly',
        defineNuxtConfig: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        useRouter: 'readonly',
        useAuthStore: 'readonly',
        useFileUpload: 'readonly'
      }
    },
    plugins: {
      "@typescript-eslint": eslintPluginTypeScript
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off"
    }
  },
  {
    files: ["**/*.vue"],
    plugins: {
      vue: pluginVue,
    },
    rules: {
      ...pluginVue.configs["vue3-essential"].rules,
      "vue/multi-word-component-names": "off"
    }
  }
];