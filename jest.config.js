export default {
  projects: [
    {
      displayName: "client",
      testMatch: ["<rootDir>/client/src/tests/**/*.test.{js,jsx}"],
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/client/src/tests/setup.js"],
      moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/client/src/$1",
      },
      collectCoverageFrom: [
        "client/src/**/*.{js,jsx}",
        "!client/src/tests/**",
        "!client/src/main.jsx",
        "!client/src/vite-env.d.ts",
      ],
      coverageThreshold: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    {
      displayName: "server",
      testMatch: ["<rootDir>/server/tests/**/*.test.js"],
      testEnvironment: "node",
      setupFilesAfterEnv: ["<rootDir>/server/tests/setup.js"],
      collectCoverageFrom: ["server/src/**/*.js", "!server/src/index.js", "!server/tests/**"],
      coverageThreshold: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  ],
  coverageDirectory: "coverage",
  collectCoverage: true,
}
