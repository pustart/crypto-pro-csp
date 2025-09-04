module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.(spec|test).[jt]s?(x)',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/vendor/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/examples/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/__mocks__/cadesplugin_api.js-actual.ts'
  ],
};
