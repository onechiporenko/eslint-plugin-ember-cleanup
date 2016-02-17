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

var rule = require("../../../lib/rules/no-settimeout"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var m = "`Ember.run.later` should be used.";

var validTests = [
  {code: "Ember.run.later(obj, function () {}, 1000);"},
  {code: "notWindow.setTimeout();"},
  {code: "notWindow.setTimeout.call();"},
  {code: "notWindow.setTimeout.apply();"},
  {code: "notWindow['setTimeout']();"},
  {code: "notWindow['setTimeout'].call();"},
  {code: "notWindow['setTimeout'].apply();"},
  {code: "setTimeout;"},
  {code: "window.setTimeout;"},
  {code: "window['setTimeout'];"},
  {code: "notInCase.settimeout();"},
  {code: "notInCase['settimeout']();"}
];

var invalidCodes = [
  {CODE: "setTimeout();"},
  {CODE: "setTimeout.call();"},
  {CODE: "setTimeout.apply();"},
  {CODE: "window.setTimeout();"},
  {CODE: "window.setTimeout.call();"},
  {CODE: "window.setTimeout.apply();"},
  {CODE: "window['setTimeout']();"},
  {CODE: "window['setTimeout'].call();"},
  {CODE: "window['setTimeout'].apply();"},
  {CODE: "setTimeout(function () {}, 1000);"},
  {CODE: "setTimeout.call(function () {}, 1000);"},
  {CODE: "setTimeout.apply(function () {}, 1000);"},
  {CODE: "window['setTimeout'](function () {}, 1000);"},
  {CODE: "window['setTimeout'].call(function () {}, 1000);"},
  {CODE: "window['setTimeout'].apply(function () {}, 1000);"}
];

var invalidTestsTemplates = [
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

var invalidTests = j
  .setTemplates(invalidTestsTemplates)
  .createCombos(["code"], invalidCodes)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester();
ruleTester.run("no-settimeout", rule, {
  valid: validTests,
  invalid: invalidTests
});