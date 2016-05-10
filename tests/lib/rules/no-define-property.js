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

var rule = require("../../../lib/rules/no-define-property"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var m = "`Ember.defineProperty` should not be used. Use `Ember.mixin()` to define new properties.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var kinds = [
  {KIND: "var"},
  {KIND: "let"},
  {KIND: "const"}
];

var declarations = [
  {DEC: "{{KIND}} {defineProperty} = {{OBJ}}"},
  {DEC: "{{KIND}} {someOther1, defineProperty, someOther2} = {{OBJ}}"},
  {DEC: "{{KIND}} defineProperty = {{OBJ}}.defineProperty"}
];

var emberObjects = [
  {OBJ: "Ember"},
  {OBJ: "Em"}
];

var objObjects = [
  {OBJ: "Object"}
];

var emberDefinePCalls = [
  {DP: "Ember.defineProperty()"},
  {DP: "Em.defineProperty()"}
];

var objectDefinePCalls = [
  {DP: "Object.defineProperty()"}
];

var unknownDefinePCalls = [
  {DP: "defineProperty()"}
];

var validTestTemplates = [
  {
    code:
      "{{DEC}}; {{DP}};"
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{DEC}}; {{DP}};",
    errors: [
      {message: m, type: "CallExpression"}
    ]
  }
];

declarations = j
  .setTemplates(declarations)
  .createCombos(["DEC"], kinds)
  .uniqueCombos()
  .getCombos();

var emberDeclarations = j
  .setTemplates(declarations)
  .createCombos(["DEC"], emberObjects)
  .getCombos();

var objectDeclarations = j
  .setTemplates(declarations)
  .createCombos(["DEC"], objObjects)
  .getCombos();



var emDecObjCalls = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], emberDeclarations)
  .useCombosAsTemplates()
  .createCombos(["code"], objectDefinePCalls)
  .getCombos();

var tplObjDec = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], objectDeclarations)
  .getCombos();

var objDecUnkwnCalls = j
  .setTemplates(tplObjDec)
  .createCombos(["code"], unknownDefinePCalls)
  .getCombos();

var validTests = j
  .setTemplates(tplObjDec)
  .createCombos(["code"], objectDefinePCalls)
  .concatCombos(objDecUnkwnCalls)
  .concatCombos(emDecObjCalls)
  .uniqueCombos()
  .getCombos();



var emDecEmCalls = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], emberDeclarations)
  .useCombosAsTemplates()
  .createCombos(["code"], emberDefinePCalls)
  .getCombos();

var tplEmDec = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], emberDeclarations)
  .getCombos();

var emDecUnkwnCalls = j
  .setTemplates(tplEmDec)
  .createCombos(["code"], unknownDefinePCalls)
  .getCombos();


var invalidTests = j
  .setTemplates(tplEmDec)
  .createCombos(["code"], emberDefinePCalls)
  .concatCombos(emDecUnkwnCalls)
  .concatCombos(emDecEmCalls)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-define-property", rule, {
  valid: validTests,
  invalid: invalidTests
});
