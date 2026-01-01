module.exports = {
  testEnvironment: 'node',          // Run tests in Node.js environment
  coverageDirectory: 'coverage',    // Where to save coverage reports
  collectCoverageFrom: [
    'src/**/*.js',                  // Test all source files
    '!src/index.js'                 // Except the main entry point
  ],
  testMatch: [
    '**/tests/**/*.test.js'         // Look for .test.js files in tests/
  ],
  verbose: true                     // Show detailed test output
};