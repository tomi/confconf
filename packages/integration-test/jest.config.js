const baseConfig = require("../../jest.base.config");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...baseConfig,

  globals: {
    "ts-jest": { tsconfig: "tsconfig.json" },
  },
};
