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

var rule = require("../../../lib/rules/no-this-in-dep-keys"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "Dependent keys should not starts with `this.`";

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
  {KEYS: "'a'"},
  {KEYS: "'a', 'b'"},
  {KEYS: "'a', 'b', 'c'"},
  {KEYS: "'a.{b,c}'"}
];

var invalidKeys = [
  {KEYS: "'this.a'"},
  {KEYS: "'{this,b}.a'"},
  {KEYS: "'this.{a,b}'"},
  {KEYS: "'a', 'this.b'"}
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
ruleTester.run("no-this-in-dep-keys", rule, {
  valid: validTests,
  invalid: invalidTests
});