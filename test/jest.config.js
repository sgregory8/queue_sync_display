module.exports = config = {
    preset: 'ts-jest/presets/js-with-babel',
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
    rootDir: '../',
    testMatch: ['<rootDir>/**/*.test.{js,ts}'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    modulePathIgnorePatterns: ['/node_modules/', '/server/build/', 'client/build'],
    testPathIgnorePatterns: ['/node_modules/', '/server/build/', 'client/build'],
    // collectCoverage: true,
    // coverageDirectory: '<rootDir>/test/coverage',
    // collectCoverageFrom: ['**/src/*.{js,jsx,ts}', '!**/node_modules/**', '!**/build/**', '!**/test/**'],
    testEnvironment: 'node',
    globalSetup: '<rootDir>/test/setup.ts',
    globalTeardown: '<rootDir>/test/teardown.ts',
    clearMocks: true, // reset all mock calls between tests
};
