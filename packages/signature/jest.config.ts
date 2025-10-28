import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true, tsconfig: "tsconfig.json" }],
    "^.+\\.[cm]?js$": "babel-jest", // for ESM JS in node_modules (e.g. @noble/*)
  },

  transformIgnorePatterns: ["/node_modules/(?!(@noble|@scure)/)"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: "v8",
};
export default config;
