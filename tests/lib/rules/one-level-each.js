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

var rule = require("../../../lib/rules/one-level-each"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m1 = "Dependent key should not end with `@each`, use `[]` instead.";
var m2 = "Multiple `@each` in the one dependent key are not allowed.";
var m3 = "Deep `@each` in the dependent key is not allowed.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var codes = [
  {CODE: "Ember.computed({{KEYS}}, function () {});"},
  {CODE: "Ember.computed({{KEYS}}, {get() {}, set() {}});"},
  {CODE: "Ember['computed']({{KEYS}}, function () {});"},
  {CODE: "Ember['computed']({{KEYS}}, {get() {}, set() {}});"},
  {CODE: "Ember.observes({{KEYS}}, function () {});"},
  {CODE: "Ember['observes']({{KEYS}}, function () {});"},
  {CODE: "computed({{KEYS}}, function () {});"},
  {CODE: "computed({{KEYS}}, {get() {}, set() {}});"},
  {CODE: "observes({{KEYS}}, function () {});"},
  {CODE: "var a = {b: function() {}.property({{KEYS}})};"},
  {CODE: "var a = {b: function() {}.observes({{KEYS}})};"}
];

var validKeys = [
  {KEYS: "'a.@each.b'"},
  {KEYS: "'a.b.@each.c'"}
];

var invalidKeys = [
  {KEYS: "'a.@each'", M: m1},
  {KEYS: "'a.{@each,b}'", M: m1},
  {KEYS: "'a.@each.b.@each.c'", M: m2},
  {KEYS: "'a.@each.{b,d}.@each.c'", M: m2},
  {KEYS: "'a.@each.b.c'", M: m3},
  {KEYS: "'a.{@each.b,d}.c'", M: m3}
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
ruleTester.run("one-level-each", rule, {
  valid: validTests,
  invalid: invalidTests
});