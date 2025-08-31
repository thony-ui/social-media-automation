/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  globalSetup: "<rootDir>/src/test-utils/global-setup.ts",
  testMatch: ["**/*.integration.test.ts"],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/test-utils/jest-setup.ts"],
};
