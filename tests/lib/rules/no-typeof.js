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

var rule = require("../../../lib/rules/no-typeof"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var m = "`Ember.typeOf` can give more accurate result.";
var operators = [
  {OPERATOR: "==="},
  {OPERATOR: "=="},
  {OPERATOR: "!=="},
  {OPERATOR: "!="}
];

var types = [
  {TYPE: "string"},
  {TYPE: "object"},
  {TYPE: "undefined"},
  {TYPE: "symbol"},
  {TYPE: "function"},
  {TYPE: "number"},
  {TYPE: "boolean"}
];

var invalidTestTemplates = [
  {
    code:
      "{{TYPEOF}} {{FOO}} {{OPERATOR}} '{{TYPE}}';",
    options: [{disallowed: ["{{TYPE}}"]}],
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "'{{TYPE}}' {{OPERATOR}} {{TYPEOF}} {{FOO}};",
    options: [{disallowed: ["{{TYPE}}"]}],
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "if ({{TYPEOF}} {{FOO}} {{OPERATOR}} '{{TYPE}}') {}",
    options: [{disallowed: ["{{TYPE}}"]}],
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "if ('{{TYPE}}' {{OPERATOR}} {{TYPEOF}} {{FOO}}) {}",
    options: [{disallowed: ["{{TYPE}}"]}],
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "var val = {{TYPEOF}} {{FOO}} {{OPERATOR}} '{{TYPE}}';",
    options: [{disallowed: ["{{TYPE}}"]}],
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "var val = '{{TYPE}}' {{OPERATOR}} {{TYPEOF}} {{FOO}};",
    options: [{disallowed: ["{{TYPE}}"]}],
    errors: [
      {message: m}
    ]
  }
];

// same as invalid but without `errors` and `Ember.typeOf` instead of `typeof`
var validTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], operators)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.disallowed.0"], types)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{TYPEOF: "Ember.typeOf("}, {TYPEOF: "Ember['typeOf']("}])
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {FOO: "foo)"})
  .uniqueCombos()
  .getCombos()
  .map(function (c) {
    return {code: c.code, options: c.options};
  });

j
  .clearCombos()
  .clearTemplates();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], operators)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.disallowed.0"], types)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {TYPEOF: "typeof"})
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], {FOO: "foo"})
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester();
ruleTester.run("no-typeof", rule, {
  valid: validTests,
  invalid: invalidTests
});
