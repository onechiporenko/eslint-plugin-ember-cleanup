/**
 * @fileoverview
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-console"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var methods = [
  {METHOD: "log"},
  {METHOD: "info"},
  {METHOD: "debug"},
  {METHOD: "warn"},
  {METHOD: "error"}
];

var invalidTestTemplates = [
  {
    code:
      "{{CONSOLE}}['{{METHOD}}'];",
    errors: [
      {message: "`Ember.Logger.{{METHOD}}` should be used."}
    ]
  },
  {
    code:
      "{{CONSOLE}}.{{METHOD}};",
    errors: [
      {message: "`Ember.Logger.{{METHOD}}` should be used."}
    ]
  },
  {
    code:
      "{{CONSOLE}}.{{METHOD}}{{MOD}}();",
    errors: [
      {message: "`Ember.Logger.{{METHOD}}` should be used."}
    ]
  },
  {
    code:
      "{{CONSOLE}}['{{METHOD}}']{{MOD}}();",
    errors: [
      {message: "`Ember.Logger.{{METHOD}}` should be used."}
    ]
  }
];

// same as invalid but without `errors` and `Ember.Logger` instead of `console`
var validTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], methods)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {CONSOLE: "Ember.Logger", MOD: ""})
  .uniqueCombos()
  .getCombos()
  .map(function (c) {
    return {code: c.code};
  });

j
  .clearCombos()
  .clearTemplates();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.message"], methods)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {CONSOLE: "console"})
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{MOD: ".apply"}, {MOD: ".call"}, {MOD: ""}])
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester();
ruleTester.run("no-console", rule, {
  valid: validTests,
  invalid: invalidTests
});
