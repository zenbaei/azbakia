module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!zenbaei-js-lib)/react/components/*',
  ],
  testMatch: ['**/__tests__/**/*.spec.*', '**/__tests__/**/*.it.ts'],
  setupFiles: ['./__tests__/setup.js'],
};
