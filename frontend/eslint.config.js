import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },

  {
    files: ["**/*.{js,jsx}"],
    plugins: { react: pluginReact, prettier },
    extends: [js.configs.recommended, pluginReact.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      "prettier/prettier": "error", 
    },
    settings: {
      react: { version: "detect" }, 
    },
  },
]);
