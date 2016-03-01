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

var rule = require("../../../lib/rules/no-dup-keys"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "Some dependent keys are duplicated.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var codes = [
  {CODE: "Ember.computed({{KEYS}}, function () {});"},
  {CODE: "Ember['computed']({{KEYS}}, function () {});"},
  {CODE: "Ember.observes({{KEYS}}, function () {});"},
  {CODE: "Ember['observes']({{KEYS}}, function () {});"},
  {CODE: "computed({{KEYS}}, function () {});"},
  {CODE: "observes({{KEYS}}, function () {});"},
  {CODE: "var a = {b: function() {}.property({{KEYS}})};"},
  {CODE: "var a = {b: function() {}.observes({{KEYS}})};"}
];

var validKeys = [
  {KEYS: "'a'", EXP: ""},
  {KEYS: "'a', 'b'", EXP: ""},
  {KEYS: "'a', 'b', 'c'", EXP: ""}
];

var validKeysForExpand = [
  {KEYS: "'a.{b,c}'", EXP: "true"},
  {KEYS: "'a.{b,c}.d'", EXP: "true"},
  {KEYS: "'a.{b,c}', 'd'", EXP: "true"},
  {KEYS: "'a.{b,c}','a.d'", EXP: "true"},
  {KEYS: "'a.{b,c}','a.d', 'b.c'", EXP: "true"}
];

var invalidKeys = [
  {KEYS: "'a', 'b', 'c', 'a', 'e'", EXP: ""}
];

var invalidKeysForExpand = [
  {KEYS: "'a.{b,c,d,e,f,g}', 'a.c'", EXP: "true"},
  {KEYS: "'a.{b,c,d,e,f,g}', 'a.{c,d}'", EXP: "true"},
  {KEYS: "'a.{b,c,d,e,f,g}', 'a.{c,d}', 'a.b.c'", EXP: "true"},
  {KEYS: "'a.{b,c}.d', 'a.b.d', 'a.b.c'", EXP: "true"}
];

var validTestTemplates = [
  {
    code:
      "{{CODE}}"
  },
  {
    code:
      "{{CODE}}",
    options: [{tryExpandKeys: "{{EXP}}"}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{CODE}}",
    errors: [
      {message: m, type: "CallExpression"}
    ],
    options: [{tryExpandKeys: "{{EXP}}"}]
  },
  {
    code:
      "{{CODE}} {{CODE}}",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ],
    options: [{tryExpandKeys: "{{EXP}}"}]
  }
];

function prepareOptions(combo) {
  if (combo.options) {
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

var ruleTester = new RuleTester();
ruleTester.run("no-dup-keys", rule, {
  valid: validTests,
  invalid: invalidTests
});
