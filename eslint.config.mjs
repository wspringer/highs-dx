/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 Wilfred Springer
 */
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import headers from "eslint-plugin-headers";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      headers,
    },
    rules: {
      "headers/header-format": [
        "error",
        {
          source: "string",
          content: "SPDX-License-Identifier: MIT\nCopyright (c) 2024 Wilfred Springer",
        },
      ],
    },
  },
];
