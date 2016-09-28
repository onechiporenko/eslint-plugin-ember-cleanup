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

var rule = require("../../../lib/rules/route-model-return"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "`model` should return something";
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


var validModels = [
  {MODEL: "model() {return some;}"},
  {MODEL: "model: function () {return some;}"},
  {MODEL: "model() {if (a) {} else {}}"},
  {MODEL: "model() {if (a) {}}"},
  {MODEL: "model: function () {if (a) {} else {}}"},
  {MODEL: "model: function () {if (a) {}}"}
];

var invalidModels = [
  {MODEL: "model() {this.get('store').findAll('type');}"},
  {MODEL: "model: function() {this.get('store').findAll('type');}"},
  {MODEL: "model() {return;}"},
  {MODEL: "model: function() {return;}"}
];

var extend = [
  {EXT: "Ember.Route.extend({", END: "});"},
  {EXT: "Ember.Route.extend(mixin, {", END: "});"},
  {EXT: "Route.extend({", END: "});"},
  {EXT: "Route.extend(mixin, {", END: "});"}
];

var validTestTemplates = [
  {
    code:
      "{{EXT}}\n\t{{MODEL}}\n{{END}}"
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{EXT}}\n\t{{MODEL}}\n{{END}}",
    errors: [
      {message: m, type: "FunctionExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], extend)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], validModels)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], extend)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], invalidModels)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("route-model-return", rule, {
  valid: validTests,
  invalid: invalidTests
});