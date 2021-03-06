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

var rule = require("../../../lib/rules/max-dep-keys"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var keys = require("./keys.js");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var codes = keys.code.slice().filter(function (c) {
  return c.CODE.indexOf(".someMacro") === -1;
});

var validKeys = [
  {KEYS: "'a'", MAX: 1, EXP: ""},
  {KEYS: "'a', 'b'", MAX: 2, EXP: ""},
  {KEYS: "'a', 'b', 'c'", MAX: 3, EXP: ""}
];

var validKeysForExpand = [
  {KEYS: "'a.{b,c}'", MAX: 2, EXP: "true"},
  {KEYS: "'a.{b,c}'", MAX: 3, EXP: "true"},
  {KEYS: "'a.{b,c}','a.d'", MAX: 3, EXP: "true"},
  {KEYS: "'a.{b,c}','a.d'", MAX: 4, EXP: "true"}
];

var invalidKeys = [
  {KEYS: "'a', 'b', 'c', 'd', 'e'", MAX: 4, KEYS_COUNT: 5, EXP: ""}
];

var invalidKeysForExpand = [
  {KEYS: "'a.{b,c,d,e,f,g}'", MAX: 4, KEYS_COUNT: 6, EXP: "true"}
];

var validTestTemplates = [
  {
    code:
      "{{CODE}}"
  },
  {
    code:
      "{{CODE}}",
    options: [{max: "{{MAX}}", tryExpandKeys: "{{EXP}}"}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{CODE}}",
    errors: [
      {message: "Too many dependent keys {{KEYS_COUNT}}. Maximum allowed is {{MAX}}.", type: "CallExpression"}
    ],
    options: [{max: "{{MAX}}", tryExpandKeys: "{{EXP}}"}]
  },
  {
    code:
      "{{CODE}} {{CODE}}",
    errors: [
      {message: "Too many dependent keys {{KEYS_COUNT}}. Maximum allowed is {{MAX}}.", type: "CallExpression"},
      {message: "Too many dependent keys {{KEYS_COUNT}}. Maximum allowed is {{MAX}}.", type: "CallExpression"}
    ],
    options: [{max: "{{MAX}}", tryExpandKeys: "{{EXP}}"}]
  }
];

function prepareOptions(combo) {
  if (combo.options) {
    combo.options[0].max = parseInt(combo.options[0].max, 10);
    combo.options[0].tryExpandKeys = Boolean(combo.options[0].tryExpandKeys);
  }
  return combo;
}

var validTestsForExpand = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.{max,tryExpandKeys}"], validKeysForExpand)
  .getCombos()
  .map(prepareOptions);

j
  .clearCombos()
  .clearTemplates();

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.max"], validKeys)
  .uniqueCombos()
  .getCombos()
  .map(prepareOptions)
  .concat(validTestsForExpand);

j
  .clearCombos()
  .clearTemplates();

var invalidTestsForExpand = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.{max,tryExpandKeys}", "errors.@each.message"], invalidKeysForExpand)
  .getCombos()
  .map(prepareOptions);

j
  .clearCombos()
  .clearTemplates();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.max", "errors.@each.message"], invalidKeys)
  .uniqueCombos()
  .getCombos()
  .map(prepareOptions)
  .concat(invalidTestsForExpand);

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("max-dep-keys", rule, {
  valid: validTests,
  invalid: invalidTests
});
