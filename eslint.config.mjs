import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
    {
        ignores: [
            'node_modules/**',
            'test/**',
            'dist/**',
            'build/**',
            'coverage/**',
            'out/**',
            'public/**',
            'tmp/**',
            'temp/**',
        ],
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended, eslintConfigPrettier],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ['**/*.{ts,mts,cts}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            eslintConfigPrettier,
        ],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
]);
