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
var m = "`Ember.run.{{M}}` should be used.";

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
  {CODE: "setTimeout(function() {}, {{TIME}});"},
  {CODE: "setTimeout.call({}, function() {}, {{TIME}});"},
  {CODE: "setTimeout.apply({}, function() {}, {{TIME}});"},
  {CODE: "window.setTimeout(function() {}, {{TIME}});"},
  {CODE: "window.setTimeout.call({}, function() {}, {{TIME}});"},
  {CODE: "window.setTimeout.apply({}, function() {}, {{TIME}});"},
  {CODE: "window['setTimeout'](function() {}, {{TIME}});"},
  {CODE: "window['setTimeout'].call(function() {}, {{TIME}});"},
  {CODE: "window['setTimeout'].apply(function() {}, {{TIME}});"},
  {CODE: "setTimeout(function () {}, {{TIME}});"},
  {CODE: "setTimeout.call(function () {}, {{TIME}});"},
  {CODE: "setTimeout.apply(function () {}, {{TIME}});"},
  {CODE: "window['setTimeout'](function () {}, {{TIME}});"},
  {CODE: "window['setTimeout'].call(function () {}, {{TIME}});"},
  {CODE: "window['setTimeout'].apply(function () {}, {{TIME}});"}
];

var timeouts = [
  {TIME: 1, M: "next"},
  {TIME: 1000, M: "later"}
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
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], timeouts)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester();
ruleTester.run("no-settimeout", rule, {
  valid: validTests,
  invalid: invalidTests
});