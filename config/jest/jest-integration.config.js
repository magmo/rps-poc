var config = require('./jest-unit.config')
config.testMatch = ["<rootDir>/src/**/integration-tests/?(*.)test.ts?(x)"];
module.exports = config;