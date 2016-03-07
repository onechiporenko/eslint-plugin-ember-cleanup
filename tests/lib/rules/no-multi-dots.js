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

var rule = require("../../../lib/rules/no-multi-dots.js"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var keys = require("./keys.js");
var m = "`..` should not be in the dependent keys.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var codes = keys.code;

var validKeys = [
  {KEYS: "'a'"},
  {KEYS: "'a', 'b'"},
  {KEYS: "'a', 'b', 'c'"},
  {KEYS: "'a.{b,c}'"}
];

var invalidKeys = [
  {KEYS: "'a..b'"},
  {KEYS: "'a', 'b..c'"},
  {KEYS: "'a', 'b...c'"},
  {KEYS: "'a', 'b..c', 'd'"},
  {KEYS: "'a', 'b..c', 'd..e'"},
  {KEYS: "'a', 'b...c', 'd'"},
  {KEYS: "'a', 'a.{b..c,d}', 'e'"},
  {KEYS: "'a', 'a.{b...c,d}', 'e'"}
];

var validTestTemplates = [
  {
    code:
      "{{CODE}}"
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{CODE}}",
    errors: [
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{CODE}} {{CODE}}",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], validKeys)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], invalidKeys)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-multi-dots", rule, {
  valid: validTests,
  invalid: invalidTests
});
