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

var rule = require("../../../lib/rules/no-typo-in-dep-keys"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var codes = require("./keys.js").code;
var m = "Key `{{M1}}` is looks like `{{M2}}`.";
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var validKeys = [
  {KEYS: "'myObject.a', 'myObject.b', 'myObject.c'"},
  {KEYS: "'abcd1.e', 'abcc1.f', 'abbd1.g'"},
  {KEYS: "'myObject.{a,b,c}'"},
  {KEYS: "'myObject.myProperty', 'myProperti.myObkect'"}
];

var invalidKeys = [
  {KEYS: "'myObject.a', 'myObject.b', 'myObkect.c'", M1: "myObkect", M2: "myObject"},
  {KEYS: "'myObject.myProperty.val1', 'myObject.myProeprty.val2', 'myObject.myProperty.val3'", M1: "myProeprty", M2: "myProperty"}
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
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], validKeys)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], invalidKeys)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-typo-in-dep-keys", rule, {
  valid: validTests,
  invalid: invalidTests
});
