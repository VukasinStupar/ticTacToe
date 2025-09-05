import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 🚫 Ignorisanje fajlova i foldera
  {
    ignores: ['node_modules/**', 'package-lock.json', 'dist/**', 'build/**'],
  },

  // JS for backend (Node)
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier },
    languageOptions: { globals: globals.node },
    rules: { 'prettier/prettier': 'error' },
  },

  // Frontend JS/JSX with React
  {
    files: ['frontend/**/*.{js,jsx}'],
    plugins: { react: pluginReact, prettier },
    extends: [pluginReact.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    rules: { 'prettier/prettier': 'error' },
    settings: { react: { version: 'detect' } },
  },

  // JSON
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
  },
  

  // Markdown
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: ['markdown/recommended'],
  },

  // CSS
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
]);
