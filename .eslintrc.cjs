/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "prettier"
  ],
  rules: {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "no-console": "off",
    "import/order": [
      "warn",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ]
  }
};
