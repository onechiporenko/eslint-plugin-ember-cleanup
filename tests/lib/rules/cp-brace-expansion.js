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

var rule = require("../../../lib/rules/cp-brace-expansion"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var keys = require("./keys.js");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var m = "Some dependent keys may be grouped with Brace Expansion.";

var codes = keys.code;

var validKeysForExpand = [
  {KEYS: "'a.b','b.c'"},
  {KEYS: "'a.b','b.c','c.d'"},
  {KEYS: "'a.b','b.c','e.c.d'"}
];

var invalidKeysForExpand = [
  {KEYS: "'a.{b,c}','a.d'"},
  {KEYS: "'a.b','a.c','a.d'"},
  {KEYS: "'a.b','b.c','a.d'"},
  {KEYS: "'b.b','b.c','a.d'"},
  {KEYS: "'b.b','a.c.b','a.c.d'"},
  {KEYS: "'a.b','c.b'"},
  {KEYS: "'a.b','d.c.b'"}
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

var validTestsForExpand = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], validKeysForExpand)
  .getCombos();

j
  .clearCombos()
  .clearTemplates();

var invalidTestsForExpand = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], invalidKeysForExpand)
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("cp-brace-expansion", rule, {
  valid: validTestsForExpand,
  invalid: invalidTestsForExpand
});
