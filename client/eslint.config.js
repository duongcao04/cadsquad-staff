import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    plugins: [
      'simple-import-sort', // Plugin sắp xếp
      'unused-imports'      // Plugin xóa thừa
    ],
    rules: {
      // ... các rules cũ

      // 1. Tự động xóa các import không dùng
      "no-unused-vars": "off", // Tắt rule mặc định của ESLint để tránh xung đột
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ],

      // 2. Tự động sắp xếp import (Sort)
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
