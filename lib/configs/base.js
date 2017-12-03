module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },

  env: {
    browser: true,
    es6: true
  },

  plugins: [
    "ember-cleanup"
  ],
};