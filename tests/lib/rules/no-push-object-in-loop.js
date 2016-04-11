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

var rule = require("../../../lib/rules/no-push-object-in-loop.js"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var m = "`pushObject(s)` should not be used in the loop. Use `pushObjects` outside loop";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var codes = [
  {CODE: "Ember.Object.extend({a: function () { {{BODY}} } });"},
  {CODE: "Ember.Object.extend({a: function () { {{BODY}} }.observes('b') });"},
  {CODE: "Ember.Object.extend({a: Ember.observer('b', function () { {{BODY}} }) });"}
];

var validBodies = [
  {BODY: "{{LO}} a.b.pushObject(c); {{OP}}"},
  {BODY: "{{LO}} a.push(c); {{OP}}"},
  {BODY: "{{LO}} a.b.pushObjects([c, d]); {{OP}}"}
];

var invalidBodies = [
  {BODY: "{{LO}} a.get('b').pushObject(c); {{OP}}"},
  {BODY: "{{LO}} a.get('b').pushObjects([c, d]); {{OP}}"}
];

var loops = [
  {LO: "for (var i = 0; i < 5; i++) {", OP: "}"},
  {LO: "while (i < 5) {", OP: "}"},
  {LO: "do {", OP: "} while(i > 5)"},
  {LO: "for (var i in o) {", OP: "}"},
  {LO: "for (var i of o) {", OP: "}"}
];

var mappedInvalidBodies = j
  .setTemplates(invalidBodies)
  .createCombos(["BODY"], loops)
  .uniqueCombos()
  .getCombos();

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
      {message: m, type: "MemberExpression"}
    ]
  },
  {
    code:
      "{{CODE}} {{CODE}}",
    errors: [
      {message: m, type: "MemberExpression"},
      {message: m, type: "MemberExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], validBodies)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], mappedInvalidBodies)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-push-object-in-loop", rule, {
  valid: validTests,
  invalid: invalidTests
});

invalidTestTemplates = [
  {
    code:
      "{{CODE}}",
    options: [
      {extraMemberExpression: ["map", "forEach"]}
    ],
    errors: [
      {message: m, type: "MemberExpression"}
    ]
  }
];

var memberLoops = [
  {LO: "a.map(function () {", OP: "});"},
  {LO: "a.forEach(function () {", OP: "});"}
];

mappedInvalidBodies = j
  .setTemplates(invalidBodies)
  .createCombos(["BODY"], memberLoops)
  .uniqueCombos()
  .getCombos();

validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], mappedInvalidBodies)
  .uniqueCombos()
  .getCombos();

invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], mappedInvalidBodies)
  .uniqueCombos()
  .getCombos();

ruleTester.run("no-push-object-in-loop", rule, {
  valid: validTests,
  invalid: invalidTests
});