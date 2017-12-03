"use strict";

const path = require("path");
const requireIndex = require("requireindex");

module.exports = {
  rules: requireIndex(path.resolve(__dirname, "./rules")),
  configs: requireIndex(path.resolve(__dirname, "./configs"))
};