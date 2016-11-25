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

var rule = require("../../../lib/rules/no-declare-obj-components"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var m = "Don't declare arrays or objects directly on Components. Instead, add them on `init`";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var components = [
  {COMPONENT: "Component"},
  {COMPONENT: "Ember.Component"},
  {COMPONENT: "Em.Component"}
];

var validProperties = [
  {PROPERTY: "a: ''"},
  {PROPERTY: "a: 1"},
  {PROPERTY: "a: null"},
  {PROPERTY: "a: true"},
  {PROPERTY: "actions: {}"},
  {PROPERTY: "actions: {}", ALLOWED: ["verifications"]},
  {PROPERTY: "verifications: {}", ALLOWED: ["verifications"]}
];

var invalidProperties = [
  {PROPERTY: "a: []"},
  {PROPERTY: "a: {}"},
  {PROPERTY: "a: new Array()"},
  {PROPERTY: "a: new Object()"}
];

var validTestTemplates = [
  {
    code:
      "{{COMPONENT}}.extend({" +
        "{{PROPERTY}}" +
      "});",
    options: [{allowed: ["{{ALLOWED}}"]}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{COMPONENT}}.extend({" +
        "{{PROPERTY}}" +
      "});",
    errors: [
      {message: m, type: "Property"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], components)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.allowed.0"], validProperties)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], components)
  .useCombosAsTemplates()
  .createCombos(["code"], invalidProperties)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-declare-obj-components", rule, {
  valid: validTests,
  invalid: invalidTests
});
