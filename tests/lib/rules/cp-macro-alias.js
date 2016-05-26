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

var rule = require("../../../lib/rules/cp-macro-alias"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "May be simplified to `computed.alias`";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var embers = [
  {EM: "Ember."},
  {EM: "Em."},
  {EM: ""}
];

var validTestTemplates = [
  {
    code:
      "{{EM}}computed('someKey', function() { {{BODY}} });"
  },
  {
    code:
      "a = function() { {{BODY}} }.property('someKey');"
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{EM}}computed('someKey', function () { {{BODY}} });",
    errors: [
      {message: m}
    ]
  },
  {
    code:
      "a = function() { {{BODY}} }.property('someKey');",
    errors: [
      {message: m}
    ]
  }
];

var validBodies = [
  {BODY: "return this.get('abc').someMethod();"},
  {BODY: "return {{EM}}get(this, 'abc').someMethod();"},
  {BODY: "var a = 'abc'; return {{EM}}get(this, 'abc');"},
  {BODY: "var a = 'abc'; return this.get('abc');"}
];

var invalidBodies = [
  {BODY: "return this.get('abc');"},
  {BODY: "return {{EM}}get(this, 'abc');"}
];

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("cp-macro-alias", rule, {
  valid: j
    .setTemplates(validTestTemplates)
    .createCombos(["code"], validBodies)
    .useCombosAsTemplates()
    .createCombos(["code"], embers)
    .uniqueCombos()
    .getCombos(),
  invalid: j
    .setTemplates(invalidTestTemplates)
    .createCombos(["code"], invalidBodies)
    .useCombosAsTemplates()
    .createCombos(["code"], embers)
    .uniqueCombos()
    .getCombos()
});
