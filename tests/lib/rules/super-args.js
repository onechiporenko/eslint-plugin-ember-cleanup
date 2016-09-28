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

var rule = require("../../../lib/rules/super-args"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "`_super` should be called with `...{{M}}`";
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


var validFields = [
  {FIELD: "a() {return this._super(...arguments);}"},
  {FIELD: "a(...args) {return this._super(...args);}"},
  {FIELD: "a: function() {return this._super(...arguments);}"},
  {FIELD: "a: function(...args) {return this._super(...args);}"},
  {FIELD: "a: function(b, ...args) {return this._super(args);}"},
  {FIELD: "a(b, ...args) {return this._super(args);}"},
  {FIELD: "a: function(b) {return this._super(b);}"},
  {FIELD: "a(b) {return this._super(b);}"},
  {FIELD: "a: function(b) {return this._super();}"},
  {FIELD: "a(b) {return this._super();}"},
  {FIELD: "a: function() {return this._super(b);}"},
  {FIELD: "a() {return this._super(b);}"},
  {FIELD: "a: function() {return this._super(...b);}"},
  {FIELD: "a() {return this._super(...b);}"}
];

var invalidFields = [
  {FIELD: "a() {return this._super(arguments);}", M: "arguments"},
  {FIELD: "a(...args) {return this._super(args);}", M: "args"},
  {FIELD: "a: function() {return this._super(arguments);}", M: "arguments"},
  {FIELD: "a: function(...args) {return this._super(args);}", M: "args"}
];

var extend = [
  {EXT: "Ember.Object.extend({", END: "});"},
  {EXT: "Ember.Object.extend(mixin, {", END: "});"}
];

var validTestTemplates = [
  {
    code:
      "{{EXT}}\n\t{{FIELD}}\n{{END}}"
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{EXT}}\n\t{{FIELD}}\n{{END}}",
    errors: [
      {message: m, type: "CallExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], extend)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], validFields)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], extend)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], invalidFields)
  .uniqueCombos()
  .getCombos();

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("super-args", rule, {
  valid: validTests,
  invalid: invalidTests
});