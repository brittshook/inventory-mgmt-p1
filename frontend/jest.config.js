export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: 'tsconfig.app.json',
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
                  }
                }
              },
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg|css)$": "<rootDir>/src/test/__mocks__/fileMock.js",
    '^@/(.*)': '<rootDir>/src/$1'
  },
};
