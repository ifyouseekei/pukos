/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import { Config } from 'jest';

/** @type {import('jest').Config} */
const config: Config = {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // ✅ Allows importing .js files in TypeScript
  },
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
};

export default config;
