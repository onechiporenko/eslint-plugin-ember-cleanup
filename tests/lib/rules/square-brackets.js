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

var rule = require("../../../lib/rules/square-brackets"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m1 = "Dependent key should not end with `@each`, use `[]` instead.";
var m2 = "`[]` should be at the end of the dependent key.";
var m3 = "Dot should be before `[]`.";
var keys = require("./keys.js");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var codes = keys.code;

var validKeys = [
  {KEYS: "'a.[]'"},
  {KEYS: "'a.b.[]'"}
];

var invalidKeys = [
  {KEYS: "'a.@each'", M: m1},
  {KEYS: "'a.{@each,b}'", M: m1},
  {KEYS: "'a.[].b.[].c'", M: m2},
  {KEYS: "'a.[].{b,d}.[].c'", M: m2},
  {KEYS: "'a.[].b.c'", M: m2},
  {KEYS: "'a.{[].b,d}.c'", M: m2},
  {KEYS: "'a[]'", M: m3},
  {KEYS: "'a{b,[]}'", M: m3}
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
      {message: "{{M}}", type: "CallExpression"}
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
  .createCombos(["code", "errors.0.message"], invalidKeys)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("square-brackets", rule, {
  valid: validTests,
  invalid: invalidTests
});