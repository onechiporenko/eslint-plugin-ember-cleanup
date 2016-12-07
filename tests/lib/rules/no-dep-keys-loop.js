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

var rule = require("../../../lib/rules/no-dep-keys-loop"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var m = "Dependent keys are in loop: ";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

function p(name, deps) {
  var _deps = Array.isArray(deps) ? deps : deps.split(",");
  return name + ": Ember.computed('" + _deps.join("','") + "', function () {})"
}

var validProperties = [
  {
    P1: p("a", "b"),
    P2: p("b", "d"),
    P3: p("c", "d")
  },
  {
    P1: p("a", "b"),
    P2: p("b", "c"),
    P3: p("c", "d")
  }
];

var invalidProperties = [
  {
    P1: p("a", "b"),
    P2: p("b", "a"),
    P3: p("c", "a"),
    ERROR: "a → b → a"
  },
  {
    P1: p("a", "b,e"),
    P2: p("b", "d,c"),
    P3: p("c", "a"),
    ERROR: "a → b → c → a"
  },
  {
    P1: p("a", "b,e"),
    P2: p("b", "d.c,c"),
    P3: p("c", "a"),
    ERROR: "a → b → c → a"
  },
  {
    P1: p("a", "b"),
    P2: p("b", "c"),
    P3: p("c", "a"),
    ERROR: "a → b → c → a"
  }
];

var validTestTemplates = [
  {
    code:
      "Ember.Object.extend({" +
        "{{P1}}," +
        "{{P2}}," +
        "{{P3}}" +
      "});"
  }
];

var invalidTestTemplates = [
  {
    code:
      "Ember.Object.extend({" +
        "{{P1}}," +
        "{{P2}}," +
        "{{P3}}" +
      "});",
    errors: [
      {message: m + "{{ERROR}}", type: "CallExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos("code", validProperties)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.message"], invalidProperties)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-dep-keys-loop", rule, {
  valid: validTests,
  invalid: invalidTests
});
