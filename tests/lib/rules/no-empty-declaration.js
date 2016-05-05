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

var rule = require("../../../lib/rules/no-empty-declaration"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "Empty `extend` is redundant.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var types = [
  {TYPE: "Component"},
  {TYPE: "Route"},
  {TYPE: "Model"},
  {TYPE: "Controller"}
];

var embers = [
  {EM: "Ember."},
  {EM: "Em."},
  {EM: ""}
];

var validTestTemplates = [
  {
    code:
      "{{EM}}{{TYPE}}.extend(hash);"
  },
  {
    code:
      "{{EM}}{{TYPE}}.extend({a: 1});"
  },
  {
    code:
      "{{EM}}{{TYPE}}.extend({});",
    options: [{allowedFor: ["{{TYPE}}"]}]
  }
];

var empties = [
  {EMPTY: "{}"},
  {EMPTY: ""}
];

var invalidTestTemplates = [
  {
    code:
      "{{EM}}{{TYPE}}.extend({{EMPTY}});",
    errors: [
      {message: m}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code", "options.0.allowedFor.0"], types)
  .useCombosAsTemplates()
  .createCombos(["code"], embers)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], types)
  .useCombosAsTemplates()
  .createCombos(["code"], embers)
  .useCombosAsTemplates()
  .createCombos(["code"], empties)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-empty-declaration", rule, {
  valid: validTests,
  invalid: invalidTests
});
