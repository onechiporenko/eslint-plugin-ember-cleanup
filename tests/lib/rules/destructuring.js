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

var rule = require("../../../lib/rules/destructuring"),
  RuleTester = require("eslint").RuleTester;

var emberUsages = [
  {EMBER_USAGE1: "Ember.get({}, 'a');", EMBER_USAGE2: "Ember.set({}, 'a', 1);", IN_MESSAGE1: "Ember.get", IN_MESSAGE2: "Ember.set"},
  {EMBER_USAGE1: "Ember.assert('', false);", EMBER_USAGE2: "Ember.run(function () {});", IN_MESSAGE1: "Ember.assert", IN_MESSAGE2: "Ember.run"},
  {EMBER_USAGE1: "Ember.Object.create({});", EMBER_USAGE2: "Ember.tryInvoke(this, 'fName');", IN_MESSAGE1: "Ember.Object", IN_MESSAGE2: "Ember.tryInvoke"}
];

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var validTestTemplates = [
  {
    code:
      "f(); f();"
  },
  {
    code:
      "{{EMBER_USAGE1}}"
  },
  {
    code:
      "{{EMBER_USAGE2}}"
  },
  {
    code:
      "{{EMBER_USAGE1}} " +
      "{{EMBER_USAGE2}}"
  }
];
var invalidTestTemplates = [
  {
    code:
      "{{EMBER_USAGE1}} " +
      "{{EMBER_USAGE1}}",
    errors: [
      {message: "`{{IN_MESSAGE1}}` is used many times. Maybe it should be destructured?", type: "MemberExpression"},
      {message: "`{{IN_MESSAGE1}}` is used many times. Maybe it should be destructured?", type: "MemberExpression"}
    ]
  },
  {
    code:
      "{{EMBER_USAGE1}} " +
      "{{EMBER_USAGE1}} " +
      "{{EMBER_USAGE2}} " +
      "{{EMBER_USAGE2}}",
    errors: [
      {message: "`{{IN_MESSAGE1}}` is used many times. Maybe it should be destructured?", type: "MemberExpression"},
      {message: "`{{IN_MESSAGE1}}` is used many times. Maybe it should be destructured?", type: "MemberExpression"},
      {message: "`{{IN_MESSAGE2}}` is used many times. Maybe it should be destructured?", type: "MemberExpression"},
      {message: "`{{IN_MESSAGE2}}` is used many times. Maybe it should be destructured?", type: "MemberExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos("code", emberUsages)
  .uniqueCombos()
  .getCombos()
  .filter(function (c) {
    return c.code.trim();
  });

j
  .clearCombos()
  .clearTemplates();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.message"], emberUsages)
  .uniqueCombos()
  .getCombos()
  .filter(function (c) {
    return c.code.trim();
  });

var ruleTester = new RuleTester();
ruleTester.run("destructuring", rule, {
  valid: validTests,
  invalid: invalidTests
});
