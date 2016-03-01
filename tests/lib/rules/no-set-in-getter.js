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

var rule = require("../../../lib/rules/no-set-in-getter"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var m = "Ember-setter should not be used inside getter.";

var codes = [
  {CODE: "Ember.computed('a', 'b', function () { {{BODY}} });"},
  {CODE: "Ember['computed']('a', 'b', function () { {{BODY}} });"},
  {CODE: "computed('a', 'b', function () { {{BODY}} });"},
  {CODE: "var a = {b: function() { {{BODY}} }.property('a', 'b')};"}
];

var validBody = [
  {BODY: "this.set"},
  {BODY: "Ember.set"},
  {BODY: "set"}
];

var invalidBody = [
  {BODY: "this.set('a', 'b', 'c');"},
  {BODY: "this.set.call('a', 'b', 'c');"},
  {BODY: "this['set']('a', 'b', 'c');"},
  {BODY: "Ember.set('a', 'b', 'c');"},
  {BODY: "Ember.set.call('a', 'b', 'c');"},
  {BODY: "Ember['set']('a', 'b', 'c');"},
  {BODY: "set('a', 'b', 'c');"},
  {BODY: "set.call('a', 'b', 'c');"}
];

var validTestTemplates = [
  {
    code: "this.set;"
  },
  {
    code: "Ember.set;"
  },
  {
    code: "set;"
  },
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
  .createCombos(["code"], validBody)
  .getCombos();

j
  .clearCombos()
  .clearTemplates();

var invalidTestsForExpand = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], invalidBody)
  .getCombos();

var ruleTester = new RuleTester();
ruleTester.run("no-set-in-getter", rule, {
  valid: validTestsForExpand,
  invalid: invalidTestsForExpand
});
