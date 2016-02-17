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

var rule = require("../../../lib/rules/no-is-array"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var m = "`Ember.isArray` is better to detect arrays and array-like variables.";

var operators = [
  {OPERATOR: "==="},
  {OPERATOR: "=="},
  {OPERATOR: "!=="},
  {OPERATOR: "!="}
];

var invalidTestTemplates = [
  {
    code:
      "{{IS_ARRAY}}{{MOD}} {{FOO}} {{OPERATOR}} {{RESULT}};",
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "{{RESULT}} {{OPERATOR}} {{IS_ARRAY}}{{MOD}} {{FOO}};",
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "if ({{IS_ARRAY}}{{MOD}} {{FOO}} {{OPERATOR}} {{RESULT}}) {}",
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "if ({{RESULT}} {{OPERATOR}} {{IS_ARRAY}}{{MOD}} {{FOO}}) {}",
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "var val = {{IS_ARRAY}}{{MOD}} {{FOO}} {{OPERATOR}} {{RESULT}};",
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "var val = {{RESULT}} {{OPERATOR}} {{IS_ARRAY}}{{MOD}} {{FOO}};",
    errors: [
      {message: m}
    ]
  }
];

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], operators)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{IS_ARRAY: "Ember.typeOf"}, {IS_ARRAY: "Ember['typeOf']"}, {IS_ARRAY: "Array.isArray"}, {IS_ARRAY: "Array['isArray']"}])
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{MOD: ".call("}, {MOD: ".apply("}, {MOD: "("}])
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {FOO: "foo)"})
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {RESULT: "'array'"})
  .uniqueCombos()
  .getCombos();

j
  .clearCombos()
  .clearTemplates();

var validTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], operators)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{IS_ARRAY: "Ember.isArray"}, {IS_ARRAY: "Ember['isArray']"}])
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{MOD: ".call("}, {MOD: ".apply("}, {MOD: "("}])
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {FOO: "foo)"})
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{RESULT: "true"}, {RESULT: "false"}])
  .uniqueCombos()
  .getCombos()
  .map(function (c) {
    return {code: c.code};
  });

var ruleTester = new RuleTester();
ruleTester.run("no-is-array", rule, {
  valid: validTests,
  invalid: invalidTests
});
