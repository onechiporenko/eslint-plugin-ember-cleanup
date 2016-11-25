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

var rule = require("../../../lib/rules/no-expr-in-dep-keys.js"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
var keys = require("./keys.js");
var m = "Expression should not be used for dependent key.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var codes = keys.code.filter(function (c) {
  return c.CODE.indexOf("var") === -1 && c.CODE.indexOf("computed.") === -1 && c.CODE.indexOf("['computed'].") === -1;
}).map(function (c) {
  var _c = JSON.parse(JSON.stringify(c));
  _c.CODE = _c.CODE.replace(";", "");
  return _c;
});

var codesWithExtProto = keys.code.filter(function (c) {
  return c.CODE.indexOf("}.property") !== -1 || c.CODE.indexOf("}.observes") !== -1;
});

var invalidKeysForCodeWithExtProto = [
  {KEYS: "'a', {}"},
  {KEYS: "{}"},
  {KEYS: "a.c"},
  {KEYS: "a+c"},
  {KEYS: "function () {}"}
];

var validKeys = [
  {KEYS: "'a', 'b', 'c'"},
  {KEYS: "'a.b.c', 'd.e.f'"},
  {KEYS: "'a.@each.c'"},
  {KEYS: "`a.@each.${b}`"},
  {KEYS: "'a.[]'"}
];

var invalidKeys = [
  {KEYS: "'a' + val, 'b'"},
  {KEYS: "val + 'a', 'b'"},
  {KEYS: "v1 + v2, 'b'"},
  {KEYS: "function () {}"}
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
      "Em.Object.extend({a: {{CODE}} });",
    errors: [
      {message: m, type: "CallExpression"}
    ]
  }
];

var invalidTestTemplatesForCodeWithExtProto = [
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
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], validKeys)
  .uniqueCombos()
  .getCombos();

var invalidWithExtProto = j
  .setTemplates(invalidTestTemplatesForCodeWithExtProto)
  .createCombos(["code"], codesWithExtProto)
  .useCombosAsTemplates()
  .createCombos(["code"], invalidKeysForCodeWithExtProto)
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], invalidKeys)
  .concatCombos(invalidWithExtProto)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("no-expr-in-dep-keys", rule, {
  valid: validTests,
  invalid: invalidTests
});
