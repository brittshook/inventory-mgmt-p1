import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jest-environment-jsdom",
  // solve cross origin errors
  testEnvironmentOptions: {
    url: "http://localhost:5173"
  },
  testTimeout: 60000,
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json",
        diagnostics: false,
        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_APP_API_URL: "http://localhost:5000/api",
                    VITE_AUTH0_DOMAIN: "placeholder",
                    VITE_AUTH0_CLIENT_ID: "placeholder",
                    VITE_AUTH0_REDIRECT_URI: "placeholder",
                    VITE_AUTH0_AUDIENCE: "placeholder",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg|css)$":
      "<rootDir>/src/test/__mocks__/fileMock.js",
    "^@/(.*)": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "json", "text"],
  coveragePathIgnorePatterns: ["/node_modules/", "/src/api/"],
};

export default config;
