// This config is cascaded automatically with the base config in the repo root:
// https://eslint.org/docs/user-guide/configuring/configuration-files#cascading-and-hierarchy
module.exports = {
  ignorePatterns: [
    ".mocharc.json",
    // The eslint config itself. Needed for vscode-eslint extension
    ".eslintrc.js",
  ],
  plugins: ["mocha"],
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  extends: ["plugin:mocha/recommended"],
  rules: {
    "mocha/no-mocha-arrows": "off",
  },
};
