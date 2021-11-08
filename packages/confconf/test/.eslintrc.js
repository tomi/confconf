// This config is cascaded automatically with the base config in the repo root:
// https://eslint.org/docs/user-guide/configuring/configuration-files#cascading-and-hierarchy
module.exports = {
  ignorePatterns: [
    // The eslint config itself. Needed for vscode-eslint extension
    ".eslintrc.js",
  ],
  parserOptions: {
    project: ["../tsconfig.test.json"],
    tsconfigRootDir: __dirname,
  },
  extends: ["plugin:jest/recommended", "plugin:jest/style"],
  env: {
    "jest/globals": true,
  },
};
