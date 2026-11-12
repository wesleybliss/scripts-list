import { createRequire } from 'node:module'

import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import type { Linter } from 'eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const require = createRequire(import.meta.url)
const indentEmptyLinesPlugin = require('eslint-plugin-indent-empty-lines').default

const basePlugins = {
    'indent-empty-lines': indentEmptyLinesPlugin,
    'simple-import-sort': simpleImportSort,
}

const stylisticRules: Linter.RulesRecord = {
    '@stylistic/indent': ['error', 4, { SwitchCase: 1 }],
    '@stylistic/linebreak-style': ['error', 'unix'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/arrow-parens': ['error', 'as-needed'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/max-len': ['error', { code: 120 }],
    '@stylistic/block-spacing': ['error', 'always'],
    '@stylistic/space-before-blocks': ['error', 'always'],
    '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
    '@stylistic/object-curly-spacing': ['error', 'always'],
}

export default tseslint.config(
    {
        ignores: [
            'dist',
            '**/node_modules/**',
            'coverage',
        ],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.node,
        },
        plugins: {
            '@stylistic': stylistic,
            ...basePlugins,
        },
        rules: {
            'linebreak-style': ['error', 'unix'],
            'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
            'no-eq-null': 'error',
            radix: ['error', 'always'],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'indent-empty-lines/indent-empty-lines': ['error', 4],
            'preserve-caught-error': 'off',
            'no-unused-vars': 'off',
            'no-console': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            ...stylisticRules,
        },
    },
    {
        files: ['test/**/*.ts'],
        rules: {
            'no-console': 'off',
        },
    },
)
