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

var rule = require("../../../lib/rules/cp-macro-not-key.js"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var m = "{{NUM1}} argument for `computed.{{MACRO}}` should be raw-value and not a dependent key";
var m2 = "{{NUM2}} argument for `computed.{{MACRO}}` should be raw-value and not a dependent key";

var options = [{
  check: {
    gt: [1],
    myMacro: [1, 2]
  }
}];

var macros = [
  {MACRO: "gt"},
  {MACRO: "myMacro"}
];

var codes = require("./keys.js").macro;
codes.push({CODE: "{{MACRO}}({{KEYS}})"});

codes = codes.map(function (c) {
  var _c = JSON.parse(JSON.stringify(c));
  _c.CODE = _c.CODE.replace(";", "");
  return _c;
});

var validKeys = [
  {KEYS: "'a.b', 'c'", PROPS: ""},
  {KEYS: "'a', 'b', 'c'", PROPS: ""},
  {KEYS: "'a', 1", PROPS: ""},
  {KEYS: "'a', o.m()", PROPS: ""},
  {KEYS: "'a', f()", PROPS: ""}
];

var invalidKeys = [
  {KEYS: "'a', 'b.c'", PROPS: "b: {c: ''},", NUM1: "2nd"}
];

var invalidKeys2 = [
  {KEYS: "'a', 'b.c', 'd.e'", PROPS: "b: {c: ''}, d: {},", NUM1: "2nd", NUM2: "3rd"}
];

var uniqueValidTests = [
  {
    code:
      "Em.Object.extend({ b: '' }); " +
      "Em.Object.extend({ key : computed.gt('a', 'b') });",
    options: [
      {check: {gt: [1]}}
    ]
  }
];

var validTestTemplates = [
  {
    code:
      "Em.Object.extend({ {{PROPS}} key : {{CODE}} });",
    options: options
  }
];

var invalidTestTemplates = [
  {
    code:
      "Em.Object.extend({ {{PROPS}} key : {{CODE}} });",
    options: options,
    errors: [
      {message: m, type: "CallExpression"}
    ]
  }
];

var invalidTestTemplates2 = [
  {
    code:
      "Em.Object.extend({ {{PROPS}} key : {{CODE}} });",
    options: options,
    errors: [
      {message: m, type: "CallExpression"},
      {message: m2, type: "CallExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], macros)
  .useCombosAsTemplates()
  .createCombos(["code"], validKeys)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], macros[0])
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], invalidKeys)
  .uniqueCombos()
  .getCombos();

var invalidTests2 = j
  .setTemplates(invalidTestTemplates2)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], macros[1])
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], invalidKeys2)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("cp-macro-not-key", rule, {
  valid: validTests,
  invalid: invalidTests.concat(invalidTests2)
});
