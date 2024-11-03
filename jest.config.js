/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 Wilfred Springer
 *
 * @type {import('ts-jest').JestConfigWithTsJest} *
 */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
};
